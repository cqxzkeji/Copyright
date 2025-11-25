<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="header">
        <div>
          <h1>大气 PM2.5 WRF-Chem 预测系统</h1>
          <p>请登录以管理数据、配置模式并发布预测成果</p>
        </div>
        <div class="badge">安全接入</div>
      </div>
      <form @submit.prevent="handleLogin" class="grid form-grid">
        <div>
          <label>用户名</label>
          <input v-model="form.username" placeholder="如：chem_admin" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit">登录系统</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (!form.username || !form.password) return;
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at 10% 20%, rgba(59,130,246,0.15), transparent 35%),
    radial-gradient(circle at 90% 10%, rgba(14,165,233,0.15), transparent 30%),
    var(--bg);
}

.login-card {
  width: min(520px, 92vw);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: 22px;
}

p {
  margin: 6px 0 0;
  color: var(--muted);
}

.form-grid {
  gap: 14px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}
</style>
