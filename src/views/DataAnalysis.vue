<template>
  <div class="grid" style="gap: 14px;">
    <div class="card">
      <div class="section-header">
        <div>
          <p class="eyebrow">数据分析与报告生成</p>
          <h3>风险趋势与用水用电</h3>
        </div>
        <div class="action-row">
          <button class="btn secondary" @click="toggleReport">生成报告</button>
          <button class="btn" @click="toggleProgress">导出数据</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <div class="card" v-for="metric in metrics" :key="metric.label" style="background:#f7f9fc;">
          <p class="muted">{{ metric.label }}</p>
          <h2>{{ metric.value }}</h2>
          <div class="progress-bar" style="margin-top:8px;">
            <span :style="{ width: metric.ratio + '%' }"></span>
          </div>
          <p class="muted">达成率 {{ metric.ratio }}%</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>月度统计数据</h3>
        <span class="muted">点击行查看详情并更新趋势</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>月份</th>
            <th>告警次数</th>
            <th>巡检完成率</th>
            <th>维修完成率</th>
            <th>水系统耗能</th>
            <th>电系统耗能</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="month in months" :key="month.name" style="cursor:pointer;" @click="selectMonth(month)">
            <td>{{ month.name }}</td>
            <td>{{ month.alarms }}</td>
            <td>{{ month.inspection }}%</td>
            <td>{{ month.maintenance }}%</td>
            <td>{{ month.water }} m³</td>
            <td>{{ month.power }} kWh</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDetail" class="card">
      <div class="section-header">
        <h3>{{ active.name }} 趋势</h3>
        <button class="btn secondary" @click="toggleProgress">重新计算</button>
      </div>
      <div class="chart-wrapper">
        <div class="chart-bar" v-for="point in active.trend" :key="point.label">
          <div class="label">{{ point.label }}</div>
          <div class="bar">
            <span :style="{ width: point.value + '%' }"></span>
          </div>
          <div class="value">{{ point.value }}%</div>
        </div>
      </div>
    </div>

    <div v-if="showReport" class="modal-backdrop" @click.self="showReport = false">
      <div class="modal">
        <h3>生成周报</h3>
        <div class="form-row">
          <label>接收邮箱</label>
          <input type="email" placeholder="ops@example.com" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>时间范围</label>
          <select>
            <option>本周</option>
            <option>本月</option>
            <option>季度</option>
          </select>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px;">
          <button class="btn secondary" @click="showReport = false">取消</button>
          <button class="btn success" @click="confirmReport">生成</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal">
        <h3>导出进度</h3>
        <div class="progress-bar" style="margin: 10px 0;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p>当前进度 {{ progress }}%</p>
        <div style="text-align:right;">
          <button class="btn" @click="showProgress = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const metrics = reactive([
  { label: '周告警闭环', value: '15/18', ratio: 83 },
  { label: '巡检完成率', value: '92%', ratio: 92 },
  { label: '保养完成率', value: '78%', ratio: 78 },
  { label: '主机在线率', value: '99.3%', ratio: 99 }
]);

const months = reactive([
  { name: '1 月', alarms: 12, inspection: 90, maintenance: 76, water: 120, power: 340, trend: trendData() },
  { name: '2 月', alarms: 9, inspection: 88, maintenance: 80, water: 115, power: 320, trend: trendData() },
  { name: '3 月', alarms: 15, inspection: 91, maintenance: 85, water: 130, power: 360, trend: trendData() },
  { name: '4 月', alarms: 8, inspection: 94, maintenance: 90, water: 110, power: 310, trend: trendData() },
  { name: '5 月', alarms: 7, inspection: 96, maintenance: 93, water: 105, power: 300, trend: trendData() }
]);

const showReport = ref(false);
const showProgress = ref(false);
const showDetail = ref(false);
const progress = ref(30);
const active = ref({});

function trendData() {
  return [
    { label: '告警处置', value: Math.floor(Math.random() * 20) + 70 },
    { label: '巡检完成', value: Math.floor(Math.random() * 20) + 70 },
    { label: '保养完成', value: Math.floor(Math.random() * 20) + 70 }
  ];
}

function toggleReport() { showReport.value = true; }
function toggleProgress() {
  showProgress.value = true;
  progress.value = (progress.value + 20) % 100;
}

function confirmReport() {
  alert('已生成并发送数据报告');
  showReport.value = false;
}

function selectMonth(month) {
  active.value = month;
  showDetail.value = true;
}
</script>

<style scoped>
.section-header { display:flex; justify-content: space-between; align-items:center; gap: 10px; flex-wrap: wrap; }
.action-row { display:flex; gap: 10px; flex-wrap: wrap; }
.chart-wrapper { display: grid; gap: 12px; }
.chart-bar { background: #f7f9fc; padding: 12px; border-radius: 12px; display: grid; grid-template-columns: 140px 1fr 80px; align-items:center; gap: 8px; }
</style>
