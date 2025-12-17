<template>
  <div class="layout">
    <header class="header">
      <div class="flex-between" style="gap: 12px;">
        <strong>农业电商运营中台</strong>
        <span class="badge success dot">在线</span>
      </div>
      <nav>
        <RouterLink to="/app/products" class="nav-link" active-class="active">商品</RouterLink>
        <RouterLink to="/app/orders" class="nav-link" active-class="active">订单</RouterLink>
        <RouterLink to="/app/inventory" class="nav-link" active-class="active">库存供应链</RouterLink>
        <RouterLink to="/app/analytics" class="nav-link" active-class="active">运营分析</RouterLink>
        <RouterLink to="/app/system" class="nav-link" active-class="active">系统管理</RouterLink>
      </nav>
      <div class="action-bar">
        <button class="btn ghost" @click="showNotice = true">消息</button>
        <button class="btn primary" @click="showProfile = true">管理员</button>
      </div>
    </header>
    <main class="content">
      <RouterView />
    </main>
    <ModalDialog v-model="showProfile" title="个人中心" @confirm="showProfile = false">
      <div class="form-grid">
        <label>
          <div class="label">姓名</div>
          <input class="input" value="张运营" readonly />
        </label>
        <label>
          <div class="label">角色</div>
          <input class="input" value="平台管理员" readonly />
        </label>
        <label>
          <div class="label">最近登录时间</div>
          <input class="input" value="09:20 来自广州" readonly />
        </label>
      </div>
    </ModalDialog>
    <ModalDialog v-model="showNotice" title="提醒">
      <ul class="list">
        <li><span>新增 4 条待审核商品</span><span class="badge warning dot">待处理</span></li>
        <li><span>今日冷链补货申请 2 条</span><span class="badge info dot">供应链</span></li>
        <li><span>风控命中 1 条异常订单</span><span class="badge danger dot">异常</span></li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const showProfile = ref(false);
const showNotice = ref(false);
</script>
