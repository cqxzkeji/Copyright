<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <div class="top-banner">
        <h2>六足机器人视觉伺服上位机</h2>
        <p>面向复杂场景的任务与控制，支持设备接入、视觉伺服与数据管理。</p>
      </div>
      <form @submit.prevent="handleLogin" class="grid" style="margin-top: 16px">
        <div>
          <label>账号</label>
          <input v-model="form.user" placeholder="请输入账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.pass" type="password" placeholder="请输入密码" required />
        </div>
        <div class="flex-between">
          <div class="tag">
            <span>安全提示</span>
            <small>仅本地演示</small>
          </div>
          <button type="submit">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ user: 'operator', pass: '123456' });

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, rgba(100, 181, 246, 0.25), transparent 35%),
    radial-gradient(circle at 80% 30%, rgba(255, 179, 0, 0.2), transparent 30%),
    var(--bg);
  padding: 20px;
}

.login-card {
  width: min(480px, 100%);
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}
</style>
