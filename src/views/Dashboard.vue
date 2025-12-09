<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">📊 数据分析仪表板</div>
      <p>跨时空整合心率、脑电、学习轨迹等多模态数据，展示趋势与风险预警。</p>
      <div class="button-group">
        <button class="btn" @click="showMetricForm = true">新增监测指标</button>
        <button class="btn secondary" @click="startProgress">刷新聚合数据</button>
        <button class="btn ghost" @click="showInfo = true">提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">📈 动态趋势</div>
      <div class="simple-chart">
        <div v-for="item in trend" :key="item.label" class="bar-row">
          <span>{{ item.label }}</span>
          <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
          <span style="text-align: right; font-weight: 700;">{{ item.value }}%</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-title">📑 指标追踪表（10+条）</div>
    <table class="table">
      <thead>
        <tr>
          <th>序号</th>
          <th>指标</th>
          <th>最新值</th>
          <th>变化率</th>
          <th>风险等级</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in metrics" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.value }}</td>
          <td :style="{ color: row.delta > 0 ? '#dc2626' : '#16a34a' }">{{ row.delta }}%</td>
          <td><span class="badge">{{ row.risk }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showMetricForm" class="modal-overlay" @click.self="showMetricForm = false">
    <div class="modal">
      <h3>新增监测指标</h3>
      <form @submit.prevent="submitMetric">
        <label>
          指标名称
          <input v-model="newMetric.name" placeholder="例如：专注度" required />
        </label>
        <label>
          当前值
          <input v-model.number="newMetric.value" type="number" placeholder="70" required />
        </label>
        <label>
          风险等级
          <select v-model="newMetric.risk">
            <option>低</option>
            <option>中</option>
            <option>高</option>
          </select>
        </label>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="btn ghost" type="button" @click="showMetricForm = false">取消</button>
          <button class="btn" type="submit">提交</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showInfo" class="modal-overlay" @click.self="showInfo = false">
    <div class="modal">
      <h3>仪表板提示</h3>
      <p>刷新后自动合并最新跨时空批次数据，新增指标将写入本地状态便于演示。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showInfo = false">知道了</button>
      </div>
    </div>
  </div>

  <div v-if="progressing" class="modal-overlay" @click.self="progressing = false">
    <div class="modal">
      <h3>数据刷新进度</h3>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p style="margin-top: 10px;">正在融合多模态数据流...</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn ghost" type="button" @click="progressing = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const trend = [
  { label: '情绪平稳率', value: 82 },
  { label: '认知负荷稳定度', value: 74 },
  { label: '夜间睡眠质量', value: 69 },
  { label: '课堂专注度', value: 88 },
  { label: '社会互动活跃度', value: 63 }
];

const metrics = reactive([
  { id: 1, name: '心率变异性', value: '68ms', delta: -4, risk: '低' },
  { id: 2, name: '脑电α波占比', value: '34%', delta: 2, risk: '中' },
  { id: 3, name: '焦虑指数', value: '21', delta: -6, risk: '低' },
  { id: 4, name: '压力指数', value: '37', delta: 5, risk: '中' },
  { id: 5, name: '睡眠充足度', value: '76%', delta: 1, risk: '低' },
  { id: 6, name: '课堂响应时间', value: '1.8s', delta: -3, risk: '低' },
  { id: 7, name: '社交互动频率', value: '14次/日', delta: 4, risk: '中' },
  { id: 8, name: '学习时长', value: '5.5h', delta: -2, risk: '低' },
  { id: 9, name: '冥想坚持率', value: '62%', delta: 3, risk: '中' },
  { id: 10, name: '运动活跃度', value: '47%', delta: -1, risk: '低' },
  { id: 11, name: '团队合作指数', value: '71', delta: 2, risk: '中' }
]);

const showMetricForm = ref(false);
const showInfo = ref(false);
const progressing = ref(false);
const progress = ref(0);
const newMetric = reactive({ name: '', value: 60, risk: '低' });
let timer;

const startProgress = () => {
  progressing.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 500);
};

const submitMetric = () => {
  metrics.push({
    id: metrics.length + 1,
    name: newMetric.name,
    value: `${newMetric.value}`,
    delta: 0,
    risk: newMetric.risk
  });
  newMetric.name = '';
  newMetric.value = 60;
  newMetric.risk = '低';
  showMetricForm.value = false;
};
</script>
