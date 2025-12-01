<template>
  <div class="login-page">
    <div class="login-card">
      <div class="header">
        <h1>Transformer 路侧感知融合平台</h1>
        <p>登录后管理全链路数据采集、融合算法与可视化决策</p>
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <label>账号</label>
        <input v-model="form.username" type="text" placeholder="输入工号或邮箱" required />
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="输入密码" required />
        <div class="actions">
          <button type="button" class="secondary-btn" @click="showHint = true">获取登录提示</button>
          <button type="submit" class="primary-btn">登录工作台</button>
        </div>
      </form>
    </div>

    <div v-if="showHint" class="modal-backdrop" @click.self="showHint = false">
      <div class="modal-content">
        <h3>登录信息提示</h3>
        <p>平台会为每个实验会话生成一个会话令牌，请确保输入合法凭据后再登录。</p>
        <button class="primary-btn" @click="showHint = false">知道了</button>
      </div>
    </div>

    <div v-if="loggingIn" class="modal-backdrop">
      <div class="modal-content">
        <h3>正在验证凭据</h3>
        <p>正在与权限中心同步，请稍候...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showHint = ref(false);
const loggingIn = ref(false);
const progress = ref(0);
let timer = null;

const handleLogin = () => {
  if (!form.username || !form.password) {
    return;
  }
  loggingIn.value = true;
  progress.value = 0;
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      sessionStorage.setItem('token', `${form.username}-session`);
      router.push('/main');
      loggingIn.value = false;
    } else {
      progress.value += 25;
    }
  }, 280);
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 18px;
}

.login-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 18px;
  width: min(560px, 96vw);
  box-shadow: 0 22px 50px rgba(49, 130, 206, 0.12);
}

.header h1 {
  margin: 0 0 6px;
  color: #0f172a;
}

.header p {
  margin: 0 0 18px;
  color: #475569;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.secondary-btn {
  background: #e2e8f0;
  color: #0f172a;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
}
</style>
