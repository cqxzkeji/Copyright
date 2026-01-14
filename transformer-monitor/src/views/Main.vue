<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">⚡</div>
        <div>
          <h2>变压器监测</h2>
          <span>智能预警平台</span>
        </div>
      </div>
      <el-menu :default-active="activeMenu" class="menu" @select="handleSelect">
        <el-menu-item index="/main/device">设备接入</el-menu-item>
        <el-menu-item index="/main/monitor">实时监测</el-menu-item>
        <el-menu-item index="/main/analysis">变形分析</el-menu-item>
        <el-menu-item index="/main/alarm">预警管理</el-menu-item>
        <el-menu-item index="/main/report">统计与系统管理</el-menu-item>
      </el-menu>
    </aside>
    <div class="content">
      <header class="header">
        <div class="header-left">
          <h1>实时在线监测与预警平台</h1>
          <p>统一调度 · 智能感知 · 风险可控</p>
        </div>
        <div class="header-right">
          <el-tag type="success">运行中</el-tag>
          <el-avatar>运维</el-avatar>
        </div>
      </header>
      <section class="view-wrapper">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => route.path);

const handleSelect = (index) => {
  router.push(index);
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f8ff;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5ecf8;
  padding: 24px 16px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #d9e8ff;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.brand h2 {
  font-size: 16px;
  margin: 0;
  color: #1a2b5c;
}

.brand span {
  font-size: 12px;
  color: #7b8bb3;
}

.menu {
  border-right: none;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e5ecf8;
}

.header-left h1 {
  margin: 0 0 6px;
  color: #1a2b5c;
}

.header-left p {
  margin: 0;
  color: #7b8bb3;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-wrapper {
  padding: 24px 32px 40px;
}

@media (max-width: 960px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .menu {
    flex: 1;
  }
}
</style>
