<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-title">优特钢逆向推导系统</div>
        <div class="brand-sub">销售 & 技术标准</div>
      </div>
      <nav class="menu">
        <RouterLink to="/app/sales" class="menu-item" active-class="active">销售数据分析</RouterLink>
        <RouterLink to="/app/standards" class="menu-item" active-class="active">技术标准数据库</RouterLink>
        <RouterLink to="/app/customer" class="menu-item" active-class="active">客户需求分析</RouterLink>
        <RouterLink to="/app/reverse" class="menu-item" active-class="active">逆向推导模型</RouterLink>
        <RouterLink to="/app/reports" class="menu-item" active-class="active">智能报告可视化</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="status">在线</div>
        <button class="logout" type="button" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="title">优特钢销售技术标准逆向推导设计系统</div>
        <div class="meta">亮色自适应仪表盘 · 数据实时更新</div>
      </header>
      <section class="content-body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand-title {
  font-weight: 700;
  font-size: 18px;
}

.brand-sub {
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  background: #f8fafc;
  font-weight: 500;
}

.menu-item.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.logout {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 24px 32px 12px;
}

.title {
  font-size: 22px;
  font-weight: 700;
}

.meta {
  color: #64748b;
  margin-top: 4px;
}

.content-body {
  padding: 0 32px 32px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    width: 100%;
  }
}
</style>
