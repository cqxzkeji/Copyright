<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-title">智链信息服务与管理系统</div>
        <div class="brand-subtitle">主控面板</div>
      </div>
      <nav class="menu">
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          active-class="active"
        >
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="badge">在线用户 128</div>
        <div class="badge">系统健康 98%</div>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div>
          <div class="topbar-title">欢迎回来，运营中心</div>
          <div class="topbar-subtitle">实时数据接入与智能分析一体化工作台</div>
        </div>
        <div class="topbar-actions">
          <button class="btn btn-secondary" type="button" @click="openNotice">
            通知中心
          </button>
          <button class="btn" type="button" @click="openQuick">快捷操作</button>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>

    <BaseModal v-if="modal.open" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <template #actions>
        <button class="btn btn-secondary" type="button" @click="closeModal">知道了</button>
        <button class="btn" type="button" @click="closeModal">立即处理</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import BaseModal from "../components/BaseModal.vue";

const menu = [
  { label: "信息采集与接入", path: "/app/data-collection" },
  { label: "数据存储与管理", path: "/app/data-management" },
  { label: "智能分析与决策支持", path: "/app/data-analysis" },
  { label: "报告与展示", path: "/app/reporting" },
  { label: "系统配置与管理", path: "/app/settings" }
];

const modal = reactive({
  open: false,
  title: "",
  message: ""
});

const openNotice = () => {
  modal.open = true;
  modal.title = "通知中心";
  modal.message = "当前已推送 6 条重要通知，请前往报告模块查看最新汇总。";
};

const openQuick = () => {
  modal.open = true;
  modal.title = "快捷操作";
  modal.message = "已为你准备接入模板、分析任务与报告发布的快捷入口。";
};

const closeModal = () => {
  modal.open = false;
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: var(--bg);
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid var(--border);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand-title {
  font-weight: 700;
  font-size: 18px;
}

.brand-subtitle {
  color: var(--muted);
  font-size: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #1e293b;
  font-weight: 600;
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-item:hover {
  background: #f1f5f9;
}

.menu-item.active {
  background: rgba(37, 99, 235, 0.12);
  color: var(--primary);
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: white;
  border-bottom: 1px solid var(--border);
}

.topbar-title {
  font-weight: 700;
  font-size: 18px;
}

.topbar-subtitle {
  color: var(--muted);
  font-size: 13px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.content {
  flex: 1;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .main {
    width: 100%;
  }
}
</style>
