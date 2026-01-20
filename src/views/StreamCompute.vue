<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>流式计算分析</h2>
        <p>实时计算、统计与规则分析，支持窗口处理。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showRule = true">新建计算规则</button>
        <button class="secondary" @click="startCompute">启动窗口计算</button>
        <button class="ghost" @click="showTip = true">规则提示</button>
        <button class="ghost" @click="showDetail = true">查看算子</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>实时计算吞吐</h3>
        <div class="chart">
          <div v-for="bar in bars" :key="bar.label" class="bar">
            <div class="bar-fill" :style="{ height: `${bar.value}%` }"></div>
            <span>{{ bar.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>窗口配置概览</h3>
        <ul class="status-list">
          <li v-for="item in windows" :key="item.name">
            <span>{{ item.name }}</span>
            <em>{{ item.value }}</em>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>计算规则列表</h3>
        <button class="secondary" @click="startPublish">发布规则</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>规则编号</th>
              <th>名称</th>
              <th>窗口类型</th>
              <th>统计指标</th>
              <th>延迟</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in rules" :key="rule.id">
              <td>{{ rule.id }}</td>
              <td>{{ rule.name }}</td>
              <td>{{ rule.window }}</td>
              <td>{{ rule.metric }}</td>
              <td>{{ rule.latency }}</td>
              <td>{{ rule.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Modal v-model="showRule" title="新建计算规则">
    <form class="modal-form">
      <label>
        规则名称
        <input v-model="form.name" type="text" placeholder="如：订单风控统计" />
      </label>
      <label>
        窗口类型
        <select v-model="form.window">
          <option>滑动窗口</option>
          <option>滚动窗口</option>
          <option>会话窗口</option>
        </select>
      </label>
      <label>
        统计指标
        <input v-model="form.metric" type="text" placeholder="如：平均支付时长" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="showRule = false">取消</button>
      <button class="primary" type="button" @click="submitRule">确认创建</button>
    </template>
  </Modal>

  <Modal v-model="showProgress" title="计算任务执行中">
    <p>系统正在启动实时计算任务并加载状态。</p>
    <div class="progress-space">
      <ProgressBar :progress="progress" />
    </div>
  </Modal>

  <Modal v-model="showTip" title="规则设计提示">
    <ul class="tip-list">
      <li>建议设置水位线以降低乱序数据影响。</li>
      <li>滑动窗口适用于实时趋势统计。</li>
      <li>规则发布后可在监控模块查看延迟。</li>
    </ul>
  </Modal>

  <Modal v-model="showDetail" title="可用算子一览">
    <p>平台内置聚合、过滤、Join、CEP 等高性能算子。</p>
    <p>支持 Python 与 SQL 混合编排，满足复杂计算需求。</p>
    <template #footer>
      <button class="primary" type="button" @click="showDetail = false">确认</button>
    </template>
  </Modal>

  <Modal v-model="showPublish" title="规则发布进度">
    <p>正在同步 6 个计算节点。</p>
    <div class="progress-space">
      <ProgressBar :progress="publishProgress" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';

const bars = [
  { label: '09:00', value: 60 },
  { label: '10:00', value: 72 },
  { label: '11:00', value: 65 },
  { label: '12:00', value: 82 },
  { label: '13:00', value: 74 },
  { label: '14:00', value: 88 },
  { label: '15:00', value: 80 }
];

const windows = [
  { name: '滑动窗口', value: '5 分钟 / 1 分钟' },
  { name: '滚动窗口', value: '10 分钟' },
  { name: '会话窗口', value: '30 秒' },
  { name: '水位线', value: '延迟 3 秒' }
];

const rules = Array.from({ length: 20 }, (_, index) => ({
  id: `R-${index + 100}`,
  name: `实时规则-${index + 1}`,
  window: ['滑动窗口', '滚动窗口', '会话窗口'][index % 3],
  metric: ['订单数', '风控评分', '转化率', '响应时长'][index % 4],
  latency: `${5 + (index % 6)} ms`,
  status: index % 3 === 0 ? '运行中' : '已发布'
}));

const showRule = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const showDetail = ref(false);
const showPublish = ref(false);

const progress = ref(0);
const publishProgress = ref(0);
let timer;
let publishTimer;

const form = reactive({
  name: '',
  window: '滑动窗口',
  metric: ''
});

const submitRule = () => {
  showRule.value = false;
  startCompute();
};

const startCompute = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 14;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    }
  }, 210);
};

const startPublish = () => {
  showPublish.value = true;
  publishProgress.value = 0;
  clearInterval(publishTimer);
  publishTimer = setInterval(() => {
    publishProgress.value += 20;
    if (publishProgress.value >= 100) {
      clearInterval(publishTimer);
      showPublish.value = false;
    }
  }, 200);
};

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(publishTimer);
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
  color: #0f766e;
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
