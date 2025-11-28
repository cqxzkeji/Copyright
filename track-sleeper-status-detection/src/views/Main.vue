<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">轨枕状态感知</div>
      <nav class="nav">
        <button
          v-for="item in menu"
          :key="item.path"
          :class="['nav-btn', { active: current === item.path }]"
          @click="go(item.path)"
        >
          <span>{{ item.label }}</span>
        </button>
      </nav>
      <div class="foot">
        <div class="status">今日巡检通过率 96%</div>
        <button class="logout" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <header class="toolbar">
        <div>
          <p class="eyebrow">综合可视化工作台</p>
          <h2>轨道轨枕状态感知与图像检测</h2>
        </div>
        <div class="tag-row">
          <span class="pill">亮色主题</span>
          <span class="pill">自适应布局</span>
          <span class="pill">模块化装载</span>
        </div>
      </header>
      <section class="module-host card">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const menu = [
  { label: '数据采集与传感器管理', path: '/main/data-collection' },
  { label: '图像采集与处理', path: '/main/image-processing' },
  { label: '状态检测与分析', path: '/main/state-detection' },
  { label: '数据分析与预警', path: '/main/analytics' },
  { label: '报告生成与可视化', path: '/main/report' },
];

const current = computed(() => route.path);

const go = (path) => {
  router.push(path);
};

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  padding: 20px;
  background: #f3f7ff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  font-weight: 900;
  font-size: 20px;
  color: #2563eb;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav-btn {
  text-align: left;
  background: #fff;
  color: #1f2937;
  box-shadow: none;
  border: 1px solid #e5e7eb;
}

.nav-btn.active {
  border-color: #4f9bff;
  box-shadow: 0 8px 20px rgba(79, 155, 255, 0.18);
}

.foot {
  margin-top: auto;
  display: grid;
  gap: 10px;
}

.status {
  background: #eef5ff;
  padding: 10px;
  border-radius: 12px;
  color: #1d4ed8;
  font-weight: 700;
}

.logout {
  background: linear-gradient(90deg, #fb7185, #ef4444);
}

.content {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.eyebrow {
  color: #6b7280;
  margin: 0 0 4px 0;
}

.module-host {
  min-height: 70vh;
}
</style>
