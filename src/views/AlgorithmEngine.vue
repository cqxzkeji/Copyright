<template>
  <div class="module-shell">
    <header>
      <div>
        <h3>推荐算法引擎</h3>
        <p>管理召回、粗排、精排等多阶段模型，实时调优参数。</p>
      </div>
      <div class="actions">
        <button @click="showDeployment = true">发布模型</button>
        <button class="primary" @click="showWeights = true">保存权重</button>
      </div>
    </header>
    <section class="engine-grid">
      <article class="flow">
        <h4>算法流程概览</h4>
        <ol>
          <li v-for="step in pipeline" :key="step">
            <span />
            <p>{{ step }}</p>
          </li>
        </ol>
      </article>
      <article class="chart">
        <h4>实验 AB 测试表现</h4>
        <svg viewBox="0 0 220 120">
          <polyline :points="chartPoints" fill="none" stroke="#6366f1" stroke-width="3" />
          <polyline :points="chartPointsB" fill="none" stroke="#f97316" stroke-width="3" />
        </svg>
      </article>
    </section>
    <section class="controls">
      <h4>参数调节</h4>
      <div class="control-list">
        <div v-for="param in params" :key="param.label" class="control-item">
          <div>
            <p>{{ param.label }}</p>
            <small>{{ param.desc }}</small>
          </div>
          <input type="range" min="0" max="100" v-model="param.value" />
          <span>{{ param.value }}%</span>
        </div>
      </div>
      <button class="ghost" @click="showParams = true">查看调节建议</button>
    </section>
  </div>
  <BaseModal v-model:open="showDeployment" title="模型发布">
    <p>已完成部署前检查，当前实验版本将推送至 10% 流量。</p>
  </BaseModal>
  <BaseModal v-model:open="showWeights" title="权重保存">
    <p>最新调参结果保存成功，可在数据监控模块查看实时表现。</p>
  </BaseModal>
  <BaseModal v-model:open="showParams" title="调参建议">
    <ul>
      <li>将召回池扩充 5%，提升新鲜度。</li>
      <li>对高价值用户提升协同过滤权重。</li>
      <li>对低频用户提高内容多样性系数。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const pipeline = ['召回 (Vector)', '粗排 (GBDT)', '精排 (Transformer)', '重排 (Diversity)', '在线反馈']

const chartPoints = '0,90 40,80 80,70 120,60 160,40 200,30'
const chartPointsB = '0,100 40,96 80,82 120,78 160,66 200,58'

const params = reactive([
  { label: '协同过滤权重', value: 68, desc: '控制相似用户的影响' },
  { label: '内容语义占比', value: 52, desc: '语义向量特征占比' },
  { label: '实时反馈响应', value: 74, desc: '点击、停留等行为' }
])

const showDeployment = ref(false)
const showWeights = ref(false)
const showParams = ref(false)
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
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  background: #e2e8f0;
}

button.primary {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: #fff;
}

.engine-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.flow,
.chart {
  flex: 1;
  min-width: 260px;
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

.flow ol {
  list-style: none;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.flow li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.flow span {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #6366f1;
}

.chart svg {
  width: 100%;
  margin-top: 1rem;
}

.controls {
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-item {
  display: grid;
  grid-template-columns: 1fr 1.5fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.control-item:last-child {
  border-bottom: none;
}

input[type='range'] {
  width: 100%;
}

button.ghost {
  align-self: flex-start;
  background: transparent;
  border: 1px dashed #a855f7;
  color: #a855f7;
}
</style>
