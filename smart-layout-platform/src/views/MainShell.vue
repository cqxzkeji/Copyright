<template>
  <div class="main-shell">
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-mark">ML</span>
        <div>
          <p class="logo-title">传媒智能排版</p>
          <small>多模块统一工作台</small>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/app/layout" class="menu-item" :class="isActive('/app/layout')">排版设计</router-link>
        <router-link to="/app/content" class="menu-item" :class="isActive('/app/content')">内容管理</router-link>
        <router-link to="/app/templates" class="menu-item" :class="isActive('/app/templates')">模板库</router-link>
        <router-link to="/app/preview" class="menu-item" :class="isActive('/app/preview')">预览与导出</router-link>
        <router-link to="/app/analytics" class="menu-item" :class="isActive('/app/analytics')">数据分析</router-link>
        <router-link to="/app/profile" class="menu-item" :class="isActive('/app/profile')">个人中心</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">多功能模块快速切换</p>
          <h2>媒体宣传内容智能排版设计平台</h2>
        </div>
        <div class="top-actions">
          <button class="secondary-btn" @click="openModal('notice')">系统提示</button>
          <button class="primary-btn" @click="openModal('shortcut')">快捷操作</button>
        </div>
      </header>
      <section class="content-pane">
        <router-view />
      </section>
    </main>
    <BaseModal v-model="noticeModal" title="操作提示">
      <p>当前版本已加载全部功能模块，支持全局亮色与响应式布局。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="noticeModal = false">知道了</button>
      </div>
    </BaseModal>
    <BaseModal v-model="shortcutModal" title="快捷操作">
      <div class="grid-2">
        <div class="card">
          <p class="eyebrow">排版</p>
          <p>自动排版、组件对齐、一键分栏</p>
        </div>
        <div class="card">
          <p class="eyebrow">导出</p>
          <p>导出高清图、批量生成视频、发布到社交媒体</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="shortcutModal = false">关闭</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const route = useRoute();
const noticeModal = ref(false);
const shortcutModal = ref(false);

const isActive = (path) => (route.path === path ? 'active' : '');
const openModal = (type) => {
  if (type === 'notice') noticeModal.value = true;
  if (type === 'shortcut') shortcutModal.value = true;
};
</script>

<style scoped>
.main-shell {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1.5rem;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 2rem;
}

.logo {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 0.75rem;
  align-items: center;
}

.logo-mark {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #a78bfa, #4f46e5);
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
}

.logo-title {
  margin: 0;
  font-weight: 700;
}

.menu {
  display: grid;
  gap: 0.5rem;
}

.menu-item {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: #e2e8f0;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.15s ease;
}

.menu-item.active,
.menu-item:hover {
  background: #1d2a44;
  transform: translateX(4px);
}

.content {
  background: #f8fafc;
  padding: 1.5rem;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
}

.topbar {
  background: #fff;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
  flex-wrap: wrap;
  gap: 1rem;
}

.content-pane {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.top-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .main-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    grid-template-rows: auto;
    grid-auto-flow: column;
    align-items: center;
  }
}
</style>
