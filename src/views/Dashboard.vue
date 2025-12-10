<template>
  <div style="min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; gap: 18px; padding: 18px;" class="layout">
    <aside class="card" style="height: fit-content; position: sticky; top: 18px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(120deg, #0ea5e9, #22c55e);"></div>
        <div>
          <div style="font-weight: 800;">农产品管理中心</div>
          <div class="tagline">亮色 / 自适应布局</div>
        </div>
      </div>
      <nav style="display: grid; gap: 8px;">
        <router-link v-for="item in menu" :key="item.path" :to="item.path" class="card" style="padding: 10px; box-shadow: none; border-width: 1px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(120deg, #f0f9ff, #e0f2fe);">
          <span>{{ item.label }}</span>
          <span style="color: var(--primary); font-weight: 700;">→</span>
        </router-link>
      </nav>
    </aside>
    <main>
      <div class="card" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div>
          <h2 style="margin: 0;">主界面</h2>
          <p class="tagline">选择左侧模块加载到右侧窗口</p>
        </div>
        <button class="btn secondary" @click="showHelp = true">界面提示</button>
      </div>
      <router-view />
    </main>
    <ModalDialog v-model="showHelp" title="操作提示">
      <p>所有功能模块将加载在右侧窗口，点击左侧导航切换。每个模块均提供数据表、图表与弹窗操作，按钮均为对应功能。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showHelp = ref(false);
const menu = [
  { label: '产品管理', path: '/dashboard/products' },
  { label: '销售管理', path: '/dashboard/sales' },
  { label: '库存追踪', path: '/dashboard/inventory' },
  { label: '订单处理', path: '/dashboard/orders' },
  { label: '报表中心', path: '/dashboard/reports' }
];
</script>
