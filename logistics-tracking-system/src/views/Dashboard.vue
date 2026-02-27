<template>
  <div class="layout">
    <aside>
      <h2>运输管控</h2>
      <button
        v-for="item in modules"
        :key="item.key"
        :class="{ active: current === item.key }"
        @click="current = item.key"
      >
        {{ item.label }}
      </button>
      <button class="logout" @click="goLogin">退出登录</button>
    </aside>
    <section class="content">
      <component :is="currentComponent" />
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import TransportPlan from './TransportPlan.vue'
import Tracking from './Tracking.vue'
import DataRecords from './DataRecords.vue'
import Alerts from './Alerts.vue'
import Analytics from './Analytics.vue'

const router = useRouter()
const modules = [
  { key: 'plan', label: '运输计划与调度', component: TransportPlan },
  { key: 'tracking', label: '货物追踪与监控', component: Tracking },
  { key: 'records', label: '数据记录与管理', component: DataRecords },
  { key: 'alerts', label: '异常事件监测与处理', component: Alerts },
  { key: 'analytics', label: '运输分析与报告', component: Analytics }
]

const current = ref('plan')
const currentComponent = computed(() => modules.find((item) => item.key === current.value)?.component)

const goLogin = () => router.push('/login')
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
}
aside {
  padding: 16px;
  background: #eef6ff;
  border-right: 1px solid #d9e8fc;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
button {
  border: none;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  color: #32527d;
}
button.active {
  background: linear-gradient(135deg, #2f8cff, #53b8ff);
  color: #fff;
}
.content {
  padding: 16px;
}
.logout {
  margin-top: auto;
  background: #ffd7d7;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  aside {
    position: sticky;
    top: 0;
    z-index: 5;
  }
}
</style>
