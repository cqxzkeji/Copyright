<template>
  <div class="main-page">
    <header class="top-bar">
      <div>
        <h2>创意驾驶舱</h2>
        <p>实时监控七大模块运行状态，快速调度资源。</p>
      </div>
      <div class="actions">
        <button @click="openInfo('智能助手提示', 'AI创意助手已准备好为您服务。')">AI 助手</button>
        <button @click="startProgress('素材云同步', '正在增量同步最新素材包…')">素材同步</button>
      </div>
    </header>

    <section class="kpi-panel">
      <div class="kpi-card" v-for="metric in kpis" :key="metric.label">
        <p>{{ metric.label }}</p>
        <strong>{{ metric.value }}</strong>
        <div class="kpi-chart">
          <div class="kpi-bar" :style="{ width: metric.trend + '%'}"></div>
        </div>
      </div>
      <div class="chart-card">
        <h3>跨模块产能走势</h3>
        <div class="chart-bars">
          <div v-for="(item, index) in capacity" :key="item.label" class="chart-col">
            <div class="bar" :style="{ height: item.value + '%', background: colors[index % colors.length] }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="workspace">
      <aside class="module-menu">
        <div
          v-for="module in modules"
          :key="module.id"
          :class="['module-item', { active: module.id === activeModule }]"
          @click="activeModule = module.id"
        >
          <h4>{{ module.title }}</h4>
          <p>{{ module.desc }}</p>
        </div>
      </aside>
      <div class="module-content">
        <component
          :is="moduleComponent"
          @open-modal="openInfo"
          @show-progress="startProgress"
        />
      </div>
    </section>

    <div v-if="modal.visible" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-panel">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <div v-if="modal.showProgress" class="progress-shell">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <button @click="closeModal">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import UserManagement from './UserManagement.vue'
import CreativeGeneration from './CreativeGeneration.vue'
import AssetLibrary from './AssetLibrary.vue'
import CampaignPublish from './CampaignPublish.vue'
import Analytics from './Analytics.vue'
import SystemSettings from './SystemSettings.vue'

const modules = [
  { id: 'user', title: '用户与权限', desc: '管控账号与权限', component: UserManagement },
  { id: 'creative', title: '创意生成', desc: 'AI 生成/编辑创意', component: CreativeGeneration },
  { id: 'asset', title: '素材资产', desc: '素材库管理', component: AssetLibrary },
  { id: 'publish', title: '广告投放', desc: '计划与排期', component: CampaignPublish },
  { id: 'analytics', title: '数据分析', desc: '效果洞察', component: Analytics },
  { id: 'settings', title: '系统配置', desc: '后台设置', component: SystemSettings }
]

const kpis = [
  { label: '今日创意交付', value: '126 个', trend: 78 },
  { label: '上线广告组', value: '34 个', trend: 62 },
  { label: '模型调用成功率', value: '99.2%', trend: 92 }
]

const capacity = [
  { label: '用户', value: 60 },
  { label: '创意', value: 95 },
  { label: '素材', value: 70 },
  { label: '投放', value: 80 },
  { label: '分析', value: 88 },
  { label: '配置', value: 65 }
]

const colors = ['#60a5fa', '#a855f7', '#34d399', '#f59e0b']

const activeModule = ref('creative')
const modal = reactive({ visible: false, title: '', message: '', showProgress: false, progress: 0 })

const moduleComponent = computed(() => {
  const target = modules.find((item) => item.id === activeModule.value)
  return target?.component ?? modules[0].component
})

const openInfo = (title, message) => {
  modal.visible = true
  modal.title = title
  modal.message = message
  modal.showProgress = false
}

const startProgress = (title, message) => {
  modal.visible = true
  modal.title = title
  modal.message = message
  modal.showProgress = true
  modal.progress = 0
  const timer = setInterval(() => {
    modal.progress += 15
    if (modal.progress >= 100) {
      modal.progress = 100
      clearInterval(timer)
    }
  }, 300)
}

const closeModal = () => {
  modal.visible = false
}
</script>

<style scoped>
.main-page {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f172a;
  color: #fff;
  padding: 24px;
  border-radius: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.top-bar h2 {
  font-size: 24px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  padding: 10px 16px;
  border: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-weight: 600;
}

.kpi-panel {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.kpi-card,
.chart-card {
  background: #fff;
  border-radius: 24px;
  padding: 20px;
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kpi-card strong {
  font-size: 24px;
}

.kpi-chart {
  height: 6px;
  background: #e5e7eb;
  border-radius: 999px;
}

.kpi-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #2563eb, #9333ea);
}

.chart-card {
  min-width: 280px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 140px;
}

.chart-col {
  flex: 1;
  text-align: center;
}

.chart-col .bar {
  width: 100%;
  border-radius: 12px 12px 4px 4px;
}

.chart-col span {
  display: block;
  margin-top: 8px;
  font-size: 12px;
}

.workspace {
  display: flex;
  gap: 24px;
  min-height: 420px;
}

.module-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-item {
  padding: 18px;
  background: #fff;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: border 0.2s, transform 0.2s;
}

.module-item.active {
  border-color: #2563eb;
  transform: translateY(-2px);
}

.module-item h4 {
  margin-bottom: 6px;
}

.module-content {
  flex: 2;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  min-height: 420px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.modal-panel {
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  width: min(420px, 90%);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-panel button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
}

.progress-shell {
  background: #e5e7eb;
  border-radius: 999px;
  height: 12px;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #22d3ee, #6366f1);
  transition: width 0.3s ease;
}

@media (max-width: 960px) {
  .workspace {
    flex-direction: column;
  }
}
</style>
