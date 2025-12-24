<template>
  <div class="app-shell">
    <header class="header">
      <div class="brand">
        <span>Rural</span>
        农村电商运营与资源整合系统
      </div>
      <div class="nav-links">
        <RouterLink class="nav-link" active-class="active" to="/app/resource">资源整合</RouterLink>
        <RouterLink class="nav-link" active-class="active" to="/app/product">商品运营</RouterLink>
        <RouterLink class="nav-link" active-class="active" to="/app/order">订单履约</RouterLink>
        <RouterLink class="nav-link" active-class="active" to="/app/analytics">数据决策</RouterLink>
        <RouterLink class="nav-link" active-class="active" to="/app/system">平台支撑</RouterLink>
      </div>
      <RouterLink class="btn secondary" to="/">退出</RouterLink>
    </header>
    <main class="layout">
      <section class="sidebar">
        <h3>快捷工具</h3>
        <div class="tag-list">
          <span class="tag">村播培训</span>
          <span class="tag">社群分销</span>
          <span class="tag">供应链协同</span>
          <span class="tag">冷链配送</span>
        </div>
        <div class="card">
          <p>本周重点</p>
          <ul>
            <li>提升乡镇店铺开播率</li>
            <li>优化产地仓库存周转</li>
            <li>完善订单履约的时效告警</li>
          </ul>
        </div>
      </section>
      <section class="content-area">
        <router-view />
      </section>
    </main>
  </div>
</template>
