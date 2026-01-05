<template>
  <div class="main-screen">
    <aside class="sidebar card">
      <div class="brand">
        <div class="logo">SM</div>
        <div>
          <div class="title">多传感器检测</div>
          <small>实时 · 报告 · 配置</small>
        </div>
      </div>
      <nav>
        <button v-for="item in menu" :key="item.path" class="menu-btn" :class="{ active: isActive(item.path) }" @click="go(item.path)">
          <span>{{ item.label }}</span>
          <small>{{ item.desc }}</small>
        </button>
      </nav>
      <div class="sidebar-footer">
        <button class="btn secondary" @click="openGlobalHint = true">系统提示</button>
        <button class="btn ghost" @click="openSupport = true">技术支持</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar card">
        <div>
          <div class="section-title">综合监控面板</div>
          <p class="muted">选择左侧功能模块，内容将在右侧窗口区域显示。</p>
        </div>
        <div class="toolbar">
          <button class="btn secondary" @click="openNotice = true">运行公告</button>
          <button class="btn" @click="openProgress()">资源巡检</button>
        </div>
      </header>
      <section class="content-panel card">
        <router-view />
      </section>
    </main>
    <ModalDialog :open="openGlobalHint" @close="openGlobalHint = false" @confirm="openGlobalHint = false">
      <template #title><h3 style="margin:0;">系统提示</h3></template>
      <p>当前系统已启用多传感器安全策略，操作时请保持传感器连接稳定。</p>
    </ModalDialog>
    <ModalDialog :open="openSupport" @close="openSupport = false" @confirm="openSupport = false">
      <template #title><h3 style="margin:0;">技术支持</h3></template>
      <div class="input-row">
        <label>问题描述<textarea rows="3" placeholder="请描述遇到的问题"></textarea></label>
        <label>联系方式<input placeholder="邮箱或手机号" /></label>
      </div>
    </ModalDialog>
    <ProgressModal :open="openProgressModal" :progress="progress" title="资源巡检" subtitle="巡检进度" @close="openProgressModal = false" @confirm="openProgressModal = false" />
    <ModalDialog :open="openNotice" @close="openNotice = false" @confirm="openNotice = false">
      <template #title><h3 style="margin:0;">运行公告</h3></template>
      <ul style="margin:0 0 10px 16px;color:var(--muted);">
        <li>巡检任务默认每日 02:00 自动执行。</li>
        <li>驱动升级后请重新加载对应传感器。</li>
        <li>报告生成过程请勿中断电源。</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const router = useRouter();
const route = useRoute();
const menu = [
  { label: '传感器接入与管理', desc: '扫描/配置', path: '/main/sensors' },
  { label: '实时数据采集与显示', desc: '视频/点云', path: '/main/monitor' },
  { label: '驱动管理与自动加载', desc: '扫描/导入', path: '/main/drivers' },
  { label: '数据记录与报告生成', desc: '截图/报告', path: '/main/records' },
  { label: '数据分析与系统配置', desc: '通信/参数', path: '/main/config' }
];

const openSupport = ref(false);
const openGlobalHint = ref(false);
const openNotice = ref(false);
const openProgressModal = ref(false);
const progress = ref(5);
let progressTimer;

const go = (path) => router.push(path);
const isActive = (path) => computed(() => route.path === path).value;

const openProgress = () => {
  progress.value = 5;
  openProgressModal.value = true;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
    if (progress.value === 100) {
      clearInterval(progressTimer);
    }
  }, 500);
};

onBeforeUnmount(() => clearInterval(progressTimer));
</script>

<style scoped>
.main-screen {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar {
  position: sticky;
  top: 16px;
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.title { font-size: 18px; font-weight: 700; }
.small { color: var(--muted); }

.menu-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid var(--border);
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.menu-btn small { color: var(--muted); display: block; }
.menu-btn.active,
.menu-btn:hover {
  border-color: var(--primary);
  background: var(--primary-weak);
  color: var(--primary);
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 8px;
}

.content {
  display: grid;
  gap: 12px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.muted { color: var(--muted); margin: 4px 0 0; }

.content-panel {
  min-height: calc(100vh - 150px);
}

@media (max-width: 900px) {
  .main-screen {
    grid-template-columns: 1fr;
  }
  .sidebar {
    height: auto;
    position: relative;
  }
  .topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>
