<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="brand">图像识别与特征提取分析平台</div>
      <p class="muted">登录后进入主界面加载所有功能模块</p>
      <div class="form-row">
        <div>
          <label>用户名</label>
          <input v-model="form.user" class="input" placeholder="请输入用户名" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.pass" type="password" class="input" placeholder="请输入密码" />
        </div>
      </div>
      <div class="actions">
        <button class="btn" @click="login">立即登录</button>
        <button class="btn secondary" @click="showTip = true">提示</button>
      </div>
    </div>
    <ModalDialog v-model="showTip" title="登录提示" confirm-text="知道了" @confirm="showTip = false">
      <p>测试账号无需校验，直接点击登录即可跳转主界面。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ user: '', pass: '' });
const showTip = ref(false);

const login = () => {
  router.push({ path: '/home' });
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 25%),
    radial-gradient(circle at 80% 0%, #ffe4e6, transparent 30%),
    #f5f7fb;
}

.login-card {
  max-width: 460px;
  width: 100%;
  padding: 2rem;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.muted {
  color: #6b7280;
  margin-bottom: 1rem;
}

.actions {
  margin-top: 1.25rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

label {
  display: block;
  margin-bottom: 0.35rem;
  color: #475569;
  font-weight: 600;
}
</style>
