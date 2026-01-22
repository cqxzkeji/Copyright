<template>
  <div class="app-shell">
    <aside v-if="showLayout" class="sidebar">
      <div class="brand">
        <div class="logo">AG</div>
        <div>
          <div class="name">挡泥板组合设计</div>
          <div class="sub">农业机械平台</div>
        </div>
      </div>
      <nav class="menu">
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          active-class="active"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="user-card">
        <div class="user-title">当前用户</div>
        <div class="user-name">设计工程师 · 农机组</div>
      </div>
    </aside>
    <main :class="['content', { full: !showLayout }]">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const showLayout = computed(() => route.path !== "/login");

const menu = [
  { path: "/dashboard", label: "系统概览" },
  { path: "/param-modeling", label: "挡泥板参数化建模" },
  { path: "/assembly-design", label: "组合方案配置与装配设计" },
  { path: "/performance-analysis", label: "材料与结构性能分析" },
  { path: "/simulation", label: "工况仿真与适配验证" },
  { path: "/design-manage", label: "设计结果管理与输出" },
];
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6dd5fa, #2980b9);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name {
  font-weight: 700;
}

.sub {
  font-size: 12px;
  color: #6b7280;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f3f6fb;
  font-size: 14px;
  line-height: 1.4;
}

.menu-item.active {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.user-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 12px;
}

.user-title {
  font-size: 12px;
  color: #6b7280;
}

.user-name {
  margin-top: 6px;
  font-weight: 600;
}

.content {
  padding: 24px 32px 48px;
}

.content.full {
  padding: 0;
}

@media (max-width: 1100px) {
  .app-shell {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    height: auto;
  }
}
</style>
