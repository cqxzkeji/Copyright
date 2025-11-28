<template>
  <div class="login-page">
    <div class="panel">
      <div>
        <h1>轨道轨枕状态感知平台</h1>
        <p class="sub">登录后进入多模块监测主界面</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-grid">
          <div>
            <label>账号</label>
            <input v-model="form.username" required class="input" placeholder="工程账号" />
          </div>
          <div>
            <label>密码</label>
            <input v-model="form.password" required type="password" class="input" placeholder="请输入密码" />
          </div>
        </div>
        <div class="actions">
          <label class="remember"><input type="checkbox" v-model="form.remember" /> 记住账号</label>
          <button type="submit">进入主界面</button>
        </div>
      </form>
      <div class="pill-row">
        <span class="pill">多传感器联动</span>
        <span class="pill">图像检测</span>
        <span class="pill">风险预警</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'inspect_admin', password: '123456', remember: true });

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
}

.panel {
  width: min(720px, 96vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 50px rgba(79, 155, 255, 0.15);
  display: grid;
  gap: 18px;
}

.sub {
  margin: 6px 0 0 0;
  color: #6b7280;
}

label {
  font-weight: 700;
  color: #1f2937;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.remember {
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  background: #eef5ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}
</style>
