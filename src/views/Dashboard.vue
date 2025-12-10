<template>
  <div class="shell">
    <aside class="sidebar card">
      <div class="logo">冷链运输平台</div>
      <nav class="menu">
        <RouterLink to="/dashboard/monitor" class="menu-item" active-class="active">冷链运输监控</RouterLink>
        <RouterLink to="/dashboard/dispatch" class="menu-item" active-class="active">调度管理</RouterLink>
        <RouterLink to="/dashboard/analysis" class="menu-item" active-class="active">数据分析</RouterLink>
        <RouterLink to="/dashboard/equipment" class="menu-item" active-class="active">设备管理</RouterLink>
        <RouterLink to="/dashboard/users" class="menu-item" active-class="active">用户与权限</RouterLink>
      </nav>
      <div class="card quick">
        <p class="section-title">快捷看板</p>
        <div class="summary-grid">
          <div class="summary-card">
            <h4>当日在线车辆</h4>
            <div class="flex-between">
              <strong>42</strong>
              <span class="status safe">正常</span>
            </div>
            <div class="chart-bar" style="margin-top: 6px;"><span style="width: 86%"></span></div>
          </div>
          <div class="summary-card">
            <h4>告警处理</h4>
            <div class="flex-between">
              <strong>18/20</strong>
              <span class="status warn">进行中</span>
            </div>
            <div class="chart-bar" style="margin-top: 6px;"><span style="width: 72%"></span></div>
          </div>
          <div class="summary-card">
            <h4>调度任务</h4>
            <div class="flex-between">
              <strong>27</strong>
              <span class="status safe">高效</span>
            </div>
            <div class="chart-bar" style="margin-top: 6px;"><span style="width: 64%"></span></div>
          </div>
        </div>
      </div>
    </aside>
    <main class="content">
      <header class="content-header card">
        <div>
          <p class="tag">主界面</p>
          <h2 style="margin: 6px 0 0;">加载功能模块到内容窗口</h2>
          <p style="color: var(--muted); margin: 4px 0 0;">通过侧边导航切换模块，不重复展示模块信息</p>
        </div>
        <div class="flex-center" style="gap: 10px;">
          <button class="btn light" @click="openInfo">消息提醒</button>
          <button class="btn secondary" @click="openProgress">同步数据</button>
        </div>
      </header>
      <div class="card" style="margin-bottom: 12px;">
        <div class="flex-between">
          <div class="flex-center">
            <div class="dot online"></div>
            <div>
              <div class="section-title" style="margin: 0;">实时保障</div>
              <p style="margin: 4px 0 0; color: var(--muted);">3 个模块正在运行，资源健康</p>
            </div>
          </div>
          <div class="chip-row">
            <span class="tag">亮色</span>
            <span class="tag">自适应布局</span>
            <span class="tag">安全</span>
          </div>
        </div>
      </div>
      <router-view />
    </main>
  </div>
  <ModalDialog :visible="modalInfo" title="提醒" helper="确认关闭提醒" @close="modalInfo=false" @confirm="modalInfo=false">
    <p>已为所有模块开启温控、定位、调度的实时提醒。</p>
  </ModalDialog>
  <ModalDialog :visible="modalProgress" title="同步数据中" helper="同步完成后自动刷新" @close="modalProgress=false" @confirm="modalProgress=false">
    <p style="margin-bottom: 8px;">正在同步模块状态、表格数据与图表配置。</p>
    <div class="progress"><span style="width: 78%"></span></div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const modalInfo = ref(false);
const modalProgress = ref(false);

const openInfo = () => (modalInfo.value = true);
const openProgress = () => (modalProgress.value = true);
</script>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar {
  position: sticky;
  top: 16px;
  height: fit-content;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--text);
  border: 1px solid var(--border);
  background: #f8fafc;
}

.menu-item.active {
  background: linear-gradient(90deg, #e0edff, #e6fff6);
  color: #1d4ed8;
  border-color: #cddffe;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--secondary);
  box-shadow: 0 0 0 6px rgba(90, 216, 166, 0.18);
}

.quick {
  margin-top: 14px;
}

@media (max-width: 1080px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
  }
}
</style>
