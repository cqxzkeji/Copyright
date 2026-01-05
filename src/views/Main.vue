<template>
  <div class="layout">
    <header class="header">
      <h1>城区存量资产盘活与利用管理平台</h1>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="tag">多部门协同</span>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showNotice = true">操作提示</button>
      </div>
    </header>
    <div class="main-content">
      <aside class="sidebar">
        <ul class="menu">
          <li :class="['menu-item', isActive('/main/asset-ledger') ? 'active' : '']" @click="go('/main/asset-ledger')">存量资产台账</li>
          <li :class="['menu-item', isActive('/main/utilization') ? 'active' : '']" @click="go('/main/utilization')">资产盘活管理</li>
          <li :class="['menu-item', isActive('/main/monitoring') ? 'active' : '']" @click="go('/main/monitoring')">利用监测与绩效</li>
          <li :class="['menu-item', isActive('/main/analytics') ? 'active' : '']" @click="go('/main/analytics')">统计分析</li>
          <li :class="['menu-item', isActive('/main/system') ? 'active' : '']" @click="go('/main/system')">系统管理</li>
        </ul>
      </aside>
      <section class="content-area">
        <router-view />
      </section>
    </div>
  </div>
  <ModalDialog v-if="showNotice" title="导航提示" @close="showNotice = false">
    <p>左侧菜单大小固定，可随时切换模块。顶部按钮用于查看操作引导和平台公告。</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const showNotice = ref(false);

const go = (path) => router.push(path);
const isActive = (path) => route.path === path;
</script>
