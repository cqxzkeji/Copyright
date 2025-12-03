<template>
  <div class="grid" style="grid-template-columns: 1fr 0.9fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>数据分析与优化</h3>
        <div class="chip-row">
          <button class="secondary" @click="showFilters = true">筛选指标</button>
          <button @click="showReport = true">生成分析报告</button>
          <button @click="showInsight = true">AI 洞察</button>
        </div>
      </div>
      <p class="tooltip">汇总工艺、质量、交付数据，提供逆向推导优化依据。</p>
      <div class="table-card">
        <div class="flex-between">
          <h4>关键指标</h4>
          <span class="badge">覆盖不少于10条记录</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>钢种</th><th>合格率</th><th>缺陷集中</th><th>交期达成</th><th>优化建议</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in metrics" :key="row.grade">
              <td>{{ row.grade }}</td>
              <td>{{ row.passRate }}%</td>
              <td>{{ row.defect }}</td>
              <td>{{ row.delivery }}%</td>
              <td>{{ row.tip }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3>趋势与分布</h3>
        <button class="secondary" @click="showAlert = true">指标提醒</button>
      </div>
      <p class="tooltip">合格率趋势与缺陷分布。</p>
      <div class="trend">
        <div class="sparkline">
          <div v-for="(point, idx) in trend" :key="idx" class="spark-point" :style="{ height: point + '%' }"></div>
        </div>
        <div class="chart" style="margin-top: 12px; grid-template-columns: repeat(5, 1fr);">
          <div v-for="item in defects" :key="item.name" class="bar" style="height: 130px;">
            <span>{{ item.name }}</span>
            <div class="progress" style="width: 100%; height: 10px;"><div :style="{ width: item.rate + '%' }"></div></div>
            <strong>{{ item.rate }}%</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showFilters" title="筛选指标" show-actions @confirm="showFilters = false">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px;">
      <label>时间范围 <input type="date" /></label>
      <label>生产线 <select><option>全部</option><option>LF-VD</option><option>ESR</option></select></label>
      <label>批次前缀 <input placeholder="R-2406" /></label>
      <label>缺陷类型 <select><option>全部</option><option>表面缺陷</option><option>中心疏松</option></select></label>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showReport" title="生成分析报告">
    <p class="tooltip">汇总 KPI 并推送至邮件。</p>
    <div class="progress" style="margin-top: 8px;"><div :style="{ width: reportProgress + '%' }"></div></div>
    <p>进度：{{ reportProgress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="showInsight" title="AI 洞察">
    <ul>
      <li>建议对 34CrNiMo6 增加真空精炼时长，缺陷率有望下降 8%</li>
      <li>17-4PH 工艺中固溶时间分散度偏大，可固化为 2 小时</li>
      <li>Q690D 交期偏差集中在轧后探伤阶段，需要并行排产</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-model="showAlert" title="预警设置" show-actions @confirm="showAlert = false">
    <label>阈值 <input type="number" placeholder="例如 85" /></label>
    <label style="margin-top: 8px;">提醒方式 <select><option>站内信</option><option>邮件</option></select></label>
  </ModalDialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const metrics = [
  { grade: '20CrNi2Mo', passRate: 92, defect: '表面裂纹', delivery: 96, tip: '提升热处理控温' },
  { grade: '34CrNiMo6', passRate: 87, defect: '气孔', delivery: 91, tip: '延长精炼时间' },
  { grade: '17-4PH', passRate: 90, defect: '时效不均', delivery: 93, tip: '固溶时间标准化' },
  { grade: 'GCr15', passRate: 84, defect: '夹杂', delivery: 89, tip: '增加真空脱气' },
  { grade: '42CrMo', passRate: 88, defect: '组织粗大', delivery: 90, tip: '二次正火' },
  { grade: '50CrMo4', passRate: 91, defect: '硬度离散', delivery: 92, tip: '回火曲线分段' },
  { grade: '30CrNiMo8', passRate: 86, defect: '晶粒偏大', delivery: 88, tip: '控制终锻温度' },
  { grade: 'Q690D', passRate: 83, defect: '板形', delivery: 85, tip: '精整压平' },
  { grade: '12Cr2Ni4A', passRate: 89, defect: '渗碳不均', delivery: 91, tip: '提升渗碳气氛稳定性' },
  { grade: '40CrNiMoA', passRate: 90, defect: '淬透性波动', delivery: 92, tip: '优化合金比' }
]

const trend = [65, 72, 78, 70, 85, 82, 88, 91, 87, 90, 94]
const defects = [
  { name: '表面裂纹', rate: 32 },
  { name: '气孔', rate: 22 },
  { name: '中心疏松', rate: 18 },
  { name: '硬度不均', rate: 15 },
  { name: '组织粗大', rate: 13 }
]

const showFilters = ref(false)
const showReport = ref(false)
const showInsight = ref(false)
const showAlert = ref(false)
const reportProgress = ref(12)
let reportTimer

onMounted(() => {
  reportTimer = setInterval(() => {
    if (showReport.value) {
      reportProgress.value = Math.min(100, reportProgress.value + 14)
      if (reportProgress.value === 100) {
        showReport.value = false
      }
    }
  }, 500)
})

onUnmounted(() => clearInterval(reportTimer))
</script>

<style scoped>
.trend {
  margin-top: 10px;
}

.sparkline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12px, 1fr));
  gap: 4px;
  align-items: end;
  height: 120px;
}

.spark-point {
  background: linear-gradient(180deg, var(--primary), #cce5ff);
  border-radius: 6px 6px 2px 2px;
}
</style>
