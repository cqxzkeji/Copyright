<template>
  <div class="app-shell" :class="{ 'is-login': isLoginRoute }">
    <router-view v-if="isLoginRoute" />
    <div v-else class="layout">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">🏗️</div>
          <div>
            <p class="brand-title">装修验收</p>
            <small>Basement & Podium</small>
          </div>
        </div>
        <nav class="nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: route.path === item.path }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
        <div class="user-card">
          <p class="user-name">{{ displayName }}</p>
          <p class="user-role">施工监理</p>
          <button class="secondary" @click="logout">退出登录</button>
        </div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div>
            <p class="page-title">{{ activeNav?.label || '工作台' }}</p>
            <p class="page-sub">{{ activeNav?.desc }}</p>
          </div>
          <div class="top-actions">
            <button class="pill" @click="showReminder">今日提醒</button>
            <button class="pill" @click="openProgress">同步进度</button>
          </div>
        </header>
        <section class="content-wrapper">
          <router-view />
        </section>
      </main>
    </div>
    <ModalDialog
      v-model="showModal"
      title="系统提醒"
      :progress="progress"
      :message="modalMessage"
    />
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import ModalDialog from './components/ModalDialog.vue';

const route = useRoute();
const router = useRouter();
const auth = inject('auth');

const navItems = [
  {
    path: '/project-management',
    label: '装修项目管理',
    desc: '跟踪地下室及裙楼公区装修任务',
    icon: '📋',
  },
  {
    path: '/acceptance-planning',
    label: '验收计划与任务分配',
    desc: '制定验收计划并指派责任人',
    icon: '🗓️',
  },
  {
    path: '/inspection-feedback',
    label: '验收检查与反馈',
    desc: '检查现场并记录整改反馈',
    icon: '🔍',
  },
  {
    path: '/data-analysis',
    label: '数据统计与分析',
    desc: '掌握进度、问题、风险趋势',
    icon: '📊',
  },
  {
    path: '/document-management',
    label: '文档与报告管理',
    desc: '沉淀报告模板与验收资料',
    icon: '📂',
  },
];

const isLoginRoute = computed(() => route.path === '/login');
const activeNav = computed(() => navItems.find((item) => item.path === route.path));
const displayName = computed(() => auth?.user || '访客');

const showModal = ref(false);
const modalMessage = ref('');
const progress = ref(null);

const logout = () => {
  auth.loggedIn = false;
  auth.user = '';
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('user');
  router.push('/login');
};

const triggerModal = (message, withProgress = false) => {
  modalMessage.value = message;
  showModal.value = true;
  if (withProgress) {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 20;
      if (progress.value >= 100) {
        clearInterval(timer);
        setTimeout(() => (showModal.value = false), 500);
      }
    }, 250);
  } else {
    progress.value = null;
  }
};

const showReminder = () => {
  triggerModal('今日需复核地下室防水和电缆沟验收记录。');
};

const openProgress = () => {
  triggerModal('正在同步最新任务进展...', true);
};
</script>
