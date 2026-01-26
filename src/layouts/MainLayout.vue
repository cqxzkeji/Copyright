<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">智信</div>
        <div>
          <h1>智信管理</h1>
          <p>商标与版权系统</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/trademark" class="menu-item" active-class="active">
          商标管理
        </router-link>
        <router-link to="/copyright" class="menu-item" active-class="active">
          版权管理
        </router-link>
        <router-link to="/users" class="menu-item" active-class="active">
          用户管理与权限控制
        </router-link>
        <router-link to="/analysis" class="menu-item" active-class="active">
          数据统计与分析
        </router-link>
        <router-link to="/system" class="menu-item" active-class="active">
          系统配置与维护
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <p>系统版本 v3.2.1</p>
        <span>安全状态：良好</span>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="page-title">
          <h2>{{ route.meta.title }}</h2>
          <span>欢迎进入智信商标与版权管理软件</span>
        </div>
        <div class="user-chip">
          <div>
            <p>管理员 · 李晴</p>
            <span>最近登录：10:45</span>
          </div>
          <button class="logout" @click="logout">退出登录</button>
        </div>
      </header>
      <section class="page-body">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #60a5fa);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand h1 {
  font-size: 18px;
}

.brand p {
  font-size: 12px;
  color: #6b7280;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 10px;
  color: #1f2937;
  background: #f8fafc;
  transition: all 0.2s ease;
  font-size: 14px;
}

.menu-item.active,
.menu-item:hover {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 32px 32px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title h2 {
  font-size: 20px;
  margin-bottom: 6px;
}

.page-title span {
  font-size: 12px;
  color: #64748b;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-chip p {
  font-size: 14px;
  font-weight: 600;
}

.user-chip span {
  font-size: 12px;
  color: #64748b;
}

.logout {
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.page-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .content {
    padding: 16px;
  }
}
</style>
