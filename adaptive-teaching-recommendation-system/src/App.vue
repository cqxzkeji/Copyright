<template>
  <div class="app-shell">
    <div v-if="isAuthLayout" class="auth-layout">
      <router-view />
    </div>
    <div v-else class="main-layout">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand-dot"></span>
          <div>
            <h1>多模态教学</h1>
            <p>自适应优化平台</p>
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
            <span class="menu-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
        <div class="sidebar-footer">
          <div class="badge">在线课堂运行中</div>
          <p>实时联动 · 高亮提醒</p>
        </div>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>
            <h2>{{ currentTitle }}</h2>
            <p>{{ currentSubtitle }}</p>
          </div>
          <div class="topbar-actions">
            <button class="secondary-btn" @click="goLogin">退出登录</button>
          </div>
        </header>
        <section class="content-body">
          <router-view />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const menu = [
  { path: "/data", label: "数据采集", icon: "📡" },
  { path: "/diagnostic", label: "诊断分析", icon: "🧠" },
  { path: "/recommendation", label: "优化推荐", icon: "✨" },
  { path: "/dashboard", label: "结果展示", icon: "📊" },
  { path: "/security", label: "安全管理", icon: "🔒" }
];

const isAuthLayout = computed(() => route.meta.layout === "auth");

const currentTitle = computed(() => route.meta.title || "主界面");
const currentSubtitle = computed(() => route.meta.subtitle || "多模态教学实时运行总览");

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #e6f0ff, #f6f8fc 45%);
  padding: 24px;
}

.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #eef1f6;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand h1 {
  font-size: 18px;
  margin: 0;
}

.brand p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.brand-dot {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f7cff, #67d1ff);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 600;
  color: #41506b;
  background: #f6f8fc;
}

.menu-item.active {
  background: #e6f0ff;
  color: #1d4ed8;
}

.menu-icon {
  font-size: 18px;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 12px;
  gap: 16px;
}

.topbar h2 {
  margin: 0;
  font-size: 24px;
}

.topbar p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.content-body {
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 960px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content-body {
    padding: 0 20px 24px;
  }
}
</style>
