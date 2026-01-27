<template>
  <div v-if="route.meta.hideLayout">
    <router-view />
  </div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="logo">SmartHome ERP</div>
      <nav class="nav-group">
        <RouterLink class="nav-item" to="/dashboard">主仪表盘</RouterLink>
        <RouterLink class="nav-item" to="/users">用户管理</RouterLink>
        <RouterLink class="nav-item" to="/products">产品管理</RouterLink>
        <RouterLink class="nav-item" to="/orders">订单管理</RouterLink>
        <RouterLink class="nav-item" to="/marketing">营销与促销</RouterLink>
        <RouterLink class="nav-item" to="/analytics">报表与数据分析</RouterLink>
      </nav>
      <button class="btn ghost" type="button" @click="openLogoutModal">退出登录</button>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <h1>{{ route.meta.title }}</h1>
        <div class="button-group">
          <button class="btn secondary" type="button" @click="openNoticeModal">系统公告</button>
          <button class="btn" type="button" @click="openProfileModal">个人设置</button>
        </div>
      </header>
      <main class="content-area">
        <router-view />
      </main>
    </div>
    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">稍后处理</button>
        <button class="btn" type="button" @click="confirmModal">确认</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Modal from './components/Modal.vue';

const route = useRoute();
const router = useRouter();

const modal = reactive({
  show: false,
  title: '',
  message: '',
  showProgress: false,
  progress: 72,
  onConfirm: null
});

const openNoticeModal = () => {
  modal.show = true;
  modal.title = '系统公告';
  modal.message = '今日计划发布智能门锁新品推广，请各团队核对库存与活动预算。';
  modal.showProgress = false;
  modal.onConfirm = null;
};

const openProfileModal = () => {
  modal.show = true;
  modal.title = '个人设置';
  modal.message = '你的角色为：系统管理员，权限覆盖五大模块，需每周复核权限配置。';
  modal.showProgress = false;
  modal.onConfirm = null;
};

const openLogoutModal = () => {
  modal.show = true;
  modal.title = '退出确认';
  modal.message = '确定退出当前账号并返回登录页吗？';
  modal.showProgress = false;
  modal.onConfirm = () => {
    localStorage.removeItem('loggedIn');
    router.push('/login');
  };
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  if (modal.onConfirm) {
    modal.onConfirm();
  }
  closeModal();
};
</script>
