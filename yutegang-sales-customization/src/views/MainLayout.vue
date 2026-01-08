<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">优特钢</div>
        <span>销售定制平台</span>
      </div>
      <nav class="menu">
        <RouterLink to="/dashboard/customer" class="menu-item">
          客户需求管理
        </RouterLink>
        <RouterLink to="/dashboard/product" class="menu-item">
          产品配置与定制
        </RouterLink>
        <RouterLink to="/dashboard/quote" class="menu-item">
          报价与订单管理
        </RouterLink>
        <RouterLink to="/dashboard/production" class="menu-item">
          生产调度与执行
        </RouterLink>
        <RouterLink to="/dashboard/analysis" class="menu-item">
          数据分析与决策支持
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div>
          <p>当前角色</p>
          <strong>销售运营经理</strong>
        </div>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>优特钢销售定制化标准设计与执行平台</h2>
          <p>亮色自适应布局 · 模块独立管理</p>
        </div>
        <div class="top-actions">
          <button class="ghost">消息中心</button>
          <button class="primary">同步数据</button>
        </div>
      </header>
      <section class="content-body">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f8ff;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e6edff;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #5b6aa0;
}

.logo {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #7aa8ff, #b8ccff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 2px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #2c3a64;
  background: #f4f7ff;
  transition: all 0.2s ease;
}

.menu-item.router-link-active {
  background: #3b6af7;
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(59, 106, 247, 0.2);
}

.sidebar-footer {
  margin-top: auto;
  background: #f4f7ff;
  padding: 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #5c6aa0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(18, 38, 63, 0.08);
}

.topbar h2 {
  margin: 0;
  font-size: 20px;
}

.topbar p {
  margin: 6px 0 0;
  color: #6d7aa8;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.ghost,
.primary {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eef2ff;
  color: #3c4c7b;
}

.primary {
  background: #3b6af7;
  color: #ffffff;
}

.content-body {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 16px;
  }
}
</style>
