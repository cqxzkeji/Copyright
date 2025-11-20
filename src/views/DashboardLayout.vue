<template>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="dot" />
        <div>
          <strong>AI 推荐</strong>
          <small>控制台</small>
        </div>
      </div>
      <nav>
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.desc }}</small>
        </RouterLink>
      </nav>
      <button class="cta" @click="showAnnouncement = true">系统公告</button>
    </aside>
    <main class="workspace">
      <header class="workspace-header">
        <div>
          <h2>智能推荐指挥中心</h2>
          <p>实时监控数据、算法和内容模块的运行情况。</p>
        </div>
        <div class="header-actions">
          <button @click="showTooltip = true">操作指引</button>
          <button class="primary" @click="showProgress = true">查看训练进度</button>
        </div>
      </header>
      <section class="highlight-cards">
        <article v-for="metric in metrics" :key="metric.title" class="metric-card">
          <p>{{ metric.title }}</p>
          <strong>{{ metric.value }}</strong>
          <span :style="{ color: metric.trendColor }">{{ metric.trend }}</span>
        </article>
      </section>
      <section class="content-window">
        <router-view />
      </section>
    </main>
  </div>
  <BaseModal v-model:open="showTooltip" title="快速上手">
    <p>左侧菜单可以在模块之间切换，右上角按钮用于查看训练进度和公告提示。</p>
  </BaseModal>
  <BaseModal v-model:open="showAnnouncement" title="系统公告">
    <p>周三晚上 23:00-24:00 进行例行维护，建议提前提交训练任务。</p>
  </BaseModal>
  <BaseModal v-model:open="showProgress" title="训练进度">
    <div class="progress-group" v-for="item in progress" :key="item.label">
      <div class="progress-label">
        <span>{{ item.label }}</span>
        <span>{{ item.value }}%</span>
      </div>
      <div class="progress-bar">
        <span :style="{ width: item.value + '%', background: item.color }" />
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const route = useRoute()
const showTooltip = ref(false)
const showAnnouncement = ref(false)
const showProgress = ref(false)

const menu = computed(() => [
  { path: '/dashboard/user-behavior', label: '用户行为分析', desc: '洞察偏好' },
  { path: '/dashboard/algorithm-engine', label: '推荐算法引擎', desc: '模型管理' },
  { path: '/dashboard/content-generation', label: '内容生成', desc: '素材生成' },
  { path: '/dashboard/real-time', label: '实时推荐', desc: '流式分发' },
  { path: '/dashboard/data-monitoring', label: '数据监控', desc: '反馈评估' }
])

const metrics = [
  { title: '实时在线用户', value: '82,410', trend: '+12% QoQ', trendColor: '#16a34a' },
  { title: '推荐点击率', value: '38.2%', trend: '+3.1% WoW', trendColor: '#0ea5e9' },
  { title: '自动生成内容', value: '5,812', trend: '+640 篇', trendColor: '#f97316' }
]

const progress = [
  { label: '序列模型训练', value: 76, color: '#6366f1' },
  { label: '召回向量构建', value: 58, color: '#0ea5e9' },
  { label: 'AB 实验部署', value: 32, color: '#22c55e' }
]
</script>

<style scoped>
.dashboard-shell {
  flex: 1;
  display: flex;
  background: #f4f6fb;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.4rem;
  gap: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #a855f7);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.nav-item {
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: rgba(148, 163, 184, 0.08);
  color: #cbd5f5;
  text-decoration: none;
  gap: 0.2rem;
}

.nav-item small {
  font-size: 0.8rem;
  color: #94a3b8;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.cta {
  margin-top: auto;
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1.5rem;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

.header-actions button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  background: #e2e8f0;
}

.header-actions .primary {
  background: linear-gradient(135deg, #22d3ee, #6366f1);
  color: #fff;
}

.highlight-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.metric-card {
  flex: 1;
  min-width: 200px;
  background: #fff;
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.metric-card strong {
  font-size: 1.6rem;
}

.content-window {
  flex: 1;
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.progress-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
}

.progress-bar span {
  display: block;
  height: 8px;
  border-radius: 999px;
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
}
</style>
