<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">区域PM2.5平台</div>
        <span class="sub">综合业务导航</span>
      </div>
      <nav class="menu">
        <RouterLink to="/main/data" class="menu-item">多源数据采集与接入</RouterLink>
        <RouterLink to="/main/emission" class="menu-item">排放与边界条件管理</RouterLink>
        <RouterLink to="/main/simulation" class="menu-item">污染过程模拟与同化校正</RouterLink>
        <RouterLink to="/main/forecast" class="menu-item">预报发布与预警联动</RouterLink>
        <RouterLink to="/main/evaluation" class="menu-item">评估分析与可视化决策</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="ghost" type="button" @click="openModal('全局设置')">全局设置</button>
        <button class="primary" type="button" @click="openModal('消息中心')">消息中心</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>{{ title }}</h2>
          <span>数据更新时间：2024-08-15 08:00</span>
        </div>
        <div class="top-actions">
          <button class="ghost" type="button" @click="openModal('运行日志')">运行日志</button>
          <button class="primary" type="button" @click="openModal('快速发布')">快速发布</button>
        </div>
      </header>
      <section class="content-body">
        <router-view />
      </section>
    </main>
  </div>

  <ModalShell
    v-if="activeModal"
    :title="activeModal"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="modal-section">
      <h4>业务配置表单</h4>
      <div class="modal-grid">
        <label>
          业务主题
          <input placeholder="请输入主题" />
        </label>
        <label>
          优先级
          <select>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label>
          负责人
          <input placeholder="请输入负责人" />
        </label>
        <label>
          通知方式
          <select>
            <option>站内信</option>
            <option>短信</option>
            <option>邮件</option>
          </select>
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>执行进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前处理进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>设置将同步至所有模块并记录版本。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import ModalShell from "../components/ModalShell.vue";

const route = useRoute();
const activeModal = ref("");
const progress = ref(68);

const title = computed(() => route.meta.title || "功能模块");

const openModal = (titleValue) => {
  activeModal.value = titleValue;
  progress.value = 40;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 160);
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  gap: 20px;
}

.sidebar-header .brand {
  font-size: 18px;
  font-weight: 700;
  color: #1e3a8a;
}

.sidebar-header .sub {
  font-size: 12px;
  color: #64748b;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid transparent;
  color: #1f2937;
}

.menu-item.router-link-active {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 10px;
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
  padding: 20px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.topbar h2 {
  margin: 0 0 4px;
  font-size: 22px;
}

.topbar span {
  color: #64748b;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.content-body {
  padding: 24px 28px 32px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
}

.modal-section {
  margin-bottom: 20px;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
}

.info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #475569;
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
  }

  .menu {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .sidebar-footer {
    width: 100%;
    display: flex;
  }
}
</style>
