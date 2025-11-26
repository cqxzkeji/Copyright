<template>
  <div class="login-shell">
    <div class="login-card card">
      <div class="welcome">拆除重建地块规划模拟与控制系统</div>
      <p class="muted">请登录以继续操作与监控。</p>
      <form @submit.prevent="submit">
        <label>账号</label>
        <input v-model="form.username" required placeholder="请输入用户名" />
        <label>密码</label>
        <input v-model="form.password" type="password" required placeholder="请输入密码" />
        <button class="btn btn-primary" type="submit">进入主界面</button>
      </form>
    </div>
    <div class="hero">
      <div class="badge">实时监控 & 设计联动</div>
      <h1>快速模拟决策，精准控制施工进度</h1>
      <p>以亮色化的信息面板展示数据，流程自适应各类终端。</p>
      <div class="illustration">
        <div class="bar" v-for="n in 5" :key="n" :style="{ height: `${40 + n * 10}px` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const form = reactive({ username: 'planner', password: '123456' });
const router = useRouter();
const submit = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
  padding: 40px;
}

.login-card {
  border: 1px solid rgba(45, 123, 255, 0.14);
}

.welcome {
  font-size: 20px;
  font-weight: 700;
}

.muted {
  color: var(--muted);
}

form {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

label {
  font-weight: 600;
  color: #111827;
}

input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(45, 123, 255, 0.3);
  background: #fff;
}

.hero {
  background: linear-gradient(135deg, rgba(45, 123, 255, 0.12), rgba(79, 225, 185, 0.18));
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
}

.badge {
  width: fit-content;
  padding: 6px 12px;
  background: rgba(255, 179, 71, 0.16);
  border-radius: 12px;
  color: #c05621;
  font-weight: 700;
}

h1 {
  margin: 0;
}

.illustration {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.bar {
  flex: 1;
  background: linear-gradient(120deg, #2d7bff, #4fe1b9);
  border-radius: 10px 10px 4px 4px;
  box-shadow: 0 10px 30px rgba(45, 123, 255, 0.4);
}

@media (max-width: 600px) {
  .login-shell {
    padding: 20px;
  }
}
</style>
