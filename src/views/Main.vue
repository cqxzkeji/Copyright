<template>
  <div class="shell">
    <aside>
      <div class="brand">数字遗产中枢</div>
      <nav>
        <router-link to="/main/scene-display">场景展示</router-link>
        <router-link to="/main/resource-modeling">资源采集</router-link>
        <router-link to="/main/interactive-learning">交互学习</router-link>
        <router-link to="/main/analytics">数据分析</router-link>
        <router-link to="/main/management">后台管理</router-link>
      </nav>
      <div class="quick-actions">
        <button @click="openGuide">系统提示</button>
        <button @click="openChart">今日运行概览</button>
      </div>
    </aside>
    <main>
      <header>
        <div>
          <h2>VR 非遗文化场景再现与展示系统</h2>
          <p>统一调度各个功能模块，实时掌握业务状态</p>
        </div>
        <div class="status">
          <span>在线展厅：8</span>
          <span>活跃用户：126</span>
        </div>
      </header>
      <section class="dashboard">
        <div class="card">
          <h3>沉浸式体验热度</h3>
          <div class="chart">
            <div v-for="(value, index) in heatmap" :key="index" class="bar" :style="{ height: value + 'px' }">
              <small>{{ weekdays[index] }}</small>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>数据同步</h3>
          <p>资源同步至云端存储中</p>
          <div class="progress">
            <div class="progress-inner" :style="{ width: syncProgress + '%' }"></div>
          </div>
          <button @click="showProgress = true">查看同步详情</button>
        </div>
      </section>
      <section class="content">
        <router-view />
      </section>
    </main>
    <ModalDialog v-model="guideModal" title="系统操作指引">
      <p>各功能模块会在主界面内容窗口中动态切换，操作按钮均包含状态反馈。</p>
      <p>建议按照“资源采集→建模→展示与交互→数据分析→后台管理”的顺序组织工作。</p>
    </ModalDialog>
    <ModalDialog v-model="chartModal" title="今日运行概览">
      <ul>
        <li>累计观看次数：1,380</li>
        <li>新增素材：24 条</li>
        <li>AI 引导课程完成率：86%</li>
      </ul>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="云端同步进度">
      <p>正在同步最新采集的 3D 建模数据，预计 2 分钟完成。</p>
      <div class="progress large">
        <div class="progress-inner" :style="{ width: syncProgress + '%' }"></div>
      </div>
      <template #footer>
        <button class="primary" @click="showProgress = false">好的</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const guideModal = ref(false);
const chartModal = ref(false);
const showProgress = ref(false);
const syncProgress = ref(62);
const heatmap = ref([120, 160, 130, 180, 200, 150, 90]);
const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

const openGuide = () => {
  guideModal.value = true;
};

const openChart = () => {
  chartModal.value = true;
};

onMounted(() => {
  const timer = setInterval(() => {
    syncProgress.value = Math.min(100, syncProgress.value + Math.random() * 5);
    heatmap.value = heatmap.value.map((v) => (Math.random() * 100 + 80).toFixed(0));
  }, 4000);

  window.addEventListener('beforeunload', () => clearInterval(timer));
});
</script>

<style scoped>
.shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}

aside {
  background: #0f172a;
  color: #f1f5f9;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand {
  font-size: 1.2rem;
  font-weight: 600;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

nav a {
  color: #cbd5f5;
  text-decoration: none;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
}

nav a.router-link-active {
  background: rgba(248, 250, 252, 0.12);
  color: white;
}

.quick-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.quick-actions button {
  border: none;
  padding: 0.7rem;
  border-radius: 12px;
  background: rgba(96, 165, 250, 0.2);
  color: white;
}

main {
  padding: 1.5rem 2rem 3rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  display: flex;
  gap: 1.5rem;
  color: #475569;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(148, 163, 184, 0.25);
}

.chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.4rem;
  align-items: end;
  height: 180px;
  margin-top: 1rem;
}

.bar {
  background: linear-gradient(180deg, #38bdf8, #6366f1);
  border-radius: 12px 12px 4px 4px;
  position: relative;
}

.bar small {
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #94a3b8;
}

.progress {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  margin: 1rem 0;
  overflow: hidden;
}

.progress.large {
  height: 18px;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #6366f1);
}

button.primary {
  border: none;
  padding: 0.6rem 1.3rem;
  background: #4f46e5;
  color: white;
  border-radius: 999px;
}

.content {
  margin-top: 2rem;
}
</style>
