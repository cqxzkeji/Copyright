<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="top">
        <div class="logo">ARM</div>
        <div>
          <p class="muted">高精度智能驱动</p>
          <h2>机械臂管理</h2>
        </div>
      </div>
      <nav class="menu">
        <button
          v-for="item in menu"
          :key="item.to"
          class="nav-btn"
          :class="{ active: route.path === item.to }"
          @click="go(item.to)"
        >
          <span>{{ item.label }}</span>
        </button>
      </nav>
      <div class="status card">
        <p class="muted">系统心跳</p>
        <div class="chip">
          <span class="dot" /> 正常 · 24.7Hz
        </div>
        <p class="muted small">驱动器电源、总线和云端均在线。</p>
      </div>
    </aside>
    <main class="content">
      <header class="header card">
        <div>
          <p class="muted">工作台</p>
          <h1>智能驱动监控中控屏</h1>
        </div>
        <div class="actions">
          <button class="btn secondary" @click="showTip('提示', '当前连接稳定，网络延时 8ms。')">
            状态提示
          </button>
          <button class="btn" @click="showProgress = true">安全巡检</button>
        </div>
      </header>
      <section class="card">
        <router-view />
      </section>
    </main>
    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal-panel">
        <h3>安全巡检进行中</h3>
        <p>正在巡检制动器、编码器、末端工具互锁状态。</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted small">预计 {{ 100 - progress }}% 即可完成。</p>
        <div class="footer">
          <button class="btn secondary" @click="showProgress = false">关闭</button>
        </div>
      </div>
    </div>
    <div v-if="tip" class="modal-backdrop" @click.self="tip = null">
      <div class="modal-panel">
        <h3>{{ tip.title }}</h3>
        <p>{{ tip.desc }}</p>
        <div class="footer">
          <button class="btn secondary" @click="tip = null">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const tip = ref(null);
const showProgress = ref(false);
const progress = ref(18);
const timer = ref(null);

const menu = reactive([
  { label: '实时总览', to: '/main/overview' },
  { label: '机械臂控制', to: '/main/arm-control' },
  { label: '任务管理', to: '/main/tasks' },
  { label: '数据监控', to: '/main/monitoring' },
  { label: '性能分析', to: '/main/analysis' },
  { label: '系统设置', to: '/main/settings' },
]);

const go = (to) => router.push(to);

const showTip = (title, desc) => {
  tip.value = { title, desc };
};

const simulateProgress = () => {
  if (!showProgress.value) return;
  progress.value = Math.min(100, progress.value + Math.round(Math.random() * 12));
  if (progress.value < 100) {
    timer.value = setTimeout(simulateProgress, 520);
  }
};

onMounted(() => {
  simulateProgress();
});

onUnmounted(() => {
  clearTimeout(timer.value);
});

watch(
  () => showProgress.value,
  (open) => {
    if (open) {
      progress.value = 18;
      simulateProgress();
    } else {
      clearTimeout(timer.value);
    }
  }
);
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 18px;
  padding: 18px;
}

.sidebar {
  display: grid;
  gap: 16px;
  align-self: start;
  position: sticky;
  top: 14px;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(140deg, #22c55e, #4f46e5);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.24);
}

.top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu {
  display: grid;
  gap: 8px;
}

.nav-btn {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: left;
  font-weight: 600;
  color: #0f172a;
  transition: all 120ms ease;
}

.nav-btn.active,
.nav-btn:hover {
  border-color: #cbd5e1;
  background: linear-gradient(120deg, #eef2ff, #ecfeff);
}

.content {
  display: grid;
  gap: 16px;
  align-content: start;
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.muted {
  color: #64748b;
}

.small {
  font-size: 12px;
}

.status {
  display: grid;
  gap: 6px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.progress {
  width: 100%;
  background: #e2e8f0;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.progress .bar {
  height: 100%;
  background: linear-gradient(120deg, #4f46e5, #22c55e);
  transition: width 0.3s ease;
}

.dot {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 999px;
}

@media (max-width: 1080px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: relative;
    top: 0;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
