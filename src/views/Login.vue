<template>
  <div class="login">
    <div class="login-card">
      <h1>课堂教学质量实时诊断系统</h1>
      <p>基于 LSTM 与注意力机制的课堂质量诊断平台</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          教师账号
          <input v-model="form.account" placeholder="请输入教师账号" required />
        </label>
        <label>
          登录密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          教室编号
          <select v-model="form.room">
            <option>智慧教室 A-301</option>
            <option>智慧教室 B-204</option>
            <option>混合课堂 C-109</option>
          </select>
        </label>
        <button class="primary-btn" type="submit">登录并进入主界面</button>
      </form>
      <div class="login-actions">
        <button class="secondary-btn" @click="helpModal = true">登录帮助</button>
        <button class="secondary-btn" @click="noticeModal = true">平台公告</button>
      </div>
    </div>

    <div v-if="helpModal" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>登录帮助</h3>
        <p>请使用教师工号登录，系统将自动加载本节课的多模态采集数据。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="helpModal = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="noticeModal" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>平台公告</h3>
        <p>系统当前处于试运行阶段，请确保教室设备正常联网。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="noticeModal = false">知道了</button>
        </div>
      </div>
    </div>

    <div v-if="progressModal" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>正在加载课堂模型</h3>
        <p>系统正在同步课堂数据与模型配置，请稍候进入主界面。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="progressModal = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const helpModal = ref(false);
const noticeModal = ref(false);
const progressModal = ref(false);
const progress = ref(30);
const form = ref({
  account: '',
  password: '',
  room: '智慧教室 A-301'
});

const handleLogin = () => {
  progressModal.value = true;
  progress.value = 30;
  const interval = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      clearInterval(interval);
      progressModal.value = false;
      router.push('/dashboard');
    }
  }, 300);
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #eaf0ff, #f5f7fb 40%, #fdfcff 100%);
  padding: 24px;
}

.login-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  width: min(90vw, 480px);
  box-shadow: 0 20px 40px rgba(17, 45, 78, 0.15);
  display: grid;
  gap: 16px;
}

.login-card h1 {
  font-size: 22px;
}

.login-card p {
  font-size: 13px;
  color: #6b7280;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-form label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  display: grid;
  gap: 6px;
}

.login-form input,
.login-form select {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #f9fafb;
}

.login-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
