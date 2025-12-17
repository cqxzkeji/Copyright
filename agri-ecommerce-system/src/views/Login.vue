<template>
  <div class="login-wrapper">
    <div class="card login-card">
      <div class="flex" style="justify-content: space-between; width: 100%;">
        <div>
          <div class="chip">农产品电商 · 智慧运营</div>
          <h1>欢迎登录</h1>
          <p class="muted">统一门户登录后可管理所有业务模块</p>
        </div>
        <div class="login-graphic hide-mobile">
          <div class="leaf"></div>
          <div class="sun"></div>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <label>账号</label>
          <input v-model="form.username" placeholder="请输入账号" required />
        </div>
        <div class="input-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit" style="width: 100%; margin-top: 10px;">登录平台</button>
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
  router.push('/main');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  max-width: 780px;
  width: 100%;
  display: grid;
  gap: 16px;
}

.login-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px 16px;
}

h1 { margin: 10px 0 4px; }
.p-muted, .muted { color: var(--muted); }

.login-graphic {
  position: relative;
  width: 200px;
  height: 140px;
}

.leaf {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle at 30% 30%, #7be8a1, #4cd964);
  border-radius: 60% 40% 65% 35%;
  transform: rotate(-8deg);
  filter: drop-shadow(0 10px 25px rgba(76, 217, 100, 0.3));
}

.sun {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffd15c, #f59e0b);
  top: 20px;
  right: 0;
  filter: drop-shadow(0 12px 35px rgba(245, 158, 11, 0.35));
}
</style>
