<template>
  <div class="login">
    <div class="login-card">
      <h1>农产品直播营销数据分析系统</h1>
      <p class="subtitle">请登录后进入主界面</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="actions">
          <button class="btn" type="button" @click="openReset">清空表单</button>
          <button class="btn primary" type="submit">登录</button>
        </div>
      </form>
    </div>
    <BaseModal :show="showReset" title="已清空输入" @close="showReset = false">
      <p>账号与密码已清空，请重新输入。</p>
    </BaseModal>
    <BaseModal :show="showLogin" title="正在登录" @close="showLogin = false">
      <p>系统正在验证账号信息，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <template #footer>
        <button class="btn" @click="showLogin = false">取消</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = reactive({
  account: '',
  password: ''
});

const showReset = ref(false);
const showLogin = ref(false);
const progress = ref(0);
let timer = null;

const openReset = () => {
  form.account = '';
  form.password = '';
  showReset.value = true;
};

const handleLogin = () => {
  showLogin.value = true;
  progress.value = 0;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showLogin.value = false;
      router.push('/main/dashboard');
    } else {
      progress.value += 20;
    }
  }, 200);
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fb 0%, #eef3ff 40%, #fefeff 100%);
}

.login-card {
  width: min(420px, 100%);
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(30, 61, 129, 0.15);
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
}

.subtitle {
  margin: 0 0 24px;
  color: #5c6b8a;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #52607b;
}

input {
  border: 1px solid #e0e6f1;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>
