<template>
  <div class="login">
    <div class="panel">
      <h1>颌骨囊肿辅助检测系统</h1>
      <p class="muted">请登录后进入主界面</p>
      <div class="form">
        <label>用户名
          <input v-model="form.user" placeholder="输入账号" />
        </label>
        <label>密码
          <input v-model="form.pass" type="password" placeholder="输入密码" />
        </label>
        <button @click="handleLogin">登录</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ user: '', pass: '' });
const error = ref('');

const handleLogin = () => {
  if (form.user && form.pass) {
    localStorage.setItem('jwt-demo-token', `${form.user}-token`);
    router.push('/data');
  } else {
    error.value = '请输入完整的账号与密码';
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #eef2ff);
  padding: 20px;
}

.panel {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: min(420px, 100%);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border);
}

h1 {
  margin: 0 0 6px;
  text-align: center;
}

.muted {
  color: var(--muted);
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error {
  color: #ef4444;
  font-weight: 600;
  margin: 0;
}
</style>
