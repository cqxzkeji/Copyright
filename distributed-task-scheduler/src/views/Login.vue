<template>
  <div class="login-page">
    <div class="panel">
      <div class="logo">分布式计算调度中心</div>
      <p class="subtitle">登录以管理任务、资源与报表</p>
      <div class="input-row">
        <label>用户名</label>
        <input v-model="username" placeholder="admin" />
      </div>
      <div class="input-row">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="******" />
      </div>
      <button class="cta" @click="handleLogin">进入系统</button>
      <div class="meta">
        <span class="tag">亮色</span>
        <span class="tag">自适应布局</span>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = () => {
  if (username.value.trim() && password.value.trim()) {
    sessionStorage.setItem('dts-auth', 'yes');
    router.push('/');
  } else {
    error.value = '请输入正确的用户名和密码。';
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 20%, #eaf3ff 0, transparent 25%),
    radial-gradient(circle at 80% 10%, #f8eaff 0, transparent 25%),
    radial-gradient(circle at 40% 80%, #e6fff3 0, transparent 30%),
    #f7f9fc;
  padding: 24px;
}

.panel {
  width: min(420px, 92vw);
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(63, 98, 184, 0.16);
}

.logo {
  font-size: 20px;
  font-weight: 800;
  color: #153e9a;
}

.subtitle {
  color: #52616f;
  margin: 6px 0 18px;
}

.cta {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #4f9bff, #7cc0ff);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-top: 8px;
}

.meta {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.error {
  margin-top: 10px;
  color: #c24200;
  font-weight: 700;
}
</style>
