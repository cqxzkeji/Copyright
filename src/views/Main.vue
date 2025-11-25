<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">
        <div class="dot" />
        <div>
          <strong>WRF-Chem</strong>
          <div class="muted">PM2.5 业务化</div>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/main/data-input" class="menu-item" :class="isActive('data-input')">数据采集与输入</RouterLink>
        <RouterLink to="/main/model-config" class="menu-item" :class="isActive('model-config')">模式配置与参数化</RouterLink>
        <RouterLink to="/main/simulation" class="menu-item" :class="isActive('simulation')">数值模拟与批处理</RouterLink>
        <RouterLink to="/main/visualization" class="menu-item" :class="isActive('visualization')">预测结果可视化</RouterLink>
        <RouterLink to="/main/publish" class="menu-item" :class="isActive('publish')">预测评估与发布</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar card">
        <div>
          <div class="title">大气 PM2.5 预测模式控制台</div>
          <div class="muted">基于 WRF-Chem 的一体化业务流程</div>
        </div>
        <div class="top-actions">
          <button @click="showHelp = true">帮助</button>
          <button @click="logout">退出</button>
        </div>
      </header>
      <section class="card inner">
        <router-view />
      </section>
    </main>
  </div>

  <div v-if="showHelp" class="modal-overlay" @click.self="showHelp = false">
    <div class="modal">
      <h3>系统使用提示</h3>
      <p>根据左侧菜单进入各模块，完成从数据接入到预测发布的业务流程。模块按钮均附带操作对话框与进度反馈。</p>
      <div class="toolbar">
        <button @click="showHelp = false">我已了解</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';

const router = useRouter();
const route = useRoute();
const showHelp = ref(false);

const logout = () => {
  router.push('/login');
};

const isActive = (segment) => (route.path.includes(segment) ? 'active' : '');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  gap: 18px;
  padding: 18px;
}

.sidebar {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo .dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 8px rgba(59,130,246,0.15);
}

.muted {
  color: var(--muted);
  font-size: 13px;
}

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: #f8fafc;
  font-weight: 600;
}

.menu-item.active {
  border-color: var(--primary);
  background: #e0ecff;
  color: var(--primary-strong);
}

.content {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.title {
  font-size: 20px;
  font-weight: 700;
}

.inner {
  min-height: calc(100vh - 120px);
}

.top-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
  }
  .menu {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}
</style>
