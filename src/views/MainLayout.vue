<script setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menus = [
  { label: '图像生成优化', path: '/main/image-generation' },
  { label: '资源调度管理', path: '/main/resource-scheduling' },
  { label: '数据采集处理', path: '/main/data-processing' },
  { label: '进度监控分析', path: '/main/progress-monitoring' },
  { label: '跨平台发布同步', path: '/main/cross-platform-publishing' }
]

const logout = () => {
  localStorage.removeItem('smart-image-token')
  router.push('/login')
}
</script>

<template>
  <div class="layout-page">
    <aside class="sidebar">
      <div class="logo">智能图像系统</div>
      <el-menu :default-active="route.path" router class="menu" unique-opened>
        <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">{{ menu.label }}</el-menu-item>
      </el-menu>
      <el-button type="danger" plain @click="logout">退出登录</el-button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout-page {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  padding: 8px 12px;
}

.menu {
  flex: 1;
  border-right: none;
}

.content {
  flex: 1;
  padding: 16px;
}

@media (max-width: 960px) {
  .layout-page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-width: unset;
  }
}
</style>
