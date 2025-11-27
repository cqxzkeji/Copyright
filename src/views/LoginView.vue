<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <div class="hero">
        <div>
          <p class="eyebrow">消防设备运行监控与维护管理平台</p>
          <h1>欢迎回来</h1>
          <p class="muted">登陆后即可进入主界面进行实时监控、保养计划、巡检记录与数据分析。</p>
        </div>
        <img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/firefox.svg" alt="fire" class="hero-icon" />
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-row">
          <label>账号</label>
          <input v-model="form.username" placeholder="请输入账号" required />
        </div>
        <div class="form-row">
          <label>密码</label>
          <input type="password" v-model="form.password" placeholder="请输入密码" required />
        </div>
        <div class="form-row remember">
          <label>
            <input type="checkbox" v-model="form.remember" />
            记住账号
          </label>
          <a href="#" @click.prevent="showReset = true">忘记密码?</a>
        </div>
        <button class="btn" type="submit">登陆</button>
      </form>
    </div>
    <div v-if="showReset" class="modal-backdrop" @click.self="showReset = false">
      <div class="modal">
        <h3>重置密码</h3>
        <p class="muted">提交邮箱后将发送重置链接。</p>
        <div class="form-row">
          <label>邮箱</label>
          <input type="email" placeholder="name@example.com" />
        </div>
        <div style="margin-top:16px; display:flex; gap:10px; justify-content:flex-end;">
          <button class="btn secondary" @click="showReset=false">取消</button>
          <button class="btn" @click="confirmReset">发送邮件</button>
        </div>
      </div>
    </div>
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const form = reactive({ username: '', password: '', remember: false });
const router = useRouter();
const showReset = ref(false);
const toast = ref('');

function handleLogin() {
  toast.value = '登陆成功，正在跳转到主界面…';
  setTimeout(() => {
    router.push('/dashboard');
  }, 600);
}

function confirmReset() {
  toast.value = '已发送重置邮件';
  showReset.value = false;
  setTimeout(() => (toast.value = ''), 2000);
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #e8f4ff, #f6f8fb 40%),
    radial-gradient(circle at 80% 0%, #f9e3ff, #f6f8fb 35%);
  padding: 24px;
}

.login-card {
  width: min(900px, 100%);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 30px;
  align-items: center;
}

.hero {
  background: linear-gradient(135deg, #1e88e5, #7ac4ff);
  color: #fff;
  border-radius: 14px;
  padding: 26px;
  min-height: 280px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
}

.hero-icon {
  width: 120px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; font-size: 12px; opacity: 0.9; }
.muted { color: var(--muted); }

.remember { flex-direction: row; align-items: center; justify-content: space-between; }

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #0f172a;
  color: #fff;
  padding: 12px 14px;
  border-radius: 10px;
  box-shadow: 0 14px 30px rgba(0,0,0,0.15);
}

@media (max-width: 820px) {
  .login-card {
    grid-template-columns: 1fr;
  }
  .hero { grid-template-columns: 1fr; }
}
</style>
