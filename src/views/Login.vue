<template>
  <div class="login-page">
    <div class="login-card">
      <h1>营销分析平台</h1>
      <p>登录后体验多维度活动评估</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>账户</label>
        <input v-model="username" required placeholder="输入用户名" />
        <label>密码</label>
        <input v-model="password" type="password" required placeholder="输入密码" />
        <button type="submit">立即登录</button>
      </form>
      <div class="login-hints">
        <span>提示：演示账户无需校验</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const handleLogin = () => {
  sessionStorage.setItem('marketing-auth', '1');
  router.push('/app/dashboard');
};
</script>
