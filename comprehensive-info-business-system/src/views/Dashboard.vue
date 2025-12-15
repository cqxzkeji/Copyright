<template>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="logo">综合信息服务与业务管理</div>
      <nav class="nav-links">
        <RouterLink to="/dashboard/info" class="nav-item" active-class="nav-active">信息采集管理</RouterLink>
        <RouterLink to="/dashboard/process" class="nav-item" active-class="nav-active">流程管理与协同</RouterLink>
        <RouterLink to="/dashboard/operation" class="nav-item" active-class="nav-active">运行监控与分析</RouterLink>
        <RouterLink to="/dashboard/service" class="nav-item" active-class="nav-active">信息服务智能支撑</RouterLink>
        <RouterLink to="/dashboard/settings" class="nav-item" active-class="nav-active">配置与权限</RouterLink>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <p class="section-title" style="margin: 0;">主控驾驶舱</p>
          <p class="subtext">亮色自适应布局，所有模块独立运行</p>
        </div>
        <div class="toolbar">
          <button class="secondary-btn" @click="showAnnouncement = true">系统公告</button>
          <button class="ghost-btn" @click="showHelp = true">操作提示</button>
        </div>
      </header>
      <section class="content-area">
        <router-view />
      </section>
    </main>
  </div>
  <ModalDialog v-model="showAnnouncement" title="系统公告" description="向所有业务人员展示最新的运营提醒">
    <ul class="subtext" style="margin: 0 0 12px 0; line-height: 1.6;">
      <li>夜间批处理窗口调整为 00:30-02:00，请避开高峰提交任务。</li>
      <li>信息采集模板已更新，请下载新版模板以避免字段缺失。</li>
      <li>安全策略升级，需要对关键操作进行二次确认。</li>
    </ul>
    <div class="flex-between">
      <div class="tag">已推送至 132 名用户</div>
      <button class="primary-btn" @click="showAnnouncement = false">知道了</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showHelp" title="操作提示" description="提供快捷键与常用路径">
    <div class="grid grid-2">
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">快捷键</p>
        <p class="subtext">Alt+S 保存草稿 · Alt+F 快速搜索 · Alt+N 新建任务</p>
      </div>
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">常用入口</p>
        <p class="subtext">数据看板、任务广场、接口调用统计、权限追踪</p>
      </div>
    </div>
    <div style="margin-top: 12px; text-align: right;">
      <button class="primary-btn" @click="showHelp = false">关闭提示</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const showAnnouncement = ref(false);
const showHelp = ref(false);
</script>

<style scoped>
.dashboard-shell {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--surface);
}

.sidebar {
  background: linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%);
  border-right: 1px solid var(--border);
  padding: 22px 18px;
}

.logo {
  font-weight: 900;
  font-size: 18px;
  line-height: 1.4;
  margin-bottom: 18px;
}

.nav-links {
  display: grid;
  gap: 10px;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 700;
  color: #1f2937;
  border: 1px solid transparent;
  background: #fff;
  box-shadow: var(--shadow);
}

.nav-active {
  border-color: #bfdbfe;
  background: linear-gradient(120deg, #e0f2fe, #e0fbff);
  color: #1d4ed8;
}

.main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  padding: 18px 20px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

@media (max-width: 960px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
</style>
