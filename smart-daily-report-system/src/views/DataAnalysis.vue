<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h2>数据分析与统计</h2>
        <p>实时指标与趋势对比，助力管理层掌握日报健康度。</p>
      </div>
      <button class="primary" @click="openForecast">刷新预测</button>
    </header>

    <section class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <p class="label">{{ stat.label }}</p>
        <p class="value">{{ stat.value }}</p>
        <p class="delta" :class="{ down: stat.trend === 'down' }">
          {{ stat.trend === 'up' ? '↑' : '↓' }} {{ stat.delta }}%
        </p>
      </div>
    </section>

    <section class="chart-panel">
      <div class="chart-header">
        <h3>日报提交趋势 (近 7 天)</h3>
        <span>目标：≥ 180 份 / 天</span>
      </div>
      <div class="chart">
        <div v-for="bar in chart" :key="bar.day" class="bar">
          <div class="bar-inner" :style="{ height: bar.value + 'px' }"></div>
          <span>{{ bar.day }}</span>
        </div>
      </div>
    </section>

    <section class="insight">
      <div>
        <h3>智能洞察</h3>
        <p>{{ insight }}</p>
      </div>
      <button class="outline" @click="showInsight = true">查看详情</button>
    </section>

    <ModalDialog :show="showForecast" title="预测已更新" @close="showForecast = false">
      <p>AI 预测模型重新计算完成，本周提交量预计提升 12%。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">计算进度：{{ progress }}%</p>
    </ModalDialog>

    <ModalDialog :show="showInsight" title="日报质量详情" @close="showInsight = false">
      <p>覆盖率最高团队：AI 研发 (98%)，需重点关注：市场拓展 (76%)。</p>
      <p>建议针对覆盖率低的团队配置日报填写模板和提醒频次。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const stats = [
  { label: '今日提交', value: '196 份', delta: 8, trend: 'up' },
  { label: '平均审批时长', value: '1.8 小时', delta: 12, trend: 'down' },
  { label: '异常日报', value: '4 份', delta: 33, trend: 'down' }
]

const chart = [
  { day: '一', value: 120 },
  { day: '二', value: 140 },
  { day: '三', value: 180 },
  { day: '四', value: 190 },
  { day: '五', value: 210 },
  { day: '六', value: 175 },
  { day: '日', value: 160 }
]

const insight = '本周审批通过率 96%，周二和周五提交高峰，可安排自动预审减轻审批压力。'

const showForecast = ref(false)
const showInsight = ref(false)
const progress = ref(0)
let timer

const openForecast = () => {
  showForecast.value = true
  progress.value = 0
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(timer)
    }
  }, 150)
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(15, 22, 58, 0.08);
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.stat-card {
  flex: 1;
  min-width: 180px;
  background: #f8fbff;
  border-radius: 16px;
  padding: 16px;
}

.value {
  font-size: 24px;
  margin: 4px 0;
}

.delta {
  color: #24b47e;
  font-weight: 600;
}

.delta.down {
  color: #f45c43;
}

.chart-panel {
  background: #fdfdff;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #edf2ff;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 220px;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-inner {
  width: 100%;
  border-radius: 10px 10px 0 0;
  background: linear-gradient(180deg, #7dd3fc, #2563eb);
}

.insight {
  padding: 20px;
  border-radius: 18px;
  border: 1px dashed #9fb8ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress {
  width: 100%;
  height: 8px;
  background: #edf1fb;
  border-radius: 999px;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #34d399, #10b981);
  transition: width 0.2s ease;
}

.progress-text {
  text-align: right;
  margin-top: 8px;
  font-weight: 600;
}

.primary,
.outline {
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #2563eb, #4f46e5);
  color: #fff;
}

.outline {
  background: transparent;
  color: #1f6feb;
  border: 1px solid #b5d4ff;
}
</style>
