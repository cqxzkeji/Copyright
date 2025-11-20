<template>
  <div class="module-shell">
    <header>
      <div>
        <h3>用户行为分析</h3>
        <p>深度理解用户会话路径、偏好和影响推荐的关键因素。</p>
      </div>
      <div class="actions">
        <button @click="showInsight = true">生成洞察</button>
        <button class="primary" @click="showProgress = true">查看数据处理进度</button>
      </div>
    </header>
    <section class="grid">
      <article class="behavior-chart">
        <h4>行为热力矩阵</h4>
        <div class="heatmap">
          <span v-for="(cell, index) in heatmap" :key="index" :style="{ opacity: cell / 100 }" />
        </div>
      </article>
      <article class="trend-card">
        <h4>偏好趋势</h4>
        <div class="trend-lines">
          <div v-for="trend in trends" :key="trend.label">
            <div class="trend-label">
              <span>{{ trend.label }}</span>
              <strong>{{ trend.value }}%</strong>
            </div>
            <div class="trend-bar">
              <span :style="{ width: trend.value + '%', background: trend.color }" />
            </div>
          </div>
        </div>
      </article>
    </section>
    <section class="segments">
      <h4>核心人群分群</h4>
      <div class="segment-list">
        <article v-for="segment in segments" :key="segment.name">
          <p>{{ segment.name }}</p>
          <strong>{{ segment.size }}</strong>
          <small>{{ segment.highlights }}</small>
          <button @click="selectSegment(segment)">查看策略</button>
        </article>
      </div>
    </section>
  </div>
  <BaseModal v-model:open="showInsight" title="洞察准备完成">
    <p>已结合最近 7 天的会话数据，提炼出 4 条高价值洞察，可直接同步到算法权重。</p>
  </BaseModal>
  <BaseModal v-model:open="showProgress" title="数据处理进度">
    <div class="progress-label">
      <span>清洗日志</span>
      <span>82%</span>
    </div>
    <div class="progress-bar">
      <span style="width: 82%; background:#22d3ee" />
    </div>
    <div class="progress-label">
      <span>埋点补全</span>
      <span>46%</span>
    </div>
    <div class="progress-bar">
      <span style="width: 46%; background:#f97316" />
    </div>
  </BaseModal>
  <BaseModal v-model:open="showSegment" :title="selectedSegment?.name || '人群策略'">
    <p>{{ selectedSegment?.strategy }}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const heatmap = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100))

const trends = [
  { label: '短视频', value: 72, color: '#2563eb' },
  { label: '长文内容', value: 34, color: '#7c3aed' },
  { label: '互动话题', value: 56, color: '#f97316' }
]

const segments = [
  { name: '探索型用户', size: '32%', highlights: '喜欢最新内容', strategy: '推送多样化探索清单，提升留存。' },
  { name: '深度阅读者', size: '21%', highlights: '停留时间长', strategy: '优先展示长文与评论互动。' },
  { name: '实时热点党', size: '18%', highlights: '活跃于高峰期', strategy: '主推实时事件 & 社区话题。' }
]

const showInsight = ref(false)
const showProgress = ref(false)
const showSegment = ref(false)
const selectedSegment = ref(null)

const selectSegment = (segment) => {
  selectedSegment.value = segment
  showSegment.value = true
}
</script>

<style scoped>
.module-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  background: #e2e8f0;
}

button.primary {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #fff;
}

.grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.behavior-chart,
.trend-card {
  flex: 1;
  min-width: 240px;
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

.heatmap {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.4rem;
}

.heatmap span {
  aspect-ratio: 1;
  border-radius: 8px;
  background: #6366f1;
}

.trend-lines {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 1rem;
}

.trend-label {
  display: flex;
  justify-content: space-between;
}

.trend-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
}

.trend-bar span {
  display: block;
  height: 8px;
  border-radius: 999px;
}

.segments {
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

.segment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.segment-list article {
  flex: 1;
  min-width: 200px;
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.segment-list button {
  align-self: flex-start;
  margin-top: 0.4rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-top: 0.6rem;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  margin-bottom: 0.4rem;
}

.progress-bar span {
  display: block;
  height: 8px;
  border-radius: 999px;
}
</style>
