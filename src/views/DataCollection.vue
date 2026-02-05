<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h3>数据接入操作台</h3>
        <div class="actions">
          <button @click="openModal('create')">新增采集任务</button>
          <button @click="openModal('import')">文件上传</button>
          <button @click="openModal('api')">API 接入</button>
          <button @click="openModal('clean')">清洗规则</button>
          <button class="ghost" @click="openProgress">采集进度</button>
          <button class="ghost" @click="openTip('采集任务已同步到数据湖。')">按钮提示</button>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h4>接入渠道分布</h4>
          <div class="chart">
            <svg viewBox="0 0 320 140">
              <rect v-for="(bar, index) in channelBars" :key="bar.label" :x="index * 60 + 20" :y="140 - bar.value" width="36" :height="bar.value" fill="#60a5fa" rx="6" />
              <text v-for="(bar, index) in channelBars" :key="bar.label + '-label'" :x="index * 60 + 38" y="130" text-anchor="middle" font-size="10" fill="#6b7280">
                {{ bar.label }}
              </text>
            </svg>
          </div>
        </div>
        <div class="card">
          <h4>实时采集指标</h4>
          <ul class="metric-list">
            <li>
              <span>日均接入量</span>
              <strong>128 万条</strong>
            </li>
            <li>
              <span>格式标准化成功率</span>
              <strong>98.7%</strong>
            </li>
            <li>
              <span>异常数据拦截</span>
              <strong>1,284 条</strong>
            </li>
            <li>
              <span>正在运行任务</span>
              <strong>{{ collectionRows.length }}</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>采集任务清单</h3>
        <span class="sub">结构化/半结构化/非结构化数据统一管理</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>数据源</th>
              <th>类型</th>
              <th>接入方式</th>
              <th>状态</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in collectionRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.category }}</td>
              <td>{{ row.channel }}</td>
              <td>
                <span :class="['status', row.statusClass]">{{ row.status }}</span>
              </td>
              <td>{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <BaseModal :show="modals.create" title="新增采集任务" @close="closeModal('create')">
    <form class="modal-form" @submit.prevent="submitCreate">
      <label>
        数据源名称
        <input v-model="forms.create.name" type="text" placeholder="如：IoT_传感器集群" required />
      </label>
      <label>
        数据类型
        <select v-model="forms.create.category">
          <option value="结构化">结构化</option>
          <option value="半结构化">半结构化</option>
          <option value="非结构化">非结构化</option>
        </select>
      </label>
      <label>
        接入方式
        <select v-model="forms.create.channel">
          <option value="API">API</option>
          <option value="文件上传">文件上传</option>
          <option value="数据库连接">数据库连接</option>
        </select>
      </label>
      <label>
        采集频率
        <input v-model="forms.create.rate" type="text" placeholder="如：每5分钟" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('create')">取消</button>
        <button type="submit">保存任务</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.import" title="文件上传接入" @close="closeModal('import')">
    <form class="modal-form" @submit.prevent="submitImport">
      <label>
        上传文件
        <input type="file" />
      </label>
      <label>
        格式识别
        <select v-model="forms.import.format">
          <option value="CSV">CSV</option>
          <option value="JSON">JSON</option>
          <option value="Excel">Excel</option>
        </select>
      </label>
      <label>
        清洗模板
        <input v-model="forms.import.template" type="text" placeholder="默认标准模板" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('import')">取消</button>
        <button type="submit">开始上传</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.api" title="API 接入配置" @close="closeModal('api')">
    <form class="modal-form" @submit.prevent="submitApi">
      <label>
        API 地址
        <input v-model="forms.api.url" type="text" placeholder="https://api.example.com/data" required />
      </label>
      <label>
        认证方式
        <select v-model="forms.api.auth">
          <option value="Token">Token</option>
          <option value="OAuth2">OAuth2</option>
          <option value="签名">签名</option>
        </select>
      </label>
      <label>
        调度策略
        <input v-model="forms.api.schedule" type="text" placeholder="每小时同步" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('api')">取消</button>
        <button type="submit">保存配置</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.clean" title="清洗规则设置" @close="closeModal('clean')">
    <form class="modal-form" @submit.prevent="submitClean">
      <label>
        去重规则
        <select v-model="forms.clean.dedup">
          <option value="按主键">按主键</option>
          <option value="按时间窗口">按时间窗口</option>
          <option value="字段组合">字段组合</option>
        </select>
      </label>
      <label>
        异常阈值
        <input v-model="forms.clean.threshold" type="number" min="0" />
      </label>
      <label>
        标准化模板
        <input v-model="forms.clean.template" type="text" placeholder="统一字段命名" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('clean')">取消</button>
        <button type="submit">应用规则</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.progress" title="采集任务进度" @close="closeModal('progress')">
    <div class="progress-card">
      <p>当前任务正在进行数据抓取与校验。</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <strong>{{ progress }}%</strong>
    </div>
    <template #footer>
      <button type="button" class="secondary" @click="closeModal('progress')">关闭</button>
    </template>
  </BaseModal>

  <BaseModal :show="modals.tip" title="提示信息" @close="closeModal('tip')">
    <p>{{ tipMessage }}</p>
    <template #footer>
      <button type="button" class="secondary" @click="closeModal('tip')">知道了</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modals = reactive({
  create: false,
  import: false,
  api: false,
  clean: false,
  progress: false,
  tip: false
});

const forms = reactive({
  create: {
    name: "",
    category: "结构化",
    channel: "API",
    rate: ""
  },
  import: {
    format: "CSV",
    template: ""
  },
  api: {
    url: "",
    auth: "Token",
    schedule: ""
  },
  clean: {
    dedup: "按主键",
    threshold: 3,
    template: ""
  }
});

const tipMessage = ref("");
const progress = ref(0);
let progressTimer;

const channelBars = [
  { label: "API", value: 90 },
  { label: "文件", value: 60 },
  { label: "DB", value: 80 },
  { label: "日志", value: 50 },
  { label: "设备", value: 70 }
];

const collectionRows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `CL-${index + 1}`.padStart(6, "0"),
    source: `数据源-${index + 1}`,
    category: index % 3 === 0 ? "非结构化" : index % 2 === 0 ? "半结构化" : "结构化",
    channel: index % 2 === 0 ? "API" : "文件上传",
    status: index % 4 === 0 ? "运行中" : index % 3 === 0 ? "待配置" : "已完成",
    statusClass: index % 4 === 0 ? "running" : index % 3 === 0 ? "pending" : "done",
    time: `2024-09-${(index % 28) + 1}`.padStart(10, "0")
  }))
);

const openModal = (name) => {
  modals[name] = true;
};

const closeModal = (name) => {
  modals[name] = false;
};

const openTip = (message) => {
  tipMessage.value = message;
  modals.tip = true;
};

const submitCreate = () => {
  collectionRows.value.unshift({
    id: `CL-${collectionRows.value.length + 1}`.padStart(6, "0"),
    source: forms.create.name,
    category: forms.create.category,
    channel: forms.create.channel,
    status: "运行中",
    statusClass: "running",
    time: new Date().toISOString().slice(0, 10)
  });
  closeModal("create");
  openTip("新增采集任务已创建并进入运行状态。");
};

const submitImport = () => {
  closeModal("import");
  openTip(`文件已接入，格式识别为 ${forms.import.format}。`);
};

const submitApi = () => {
  closeModal("api");
  openTip("API 接入配置已保存并启动调度。");
};

const submitClean = () => {
  closeModal("clean");
  openTip("清洗规则已应用到当前采集任务。");
};

const openProgress = () => {
  modals.progress = true;
  progress.value = 0;
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  progressTimer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(progressTimer);
      return;
    }
    progress.value += 8;
  }, 300);
};

onBeforeUnmount(() => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
}

.sub {
  color: #6b7280;
  font-size: 13px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

.ghost {
  background: #e0f2fe;
  color: #0369a1;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  min-height: 180px;
}

.card h4 {
  margin-top: 0;
}

.chart {
  height: 140px;
}

.metric-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.metric-list li {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.running {
  background: #e0f2fe;
  color: #0369a1;
}

.status.pending {
  background: #fef3c7;
  color: #b45309;
}

.status.done {
  background: #ecfdf3;
  color: #047857;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.modal-form input,
.modal-form select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.progress-card {
  display: grid;
  gap: 12px;
}

.progress-bar {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}
</style>
