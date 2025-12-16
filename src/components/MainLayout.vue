<template>
  <div class="layout" style="display: grid; grid-template-columns: 260px 1fr; min-height: 100vh;">
    <aside class="sidebar" style="background: #f8fbff; border-right: 1px solid var(--border); padding: 20px 16px; display: flex; flex-direction: column; gap: 16px;">
      <div class="card" style="background: linear-gradient(135deg, #e0edff, #ffffff);">
        <h2 style="margin: 0;">安全治理控制台</h2>
        <p style="margin: 6px 0 0; color: #4b5563;">Adaptive Security Governance</p>
      </div>
      <nav style="display: grid; gap: 10px;">
        <RouterLink v-for="item in menus" :key="item.path" :to="item.path" class="nav-item" :class="{ active: route.path === item.path }">
          <span>{{ item.icon }} {{ item.label }}</span>
          <small style="color: #6b7280;">{{ item.desc }}</small>
        </RouterLink>
      </nav>
    </aside>
    <main style="padding: 20px; background: linear-gradient(180deg, #f8fbff, #ffffff);">
      <header class="flex-between" style="margin-bottom: 18px;">
        <div>
          <h1 style="margin: 0;">自适应安全治理与风险决策</h1>
          <p style="margin: 4px 0 0; color: #6b7280;">以数据驱动的安全全生命周期管理</p>
        </div>
        <div class="flex" style="align-items: center; gap: 10px;">
          <span class="badge success">在线</span>
          <button class="btn ghost" @click="logout">退出</button>
        </div>
      </header>
      <div class="card" style="min-height: calc(100vh - 120px);">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const menus = [
  { path: '/data-ingest', label: '安全数据采集与接入', icon: '🛰️', desc: '数据源接入与采集调度' },
  { path: '/risk', label: '风险识别与态势评估', icon: '🧭', desc: '威胁检测与画像评估' },
  { path: '/decision', label: '自适应决策与处置响应', icon: '🛡️', desc: '策略编排与自动化响应' },
  { path: '/visualization', label: '安全态势可视化与分析', icon: '📊', desc: '多维指标与趋势洞察' },
  { path: '/management', label: '系统管理与合规审计', icon: '🗄️', desc: '资产、账号与审计日志' }
];

const logout = () => {
  localStorage.removeItem('asg-auth');
  router.push('/login');
};
</script>

<style scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: var(--shadow);
  font-weight: 700;
}

.nav-item.active {
  border-color: var(--primary);
  box-shadow: 0 10px 30px rgba(44, 125, 250, 0.18);
}
</style>
