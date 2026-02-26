<template>
  <main class="login">
    <section class="card panel">
      <h1>跨境贸易市场监测与风险评估平台</h1>
      <p>请输入账号后进入业务主界面。</p>
      <div class="form-grid">
        <input v-model="form.user" placeholder="用户名" />
        <input v-model="form.pass" type="password" placeholder="密码" />
      </div>
      <button @click="login">登录</button>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ user: '', pass: '' });

const login = () => {
  if (!form.user || !form.pass) return alert('请输入完整账号密码');
  sessionStorage.setItem('trade-auth', form.user);
  router.push('/dashboard');
};
</script>

<style scoped>
.login { min-height: 100vh; display: grid; place-items: center; padding: 16px; background: linear-gradient(160deg, #e7f2ff, #f6f9ff); }
.panel { width: min(680px, 100%); padding: 24px; display: grid; gap: 14px; }
h1 { margin: 0; color: #235cb7; }
</style>
