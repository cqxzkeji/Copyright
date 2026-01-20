<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <h2>企业信息平台</h2>
        <span>多维数据整合</span>
      </div>
      <nav class="menu">
        <router-link
          v-for="item in menu"
          :key="item.path"
          class="menu-item"
          :to="item.path"
        >
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="badge">在线 · 运行稳定</div>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <strong>欢迎回来</strong>
          <p>数据实时同步中，最后更新时间 08:30</p>
        </div>
        <div class="top-actions">
          <button class="secondary" @click="openNotice">查看系统通知</button>
          <button class="primary" @click="openSupport">联络支持</button>
        </div>
      </header>
      <main class="page">
        <router-view />
      </main>
    </div>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <div class="modal-header">
          <strong>{{ activeModal.title }}</strong>
          <button class="secondary" @click="activeModal = null">关闭</button>
        </div>
        <div class="modal-body">
          <p>{{ activeModal.message }}</p>
          <div class="progress">
            <span :style="{ width: activeModal.progress + '%' }"></span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="primary" @click="activeModal = null">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menu = [
  { path: '/main/data-collection', label: '企业信息采集' },
  { path: '/main/data-processing', label: '数据清洗与整合' },
  { path: '/main/enterprise-profile', label: '企业画像与标签' },
  { path: '/main/analysis', label: '分析展示与预警' },
  { path: '/main/system', label: '系统管理与服务输出' }
];

const activeModal = ref(null);

const openNotice = () => {
  activeModal.value = {
    title: '系统通知',
    message: '今日已完成 3 批次同步任务，风险模型运行正常。',
    progress: 100
  };
};

const openSupport = () => {
  activeModal.value = {
    title: '支持服务',
    message: '专属客服将在 30 分钟内响应，请保持在线。',
    progress: 72
  };
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand span {
  color: #64748b;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 8px;
  margin-top: 24px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.menu-item.router-link-active {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15);
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px 0 24px;
  gap: 16px;
}

.topbar p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }

  .menu {
    grid-auto-flow: column;
    grid-auto-columns: minmax(150px, 1fr);
    margin-top: 0;
    gap: 12px;
    padding-left: 16px;
  }

  .sidebar-footer {
    display: none;
  }
}
</style>
