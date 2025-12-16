<template>
  <router-view v-slot="{ Component, route }">
    <div v-if="route.path === '/login'" class="login-only">
      <component :is="Component" />
    </div>
    <div v-else class="app-shell">
      <aside class="sidebar">
        <h1>供应链韧性平台</h1>
        <ul class="nav-links">
          <li><router-link to="/">系统总览</router-link></li>
          <li><router-link to="/data">数据采集与整合</router-link></li>
          <li><router-link to="/resilience">供应链韧性评估</router-link></li>
          <li><router-link to="/prediction">风险识别与预测</router-link></li>
          <li><router-link to="/warning">风险预警与应对</router-link></li>
          <li><router-link to="/system">系统管理与权限</router-link></li>
        </ul>
      </aside>
      <div class="content">
        <div class="topbar">
          <div class="title">工业供应链韧性分析与智能风险预测平台</div>
          <div class="actions">
            <button class="btn" @click="showProfile = true">账户</button>
            <button class="btn primary" @click="logout">退出</button>
          </div>
        </div>
        <component :is="Component" />
      </div>
      <BaseModal v-model="showProfile" title="个人偏好" @confirm="showProfile = false">
        <div class="form-grid">
          <label>
            通知频率
            <select>
              <option>实时</option>
              <option>每日</option>
              <option>每周</option>
            </select>
          </label>
          <label>
            主题风格
            <select>
              <option>亮色</option>
              <option>高对比</option>
            </select>
          </label>
          <label>
            邮件订阅
            <input type="email" placeholder="name@example.com" />
          </label>
        </div>
      </BaseModal>
    </div>
  </router-view>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from './components/BaseModal.vue';

const router = useRouter();
const showProfile = ref(false);

const logout = () => {
  localStorage.removeItem('resilience-authed');
  router.push('/login');
};
</script>
