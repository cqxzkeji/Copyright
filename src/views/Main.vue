<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">🌾 农产品供应链协同</div>
      <nav>
        <router-link to="/main/partner" class="nav-link" active-class="active">主体协同</router-link>
        <router-link to="/main/order" class="nav-link" active-class="active">采购与订单</router-link>
        <router-link to="/main/logistics" class="nav-link" active-class="active">物流与仓储</router-link>
        <router-link to="/main/analytics" class="nav-link" active-class="active">数据分析</router-link>
        <router-link to="/main/settings" class="nav-link" active-class="active">系统配置</router-link>
      </nav>
    </aside>
    <div class="content">
      <header class="topbar">
        <div class="welcome">
          <h2>供应链协同驾驶舱</h2>
          <p>实时汇总协同进展，快速响应农产品需求。</p>
        </div>
        <div class="user-panel">
          <div class="user-chip">运营管理员</div>
          <button class="btn outline" @click="showLogout = true">退出</button>
        </div>
      </header>
      <main class="view-area">
        <router-view />
      </main>
    </div>
  </div>

  <div v-if="showLogout" class="modal-overlay" @click.self="showLogout = false">
    <div class="modal">
      <h3>退出系统</h3>
      <p>确认返回登录页吗？</p>
      <div class="actions">
        <button class="btn outline" @click="showLogout = false">取消</button>
        <button class="btn" @click="goLogin">确认退出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showLogout = ref(false);

const goLogin = () => {
  showLogout.value = false;
  router.push('/login');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #e9f1ff 100%);
  border-right: 1px solid #e5e7eb;
  padding: 22px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  font-weight: 900;
  font-size: 18px;
  margin-bottom: 26px;
  color: #111827;
}

.nav-link {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  color: #374151;
  font-weight: 700;
  margin-bottom: 6px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.nav-link:hover {
  background: #eef2ff;
  transform: translateX(3px);
}

.nav-link.active {
  background: linear-gradient(135deg, #3a86ff, #8338ec);
  color: #fff;
  box-shadow: 0 10px 25px rgba(58, 134, 255, 0.3);
}

.content {
  padding: 18px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  background: var(--card);
  padding: 18px 20px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border);
}

.welcome h2 {
  margin: 0 0 4px;
}

.welcome p {
  margin: 0;
  color: var(--muted);
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-chip {
  background: #e0ecff;
  color: #1d4ed8;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.view-area {
  flex: 1;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    height: auto;
    position: relative;
    display: flex;
    gap: 10px;
    align-items: center;
    overflow-x: auto;
  }

  nav {
    display: flex;
    gap: 8px;
  }

  .nav-link {
    white-space: nowrap;
    margin-bottom: 0;
  }

  .content {
    padding: 10px 12px 20px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
