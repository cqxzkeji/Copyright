<template>
  <div class="layout">
    <aside>
      <h3>功能菜单</h3>
      <router-link v-for="m in menus" :key="m.path" :to="m.path">{{ m.label }}</router-link>
      <button class="btn" @click="logout">退出登录</button>
    </aside>
    <section><router-view /></section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const menus = [
  { path: '/platform/collection', label: '数据采集与传输' },
  { path: '/platform/preprocessing', label: '数据预处理与清洗' },
  { path: '/platform/storage', label: '数据存储与管理' },
  { path: '/platform/analysis', label: '智能分析与异常检测' },
  { path: '/platform/reporting', label: '可视化与报告生成' }
]
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.layout{display:grid;grid-template-columns:220px 1fr;min-height:100vh}
aside{background:#f8fbff;border-right:1px solid #e2e8f0;padding:16px;display:flex;flex-direction:column;gap:8px;position:sticky;top:0;height:100vh}
aside a{padding:8px 10px;border-radius:8px;text-decoration:none;color:#1e3a8a;background:#eaf2ff}
aside a.router-link-active{background:#2563eb;color:#fff}
section{padding:16px}
@media (max-width: 900px){.layout{grid-template-columns:1fr} aside{position:static;height:auto}}
</style>
