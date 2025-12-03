<template>
  <div class="layout-shell">
    <aside class="sidebar">
      <div class="logo">
        <div class="badge">CSB</div>
        <div>
          <div>安全带连接件</div>
          <small style="color: #6b7a99; font-weight: 600;">调度与质量平台</small>
        </div>
      </div>
      <RouterLink to="/dashboard/production">生产调度</RouterLink>
      <RouterLink to="/dashboard/quality">质量控制</RouterLink>
      <RouterLink to="/dashboard/machines">机器监控</RouterLink>
      <RouterLink to="/dashboard/reports">报告生成</RouterLink>
      <RouterLink to="/dashboard/settings">系统设置</RouterLink>
      <button @click="logout">退出登陆</button>
    </aside>
    <main style="display: flex; flex-direction: column;">
      <header class="topbar">
        <div>
          <div style="font-weight: 800;">安全带连接件调度看板</div>
          <div style="color: #6b7a99;">实时掌控生产、质量与设备状态</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="text-align: right;">
            <div style="font-weight: 700;">班长 林工</div>
            <small style="color: #6b7a99;">早班 · 07:00-15:00</small>
          </div>
          <div style="width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(140deg, #e0f2ff, #ffffff); display: grid; place-items: center; font-weight: 800; color: #2f80ed;">A3</div>
        </div>
      </header>
      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logout = () => {
  router.replace('/login');
};
</script>
