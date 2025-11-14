<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">危废管理 VR</div>
      <nav>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.desc }}</small>
        </router-link>
      </nav>
      <button class="secondary-btn" @click="showAlert('系统版本 v2.4，包含 VR 场景演练、流转闭环监控')">
        查看更新
      </button>
    </aside>
    <main class="content">
      <header class="content-header">
        <div>
          <h2>全流程数字监管</h2>
          <p>左侧导航可切换功能模块，内容区域实时载入</p>
        </div>
        <button class="primary-btn" @click="showProgress">一键巡检</button>
      </header>
      <section class="content-body">
        <router-view />
      </section>
    </main>
    <BaseModal v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
      <p>{{ modal.message }}</p>
      <div v-if="modal.progress !== null" class="progress-container" style="margin-top: 16px">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const navItems = [
  { label: '资源采集与建模', path: '/main/resource', desc: '场地建模' },
  { label: '危废运输与流转', path: '/main/transport', desc: '车辆调度' },
  { label: '交互式学习与培训', path: '/main/training', desc: '安全演练' },
  { label: '数据统计与分析', path: '/main/analytics', desc: '趋势预测' },
  { label: '展示管理与后台', path: '/main/dashboard', desc: '多端同步' }
];

const modal = reactive({ visible: false, title: '', message: '', progress: null });

const showAlert = (message) => {
  modal.visible = true;
  modal.title = '提示';
  modal.message = message;
  modal.progress = null;
};

const showProgress = () => {
  modal.visible = true;
  modal.title = '巡检执行中';
  modal.message = '正在调度无人机扫描堆场…';
  modal.progress = 72;
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

.sidebar {
  width: 280px;
  background: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
}

.brand {
  font-size: 22px;
  font-weight: 700;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.nav-item {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 14px;
  color: #cbd5f5;
  background: rgba(255, 255, 255, 0.04);
}

.nav-item small {
  font-size: 12px;
  color: #9da7c9;
}

.active {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: white;
}

.content {
  flex: 1;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
}

.content-body {
  flex: 1;
}
</style>
