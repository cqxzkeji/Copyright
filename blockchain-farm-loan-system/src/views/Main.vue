<template>
  <div class="console">
    <aside class="sidebar">
      <div class="user-info">
        <p class="role">监管中心</p>
        <h2>欢迎回来</h2>
      </div>
      <nav class="menu">
        <button v-for="item in menus" :key="item.path" @click="goto(item.path)">
          {{ item.label }}
        </button>
      </nav>
      <button class="logout" @click="logout">退出登录</button>
    </aside>

    <section class="content">
      <header class="content-header">
        <div>
          <h1>区块链农地抵押贷款驾驶舱</h1>
          <p>实时追踪农地资产、贷款合规与链上数据</p>
        </div>
        <button @click="openSync">链上态势刷新</button>
      </header>

      <div class="overview">
        <div class="card">
          <p>存量农地</p>
          <h2>{{ store.farms.length }} 块</h2>
        </div>
        <div class="card">
          <p>贷款申请</p>
          <h2>{{ store.applications.length }} 笔</h2>
        </div>
        <div class="card">
          <p>链上事件</p>
          <h2>{{ store.blockchainEvents.length }} 条</h2>
        </div>
      </div>

      <div class="chart-panel">
        <div class="chart" aria-label="抵押率图表">
          <div
            v-for="segment in chart"
            :key="segment.label"
            class="bar"
            :style="{ height: segment.value + '%', background: segment.color }"
          >
            <span>{{ segment.label }}</span>
            <strong>{{ segment.value }}%</strong>
          </div>
        </div>
        <div class="chart-info">
          <h3>抵押贷款状态监控</h3>
          <p>
            数据来自联盟链节点，显示不同阶段的贷款占比。全部模块均以 Flex 布局呈现，可根据视口自适应。
          </p>
        </div>
      </div>

      <div class="module-area">
        <router-view />
      </div>
    </section>

    <div v-if="modal.visible" class="modal-mask" @click="modal.visible = false">
      <div class="modal" @click.stop>
        <h3>链上同步进度</h3>
        <p>{{ modal.message }}</p>
        <div class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <button @click="modal.visible = false">关闭提示</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = inject('store');

const menus = [
  { label: '农地信息管理', path: '/main/farms' },
  { label: '贷款申请管理', path: '/main/application' },
  { label: '贷款合同管理', path: '/main/contracts' },
  { label: '区块链数据', path: '/main/blockchain' },
  { label: '财务与风险', path: '/main/finance' }
];

const chart = computed(() => [
  { label: '链上验证', value: 45, color: '#2ec4b6' },
  { label: '放款审批', value: 35, color: '#ff9f1c' },
  { label: '履约监控', value: 20, color: '#6c63ff' }
]);

const modal = reactive({ visible: false, message: '节点握手中', progress: 12 });
let timer;

function goto(path) {
  router.push(path);
}

function logout() {
  router.push('/login');
}

function openSync() {
  modal.visible = true;
  modal.message = '正在请求联盟链数据';
  modal.progress = 20;
  clearInterval(timer);
  timer = setInterval(() => {
    if (modal.progress >= 100) {
      modal.message = '同步完成，数据已更新';
      clearInterval(timer);
      return;
    }
    modal.progress += 20;
    modal.message = `同步进度 ${modal.progress}%`;
  }, 500);
}
</script>

<style scoped>
.console {
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
}

.sidebar {
  flex: 1 1 260px;
  max-width: 320px;
  background: #0d1b2a;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.role {
  margin: 0;
  font-size: 0.9rem;
  color: #8ecae6;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.menu button,
.logout,
.content-header button {
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.menu button {
  background: rgba(255, 255, 255, 0.1);
  color: #f1faee;
}

.menu button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.logout {
  margin-top: auto;
  background: #ef476f;
  color: #fff;
}

.content {
  flex: 3 1 640px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.content-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.content-header button {
  background: linear-gradient(120deg, #219ebc, #023047);
  color: #fff;
}

.overview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 16px;
  padding: 1rem 1.2rem;
  box-shadow: 0 15px 35px rgba(13, 38, 76, 0.08);
}

.chart-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 20px 45px rgba(13, 38, 76, 0.07);
}

.chart {
  flex: 2 1 320px;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  min-height: 180px;
}

.bar {
  flex: 1;
  border-radius: 12px 12px 4px 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  padding: 0.8rem;
  gap: 0.5rem;
}

.chart-info {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.module-area {
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(13, 38, 76, 0.07);
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 16px;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress {
  height: 12px;
  border-radius: 999px;
  background: #edf2fb;
}

.progress .bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #06d6a0, #118ab2);
  transition: width 0.3s ease;
}
</style>
