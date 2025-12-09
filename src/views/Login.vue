<template>
  <div class="login">
    <div class="panel">
      <div class="brand">膨润土磷去除系统</div>
      <p class="subtitle">使用钙基膨润土吸附技术的智慧废水处理控制台</p>
      <form class="form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" required placeholder="管理员账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" required type="password" placeholder="请输入密码" />
        </label>
        <button type="submit">登录</button>
      </form>
      <div class="helper">默认填入任意内容即可登录示例</div>
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
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 10% 10%, #dbeafe, transparent 22%),
    radial-gradient(circle at 90% 20%, #e0f2fe, transparent 20%),
    linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%);
  padding: 24px;
}

.panel {
  width: min(480px, 92vw);
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 12px 50px rgba(15, 23, 42, 0.14);
}

.brand {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.subtitle {
  color: #475569;
  margin: 8px 0 20px;
  line-height: 1.5;
}

.form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  color: #334155;
  font-weight: 600;
}

input {
  border: 1px solid #d6e4ff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
}

button {
  background: linear-gradient(135deg, #5ca3ff, #93c5fd);
  color: #fff;
  border: none;
  padding: 14px 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.35);
}

.helper {
  color: #64748b;
  margin-top: 12px;
  font-size: 13px;
}
</style>
