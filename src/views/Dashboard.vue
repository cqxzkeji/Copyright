<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">云平台中控</div>
      <nav class="menu">
        <RouterLink to="/resources" class="link" active-class="active">资源管理</RouterLink>
        <RouterLink to="/tasks" class="link" active-class="active">任务调度</RouterLink>
        <RouterLink to="/performance" class="link" active-class="active">性能监控</RouterLink>
        <RouterLink to="/alerts" class="link" active-class="active">告警管理</RouterLink>
        <RouterLink to="/settings" class="link" active-class="active">系统设置</RouterLink>
      </nav>
      <button class="sidebar-btn" @click="showShortcut = true">快捷指令</button>
    </aside>
    <section class="content">
      <header class="topbar">
        <div class="titles">
          <div class="subtitle">云计算资源调度与性能监控平台</div>
          <h1 class="title">统一控制台</h1>
        </div>
        <div class="actions">
          <button @click="showAnnouncement = true">平台公告</button>
          <button @click="showLogoutConfirm = true">安全退出</button>
        </div>
      </header>
      <main class="main">
        <router-view />
      </main>
    </section>

    <BaseModal v-if="showLogoutConfirm" title="确认退出" @close="showLogoutConfirm = false">
      <p>确定要退出平台并返回登录页吗？</p>
      <div class="modal-actions">
        <button class="primary" @click="logout">确认</button>
        <button @click="showLogoutConfirm = false">取消</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showAnnouncement" title="平台公告" @close="showAnnouncement = false">
      <ul class="announcement">
        <li>本周新增 GPU 资源 12 块，已开放调度。</li>
        <li>调度系统将在周五凌晨 2 点维护 30 分钟。</li>
        <li>请定期检查告警规则以避免遗漏。</li>
      </ul>
      <div class="modal-actions">
        <button class="primary" @click="showAnnouncement = false">已知悉</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showShortcut" title="快捷指令" @close="showShortcut = false">
      <p>可快速打开常用模块：</p>
      <div class="chips">
        <button class="chip" @click="go('/resources')">资源分配</button>
        <button class="chip" @click="go('/tasks')">调度策略</button>
        <button class="chip" @click="go('/performance')">性能看板</button>
      </div>
      <div class="modal-actions">
        <button class="primary" @click="showShortcut = false">关闭</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from './components/BaseModal.vue';

const showLogoutConfirm = ref(false);
const showAnnouncement = ref(false);
const showShortcut = ref(false);
const router = useRouter();

const logout = () => {
  showLogoutConfirm.value = false;
  router.push('/login');
};

const go = (path) => {
  router.push(path);
  showShortcut.value = false;
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  font-weight: 700;
  font-size: 18px;
  color: #2563eb;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link {
  padding: 10px 14px;
  border-radius: 10px;
  color: #374151;
  background: #f3f6ff;
  transition: all 0.2s ease;
}

.link:hover {
  background: #e5ecff;
}

.active {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: white;
}

.sidebar-btn {
  padding: 12px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.2);
}

.content {
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  margin: 4px 0 0;
  font-size: 24px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

.actions button {
  margin-left: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
}

.main {
  padding: 20px;
}

.announcement {
  padding-left: 18px;
  color: #374151;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
}

.chips {
  display: flex;
  gap: 10px;
  margin: 12px 0;
}

.chip {
  border: none;
  background: #eef2ff;
  padding: 8px 12px;
  border-radius: 999px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
