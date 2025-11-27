<template>
  <div class="login-wrap">
    <div class="login-card">
      <div>
        <p class="eyebrow">多功能高精度切割装备控制系统</p>
        <h1>欢迎登陆</h1>
        <p class="muted">输入账号密码后进入主控制界面，系统会校验安全策略。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="field">
          <span>账号</span>
          <input v-model="form.username" placeholder="操作员或管理员账号" required />
        </label>
        <label class="field">
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="actions">
          <button type="button" class="secondary-btn" @click="showHint = true">查看登陆提示</button>
          <button type="submit" class="primary-btn">登陆系统</button>
        </div>
      </form>
    </div>

    <div v-if="showHint" class="modal-backdrop" @click.self="showHint = false">
      <div class="modal-card">
        <h3 style="margin: 0 0 6px;">操作提醒</h3>
        <p style="margin: 0 0 16px;">登陆前请确认切割设备处于安全待命，避免意外启动。</p>
        <button class="primary-btn" @click="showHint = false">知道了</button>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="() => {}">
      <div class="modal-card">
        <h3 style="margin: 0 0 10px;">正在校验凭证</h3>
        <p class="muted">正在核对账号、网络与权限策略，请稍等...</p>
        <div class="progress" style="margin-top: 10px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showHint = ref(false);
const showProgress = ref(false);
const progress = ref(0);

const handleLogin = () => {
  if (!form.username || !form.password) {
    showHint.value = true;
    return;
  }
  showProgress.value = true;
  progress.value = 25;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      router.push('/app');
    } else {
      progress.value += 25;
    }
  }, 320);
};
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #f0f5ff 0, #fff 45%),
    radial-gradient(circle at 80% 10%, #e0f2fe 0, #f5f8fb 40%);
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: min(520px, 95vw);
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 44px rgba(16, 24, 40, 0.12);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.eyebrow {
  margin: 0;
  color: #2f54eb;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 13px;
}

h1 {
  margin: 4px 0;
}

.muted {
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}

.field input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
