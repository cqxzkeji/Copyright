<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="title">蓄电池电压检测数据溯源系统</div>
      <p class="subtitle">请先登录以进入主界面</p>
      <div class="form">
        <label>用户名</label>
        <input v-model="username" class="input" placeholder="输入用户名" />
        <label>密码</label>
        <input v-model="password" class="input" type="password" placeholder="输入密码" />
      </div>
      <button class="btn" @click="handleLogin">登录</button>
      <p class="hint">默认任意填写即跳转</p>
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
  if (username.value && password.value) {
    router.push('/main');
  } else {
    alert('请输入用户名与密码');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #e0edff, #f7fbff);
  padding: 20px;
}

.login-card {
  width: 380px;
  max-width: 96vw;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  margin: 0 0 18px;
  color: var(--muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  margin-bottom: 16px;
}

.hint {
  color: var(--muted);
  font-size: 12px;
}
</style>
