<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="logo">💧 多建筑群供水与污水监控</div>
      <p class="muted">请使用值班账号登陆以继续监控。</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>账号</label>
        <input v-model="user" placeholder="请输入姓名" required />
        <label>口令</label>
        <input type="password" v-model="pwd" placeholder="输入值班口令" required />
        <button class="btn primary" type="submit">进入主界面</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const user = ref('');
const pwd = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleLogin = () => {
  if (pwd.value.length < 4) {
    alert('口令长度需大于4位');
    return;
  }
  auth.login(user.value || '值班员');
  router.push({ name: 'dashboard' });
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 10% 20%, rgba(86, 204, 242, 0.25), transparent 25%),
    radial-gradient(circle at 90% 30%, rgba(39, 174, 96, 0.25), transparent 25%),
    var(--bg);
  padding: 20px;
}

.login-card {
  width: min(480px, 100%);
}

.logo {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-form label {
  font-weight: 600;
}

.login-form input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d9e3f0;
  background: #f8fbff;
}
</style>
