<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">
        <el-icon size="20" color="var(--primary-color)"><Histogram /></el-icon>
        <span>数据智能平台</span>
      </div>
      <el-button
        v-for="item in menus"
        :key="item.path"
        class="nav-button"
        :class="{ 'is-active': route.path === item.path }"
        :icon="item.icon"
        text
        size="large"
        @click="router.push(item.path)"
      >
        {{ item.label }}
      </el-button>
      <div style="flex: 1"></div>
      <el-button type="primary" :icon="SwitchButton" @click="logout">退出登录</el-button>
    </aside>

    <main class="main-panel">
      <div class="header">
        <div>
          <div style="font-weight: 700; font-size: 18px; color: #0f172a;">大数据可视化与智能分析</div>
          <div style="color: #6b7280; font-size: 13px;">全链路治理 · 实时洞察 · 决策辅助</div>
        </div>
        <el-space alignment="center" :size="12">
          <el-tag type="success" effect="plain">实时监控</el-tag>
          <el-tag type="info" effect="plain">智能预警</el-tag>
          <el-avatar :icon="UserFilled" style="background: #e0f2fe; color: #1d4ed8" />
        </el-space>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const menus = computed(() => [
  { label: '数据采集与接入', path: '/collect', icon: Connection },
  { label: '数据治理与处理', path: '/process', icon: MagicStick },
  { label: '数据可视化展示', path: '/visualization', icon: DataLine },
  { label: '智能分析与挖掘', path: '/intelligence', icon: TrendCharts },
  { label: '系统管理与支撑', path: '/system', icon: Setting }
]);

const logout = () => {
  sessionStorage.removeItem('bd-token');
  router.push('/login');
  ElMessage.info('已退出登录');
};
</script>
