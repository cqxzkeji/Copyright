<template>
  <div class="layout">
    <aside class="menu card">
      <h3>系统菜单</h3>
      <router-link v-for="item in menus" :key="item.path" :to="item.path" class="menu-item">{{ item.label }}</router-link>
      <button class="btn-secondary" @click="logout">退出登录</button>
    </aside>
    <main class="content card">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const menus = [
  { label: '任务调度与规划', path: '/system/task-scheduling' },
  { label: '多机协同作业', path: '/system/multi-drone' },
  { label: '实时监控与反馈', path: '/system/monitoring' },
  { label: '数据采集与分析', path: '/system/data-analysis' },
  { label: '任务执行与安全保障', path: '/system/safety-control' },
]

const logout = () => router.push('/login')
</script>

<style scoped>
.layout { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; gap: 16px; padding: 16px; }
.menu { height: calc(100vh - 32px); position: sticky; top: 16px; display: flex; flex-direction: column; gap: 8px; }
.menu-item { text-decoration: none; color: #334155; padding: 10px; border-radius: 8px; background: #f6f9ff; }
.menu-item.router-link-active { background: #dbeafe; color: #1d4ed8; }
.content { min-height: calc(100vh - 32px); overflow: auto; }
@media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .menu { height: auto; position: static; } }
</style>
