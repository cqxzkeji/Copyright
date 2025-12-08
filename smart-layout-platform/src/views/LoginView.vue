<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">✨</div>
        <div>
          <p class="eyebrow">智能传媒 · Bright Mode</p>
          <h1>文化传媒宣传内容智能排版设计平台</h1>
          <p class="subtitle">一次登录，进入融合排版、数据分析与模板管理的统一工作台。</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="login">
        <div class="input-field">
          <label>账号</label>
          <input v-model="form.username" placeholder="输入工作邮箱" required />
        </div>
        <div class="input-field">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </div>
        <div class="form-actions">
          <label class="remember">
            <input v-model="form.remember" type="checkbox" /> 记住设备
          </label>
          <a class="link" href="#" @click.prevent="showInfo = true">使用指引</a>
        </div>
        <button class="primary-btn full" type="submit">立即登录</button>
      </form>
      <p class="footer-note">登录后将自动跳转到主界面并加载全部功能模块。</p>
    </div>
    <BaseModal v-model="showInfo" title="登录提示">
      <p>如为首次登录，可直接输入任意账号密码体验，系统将在后台模拟授权。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showInfo = false">已了解</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = reactive({ username: '', password: '', remember: true });
const showInfo = ref(false);

const login = () => {
  router.push('/app/layout');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.login-card {
  width: min(960px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 15px 60px rgba(15, 23, 42, 0.15);
  display: grid;
  gap: 1.5rem;
}

.brand {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  align-items: center;
}

.brand-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #a5b4fc, #6366f1);
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #fff;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.3);
}

h1 {
  margin: 0.25rem 0;
  color: #0f172a;
}

.eyebrow {
  margin: 0;
  color: #6366f1;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.subtitle {
  margin: 0;
  color: #475569;
}

.login-form {
  display: grid;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #475569;
}

.link {
  color: #6366f1;
  font-weight: 600;
}

.full {
  width: 100%;
  justify-content: center;
}

.remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.footer-note {
  color: #475569;
  margin: 0;
}
</style>
