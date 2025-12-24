<template>
  <div class="layout">
    <header class="topbar">
      <div style="display:flex;gap:10px;align-items:center;">
        <div style="width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#4fb4ff,#79eaff);display:flex;align-items:center;justify-content:center;color:#0c2c44;font-weight:800;">农</div>
        <div>
          <div style="font-weight:800;font-size:18px;">农村电商数字化运营中心</div>
          <div class="muted-text">联通供应、营销、订单、系统配置的统一驾驶舱</div>
        </div>
      </div>
      <nav class="nav-links">
        <RouterLink class="nav-link" to="/app/dashboard">数据概览</RouterLink>
        <RouterLink class="nav-link" to="/app/product">商品供应</RouterLink>
        <RouterLink class="nav-link" to="/app/order">订单交易</RouterLink>
        <RouterLink class="nav-link" to="/app/marketing">营销推广</RouterLink>
        <RouterLink class="nav-link" to="/app/system">系统配置</RouterLink>
      </nav>
    </header>
    <main style="background:transparent;">
      <RouterView />
    </main>
  </div>
</template>
