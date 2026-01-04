<template>
  <div class="login">
    <div class="panel card">
      <div class="logo">CKD</div>
      <h2>慢性肾脏病健康监测</h2>
      <p class="subtitle">登陆后可管理采集、监测、预警与报告</p>
      <form @submit.prevent="handleLogin" class="grid">
        <div>
          <label>账户</label>
          <input v-model="form.username" placeholder="请输入账户" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <button class="btn" type="submit">立即登陆</button>
      </form>
      <p class="hint">演示账号可任意输入，点击登陆后跳转主界面</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (form.username && form.password) {
    router.push('/main/data');
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: radial-gradient(circle at 20% 20%, #bae6fd, transparent 32%),
    radial-gradient(circle at 80% 10%, #ddd6fe, transparent 30%),
    radial-gradient(circle at 50% 80%, #fce7f3, transparent 30%);
}

.panel {
  width: min(520px, 96vw);
  text-align: center;
  padding: 36px;
}

.logo {
  width: 62px;
  height: 62px;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #fff;
  font-weight: 800;
  display: grid;
  place-items: center;
  margin: 0 auto 12px;
}

.subtitle {
  color: #475569;
  margin-top: 0;
}

.grid {
  margin-top: 22px;
  gap: 12px;
}

.hint {
  color: #94a3b8;
  margin-top: 12px;
}
</style>
