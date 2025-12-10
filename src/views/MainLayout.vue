<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-mark">LF</div>
        <div>
          <p class="logo-title">饲料优化与营养分析</p>
          <p class="logo-sub">Livestock Feed Suite</p>
        </div>
      </div>
      <nav class="nav-links">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link" active-class="active">
          <span>{{ item.label }}</span>
          <span class="nav-pill">{{ item.short }}</span>
        </RouterLink>
      </nav>
      <button class="ghost" @click="showLogout = true">退出登录</button>
    </aside>
    <section class="content-area">
      <header class="topbar">
        <div>
          <p class="welcome">智能饲料实验室</p>
          <p class="tip">主界面将各功能模块加载到内容窗口，专注数据与分析</p>
        </div>
        <div class="top-actions">
          <button class="ghost" @click="openQuickHelp">使用指引</button>
          <button @click="openNotification">消息提示</button>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </section>
    <ModalDialog v-model="showLogout" title="确认退出" subtitle="确认返回登录页吗？">
      <p>退出后需要重新输入账号与密码才能继续查看各模块数据。</p>
      <template #footer>
        <button class="ghost" @click="showLogout = false">取消</button>
        <button @click="handleLogout">确认退出</button>
      </template>
    </ModalDialog>
    <ModalDialog v-model="showHelp" title="操作指引">
      <ul class="help-list">
        <li>左侧菜单切换饲料配比、营养分析、质量控制等模块。</li>
        <li>每个按钮都会弹出对应的表单或提示，请按需操作。</li>
        <li>数据表格可横向滚动，移动端自动堆叠布局。</li>
      </ul>
    </ModalDialog>
    <ModalDialog v-model="showNotification" title="系统通知" subtitle="最新运行状态">
      <p>当前所有分析任务均在正常运行中，数据同步延迟小于 3 分钟。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showLogout = ref(false);
const showHelp = ref(false);
const showNotification = ref(false);

const navItems = [
  { path: '/feed-formula', label: '饲料配比优化', short: '配比' },
  { path: '/nutrient-analysis', label: '营养分析', short: '营养' },
  { path: '/ingredient-library', label: '饲料原料库', short: '原料' },
  { path: '/feed-quality-control', label: '饲料质量控制', short: '质控' },
  { path: '/reports', label: '数据报表', short: '报表' }
];

const handleLogout = () => {
  localStorage.removeItem('lfos-auth');
  showLogout.value = false;
  router.push('/login');
};

const openQuickHelp = () => {
  showHelp.value = true;
};

const openNotification = () => {
  showNotification.value = true;
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #e8f1ff 0%, #f7fbff 100%);
  padding: 20px 16px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.logo-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.logo-title {
  margin: 0;
  font-weight: 700;
}

.logo-sub {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-link {
  background: #fff;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.nav-link:hover {
  border-color: var(--primary);
  box-shadow: 0 6px 18px rgba(60, 123, 230, 0.12);
}

.nav-link.active {
  background: #eef4ff;
  border-color: #c7d2fe;
  color: #1d4ed8;
}

.nav-pill {
  background: #e0f2fe;
  color: #075985;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.content-area {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.92);
  position: sticky;
  top: 0;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.welcome {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.tip {
  margin: 4px 0 0;
  color: var(--muted);
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  padding: 20px;
}

.help-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
    align-items: center;
  }

  .nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav-link {
    min-width: 140px;
  }
}
</style>
