<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">信云系统</div>
      <nav class="nav-list">
        <RouterLink class="nav-item" to="/dashboard/customer">客户信息管理</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/analysis">数据统计与分析</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/roles">权限控制与安全管理</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/crm">客户关系维护</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/reports">报表生成与导出</RouterLink>
      </nav>
    </aside>
    <section class="main-content">
      <header class="topbar">
        <h1>客户信息管理平台</h1>
        <div class="user-info">
          <span class="badge">系统管理员</span>
          <span>李慧</span>
        </div>
      </header>
      <main class="page">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<script setup></script>
