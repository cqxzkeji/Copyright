<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const modules = [
  { label: '上传导入', path: '/dashboard/upload' },
  { label: '审核比对', path: '/dashboard/review' },
  { label: '风险预警', path: '/dashboard/risk' },
  { label: '合规检查', path: '/dashboard/compliance' },
  { label: '统计报告', path: '/dashboard/analytics' }
]

const logout = () => {
  sessionStorage.removeItem('auth')
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <aside class="side">
      <div class="logo">智能单证平台</div>
      <el-menu :default-active="route.path" router>
        <el-menu-item v-for="item in modules" :key="item.path" :index="item.path">{{ item.label }}</el-menu-item>
      </el-menu>
      <el-button plain @click="logout">退出登录</el-button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.side {
  background: #ffffff;
  padding: 14px;
  border-right: 1px solid #e5edff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  font-weight: 700;
  color: #1d4ed8;
  text-align: center;
  padding: 12px;
  background: #eff6ff;
  border-radius: 10px;
}

.content {
  padding: 18px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
