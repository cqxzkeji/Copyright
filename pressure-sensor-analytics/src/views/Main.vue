<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">PSA</div>
        <div>
          <h2>压力智能平台</h2>
          <p>实时监测中心</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/main/device" class="menu-item">设备接入</RouterLink>
        <RouterLink to="/main/acquisition" class="menu-item">数据采集</RouterLink>
        <RouterLink to="/main/monitoring" class="menu-item">实时监控</RouterLink>
        <RouterLink to="/main/analysis" class="menu-item">智能分析</RouterLink>
        <RouterLink to="/main/report" class="menu-item">报表中心</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button type="button" @click="openInfoModal">系统公告</button>
        <button type="button" @click="openFormModal">切换班组</button>
      </div>
    </aside>

    <section class="content">
      <header class="topbar">
        <div>
          <h3>运行监控工作台</h3>
          <p>最新采集时间：{{ lastSync }}</p>
        </div>
        <div class="topbar-actions">
          <button type="button" @click="openProgressModal">同步状态</button>
          <button type="button" @click="openFormModal">快速配置</button>
        </div>
      </header>
      <main class="page-body">
        <RouterView />
      </main>
    </section>

    <div v-if="modal.visible" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button type="button" class="icon" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'form'" class="modal-form" @submit.prevent="submitConfig">
            <label>
              班组/区域
              <input v-model="configForm.team" type="text" required />
            </label>
            <label>
              关注设备
              <input v-model="configForm.device" type="text" required />
            </label>
            <label>
              备注说明
              <textarea v-model="configForm.note" rows="3" required></textarea>
            </label>
            <button type="submit" class="primary">保存设置</button>
          </form>
          <div v-else-if="modal.type === 'progress'">
            <p>{{ modal.message }}</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="progress-tip">正在同步在线状态与报警策略</p>
          </div>
          <div v-else class="info-body">
            <p>{{ modal.message }}</p>
            <ul>
              <li>本周新增设备 6 台，在线率 98.6%</li>
              <li>已生成 4 份趋势分析报告</li>
              <li>报警闭环处理完成率 96%</li>
            </ul>
            <button type="button" class="primary" @click="closeModal">我已知晓</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";

const lastSync = ref("2024-06-15 09:30:12");
const modal = reactive({
  visible: false,
  type: "info",
  title: "",
  message: ""
});
const progress = ref(0);
const timer = ref(null);

const configForm = reactive({
  team: "一号班组",
  device: "高压管线-01",
  note: "重点关注夜班波动"
});

const openModal = (type, title, message = "") => {
  modal.visible = true;
  modal.type = type;
  modal.title = title;
  modal.message = message;
};

const closeModal = () => {
  modal.visible = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const openInfoModal = () => {
  openModal("info", "系统公告", "今日已完成设备巡检与校准任务。请关注新报警策略更新。");
};

const openFormModal = () => {
  openModal("form", "快速配置");
};

const openProgressModal = () => {
  openModal("progress", "同步中", "正在刷新设备在线状态与数据缓存");
  progress.value = 0;
  timer.value = setInterval(() => {
    if (progress.value >= 100) {
      lastSync.value = "2024-06-15 09:35:22";
      closeModal();
    } else {
      progress.value += 10;
    }
  }, 140);
};

const submitConfig = () => {
  openModal("info", "配置已保存", `已切换至 ${configForm.team}，重点监控设备：${configForm.device}`);
};

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.main-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #1d4ed8;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 10px;
  color: #475569;
  font-weight: 600;
  background: #f8fafc;
}

.menu-item.router-link-active {
  background: #e0e7ff;
  color: #1d4ed8;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 10px;
}

.sidebar-footer button {
  border: 1px solid #cbd5f5;
  background: #f1f5ff;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.topbar h3 {
  margin: 0 0 4px;
}

.topbar p {
  margin: 0;
  color: #64748b;
}

.topbar-actions {
  display: flex;
  gap: 10px;
}

.topbar-actions button {
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

.page-body {
  padding: 24px 28px 32px;
  flex: 1;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form input,
.modal-form textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.bar {
  background: linear-gradient(90deg, #22c55e, #38bdf8);
  height: 100%;
  transition: width 0.2s ease;
}

.progress-tip {
  color: #64748b;
  font-size: 13px;
  margin-top: 10px;
}

.info-body ul {
  padding-left: 18px;
}

@media (max-width: 960px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
  }
}
</style>
