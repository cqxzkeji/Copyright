<template>
  <div class="login">
    <div class="login__card">
      <div class="login__badge">优特钢系统</div>
      <h1>销售需求分析与标准定制生成系统</h1>
      <p>请输入账号密码登录后进入主界面。</p>
      <form class="login__form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="username" type="text" placeholder="sales.manager" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="••••••" required />
        </label>
        <button class="btn btn--primary" type="submit">登录</button>
      </form>
      <div class="login__hint">
        <span>提示：内网账号已同步ERP权限</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = () => {
  if (username.value && password.value) {
    router.push('/dashboard/customer');
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: radial-gradient(circle at top, #e0ecff 0%, #f5f7fb 42%, #eef2ff 100%);
}

.login__card {
  width: min(440px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 25px 45px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login__badge {
  align-self: flex-start;
  background: #eef2ff;
  color: var(--primary);
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.login__card h1 {
  font-size: 22px;
  line-height: 1.3;
}

.login__card p {
  color: var(--muted);
  font-size: 14px;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

input {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

.btn {
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
}

.btn--primary {
  background: var(--primary);
  color: #fff;
}

.login__hint {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
}
</style>
