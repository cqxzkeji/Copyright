<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">
        <h2>旅挖钻</h2>
        <p>智能钻进指挥中心</p>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/sensor" class="menu-item" active-class="active">
          钻进感知采集
        </router-link>
        <router-link to="/dashboard/status" class="menu-item" active-class="active">
          状态识别分析
        </router-link>
        <router-link to="/dashboard/decision" class="menu-item" active-class="active">
          智能决策控制
        </router-link>
        <router-link to="/dashboard/warning" class="menu-item" active-class="active">
          风险预警防护
        </router-link>
        <router-link to="/dashboard/data" class="menu-item" active-class="active">
          监控展示与管理
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <span>在线设备 28</span>
        <span>数据通道 稳定</span>
      </div>
    </aside>
    <section class="main">
      <header class="topbar">
        <div class="status">
          <span class="dot"></span>
          实时联机中
        </div>
        <div class="actions">
          <button class="ghost" @click="openModal('report')">下载日报</button>
          <button class="primary" @click="openModal('sync')">同步参数</button>
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </section>
    <BaseModal
      :show="modal.type === 'report'"
      title="日报下载"
      :on-close="closeModal"
      :show-footer="false"
    >
      <p>日报已生成，包含今日钻进量、异常概览与参数统计。</p>
      <div class="download-actions">
        <button class="secondary" type="button" @click="closeModal">稍后下载</button>
        <button class="primary" type="button" @click="closeModal">立即下载</button>
      </div>
    </BaseModal>
    <BaseModal
      :show="modal.type === 'sync'"
      title="同步参数"
      :on-close="closeModal"
      :show-footer="false"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
      <p>参数同步中，已完成 {{ modal.progress }}%。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = reactive({
  type: '',
  progress: 64
});

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f8fafc;
}

.sidebar {
  background: #ffffff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 10px 0 30px rgba(15, 23, 42, 0.08);
}

.brand h2 {
  margin: 0;
  color: #1e40af;
}

.brand p {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #475569;
  background: #f1f5f9;
  font-size: 14px;
  transition: all 0.2s ease;
}

.menu-item.active {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.main {
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #ffffff;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0f172a;
}

.status .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
}

.actions .ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.actions .primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
}

.download-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.download-actions button {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
}

.download-actions .secondary {
  background: #e2e8f0;
  color: #1e293b;
}

.download-actions .primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  margin-bottom: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
}

.content {
  padding: 24px;
  flex: 1;
}

@media (max-width: 1100px) {
  .dashboard {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 920px) {
  .dashboard {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
