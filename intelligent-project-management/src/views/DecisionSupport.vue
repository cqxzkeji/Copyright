<template>
  <div class="module">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>项目健康分析</h3>
          <p>基于大数据的绩效与健康评分。</p>
        </div>
        <div class="panel-actions">
          <button class="ghost-btn" @click="openScenario">情景模拟</button>
          <button class="primary-btn" @click="openReport">生成分析报告</button>
        </div>
      </div>
      <div class="score-grid">
        <div v-for="score in scores" :key="score.label" class="score-card">
          <p>{{ score.label }}</p>
          <h2>{{ score.value }}</h2>
          <span class="trend">{{ score.trend }}</span>
        </div>
      </div>
      <div class="line-chart">
        <div v-for="point in lineData" :key="point.week" class="line-point">
          <div class="dot" :style="{ height: point.value + '%' }"></div>
          <span>{{ point.week }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>风险与机会预测</h3>
          <p>结合历史数据预测未来四周风险机会。</p>
        </div>
        <button class="outline-btn" @click="openInsight">查看洞察</button>
      </div>
      <div class="insight-grid">
        <div v-for="insight in insights" :key="insight.title" class="insight-card">
          <h4>{{ insight.title }}</h4>
          <p>{{ insight.desc }}</p>
          <span class="tag">{{ insight.level }}</span>
        </div>
      </div>
    </section>

    <ModalBase :show="showScenario" title="情景模拟" @close="showScenario = false">
      <div class="form-grid">
        <label>
          模拟主题
          <input v-model="scenarioForm.theme" placeholder="例如：资源减少 10%" />
        </label>
        <label>
          影响范围
          <select v-model="scenarioForm.scope">
            <option>全部项目</option>
            <option>高风险项目</option>
            <option>指定业务线</option>
          </select>
        </label>
        <label class="full">
          说明
          <textarea v-model="scenarioForm.note" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showScenario = false">取消</button>
        <button class="primary-btn" @click="runScenario">开始模拟</button>
      </template>
    </ModalBase>

    <ModalBase :show="showReport" title="分析报告生成" @close="showReport = false">
      <p>系统正在整合项目绩效与风险数据。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: reportProgress + '%' }"></div>
      </div>
      <p class="muted">报告进度：{{ reportProgress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showReport = false">取消</button>
        <button class="primary-btn" @click="advanceReport">继续生成</button>
      </template>
    </ModalBase>

    <ModalBase :show="showInsight" title="预测洞察" @close="showInsight = false">
      <ul class="insight-list">
        <li v-for="item in insightDetails" :key="item">{{ item }}</li>
      </ul>
      <template #footer>
        <button class="primary-btn" @click="showInsight = false">确认</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../components/ModalBase.vue'

const scores = [
  { label: '健康评分', value: '86', trend: '↑ 5' },
  { label: '交付稳定性', value: '82%', trend: '↑ 3%' },
  { label: '成本偏差', value: '6%', trend: '↓ 2%' }
]

const lineData = [
  { week: 'W1', value: 55 },
  { week: 'W2', value: 62 },
  { week: 'W3', value: 60 },
  { week: 'W4', value: 70 },
  { week: 'W5', value: 68 },
  { week: 'W6', value: 76 }
]

const insights = [
  { title: '关键项目风险下降', desc: '资源优化后风险降低 12%。', level: '机会' },
  { title: '跨部门协作延迟', desc: '审批周期预计增加 2 天。', level: '风险' },
  { title: '资源需求提前', desc: '算力需求提前两周达到峰值。', level: '预警' }
]

const insightDetails = ['高风险项目预计下降至 3 个', '交付效率将提升 8%', '请提前确认供应链交付节奏']

const showScenario = ref(false)
const showReport = ref(false)
const showInsight = ref(false)
const reportProgress = ref(48)

const scenarioForm = ref({
  theme: '资源减少 10%',
  scope: '全部项目',
  note: ''
})

const openScenario = () => {
  showScenario.value = true
}

const runScenario = () => {
  showScenario.value = false
}

const openReport = () => {
  showReport.value = true
}

const advanceReport = () => {
  reportProgress.value = Math.min(100, reportProgress.value + 17)
}

const openInsight = () => {
  showInsight.value = true
}
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.score-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 14px;
}

.score-card h2 {
  margin: 8px 0;
  font-size: 24px;
}

.trend {
  color: #16a34a;
  font-size: 12px;
}

.line-chart {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  height: 160px;
}

.line-point {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 18px;
  border-radius: 999px;
  background: #38bdf8;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.insight-card {
  background: #f1f5f9;
  padding: 14px;
  border-radius: 14px;
  display: grid;
  gap: 6px;
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  width: fit-content;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
}

.ghost-btn {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
}

.outline-btn {
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 10px;
  background: #ffffff;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}

.muted {
  color: #64748b;
  font-size: 13px;
}

.insight-list {
  display: grid;
  gap: 8px;
  color: #475569;
}
</style>
