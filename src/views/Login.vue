<template>
  <div class="login-page">
    <div class="login-card">
      <div>
        <p class="muted">谷物良种基因库</p>
        <h2>系统登录</h2>
        <p class="muted">登陆后进入主界面，加载所有功能模块。</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>用户名
          <input v-model="username" type="text" required placeholder="科研人员/管理员" />
        </label>
        <label>密码
          <input v-model="password" type="password" required placeholder="请输入密码" />
        </label>
        <div class="actions">
          <button class="primary" type="submit">登陆</button>
          <button class="secondary" type="button" @click="showTip = true">获取帮助</button>
        </div>
      </form>
    </div>
    <ModalDialog v-model="showTip" title="登陆提示">
      <p>输入任意用户名密码即可模拟登陆，系统会加载到主界面并保留登录状态。</p>
    </ModalDialog>
    <ModalDialog v-model="showSuccess" title="登陆成功">
      <p>身份校验通过，正在跳转到主界面载入各模块。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const username = ref('');
const password = ref('');
const showTip = ref(false);
const showSuccess = ref(false);
const router = useRouter();
const authState = inject('authState');

const handleLogin = () => {
  if (username.value && password.value) {
    localStorage.setItem('authToken', `${username.value}-${Date.now()}`);
    authState.isAuthenticated = true;
    showSuccess.value = true;
    setTimeout(() => router.replace('/'), 600);
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 35%),
    radial-gradient(circle at 80% 0%, #fff0b3, transparent 40%),
    var(--bg);
}

.login-card {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(30, 64, 175, 0.12);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
}

input {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
</style>
