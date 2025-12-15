<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>网络业务分析</h2>
      <div style="margin-bottom: 14px; color: #6b7280; font-weight: 600;">欢迎，{{ username }}</div>
      <nav>
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.path) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div style="margin-top: 20px; display: grid; gap: 8px;">
        <button class="secondary-btn" @click="openProfile">账号资料</button>
        <button class="primary-btn" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>

  <div v-if="showProfile" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">账号信息</div>
      <div class="modal-body">
        <p>用户名：{{ username }}</p>
        <p>角色：网络运维工程师</p>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="progress-inner" :style="{ width: '72%' }"></div>
        </div>
        <small>完成度 72%</small>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showProfile = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const username = localStorage.getItem('authUser') || '访客';
const showProfile = ref(false);

const links = [
  { label: '网络业务监测', path: '/dashboard/monitoring' },
  { label: '业务性能分析', path: '/dashboard/performance' },
  { label: '异常告警管理', path: '/dashboard/alerts' },
  { label: '数据可视化与报表', path: '/dashboard/visualization' },
  { label: '系统配置与权限管理', path: '/dashboard/settings' }
];

const isActive = (path) => route.path === path;

const logout = () => {
  localStorage.removeItem('authUser');
  router.push('/login');
};

const openProfile = () => {
  showProfile.value = true;
};
</script>
