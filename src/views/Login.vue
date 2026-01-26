<template>
  <div class="login-page">
    <div class="login-card">
      <h1>信云客户信息管理系统</h1>
      <p>请使用账号密码登录系统</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button class="primary" type="submit">登录</button>
      </form>
    </div>
    <BaseModal :open="modalOpen" title="登录提示" @close="modalOpen = false">
      <p>{{ modalMessage }}</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="primary" type="button" @click="enterSystem">进入系统</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = ref({
  account: '',
  password: ''
});
const modalOpen = ref(false);
const modalMessage = ref('');

const handleLogin = () => {
  modalMessage.value = `欢迎 ${form.value.account}，正在验证权限。`;
  modalOpen.value = true;
};

const enterSystem = () => {
  modalOpen.value = false;
  router.push('/dashboard/customer');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fb, #e9f0ff);
  padding: 24px;
}

.login-card {
  width: min(420px, 90vw);
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 16px 32px rgba(15, 31, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card h1 {
  margin: 0;
  font-size: 22px;
  color: #3b5bfd;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #52607a;
}

.login-card button {
  margin-top: 8px;
}
</style>
