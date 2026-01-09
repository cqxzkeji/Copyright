<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <h1>危废转运监控系统</h1>
        <div class="tag">平台运行中</div>
      </div>
      <nav class="nav-group">
        <RouterLink class="nav-item" active-class="active" to="/main/ledger">危废基础台账</RouterLink>
        <RouterLink class="nav-item" active-class="active" to="/main/dispatch">转运计划调度</RouterLink>
        <RouterLink class="nav-item" active-class="active" to="/main/monitor">实时转运监控</RouterLink>
        <RouterLink class="nav-item" active-class="active" to="/main/compliance">联单与合规管理</RouterLink>
        <RouterLink class="nav-item" active-class="active" to="/main/analytics">统计分析与追溯</RouterLink>
      </nav>
      <button class="btn secondary" @click="showLogout = true">退出登录</button>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
    <Modal :show="showLogout" title="确认退出" @close="showLogout = false">
      <p>确定要退出当前监管账号吗？退出后需要重新登录。</p>
      <div class="modal-actions">
        <button class="btn secondary" @click="showLogout = false">取消</button>
        <button class="btn" @click="handleLogout">确认退出</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterView, RouterLink } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const showLogout = ref(false);

const handleLogout = () => {
  localStorage.removeItem('hazwaste-auth');
  showLogout.value = false;
  router.push('/login');
};
</script>
