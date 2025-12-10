<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h2>健康监控与分析</h2>
        <p class="muted">采集体温、心率、反刍次数等指标，生成健康提示。</p>
      </div>
      <div class="flex-between" style="gap: 8px;">
        <button class="button" @click="openPlan">安排体检</button>
        <button class="button secondary" @click="openAlert">告警确认</button>
      </div>
    </div>
    <div class="chart-row">
      <div class="card">
        <h4>体温趋势</h4>
        <svg viewBox="0 0 200 120" style="width: 100%;">
          <polyline
            :points="temperaturePoints"
            fill="none"
            stroke="#3d8bfd"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div class="muted">近10次采集平均 {{ avgTemp.toFixed(1) }} ℃</div>
      </div>
      <div class="card">
        <h4>心率分布</h4>
        <div class="progress" v-for="hr in heartRateStats" :key="hr.label" style="margin-bottom: 8px;">
          <span :style="{ width: hr.percent + '%' }"></span>
        </div>
        <div class="muted" v-for="hr in heartRateStats" :key="hr.label + '-label'">{{ hr.label }}: {{ hr.count }} 次</div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>耳标号</th>
          <th>体温(℃)</th>
          <th>心率(bpm)</th>
          <th>反刍次数</th>
          <th>风险等级</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>{{ record.tag }}</td>
          <td>{{ record.temp }}</td>
          <td>{{ record.hr }}</td>
          <td>{{ record.rumination }}</td>
          <td><span class="badge" :style="{ background: riskColor(record.risk).bg, color: riskColor(record.risk).text }">{{ record.risk }}</span></td>
          <td>
            <button class="button secondary" @click="openDetail(record)">查看详情</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showDetail" class="modal-backdrop">
    <div class="modal">
      <h3>健康详情 - {{ current?.tag }}</h3>
      <p class="muted">包含最近10次采集曲线与健康建议。</p>
      <div class="progress"><span :style="{ width: current?.recovery + '%' }"></span></div>
      <p class="muted">恢复进度：{{ current?.recovery }}%</p>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="button secondary" @click="showDetail = false">关闭</button>
        <button class="button" @click="acknowledge">确认处理</button>
      </div>
    </div>
  </div>

  <div v-if="showPlan" class="modal-backdrop">
    <div class="modal">
      <h3>安排健康检查</h3>
      <div class="form-grid">
        <label>体检类型
          <select v-model="plan.type">
            <option>常规体检</option>
            <option>免疫补强</option>
            <option>产后复查</option>
          </select>
        </label>
        <label>日期 <input type="date" v-model="plan.date" /></label>
        <label>负责人 <input v-model="plan.owner" placeholder="兽医姓名" /></label>
      </div>
      <div class="flex-between" style="margin-top: 16px;">
        <button class="button secondary" @click="showPlan = false">取消</button>
        <button class="button" @click="submitPlan">确认排程</button>
      </div>
    </div>
  </div>

  <div v-if="showAlert" class="modal-backdrop">
    <div class="modal">
      <h3>告警确认</h3>
      <p class="muted">已收到心率波动提醒，是否推送到现场巡检？</p>
      <div class="progress"><span :style="{ width: alertProgress + '%' }"></span></div>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="button secondary" @click="closeAlert">稍后</button>
        <button class="button" @click="sendAlert">立即推送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const records = ref([
  { id: 1, tag: 'CN-1001', temp: 38.5, hr: 72, rumination: 54, risk: '低', recovery: 70 },
  { id: 2, tag: 'CN-1002', temp: 39.2, hr: 90, rumination: 40, risk: '中', recovery: 40 },
  { id: 3, tag: 'CN-1003', temp: 39.8, hr: 95, rumination: 35, risk: '高', recovery: 20 },
  { id: 4, tag: 'CN-1004', temp: 38.9, hr: 82, rumination: 49, risk: '中', recovery: 55 },
  { id: 5, tag: 'CN-1005', temp: 38.4, hr: 70, rumination: 58, risk: '低', recovery: 80 },
  { id: 6, tag: 'CN-1006', temp: 39.0, hr: 86, rumination: 42, risk: '中', recovery: 60 },
  { id: 7, tag: 'CN-1007', temp: 38.7, hr: 74, rumination: 55, risk: '低', recovery: 72 },
  { id: 8, tag: 'CN-1008', temp: 39.3, hr: 92, rumination: 44, risk: '中', recovery: 48 },
  { id: 9, tag: 'CN-1009', temp: 39.7, hr: 97, rumination: 38, risk: '高', recovery: 35 },
  { id: 10, tag: 'CN-1010', temp: 38.6, hr: 76, rumination: 52, risk: '低', recovery: 65 },
  { id: 11, tag: 'CN-1011', temp: 38.8, hr: 78, rumination: 53, risk: '低', recovery: 68 }
]);

const showDetail = ref(false);
const current = ref(null);
const showPlan = ref(false);
const showAlert = ref(false);
const alertProgress = ref(0);
const plan = reactive({ type: '常规体检', date: '', owner: '' });

const avgTemp = computed(() => records.value.reduce((sum, r) => sum + r.temp, 0) / records.value.length);
const temperaturePoints = computed(() => {
  const max = Math.max(...records.value.map((r) => r.temp));
  const min = Math.min(...records.value.map((r) => r.temp));
  const span = max - min || 1;
  return records.value
    .map((r, idx) => {
      const x = (idx / (records.value.length - 1)) * 200;
      const y = 110 - ((r.temp - min) / span) * 100;
      return `${x},${y}`;
    })
    .join(' ');
});

const heartRateStats = computed(() => {
  const buckets = [
    { label: '≤75', count: records.value.filter((r) => r.hr <= 75).length },
    { label: '76-85', count: records.value.filter((r) => r.hr > 75 && r.hr <= 85).length },
    { label: '86-95', count: records.value.filter((r) => r.hr > 85 && r.hr <= 95).length },
    { label: '>95', count: records.value.filter((r) => r.hr > 95).length }
  ];
  const total = records.value.length || 1;
  return buckets.map((b) => ({ ...b, percent: Math.round((b.count / total) * 100) }));
});

const riskColor = (risk) => {
  switch (risk) {
    case '高':
      return { bg: '#fff0f0', text: '#d14343' };
    case '中':
      return { bg: '#fff8e5', text: '#d88a1f' };
    default:
      return { bg: '#ecfdf3', text: '#0ca678' };
  }
};

const openDetail = (record) => {
  current.value = record;
  showDetail.value = true;
};

const acknowledge = () => {
  showDetail.value = false;
};

const openPlan = () => {
  showPlan.value = true;
};

const submitPlan = () => {
  showPlan.value = false;
};

const openAlert = () => {
  showAlert.value = true;
  alertProgress.value = 40;
};

const closeAlert = () => {
  showAlert.value = false;
};

const sendAlert = () => {
  alertProgress.value = 100;
  setTimeout(() => {
    showAlert.value = false;
    alertProgress.value = 0;
  }, 600);
};
</script>
