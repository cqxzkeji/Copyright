<template>
  <div class="page">
    <div class="card">
      <div class="section-title">报告与展示概览</div>
      <div class="grid grid-3">
        <div class="card">
          <div class="section-title">数据可视化</div>
          <p>当前仪表盘：{{ overview.dashboards }}</p>
          <p>可视化组件：{{ overview.widgets }}</p>
        </div>
        <div class="card">
          <div class="section-title">报告生成</div>
          <p>待发布报告：{{ overview.pending }}</p>
          <p>已导出报告：{{ overview.exported }}</p>
        </div>
        <div class="card">
          <div class="section-title">发布通道</div>
          <p>订阅部门：{{ overview.subscribers }}</p>
          <p>通知频率：{{ overview.frequency }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">可视化指标分布</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: item.value + '%' }"
          :title="item.value + '%'"
        ></div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));">
        <div v-for="item in chartData" :key="item.label" class="chart-label">{{ item.label }}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">报告操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('generate')">生成报告</button>
        <button class="btn btn-secondary" type="button" @click="openModal('export')">导出报告</button>
        <button class="btn" type="button" @click="openModal('dashboard')">更新仪表盘</button>
        <button class="btn btn-secondary" type="button" @click="openModal('publish')">发布订阅</button>
        <button class="btn" type="button" @click="openModal('tip')">展示提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">报告列表（20条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>报告编号</th>
            <th>名称</th>
            <th>类型</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.id }}</td>
            <td>{{ report.name }}</td>
            <td>{{ report.type }}</td>
            <td>{{ report.owner }}</td>
            <td>{{ report.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'generate'" class="form-grid">
        <label class="form-field">
          报告主题
          <input v-model="form.topic" type="text" placeholder="例如：季度态势分析" />
        </label>
        <label class="form-field">
          报告范围
          <select v-model="form.range">
            <option>全局</option>
            <option>重点区域</option>
            <option>专项专题</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'export'">
        <p>请选择导出格式并确认文件存储位置。</p>
        <div class="form-grid" style="margin-top: 12px;">
          <label class="form-field">
            导出格式
            <select v-model="form.format">
              <option>PDF</option>
              <option>PPT</option>
              <option>Excel</option>
            </select>
          </label>
          <label class="form-field">
            存储路径
            <input v-model="form.path" type="text" placeholder="例如：/reports/2024" />
          </label>
        </div>
      </div>
      <div v-else-if="modal.type === 'dashboard'" class="form-grid">
        <label class="form-field">
          仪表盘名称
          <input v-model="form.dashboard" type="text" placeholder="例如：指挥中心总览" />
        </label>
        <label class="form-field">
          组件数量
          <input v-model="form.widgets" type="number" min="1" />
        </label>
      </div>
      <div v-else-if="modal.type === 'publish'">
        <p>发布后将通知订阅部门并推送最新报告。</p>
        <div class="progress" style="margin-top: 12px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
      <div v-else>
        <p>提示：仪表盘指标建议与当前业务目标保持一致。</p>
      </div>
      <template #actions>
        <button class="btn btn-secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const overview = reactive({
  dashboards: 6,
  widgets: 42,
  pending: 5,
  exported: 18,
  subscribers: 12,
  frequency: "每日"
});

const chartData = [
  { label: "态势", value: 78 },
  { label: "风险", value: 60 },
  { label: "资源", value: 55 },
  { label: "专题", value: 68 },
  { label: "应急", value: 72 }
];

const reports = Array.from({ length: 20 }, (_, index) => ({
  id: `REP-${String(index + 1).padStart(3, "0")}`,
  name: `报告主题-${index + 1}`,
  type: index % 2 === 0 ? "日报" : "专项",
  owner: ["杜明", "钱雨", "陈洁"][index % 3],
  status: index % 3 === 0 ? "待发布" : index % 3 === 1 ? "已导出" : "已归档"
}));

const modal = reactive({
  open: false,
  type: "",
  title: ""
});

const progress = ref(61);

const form = reactive({
  topic: "",
  range: "全局",
  format: "PDF",
  path: "",
  dashboard: "",
  widgets: 6
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  modal.title =
    type === "generate"
      ? "生成报告"
      : type === "export"
      ? "导出报告"
      : type === "dashboard"
      ? "更新仪表盘"
      : type === "publish"
      ? "发布订阅"
      : "展示提示";
};

const closeModal = () => {
  modal.open = false;
};

const submitModal = () => {
  progress.value = Math.min(100, progress.value + 12);
  closeModal();
};
</script>
