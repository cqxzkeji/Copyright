<template>
  <div class="app-container">
    <aside class="sidebar">
      <div>
        <h1>优特钢定制销售匹配</h1>
        <p style="margin:6px 0 0; font-size:12px; color:#5b6b8a;">多客户需求统一调度</p>
      </div>
      <nav class="nav-group">
        <RouterLink class="nav-link" :class="{ active: route.path === '/customer' }" to="/customer">
          客户管理与匹配
          <span>01</span>
        </RouterLink>
        <RouterLink class="nav-link" :class="{ active: route.path === '/product' }" to="/product">
          产品配置与定制
          <span>02</span>
        </RouterLink>
        <RouterLink class="nav-link" :class="{ active: route.path === '/quotation' }" to="/quotation">
          报价与订单管理
          <span>03</span>
        </RouterLink>
        <RouterLink class="nav-link" :class="{ active: route.path === '/production' }" to="/production">
          生产调度与排产
          <span>04</span>
        </RouterLink>
        <RouterLink class="nav-link" :class="{ active: route.path === '/after-sales' }" to="/after-sales">
          售后服务与质量追溯
          <span>05</span>
        </RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <section class="top-bar">
        <div class="meta">
          <strong>欢迎回来，销售协同中心</strong>
          <span style="font-size:13px; color:#63708c;">今日已匹配方案 18 个，待处理审批 6 项</span>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="secondary-button" type="button" @click="openModal('message')">消息中心</button>
          <button class="primary-button" type="button" @click="openModal('logout')">退出登录</button>
        </div>
      </section>
      <router-view />
      <ModalDialog :open="activeModal === 'message'" title="消息中心" @close="closeModal">
        <p>今日新增 5 条系统通知，涉及排产调整与合同审批。</p>
        <div class="action-row" style="margin-top:16px;">
          <button type="button" class="primary-button" @click="closeModal">查看详情</button>
        </div>
      </ModalDialog>
      <ModalDialog :open="activeModal === 'logout'" title="确认退出" @close="closeModal">
        <p>确定退出系统并返回登录页吗？</p>
        <div class="action-row" style="margin-top:16px;">
          <button type="button" class="secondary-button" @click="closeModal">取消</button>
          <button type="button" class="primary-button" @click="handleLogout">确认退出</button>
        </div>
      </ModalDialog>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const route = useRoute();
const router = useRouter();
const activeModal = ref('');

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const handleLogout = () => {
  activeModal.value = '';
  router.push('/login');
};
</script>
