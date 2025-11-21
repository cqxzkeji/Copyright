<template>
  <div class="login-wrapper">
    <section class="login-card">
      <div class="branding">
        <h1>农业质量溯源管理系统</h1>
        <p>覆盖数据采集、质量监控、供应链与认证全流程的综合管理平台。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input type="password" v-model="form.password" placeholder="请输入密码" />
        </label>
        <div class="actions">
          <button type="submit" class="primary">立即登录</button>
          <button type="button" class="ghost" @click="showHint = true">使用帮助</button>
        </div>
      </form>
    </section>
    <ModalDialog
      :show="errorMessage !== ''"
      title="登录提示"
      :message="errorMessage"
      confirm-text="重新输入"
      @close="errorMessage = ''"
      @confirm="errorMessage = ''"
    />
    <ModalDialog
      :show="showHint"
      title="系统访问说明"
      @close="showHint = false"
      @confirm="showHint = false"
    >
      <p>系统已预置示例账号：<strong>admin / 123456</strong>。输入任意信息亦可体验全部功能。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const errorMessage = ref('');
const showHint = ref(false);

const handleLogin = () => {
  if (!form.username || !form.password) {
    errorMessage.value = '请输入用户名和密码后再尝试登录。';
    return;
  }
  if (form.username !== 'admin' || form.password !== '123456') {
    errorMessage.value = '演示环境建议使用 admin / 123456，或输入任意信息体验。';
    router.push('/dashboard');
    return;
  }
  router.push('/dashboard');
};
</script>

<style scoped>
.login-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: radial-gradient(circle at 20% 20%, #e9f5f1, #f5f7fb);
}

.login-card {
  background: #fff;
  border-radius: 24px;
  padding: 2.5rem;
  width: min(960px, 90vw);
  display: flex;
  gap: 3rem;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.branding {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.branding h1 {
  font-size: 2.2rem;
  margin: 0;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #4b5563;
  gap: 0.3rem;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

.primary {
  background: linear-gradient(135deg, #2ecc71, #1abc9c);
  color: #fff;
}

.ghost {
  background: #ecfdf5;
  color: #10b981;
}

@media (max-width: 960px) {
  .login-card {
    flex-direction: column;
  }
}
</style>
