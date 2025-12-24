<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">乡村电商</div>
      <nav>
        <RouterLink to="/main/resource" class="nav-item">资源整合与主体管理</RouterLink>
        <RouterLink to="/main/product" class="nav-item">商品运营与内容管理</RouterLink>
        <RouterLink to="/main/order" class="nav-item">订单交易与履约管理</RouterLink>
        <RouterLink to="/main/analysis" class="nav-item">运营数据分析</RouterLink>
        <RouterLink to="/main/setting" class="nav-item">系统配置与协同服务</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="top-bar card">
        <div>
          <div class="badge">乡村产业带</div>
          <h2>融合驾驶舱</h2>
        </div>
        <div class="user">
          <span class="status-pill success">在线</span>
          <span>运营官</span>
        </div>
      </header>
      <section class="page-body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  gap: 16px;
  padding: 16px;
}

.sidebar {
  position: sticky;
  top: 16px;
  align-self: start;
  display: grid;
  gap: 8px;
  background: linear-gradient(180deg, #f8fbff, #ffffff);
}

.logo {
  font-size: 20px;
  font-weight: 800;
  color: #114b8a;
}

nav {
  display: grid;
  gap: 8px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 12px;
  background: #f3f7ff;
  color: #1f2d3d;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.1s ease;
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, #5fb8ff, #7ad7ff);
  color: #0b2a40;
  transform: translateX(4px);
}

.content {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-body {
  display: grid;
  gap: 16px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
  }
}
</style>
