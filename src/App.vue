<template>
  <div class="app-shell" :class="{ 'auth-only': isAuthRoute }">
    <aside v-if="!isAuthRoute" class="side-nav">
      <div class="brand">
        <div class="logo">MP</div>
        <div>
          <h1>多参数测量系统</h1>
          <p>智能监测中枢</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path" class="menu-item">
          <span class="icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="side-footer">
        <button class="ghost-button" @click="openHelp">系统帮助</button>
      </div>
    </aside>

    <div class="main-area">
      <header v-if="!isAuthRoute" class="top-bar">
        <div>
          <h2>{{ currentTitle }}</h2>
          <p>统一监控、实时展示、多维分析</p>
        </div>
        <div class="top-actions">
          <button class="primary-button" @click="openNotice">系统公告</button>
          <button class="ghost-button" @click="openProfile">值班人员</button>
        </div>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>

    <Modal :open="helpModal" title="系统帮助" @close="helpModal = false">
      <p>可在左侧选择模块，系统支持实时采集、历史追溯、异常监测与导出配置。</p>
      <div class="modal-actions">
        <button class="primary-button" @click="helpModal = false">我知道了</button>
      </div>
    </Modal>

    <Modal :open="noticeModal" title="系统公告" @close="noticeModal = false">
      <ul class="notice-list">
        <li>08:00 - 今日新增 4 路传感器接入。</li>
        <li>12:00 - 设备 A 压力阈值调整完成。</li>
        <li>16:30 - 历史数据已归档至新存储池。</li>
      </ul>
      <div class="modal-actions">
        <button class="primary-button" @click="noticeModal = false">确认</button>
      </div>
    </Modal>

    <Modal :open="profileModal" title="值班人员" @close="profileModal = false">
      <div class="profile-card">
        <div>
          <h3>李楠 / 监控工程师</h3>
          <p>当前班次：早班（08:00 - 16:00）</p>
          <p>在线状态：在线</p>
        </div>
        <button class="primary-button" @click="profileModal = false">完成确认</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Modal from "./components/Modal.vue";

const route = useRoute();
const isAuthRoute = computed(() => route.path === "/login");
const helpModal = ref(false);
const noticeModal = ref(false);
const profileModal = ref(false);

const menu = [
  { path: "/dashboard", label: "实时数据显示", icon: "📈" },
  { path: "/collect", label: "多参数数据采集", icon: "🎛️" },
  { path: "/history", label: "历史数据记录", icon: "🗂️" },
  { path: "/alarm", label: "异常告警监测", icon: "🚨" },
  { path: "/setting", label: "系统配置与导出", icon: "⚙️" }
];

const currentTitle = computed(() => {
  const match = menu.find((item) => item.path === route.path);
  return match ? match.label : "系统入口";
});

const openHelp = () => {
  helpModal.value = true;
};

const openNotice = () => {
  noticeModal.value = true;
};

const openProfile = () => {
  profileModal.value = true;
};
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #1b1f23;
  background: #f6f8fb;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: #f6f8fb;
}

.app-shell.auth-only {
  display: block;
}

.side-nav {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.brand h1 {
  font-size: 18px;
  margin: 0;
}

.brand p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  font-weight: 600;
  background: #f8fafc;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.menu-item.router-link-active {
  border-color: #c7d2fe;
  background: #eef2ff;
  color: #1d4ed8;
}

.menu-item:hover {
  border-color: #e2e8f0;
  background: #f1f5f9;
}

.side-footer {
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.top-bar h2 {
  margin: 0;
  font-size: 20px;
}

.top-bar p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.content {
  flex: 1;
  padding: 24px 28px 40px;
  box-sizing: border-box;
}

.primary-button,
.ghost-button {
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.primary-button:hover {
  background: #1d4ed8;
}

.ghost-button {
  background: #ffffff;
  border-color: #d1d5db;
  color: #1f2937;
}

.ghost-button:hover {
  border-color: #94a3b8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.notice-list {
  margin: 0;
  padding-left: 18px;
  color: #334155;
}

.profile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

@media (max-width: 960px) {
  .side-nav {
    width: 220px;
  }

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .app-shell {
    flex-direction: column;
  }

  .side-nav {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    overflow-x: auto;
  }

  .menu {
    flex-direction: row;
    flex-wrap: nowrap;
  }
}
</style>
