<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">智能日报系统</div>
      <nav class="nav-links">
        <RouterLink to="/app/daily">日报流程管理</RouterLink>
        <RouterLink to="/app/statistics">指标统计与分析</RouterLink>
        <RouterLink to="/app/data-sync">数据同步与集成</RouterLink>
        <RouterLink to="/app/users">用户与权限管理</RouterLink>
        <RouterLink to="/app/settings">系统设置与配置</RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <div class="top-bar">
        <div>
          <div style="font-weight: 700;">欢迎回来，管理者</div>
          <div style="font-size: 12px; color: #6b7a99;">今日状态已同步更新</div>
        </div>
        <div class="actions">
          <button class="btn secondary" type="button" @click="openNotice">
            消息提醒
          </button>
          <button class="btn outline" type="button" @click="logout">
            退出登录
          </button>
        </div>
      </div>
      <router-view />
    </main>
    <BaseModal v-if="showNotice" title="系统提示" @close="showNotice = false">
      <p>今日共有 18 份日报待审批，3 条同步任务需要确认。</p>
      <template #actions>
        <button class="btn" type="button" @click="showNotice = false">我知道了</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const showNotice = ref(false);

const openNotice = () => {
  showNotice.value = true;
};

const logout = () => {
  router.push('/login');
};
</script>
