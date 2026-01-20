<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>实时数据接入</h2>
        <p>多源实时数据统一接入、解析与状态监控。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showCreate = true">新增接入源</button>
        <button class="secondary" @click="startIngest">启动采集</button>
        <button class="ghost" @click="showTip = true">接入提示</button>
        <button class="ghost" @click="showDetail = true">查看协议</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>实时接入概览</h3>
        <div class="metrics">
          <div>
            <strong>128</strong>
            <span>活跃数据源</span>
          </div>
          <div>
            <strong>6.3 TB</strong>
            <span>今日接入量</span>
          </div>
          <div>
            <strong>98.7%</strong>
            <span>解析成功率</span>
          </div>
        </div>
        <div class="chart">
          <div v-for="bar in bars" :key="bar.label" class="bar">
            <div class="bar-fill" :style="{ height: `${bar.value}%` }"></div>
            <span>{{ bar.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>数据流状态</h3>
        <ul class="status-list">
          <li v-for="item in statusList" :key="item.name">
            <span>{{ item.name }}</span>
            <em>{{ item.status }}</em>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>接入源清单</h3>
        <button class="secondary" @click="startSync">刷新状态</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>数据源</th>
              <th>协议</th>
              <th>吞吐量</th>
              <th>延迟</th>
              <th>健康度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sources" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.protocol }}</td>
              <td>{{ row.rate }}</td>
              <td>{{ row.delay }}</td>
              <td>{{ row.health }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Modal v-model="showCreate" title="新增接入源">
    <form class="modal-form">
      <label>
        数据源名称
        <input v-model="form.name" type="text" placeholder="如：IoT-Edge-01" />
      </label>
      <label>
        接入协议
        <select v-model="form.protocol">
          <option>Kafka</option>
          <option>MQTT</option>
          <option>HTTP Stream</option>
          <option>RocketMQ</option>
        </select>
      </label>
      <label>
        解析规则
        <input v-model="form.rule" type="text" placeholder="如：JSON/Avro" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="showCreate = false">取消</button>
      <button class="primary" type="button" @click="submitCreate">确认接入</button>
    </template>
  </Modal>

  <Modal v-model="showProgress" title="接入任务执行中">
    <p>正在启动接入通道并同步状态。</p>
    <div class="progress-space">
      <ProgressBar :progress="progress" />
    </div>
  </Modal>

  <Modal v-model="showTip" title="接入提示">
    <ul class="tip-list">
      <li>建议使用统一的时间戳字段，方便窗口计算。</li>
      <li>高频数据源建议启用批量压缩通道。</li>
      <li>可通过健康度阈值自动触发告警。</li>
    </ul>
  </Modal>

  <Modal v-model="showDetail" title="协议说明">
    <p>当前平台已内置 Kafka、MQTT、HTTP Stream、RocketMQ 等协议的自动解析模板。</p>
    <p>若需要自定义协议，请在接入源配置中上传解析器。</p>
    <template #footer>
      <button class="primary" type="button" @click="showDetail = false">我知道了</button>
    </template>
  </Modal>

  <Modal v-model="showSync" title="状态同步中">
    <p>正在轮询 128 个接入节点，请保持页面打开。</p>
    <div class="progress-space">
      <ProgressBar :progress="syncProgress" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';

const bars = [
  { label: '06:00', value: 45 },
  { label: '08:00', value: 62 },
  { label: '10:00', value: 78 },
  { label: '12:00', value: 55 },
  { label: '14:00', value: 82 },
  { label: '16:00', value: 70 },
  { label: '18:00', value: 90 }
];

const statusList = [
  { name: 'IoT 边缘接入', status: '稳定运行' },
  { name: '支付订单流', status: '低延迟' },
  { name: '物流轨迹流', status: '有序回补' },
  { name: '风控事件流', status: '实时解析' }
];

const sources = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `Stream-Source-${index + 1}`,
  protocol: ['Kafka', 'MQTT', 'HTTP Stream', 'RocketMQ'][index % 4],
  rate: `${(320 + index * 5).toFixed(0)} msg/s`,
  delay: `${8 + (index % 6)} ms`,
  health: `${96 + (index % 4)}%`
}));

const showCreate = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const showDetail = ref(false);
const showSync = ref(false);

const progress = ref(0);
const syncProgress = ref(0);
let timer;
let syncTimer;

const form = reactive({
  name: '',
  protocol: 'Kafka',
  rule: ''
});

const submitCreate = () => {
  showCreate.value = false;
  startProgress();
};

const startProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 12;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    }
  }, 200);
};

const startIngest = () => {
  startProgress();
};

const startSync = () => {
  showSync.value = true;
  syncProgress.value = 0;
  clearInterval(syncTimer);
  syncTimer = setInterval(() => {
    syncProgress.value += 18;
    if (syncProgress.value >= 100) {
      clearInterval(syncTimer);
      showSync.value = false;
    }
  }, 220);
};

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(syncTimer);
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary,
.secondary,
.ghost {
  border-radius: 12px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.primary {
  background: #2563eb;
  color: #ffffff;
}

.secondary {
  background: #e0f2fe;
  color: #0369a1;
}

.ghost {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.metrics strong {
  display: block;
  font-size: 20px;
  color: #0f172a;
}

.metrics span {
  color: #64748b;
  font-size: 13px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
  align-items: end;
  height: 140px;
}

.bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
}

.bar-fill {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #38bdf8, #6366f1);
}

.status-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.status-list li {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 12px;
}

.status-list em {
  font-style: normal;
  color: #16a34a;
  font-weight: 600;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.table-wrap {
  overflow-x: auto;
  margin-top: 12px;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.modal-form input,
.modal-form select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.progress-space {
  margin-top: 16px;
}

.tip-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #475569;
}
</style>
