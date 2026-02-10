<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>AI资源系统</h2>
      <nav>
        <router-link to="/dashboard/generation">图像生成</router-link>
        <router-link to="/dashboard/resources">资源管理</router-link>
        <router-link to="/dashboard/editing">图像处理</router-link>
        <router-link to="/dashboard/publish">内容发布</router-link>
        <router-link to="/dashboard/analytics">数据分析</router-link>
      </nav>
      <button class="danger" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.removeItem('auth-token')
  router.push('/login')
}
</script>

<style scoped>
.layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.sidebar {
  background: #ffffff;
  border-right: 1px solid #e7edf6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
nav { display: flex; flex-direction: column; gap: 10px; }
a {
  color: #374151;
  text-decoration: none;
  background: #eef3fb;
  border-radius: 10px;
  padding: 10px 12px;
}
a.router-link-active { background: #3478f6; color: #fff; }
.content { padding: 16px; }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: sticky; top: 0; z-index: 10; }
}
</style>
