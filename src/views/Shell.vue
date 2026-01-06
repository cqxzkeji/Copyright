<template>
  <div class="layout">
    <aside class="sidebar">
      <div style="font-weight:800;font-size:20px;margin-bottom:14px;color:var(--primary)">优特钢标准销售</div>
      <nav>
        <router-link
          v-for="item in menus"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
    <div style="display:flex;flex-direction:column;min-height:100vh;background:#f7fbff">
      <header class="topbar">
        <div>
          <div style="font-weight:800;font-size:18px">{{ currentTitle }}</div>
          <div style="color:#5c6b7a;font-size:12px">亮色主题 · 自适应布局</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="btn ghost" @click="openQuick">快速指引</button>
          <button class="btn secondary" @click="logout">退出登录</button>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
    <ModalDialog
      v-if="showGuide"
      title="操作指引"
      @close="showGuide=false"
    >
      <p>按照左侧菜单完成客户需求、技术标准、报价、订单执行与分析的全流程闭环。</p>
      <ul>
        <li>在客户与需求模块录入定制需求</li>
        <li>在技术标准模块选择牌号与检测规范</li>
        <li>在报价模块生成价格并发起审批</li>
        <li>在执行模块跟踪排产、生产与交付节点</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();

const menus = [
  { path: '/app/overview', label: '数据总览' },
  { path: '/app/customers', label: '客户与需求' },
  { path: '/app/product', label: '产品与标准' },
  { path: '/app/quotation', label: '报价与合同' },
  { path: '/app/order', label: '订单执行' },
  { path: '/app/analytics', label: '分析决策' }
];

const mapTitle = {
  '/app/overview': '数据总览与指标看板',
  '/app/customers': '客户与需求管理',
  '/app/product': '产品与技术标准管理',
  '/app/quotation': '报价与合同流程管理',
  '/app/order': '订单执行与生产协同',
  '/app/analytics': '数据分析与决策支持'
};

const showGuide = ref(false);
const currentTitle = computed(() => mapTitle[route.path] || '优特钢定制流程');

const logout = () => {
  localStorage.removeItem('steel_token');
  router.push('/login');
};

const openQuick = () => {
  showGuide.value = true;
};
</script>
