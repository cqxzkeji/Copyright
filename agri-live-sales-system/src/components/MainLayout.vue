<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">农产品直播中台</div>
      <nav class="nav-links">
        <RouterLink class="nav-link" to="/dashboard">数据总览</RouterLink>
        <RouterLink class="nav-link" to="/live">直播管理</RouterLink>
        <RouterLink class="nav-link" to="/products">商品与库存</RouterLink>
        <RouterLink class="nav-link" to="/orders">订单与结算</RouterLink>
        <RouterLink class="nav-link" to="/analysis">营销数据分析</RouterLink>
        <RouterLink class="nav-link" to="/settings">系统配置</RouterLink>
      </nav>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <div class="welcome">欢迎回来，今日直播运维状态良好。</div>
        <div class="topbar-actions">
          <button class="button secondary" @click="openTip">提示</button>
          <RouterLink class="button ghost" to="/login">退出</RouterLink>
        </div>
      </header>
      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
  <ModalDialog
    v-if="tipVisible"
    title="系统提示"
    confirm-text="了解"
    @close="tipVisible = false"
    @confirm="tipVisible = false"
  >
    <p>当前为亮色模式，模块数据每 5 分钟刷新一次。</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ModalDialog from './ModalDialog.vue'

const tipVisible = ref(false)

const openTip = () => {
  tipVisible.value = true
}
</script>
