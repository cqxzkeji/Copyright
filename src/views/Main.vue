<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">农业电商控制台</div>
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ active: route.path === link.to }"
      >
        <span>{{ link.label }}</span>
      </router-link>
    </aside>
    <section class="main-area">
      <header class="header">
        <div>
          <h2 style="margin: 0;">全链路作业舱</h2>
          <p style="margin: 4px 0 0; color: var(--muted);">从用户到售后的一体化运营操作面板。</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="ghost" @click="showGuide = true">快捷指引</button>
          <div class="badge">在线值守</div>
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </section>
  </div>
  <ModalDialog v-model="showGuide" title="快捷操作指引">
    <ul style="padding-left: 16px; margin: 0; color: var(--muted);">
      <li>切换左侧导航进入各独立功能模块。</li>
      <li>每个模块均提供新增、操作、进度条等弹窗体验。</li>
      <li>数据表默认加载 10+ 行业务样本，可直接编辑。</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const route = useRoute();
const showGuide = ref(false);

const links = computed(() => [
  { to: '/main/users', label: '用户与商户管理' },
  { to: '/main/products', label: '农产品商品管理' },
  { to: '/main/orders', label: '订单与交易管理' },
  { to: '/main/logistics', label: '物流与售后服务' },
  { to: '/main/analytics', label: '数据统计与运营分析' }
]);
</script>
