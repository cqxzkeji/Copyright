<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">消防设备监控平台</div>
      <nav>
        <RouterLink class="nav-item" to="/dashboard/monitoring">设备状态监控</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/maintenance">维修与保养</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/inspection">巡检管理</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/analysis">数据分析</RouterLink>
        <RouterLink class="nav-item" to="/dashboard/security">安全与权限</RouterLink>
      </nav>
      <div class="quick-action card">
        <h4>快捷提醒</h4>
        <p>今日有 3 项巡检任务待确认。</p>
        <button class="btn secondary" @click="openNotice">查看详情</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">主界面</p>
          <h2>安全运行全局总览</h2>
        </div>
        <div class="top-actions">
          <button class="btn secondary" @click="toggleProgress">同步进度</button>
          <button class="btn" @click="toggleProfile">操作提示</button>
        </div>
      </header>
      <router-view />
    </main>
    <div v-if="showProgress" class="modal-backdrop" @click.self="toggleProgress">
      <div class="modal">
        <h3>系统自检进度</h3>
        <p class="muted">后台正在同步最新设备状态和巡检记录。</p>
        <div class="progress-bar" style="margin: 16px 0;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p>当前进度：{{ progress }}%</p>
        <div style="text-align: right; margin-top: 12px;">
          <button class="btn secondary" @click="toggleProgress">关闭</button>
        </div>
      </div>
    </div>
    <div v-if="showProfile" class="modal-backdrop" @click.self="toggleProfile">
      <div class="modal">
        <h3>操作提示</h3>
        <ul>
          <li>左侧导航切换功能模块，内容会加载到主窗口。</li>
          <li>每个功能模块均支持表单提交、弹窗提示和进度反馈。</li>
          <li>亮色主题、自适应布局在桌面与移动端均可流畅访问。</li>
        </ul>
        <div style="text-align: right; margin-top: 16px;">
          <button class="btn" @click="toggleProfile">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const showProgress = ref(false);
const showProfile = ref(false);
const progress = ref(18);

const toggleProgress = () => {
  showProgress.value = !showProgress.value;
  if (showProgress.value) animate();
};
const toggleProfile = () => (showProfile.value = !showProfile.value);

function animate() {
  progress.value = 18;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
    } else {
      progress.value += 14;
    }
  }, 300);
}

function openNotice() {
  showProfile.value = true;
}

onMounted(() => {
  progress.value = 42;
});
</script>

<style scoped>
.sidebar {
  background: #ffffff;
  padding: 20px;
  border-right: 1px solid var(--border);
  display: grid;
  gap: 16px;
  align-content: start;
}

.brand { font-weight: 800; font-size: 20px; }

.nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  color: var(--text);
  background: #f7f9fc;
  margin-bottom: 8px;
  font-weight: 600;
}

.nav-item.router-link-exact-active,
.nav-item.router-link-active {
  background: var(--primary-light);
  color: var(--primary);
}

.content { padding: 20px; }

.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 700; font-size: 12px; }

.quick-action h4 { margin: 0 0 6px; }

@media (max-width: 960px) {
  .layout { display: flex; flex-direction: column; }
  .sidebar { border-right: none; border-bottom: 1px solid var(--border); }
  .topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
  .top-actions { display: flex; gap: 10px; flex-wrap: wrap; }
}
</style>
