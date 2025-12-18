<template>
  <div class="main-shell">
    <aside class="sidebar">
      <div class="logo">
        <span class="badge" style="background:#e0f2fe;color:#0369a1;">Agri</span>
        <div>
          <strong>农产品电商</strong>
          <p style="margin:0;color:#475569;font-size:12px;">商品管理与结算中心</p>
        </div>
      </div>
      <nav class="menu">
        <router-link v-for="item in menus" :key="item.path" :to="item.path" class="menu-item" active-class="active">
          <span>{{ item.label }}</span>
          <small style="color:#94a3b8;">{{ item.desc }}</small>
        </router-link>
      </nav>
    </aside>
    <main class="content-area">
      <header class="topbar">
        <div class="section-header">
          <div>
            <p class="badge">欢迎回来</p>
            <h3 style="margin:6px 0 0;">农产品电商运营总览</h3>
          </div>
          <div class="tag-row">
            <span class="badge" style="background:#dcfce7;color:#166534;">实时同步</span>
            <span class="badge" style="background:#fef9c3;color:#92400e;">系统正常</span>
          </div>
        </div>
      </header>
      <section class="view-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
const menus = [
  { path: '/main/product', label: '商品管理', desc: '上架与定价' },
  { path: '/main/inventory', label: '库存管理', desc: '批次与预警' },
  { path: '/main/order', label: '订单与结算', desc: '应收与对账' },
  { path: '/main/user', label: '用户与商户', desc: '权限与信誉' },
  { path: '/main/analytics', label: '数据统计与分析', desc: '增长与效率' }
];
</script>

<style scoped>
.main-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.menu-item:hover,
.menu-item.active {
  background: linear-gradient(120deg, rgba(52, 211, 153, 0.2), rgba(59, 130, 246, 0.15));
  color: #fff;
}

.content-area {
  padding: 18px 18px 32px;
}

.topbar {
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.view-area {
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .main-shell {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }
  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .menu-item {
    flex-direction: column;
    align-items: flex-start;
    min-width: 180px;
  }
}
</style>
