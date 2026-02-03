<template>
  <div v-if="isAuthLayout">
    <router-view />
  </div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">智能语音识别与实时翻译</div>
      <nav class="nav-links">
        <router-link to="/dashboard">数据总览</router-link>
        <router-link to="/speech-recognition">语音识别</router-link>
        <router-link to="/translation">实时翻译</router-link>
        <router-link to="/multi-modal">多模态输入</router-link>
        <router-link to="/speech-feedback">语音反馈</router-link>
        <router-link to="/user-settings">用户设置</router-link>
      </nav>
    </aside>
    <div class="layout-content">
      <header class="topbar">
        <div>实时智能语音平台</div>
        <div>欢迎回来，系统管理员</div>
      </header>
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAuthLayout = computed(() => route.meta.layout === 'auth');
</script>
