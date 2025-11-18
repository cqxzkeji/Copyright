<template>
  <div class="login-wrapper">
    <div class="panel">
      <h1>VR 非遗 & 冰雪场景系统</h1>
      <p>登陆后即可调度各功能模块，完成沉浸式演示与管理。</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="username" placeholder="管理员账号" />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="安全口令" />
        </label>
        <button type="submit">进入系统</button>
        <small v-if="error" class="error">{{ error }}</small>
      </form>
    </div>
    <div class="side">
      <div>
        <h2>沉浸式文化体验</h2>
        <p>跨越季节，在同一平台预览非遗文化与冰雪旅游的双场景内容。</p>
        <ul>
          <li>VR 场景预览与交互体验</li>
          <li>资源采集、建模、调度</li>
          <li>实时统计与运营管理</li>
        </ul>
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
const error = ref('');

const handleLogin = () => {
  if (!username.value || !password.value) {
    error.value = '请输入完整的账号密码';
    return;
  }
  error.value = '';
  router.push('/main');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  background: radial-gradient(circle at top, rgba(92, 225, 230, 0.15), transparent 45%),
    radial-gradient(circle at 20% 20%, rgba(76, 110, 245, 0.15), transparent 40%);
}

.panel,
.side {
  flex: 1 1 320px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  border-radius: 24px;
  margin: 32px;
  gap: 16px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}

input {
  border-radius: 12px;
  border: 1px solid #d0d7ff;
  padding: 12px;
  font-size: 1rem;
}

button {
  border: none;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: white;
  padding: 12px;
  border-radius: 999px;
  font-size: 1rem;
  margin-top: 8px;
}

.side {
  color: white;
  background: linear-gradient(160deg, #0f172a, #1e3a8a);
  border-radius: 24px;
  margin: 32px;
}

.side ul {
  padding-left: 20px;
}

.error {
  color: #e03131;
}
</style>
