<template>
  <div class="page-container">
    <aside class="sidebar">
      <h2>优特钢定制</h2>
      <nav class="nav-list">
        <RouterLink class="nav-item" to="/app/customer">客户管理与匹配</RouterLink>
        <RouterLink class="nav-item" to="/app/product">产品配置与定制</RouterLink>
        <RouterLink class="nav-item" to="/app/quotation">报价与订单管理</RouterLink>
        <RouterLink class="nav-item" to="/app/analysis">数据分析与决策支持</RouterLink>
        <RouterLink class="nav-item" to="/app/report">报告与通知系统</RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <div class="topbar">
        <div>
          <div class="title">主界面控制台</div>
          <div style="color: var(--muted); font-size: 13px;">快速进入各模块并查看关键运营指标。</div>
        </div>
        <div class="button-row">
          <button class="btn secondary" type="button" @click="openTip">系统提示</button>
          <button class="btn" type="button" @click="openProgress">数据同步</button>
        </div>
      </div>
      <RouterView />
    </main>
    <BaseModal v-if="showTip" title="系统提示" @close="showTip = false">
      <p style="margin: 0 0 12px;">今日已加载 5 个业务模块与 120 条业务数据。</p>
      <button class="btn" type="button" @click="showTip = false">确认</button>
    </BaseModal>
    <BaseModal v-if="showProgress" title="数据同步进度" @close="showProgress = false">
      <p style="margin: 0 0 12px;">正在同步客户、订单与报价数据。</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin: 12px 0 0; color: var(--muted);">已完成 {{ progress }}%</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const showTip = ref(false);
const showProgress = ref(false);
const progress = ref(45);

const openTip = () => {
  showTip.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

onMounted(() => {
  progress.value = 45;
});
</script>
