<template>
  <div style="min-height: 100vh; display: grid; grid-template-rows: auto 1fr;">
    <header style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:#ffffff;border-bottom:1px solid var(--border); box-shadow:0 8px 24px rgba(15,23,42,0.04);">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;">UT</div>
        <div>
          <div style="font-weight:800;font-size:18px;">优特钢多客户定制销售匹配系统</div>
          <div style="color:var(--muted);font-size:13px;">高性能销售协同 · 自适应亮色界面</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;">
        <div class="badge">业务在线</div>
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </header>

    <div style="display:grid;grid-template-columns: 260px 1fr; min-height: calc(100vh - 80px);">
      <aside style="padding:18px; border-right:1px solid var(--border); background:#f8fafc;">
        <div style="font-weight:700;color:var(--muted);margin-bottom:12px;">功能导航</div>
        <nav style="display:grid; gap:10px;">
          <router-link v-for="item in menus" :key="item.path" :to="item.path" class="nav-item" :class="{ active: isActive(item.path) }">
            <div>
              <div style="font-weight:700;">{{ item.label }}</div>
              <div style="color:var(--muted); font-size:13px;">{{ item.desc }}</div>
            </div>
            <span style="color:var(--muted);">→</span>
          </router-link>
        </nav>
      </aside>

      <main style="padding: 20px; background: linear-gradient(180deg, #f9fbff 0%, #eef2ff 100%);">
        <div class="card" style="min-height: calc(100vh - 160px);">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menus = [
  { path: '/main/customers', label: '客户管理', desc: '跟进标签、拜访计划' },
  { path: '/main/products', label: '产品目录', desc: '规格、库存与价格' },
  { path: '/main/orders', label: '订单管理', desc: '排产交付、收款跟踪' },
  { path: '/main/engine', label: '定制化引擎', desc: '个性化方案与报价' },
  { path: '/main/analytics', label: '数据分析与报表', desc: '经营监控与销售漏斗' }
];

const logout = () => {
  router.push('/login');
};

const isActive = (path) => route.path === path;
</script>

<style scoped>
.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  transition: all 0.2s ease;
}

.nav-item:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
}

.nav-item.active {
  border-color: var(--primary);
  box-shadow: 0 12px 26px rgba(37,99,235,0.12);
}
</style>
