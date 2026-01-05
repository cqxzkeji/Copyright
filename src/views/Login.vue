<template>
  <div class="login-page">
    <div class="login-card">
      <div class="hero">
        <p class="tag">VR 非遗文化</p>
        <h1>沉浸式传承 · 智能化展示</h1>
        <p class="subtitle">统一采集、场景还原、互动学习、内容发布与数据评估的一体化平台。</p>
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入管理员账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button class="primary" type="submit">登录系统</button>
      </form>
    </div>
    <BaseModal :show="showModal" title="登录进度" width="420px" @close="finalizeLogin">
      <p>正在校验账号与角色权限，请稍候…</p>
      <progress :value="progress" max="100"></progress>
      <p class="progress-text">{{ progress }}% 已完成</p>
      <template #footer>
        <button class="primary" :disabled="progress < 100" @click="finalizeLogin">
          进入主界面
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = reactive({ username: 'heritage-admin', password: '123456' });
const showModal = ref(false);
const progress = ref(10);
let timer;

const handleLogin = () => {
  showModal.value = true;
  progress.value = 10;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 400);
};

const finalizeLogin = () => {
  clearInterval(timer);
  progress.value = 100;
  showModal.value = false;
  router.push('/main/resource');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: linear-gradient(135deg, #e8f1ff, #fff6ea);
}

.login-card {
  width: min(920px, 100%);
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(31, 42, 68, 0.12);
  border: 1px solid #e4ecf5;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.hero h1 {
  margin: 8px 0;
}

.hero .tag {
  display: inline-block;
  padding: 6px 12px;
  background: #e8f9f1;
  color: #2c8a5f;
  border-radius: 999px;
  font-weight: 700;
}

.subtitle {
  color: #4b5671;
}

.form {
  background: #f8fbff;
  padding: 18px;
  border-radius: 12px;
  display: grid;
  gap: 12px;
  border: 1px solid #e4ecf5;
}

label {
  font-weight: 600;
  color: #1f2a44;
  display: grid;
  gap: 6px;
}

.primary {
  background: linear-gradient(120deg, #4f9dff, #7bd8ff);
  color: #0f1c3f;
}

.progress-text {
  font-weight: 600;
  color: #1f2a44;
}
</style>
