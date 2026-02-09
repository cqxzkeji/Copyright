<template>
  <div class="layout">
    <aside class="menu">
      <h3>功能菜单</h3>
      <router-link v-for="item in menu" :key="item.path" class="menu-item" :to="item.path">{{ item.name }}</router-link>
      <button class="btn light" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
    <ModalDialog :visible="showLogout" title="提示信息" @close="showLogout=false" @confirm="confirmLogout">
      <p>确认退出当前账户？</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const showLogout = ref(false)
const menu = [
  { name: '项目立项与计划管理', path: '/dashboard/project-setup' },
  { name: '资源调度与分配', path: '/dashboard/resource-management' },
  { name: '进度监控与风险评估', path: '/dashboard/progress-monitoring' },
  { name: '团队协作与任务分配', path: '/dashboard/team-management' },
  { name: '财务管理与报告分析', path: '/dashboard/financial-reports' }
]

function logout() { showLogout.value = true }
function confirmLogout() {
  localStorage.removeItem('pms-auth')
  router.push('/login')
}
</script>

<style scoped>
.layout { min-height: 100vh; display: grid; grid-template-columns: 280px 1fr; }
.menu { background: #fff; padding: 18px; display: flex; flex-direction: column; gap: 10px; border-right: 1px solid #e8efff; height: 100vh; position: sticky; top: 0; }
.menu-item { text-decoration: none; color: #335083; background: #eef4ff; border-radius: 8px; padding: 10px; }
.menu-item.router-link-active { background: #2d7ef7; color: #fff; }
.content { padding: 16px; }
@media (max-width: 920px) {
  .layout { grid-template-columns: 1fr; }
  .menu { position: static; height: auto; }
}
</style>
