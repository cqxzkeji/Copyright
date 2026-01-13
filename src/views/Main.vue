<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">IR</div>
        <div>
          <h3>智能驱控系统</h3>
          <span>Precision Arm Control</span>
        </div>
      </div>
      <nav>
        <RouterLink to="/main/device">设备接入与驱控管理</RouterLink>
        <RouterLink to="/main/motion">精准运动控制与轨迹规划</RouterLink>
        <RouterLink to="/main/adaptive">智能感知与自适应控制</RouterLink>
        <RouterLink to="/main/monitoring">运行监控与安全防护</RouterLink>
        <RouterLink to="/main/analysis">数据分析与系统管理</RouterLink>
      </nav>
    </aside>
    <section class="content">
      <header class="topbar">
        <div>
          <h2>主控中心</h2>
          <p>统一调度设备模型、轨迹任务与安全策略。</p>
        </div>
        <div class="top-actions">
          <button class="secondary" type="button" @click="openModal('sync')">数据同步</button>
          <button class="primary" type="button" @click="openModal('settings')">系统设置</button>
        </div>
      </header>
      <div class="content-window">
        <router-view />
      </div>
    </section>
    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="closeModal">
      <template v-if="activeModal === 'sync'">
        <p>即将同步设备模型、日志与任务模板，请选择同步策略。</p>
        <div class="modal-grid">
          <label>
            同步范围
            <select v-model="settings.scope">
              <option value="all">全量同步</option>
              <option value="increment">增量同步</option>
              <option value="logs">仅日志</option>
            </select>
          </label>
          <label>
            时间窗口
            <select v-model="settings.window">
              <option value="24h">最近24小时</option>
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'settings'">
        <p>配置主控中心的默认策略与报警阈值。</p>
        <div class="modal-grid">
          <label>
            默认模式
            <select v-model="settings.mode">
              <option value="balanced">平衡模式</option>
              <option value="precision">高精度</option>
              <option value="efficiency">高效率</option>
            </select>
          </label>
          <label>
            报警级别
            <select v-model="settings.alert">
              <option value="critical">关键告警</option>
              <option value="warning">预警提示</option>
              <option value="all">全部提示</option>
            </select>
          </label>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const settings = reactive({
  scope: 'all',
  window: '24h',
  mode: 'balanced',
  alert: 'critical'
});

const modalTitle = computed(() => (activeModal.value === 'sync' ? '数据同步策略' : '系统设置'));

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e8edf5;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand h3 {
  font-size: 18px;
}

.brand span {
  font-size: 12px;
  color: #64748b;
}

nav {
  display: grid;
  gap: 10px;
}

nav a {
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #1f2a44;
  background: #f1f5f9;
}

nav a.router-link-active {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 0;
  flex-wrap: wrap;
  gap: 16px;
}

.topbar p {
  color: #64748b;
  margin-top: 4px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  color: #1e293b;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.content-window {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-grid {
  display: grid;
  gap: 12px;
}

@media (max-width: 960px) {
  .sidebar {
    width: 220px;
  }

  .content-window {
    padding: 20px;
  }
}
</style>
