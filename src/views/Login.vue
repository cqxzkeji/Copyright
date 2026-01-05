<template>
  <div class="login-page">
    <div class="login-card card">
      <h1>智能多传感器检测系统</h1>
      <p class="subtitle">统一登录后管理传感器接入、监控、驱动与报告</p>
      <form class="input-row" @submit.prevent="handleSubmit">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="toolbar" style="margin-top:6px;">
          <label style="display:flex;align-items:center;gap:6px;color:var(--muted);">
            <input type="checkbox" v-model="form.remember" /> 记住登录
          </label>
          <span class="chip">多端同步</span>
        </div>
        <button class="btn" type="submit">登录系统</button>
      </form>
    </div>
    <ModalDialog :open="showModal" @close="showModal = false" @confirm="goMain">
      <template #title>
        <h3 style="margin:0;">登录提示</h3>
      </template>
      <p style="margin:0 0 6px;">{{ modalMessage }}</p>
      <p style="color:var(--muted);font-size:13px;">登录后可在主界面切换各功能模块。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '', remember: true });
const showModal = ref(false);
const modalMessage = ref('');

const handleSubmit = () => {
  if (!form.username || !form.password) {
    modalMessage.value = '请输入完整账号信息后再尝试登录。';
  } else {
    modalMessage.value = `${form.username}，已完成身份验证，是否进入主界面？`;
  }
  showModal.value = true;
};

const goMain = () => {
  showModal.value = false;
  router.push('/main/sensors');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: linear-gradient(120deg, #e6f0ff 0%, #ffffff 60%);
}

.login-card {
  width: min(480px, 100%);
}

.subtitle {
  color: var(--muted);
  margin-top: -4px;
}

form {
  margin-top: 20px;
  display: grid;
  gap: 16px;
}
</style>
