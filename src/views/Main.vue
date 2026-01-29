<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <h1>动作识别实训系统</h1>
        <p>非接触式交互与训练管理平台</p>
      </div>
      <nav>
        <RouterLink class="nav-item" to="/main/motion-capture">动作捕捉</RouterLink>
        <RouterLink class="nav-item" to="/main/motion-analysis">动作识别</RouterLink>
        <RouterLink class="nav-item" to="/main/training-mode">训练模式</RouterLink>
        <RouterLink class="nav-item" to="/main/data-monitor">数据监控</RouterLink>
        <RouterLink class="nav-item" to="/main/progress-track">进度跟踪</RouterLink>
        <RouterLink class="nav-item" to="/main/settings">系统设置</RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup></script>
