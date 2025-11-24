<template>
  <div class="login-page">
    <div class="login-card">
      <h1>地理信息管理系统</h1>
      <p class="hint">请使用授权账号登录</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>
          <span>用户名</span>
          <input v-model="form.username" placeholder="geo_admin" required />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="••••••" required />
        </label>
        <div class="actions">
          <label class="remember">
            <input type="checkbox" v-model="remember" /> 记住我
          </label>
          <a href="#" @click.prevent="forgotPassword">忘记密码？</a>
        </div>
        <button type="submit" class="submit">立即登录</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const remember = ref(true);
const message = ref('');

const handleLogin = () => {
  if (form.username && form.password) {
    message.value = '验证通过，正在跳转...';
    setTimeout(() => router.push('/dashboard'), 600);
  } else {
    message.value = '请输入完整的登录信息。';
  }
};

const forgotPassword = () => {
  message.value = '请联系系统管理员重置密码。';
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
}
.login-card {
  width: min(440px, 100%);
  background: rgba(13, 27, 42, 0.9);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-card h1 {
  margin: 0;
  font-size: 1.9rem;
}
.hint {
  margin: 0 0 12px;
  opacity: 0.75;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.95rem;
}
input[type="text"],
input[type="password"],
input:not([type]) {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: #f5f7ff;
}
.actions {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}
.submit {
  background: linear-gradient(120deg, #3a86ff, #64c5eb);
  color: #fff;
  border-radius: 14px;
  padding: 12px;
  font-size: 1rem;
  margin-top: 12px;
}
.message {
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>
