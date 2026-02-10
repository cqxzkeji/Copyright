<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>非遗创作系统</h2>
      <router-link v-for="item in menus" :key="item.path" :to="item.path" class="menu-item">
        {{ item.name }}
      </router-link>
      <button class="logout" @click="goLogin">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const menus = [
  { name: '内容采集与管理', path: '/main/collection' },
  { name: '多模态融合处理', path: '/main/fusion' },
  { name: '内容创作与定制', path: '/main/creation' },
  { name: '智能推荐互动体验', path: '/main/interactive' },
  { name: '发布传播与分析', path: '/main/analytics' }
]

const goLogin = () => router.push('/')
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
}
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #dbeafe;
  border-right: 1px solid #bfdbfe;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sidebar h2 {
  font-size: 18px;
  color: #1e40af;
  margin-bottom: 8px;
}
.menu-item {
  padding: 10px;
  border-radius: 8px;
  color: #1e3a8a;
  text-decoration: none;
  background: #eff6ff;
}
.menu-item.router-link-active { background: #93c5fd; }
.logout {
  margin-top: auto;
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}
.content {
  flex: 1;
  padding: 16px;
  overflow-x: auto;
}
@media (max-width: 860px) {
  .layout { flex-direction: column; }
  .sidebar { width: 100%; min-width: 100%; }
}
</style>
