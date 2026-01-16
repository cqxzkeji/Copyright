<template>
  <div class="grid cols-2">
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">数据分析与合规</div>
          <div class="section-sub">追踪营销效果并提供内容合规审查。</div>
        </div>
        <div class="actions">
          <button class="btn" type="button" @click="openModal('report')">生成分析报告</button>
          <button class="btn secondary" type="button" @click="openModal('compliance')">合规审查</button>
          <button class="btn ghost" type="button" @click="openModal('risk')">风险提示</button>
          <button class="btn ghost" type="button" @click="openModal('tip')">按钮提示</button>
        </div>
      </div>
      <div class="insight-grid">
        <div class="insight-card" v-for="item in insights" :key="item.id">
          <img :src="item.image" :alt="item.title" />
          <div>
            <div class="insight-title">{{ item.title }}</div>
            <div class="insight-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-header">
        <div>
          <div class="section-title">指标监控列表</div>
          <div class="section-sub">共 {{ analyticsRows.length }} 条指标数据。</div>
        </div>
        <button class="btn secondary" type="button" @click="openModal('progress')">扫描进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>市场</th>
            <th>渠道</th>
            <th>点击率</th>
            <th>转化率</th>
            <th>合规状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in analyticsRows" :key="row.id">
            <td>{{ row.market }}</td>
            <td>{{ row.channel }}</td>
            <td>{{ row.ctr }}</td>
            <td>{{ row.cvr }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('detail', row)">详情</button>
              <button class="btn ghost" type="button" @click="openModal('export', row)">导出</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" :on-close="closeModal">
    <template v-if="modal.type === 'report'">
      <label class="field">
        报告周期
        <select class="select">
          <option>本周</option>
          <option>本月</option>
          <option>季度</option>
        </select>
      </label>
      <label class="field">
        覆盖市场
        <input class="input" value="北美、欧洲、亚太" readonly />
      </label>
      <button class="btn" type="button" @click="submitAction('分析报告已生成')">生成报告</button>
    </template>

    <template v-else-if="modal.type === 'compliance'">
      <label class="field">
        审查范围
        <select class="select">
          <option>所有已发布内容</option>
          <option>待发布内容</option>
        </select>
      </label>
      <label class="field">
        规则集
        <input class="input" value="广告法、平台政策" readonly />
      </label>
      <button class="btn" type="button" @click="submitAction('合规审查已启动')">启动审查</button>
    </template>

    <template v-else-if="modal.type === 'risk'">
      <label class="field">
        风险级别
        <select class="select">
          <option>低</option>
          <option>中</option>
          <option>高</option>
        </select>
      </label>
      <label class="field">
        备注
        <textarea class="textarea" rows="4" placeholder="输入风险提示"></textarea>
      </label>
      <button class="btn" type="button" @click="submitAction('风险提示已推送')">发送提示</button>
    </template>

    <template v-else-if="modal.type === 'progress'">
      <div class="progress-block">
        <div class="progress-title">合规扫描进度</div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-meta">已完成 {{ progress }}%。</div>
      </div>
      <button class="btn" type="button" @click="updateProgress">刷新进度</button>
    </template>

    <template v-else-if="modal.type === 'detail'">
      <div class="tip">
        {{ modal.payload.market }} - {{ modal.payload.channel }} 渠道点击率 {{ modal.payload.ctr }}，转化率
        {{ modal.payload.cvr }}，合规状态：{{ modal.payload.status }}。
      </div>
    </template>

    <template v-else-if="modal.type === 'export'">
      <div class="tip">
        已选择 {{ modal.payload.market }} 市场数据，支持导出 CSV 或 PDF。
      </div>
      <button class="btn" type="button" @click="submitAction('数据已导出')">确认导出</button>
    </template>

    <template v-else-if="modal.type === 'tip'">
      <div class="tip">
        提示：合规扫描建议在发布前 24 小时执行，预留修改时间。
      </div>
    </template>

    <template v-else-if="modal.type === 'result'">
      <div class="tip">{{ modal.message }}</div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const insights = [
  {
    id: 1,
    title: "市场表现总览",
    meta: "实时监控",
    image: "https://picsum.photos/seed/analytics1/160/120"
  },
  {
    id: 2,
    title: "合规风险面板",
    meta: "自动预警",
    image: "https://picsum.photos/seed/analytics2/160/120"
  },
  {
    id: 3,
    title: "渠道效果对比",
    meta: "多维分析",
    image: "https://picsum.photos/seed/analytics3/160/120"
  }
];

const analyticsRows = Array.from({ length: 24 }, (_, index) => ({
  id: `AN-${index + 1}`,
  market: ["北美", "欧洲", "亚太"][index % 3],
  channel: ["社媒", "电商", "官网"][index % 3],
  ctr: `${(12 + index) % 30}%`,
  cvr: `${(4 + index) % 12}%`,
  status: ["合规", "复核中", "需修改"][index % 3]
}));

const modal = reactive({
  open: false,
  type: "",
  title: "",
  message: "",
  payload: {}
});

const progress = ref(71);

const openModal = (type, payload = {}) => {
  modal.open = true;
  modal.type = type;
  modal.payload = { ...payload };
  modal.message = "";
  const titles = {
    report: "生成分析报告",
    compliance: "合规审查",
    risk: "风险提示",
    progress: "扫描进度",
    detail: "指标详情",
    export: "导出数据",
    tip: "按钮提示",
    result: "处理结果"
  };
  modal.title = titles[type] || "操作";
};

const closeModal = () => {
  modal.open = false;
};

const submitAction = (message) => {
  modal.type = "result";
  modal.title = "操作完成";
  modal.message = message;
};

const updateProgress = () => {
  progress.value = Math.min(100, progress.value + 5);
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
}

.section-sub {
  color: #6c7a96;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.insight-grid {
  display: grid;
  gap: 12px;
}

.insight-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f7f9ff;
}

.insight-card img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.insight-title {
  font-weight: 600;
}

.insight-meta {
  color: #6c7a96;
  font-size: 12px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #3a4a6b;
}

.progress-block {
  display: grid;
  gap: 8px;
}

.progress-title {
  font-weight: 600;
}

.progress-meta {
  font-size: 13px;
  color: #6c7a96;
}

.tip {
  background: #f5f7ff;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
}
</style>
