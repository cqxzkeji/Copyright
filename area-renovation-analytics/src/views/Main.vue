<template>
  <div class="app-shell">
    <aside class="sidebar">
      <h1>整治项目平台</h1>
      <div class="nav-menu">
        <router-link
          v-for="item in menus"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          <span>{{ item.label }}</span>
          <span class="badge">{{ item.badge }}</span>
        </router-link>
      </div>
    </aside>
    <main class="content">
      <div class="top-bar">
        <div>
          <div class="label">片区整治</div>
          <div class="breadcrumb">{{ breadcrumb }}</div>
        </div>
        <div class="flex" style="gap:8px;">
          <button class="ghost-btn" @click="showNotice = true">通知提醒</button>
          <button class="primary-btn" @click="showProfile = true">个人中心</button>
        </div>
      </div>
      <div class="main-panel">
        <router-view />
      </div>
    </main>
  </div>
  <ModalDialog v-model="showNotice" title="最新提醒" sub-title="任务播报">
    <p>本周需完成4个节点验收，2个新增资金拨付申请待审核。</p>
  </ModalDialog>
  <ModalDialog v-model="showProfile" title="个人中心" sub-title="账户信息">
    <div class="label">当前用户：项目管理员</div>
    <p>负责片区整治项目的进度统筹与成果验收。</p>
  </ModalDialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const showNotice = ref(false);
const showProfile = ref(false);
const route = useRoute();

const menus = [
  { label: '项目基础信息与档案管理', path: '/main/project-archive', badge: '基础' },
  { label: '多源数据采集与接入管理', path: '/main/data-collection', badge: '采集' },
  { label: '过程监测与进度分析', path: '/main/process-monitor', badge: '监测' },
  { label: '评估分析与综合研判', path: '/main/evaluation', badge: '评估' },
  { label: '统计展示与决策支持', path: '/main/dashboard', badge: '看板' }
];

const breadcrumb = computed(() => {
  const current = menus.find((item) => item.path === route.path);
  return current ? `当前位置：${current.label}` : '请选择功能模块';
});
</script>
