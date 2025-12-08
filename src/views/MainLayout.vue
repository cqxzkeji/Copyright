<template>
  <div class="layout">
    <nav class="sidebar">
      <div
        v-for="link in links"
        :key="link.path"
        class="nav-item"
        :class="{ active: activePath === link.path }"
        @click="go(link.path)"
      >
        <span>{{ link.label }}</span>
        <span class="badge info">进入</span>
      </div>
      <button class="button secondary" @click="showTips = true">操作说明</button>
    </nav>
    <main>
      <router-view />
    </main>
    <ModalDialog :show="showTips" title="导航说明" @close="showTips=false">
      <p>左侧导航加载五个功能模块，点击后内容区域切换，不再重复显示模块标题。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const showTips = ref(false);
const links = [
  { path: '/app/course', label: '课程管理' },
  { path: '/app/planning', label: '空间规划展示' },
  { path: '/app/data', label: '数据采集与分析' },
  { path: '/app/experience', label: '用户体验与反馈' },
  { path: '/app/admin', label: '后台管理' }
];

const activePath = computed(() => route.path);
const go = (path) => router.push(path);
</script>
