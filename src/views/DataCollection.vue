<template>
  <div class="page">
    <div class="card">
      <div class="section-title">信息采集与接入总览</div>
      <div class="grid grid-3">
        <div class="card">
          <div class="section-title">采集通道</div>
          <p>已启用通道：{{ summary.channels }}</p>
          <p>今日新增采集：{{ summary.newTasks }}</p>
        </div>
        <div class="card">
          <div class="section-title">接口接入</div>
          <p>可用接口：{{ summary.interfaces }}</p>
          <p>异常接口：{{ summary.alerts }}</p>
        </div>
        <div class="card">
          <div class="section-title">外部API</div>
          <p>已授权：{{ summary.apis }}</p>
          <p>同步频率：{{ summary.frequency }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">实时采集趋势</div>
      <div class="chart">
        <div
          v-for="(item, index) in chartData"
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
      <div class="section-title">功能操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('newTask')">新建采集任务</button>
        <button class="btn btn-secondary" type="button" @click="openModal('connect')">接入数据接口</button>
        <button class="btn" type="button" @click="openModal('sync')">同步外部API</button>
        <button class="btn btn-secondary" type="button" @click="openModal('progress')">查看采集进度</button>
        <button class="btn" type="button" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">采集任务清单（20条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>数据源</th>
            <th>状态</th>
            <th>负责人</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.source }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'newTask'" class="form-grid">
        <label class="form-field">
          采集名称
          <input v-model="form.taskName" type="text" placeholder="例如：城市舆情采集" />
        </label>
        <label class="form-field">
          数据范围
          <select v-model="form.scope">
            <option>全量</option>
            <option>增量</option>
            <option>事件驱动</option>
          </select>
        </label>
        <label class="form-field">
          频率策略
          <input v-model="form.frequency" type="text" placeholder="例如：每30分钟" />
        </label>
      </div>
      <div v-else-if="modal.type === 'connect'" class="form-grid">
        <label class="form-field">
          接口名称
          <input v-model="form.interfaceName" type="text" placeholder="例如：政务接口" />
        </label>
        <label class="form-field">
          授权方式
          <select v-model="form.authType">
            <option>Token</option>
            <option>OAuth2</option>
            <option>密钥认证</option>
          </select>
        </label>
        <label class="form-field">
          接入说明
          <textarea v-model="form.notes" rows="3" placeholder="填写接入说明"></textarea>
        </label>
      </div>
      <div v-else-if="modal.type === 'sync'">
        <p>外部API同步任务已准备就绪，确认后将执行数据拉取。</p>
        <div class="progress" style="margin-top: 12px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
      <div v-else-if="modal.type === 'progress'">
        <p>正在采集的任务：{{ summary.newTasks }} 个</p>
        <div class="progress" style="margin-top: 12px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p style="margin-top: 8px;">预计完成时间：{{ summary.eta }}</p>
      </div>
      <div v-else>
        <p>操作提示：建议在低峰期进行大规模接入，可提升稳定性。</p>
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

const summary = reactive({
  channels: 14,
  newTasks: 6,
  interfaces: 18,
  alerts: 1,
  apis: 9,
  frequency: "15分钟/次",
  eta: "约 12 分钟"
});

const chartData = [
  { label: "周一", value: 72 },
  { label: "周二", value: 58 },
  { label: "周三", value: 80 },
  { label: "周四", value: 65 },
  { label: "周五", value: 90 },
  { label: "周六", value: 60 },
  { label: "周日", value: 75 }
];

const tasks = Array.from({ length: 20 }, (_, index) => ({
  id: `COL-${String(index + 1).padStart(3, "0")}`,
  source: `数据源-${index + 1}`,
  status: index % 3 === 0 ? "运行中" : index % 3 === 1 ? "待审核" : "已完成",
  owner: ["王琳", "周启", "韩雪"][index % 3],
  updated: `2024-06-${String(index + 1).padStart(2, "0")}`
}));

const modal = reactive({
  open: false,
  type: "",
  title: ""
});

const progress = ref(68);

const form = reactive({
  taskName: "",
  scope: "全量",
  frequency: "",
  interfaceName: "",
  authType: "Token",
  notes: ""
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  modal.title =
    type === "newTask"
      ? "新建采集任务"
      : type === "connect"
      ? "接入数据接口"
      : type === "sync"
      ? "同步外部API"
      : type === "progress"
      ? "采集进度"
      : "操作提示";
};

const closeModal = () => {
  modal.open = false;
};

const submitModal = () => {
  progress.value = Math.min(100, progress.value + 12);
  closeModal();
};
</script>
