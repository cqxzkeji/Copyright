<template>
  <div class="login">
    <div class="card">
      <div>
        <h1>智能录课数字人助教系统</h1>
        <p>请输入账号密码进入主界面</p>
      </div>
      <form @submit.prevent="submit">
        <label>
          账号
          <input v-model="form.username" required placeholder="admin" />
        </label>
        <label>
          密码
          <input v-model="form.password" required type="password" placeholder="••••••" />
        </label>
        <button type="submit">登陆</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'admin', password: '123456' });

const submit = () => {
  sessionStorage.setItem('loggedIn', 'yes');
  router.push('/dashboard');
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e0ecff 0%, #fdf2f8 100%);
  padding: 20px;
}

.card {
  background: #ffffff;
  padding: 32px;
  width: min(420px, 100%);
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 16px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

p {
  margin: 6px 0 0;
  color: #6b7280;
}

form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-weight: 600;
}

input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 15px;
}

button {
  padding: 12px;
  border: none;
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: transform 0.1s ease;
}

button:hover {
  transform: translateY(-1px);
}
</style>
