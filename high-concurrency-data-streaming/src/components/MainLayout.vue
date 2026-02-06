<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-mark">H</div>
        <div>
          <div class="logo-title">实时数据流平台</div>
          <div class="logo-sub">高并发 · 低延迟</div>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/app/collection" class="menu-item">数据采集与接入</RouterLink>
        <RouterLink to="/app/processing" class="menu-item">数据流处理</RouterLink>
        <RouterLink to="/app/storage" class="menu-item">数据存储与管理</RouterLink>
        <RouterLink to="/app/analysis" class="menu-item">数据分析与挖掘</RouterLink>
        <RouterLink to="/app/visualization" class="menu-item">可视化与反馈</RouterLink>
      </nav>
      <div class="status-card">
        <div class="status-title">集群健康度</div>
        <div class="status-value">98.2%</div>
        <div class="status-bar"><span /></div>
      </div>
    </aside>
    <div class="content-area">
      <header class="topbar">
        <div>
          <div class="title">高并发实时数据流处理与分析系统</div>
          <div class="subtitle">统一监控、多源接入、实时分析与告警</div>
        </div>
        <div class="user-panel">
          <div class="user-badge">运营中心</div>
          <button class="pill" @click="openProject">切换项目</button>
        </div>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>

  <Modal v-model="showProject" title="切换项目空间" @confirm="confirmProject">
    <div class="form-grid">
      <label>
        目标项目
        <select v-model="projectForm.name">
          <option>城市运行中心</option>
          <option>工业物联平台</option>
          <option>网络安全态势</option>
        </select>
      </label>
      <label>
        访问角色
        <select v-model="projectForm.role">
          <option>运营管理员</option>
          <option>分析师</option>
          <option>告警响应</option>
        </select>
      </label>
    </div>
  </Modal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from './Modal.vue';

const showProject = ref(false);
const projectForm = reactive({
  name: '城市运行中心',
  role: '运营管理员'
});

const openProject = () => {
  showProject.value = true;
};

const confirmProject = () => {
  showProject.value = false;
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.sidebar {
  width: 240px;
  padding: 28px 20px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.logo-title {
  font-weight: 700;
}

.logo-sub {
  font-size: 12px;
  color: #64748b;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  background: #f1f5f9;
}

.menu-item.router-link-active {
  background: #2563eb;
  color: #fff;
}

.status-card {
  margin-top: auto;
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.status-title {
  font-size: 13px;
  color: #64748b;
}

.status-value {
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0;
}

.status-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.status-bar span {
  display: block;
  height: 100%;
  width: 98.2%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 22px;
  font-weight: 700;
}

.subtitle {
  color: #64748b;
  font-size: 14px;
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-badge {
  padding: 6px 12px;
  background: #e0f2fe;
  border-radius: 999px;
  font-size: 13px;
  color: #0369a1;
}

.pill {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.content {
  padding: 24px 32px 40px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }

  .menu {
    display: flex;
    gap: 8px;
  }

  .status-card {
    display: none;
  }

  .content {
    padding: 20px;
  }
}
</style>
