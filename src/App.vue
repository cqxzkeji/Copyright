<template>
  <router-view v-slot="{ Component, route }">
    <div v-if="route.name === 'Login'">
      <Component />
    </div>
    <div v-else class="app-shell">
      <aside class="sidebar">
        <div class="brand">🧭 跨时空心理分析</div>
        <RouterLink
          v-for="item in nav"
          :key="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
          :to="item.path"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </aside>
      <main class="content">
        <header class="header">
          <div>
            <div class="badge">自适应亮色界面</div>
            <h2 style="margin: 6px 0 0;">跨时空多模态学生心理数据分析</h2>
          </div>
          <div class="button-group">
            <button class="btn ghost" @click="showNotice = true">提示</button>
            <button class="btn secondary" @click="logout">退出登录</button>
          </div>
        </header>
        <Component />
      </main>
    </div>
  </router-view>

  <div v-if="showNotice" class="modal-overlay" @click.self="showNotice = false">
    <div class="modal">
      <h3>操作提示</h3>
      <p>所有模块以独立卡片形式呈现，并支持弹窗表单与分析进度展示。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showNotice = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showNotice = ref(false);
const nav = [
  { path: '/dashboard', label: '数据分析仪表板', icon: '📊' },
  { path: '/mood', label: '情绪追踪与分析', icon: '😊' },
  { path: '/cognition', label: '认知分析', icon: '🧠' },
  { path: '/behavior', label: '行为洞察', icon: '👣' },
  { path: '/report', label: '报告生成', icon: '📄' }
];

const logout = () => {
  router.push('/');
};
</script>
