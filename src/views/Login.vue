<template>
  <div style="min-height: 100vh; display: grid; place-items: center; padding: 20px;">
    <div class="card" style="width: min(420px, 92vw);">
      <h2 style="margin: 0 0 6px 0;">农村电商供应与销售管理</h2>
      <p style="color: var(--muted); margin-top: 0;">亮色主题，统一弹窗交互</p>
      <form @submit.prevent="submitLogin">
        <input v-model="form.username" placeholder="账号" required />
        <input v-model="form.password" type="password" placeholder="密码" required />
        <div class="flex" style="justify-content: space-between;">
          <button type="submit">登陆系统</button>
          <button type="button" class="secondary" @click="showHint = true">查看提示</button>
        </div>
      </form>
    </div>
    <ModalDialog v-model="showHint" title="登陆提示">
      <p>任意账号密码均可登陆演示环境。</p>
      <p>登陆后会进入主界面，侧边栏切换各个模块。</p>
      <template #footer>
        <button class="secondary" @click="showHint = false">明白</button>
      </template>
    </ModalDialog>
    <ModalDialog v-model="showWelcome" title="登陆成功">
      <p>正在跳转到主界面...</p>
      <div class="progress-bar">
        <span :style="{ width: loginProgress + '%' }"></span>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showHint = ref(false);
const showWelcome = ref(false);
const loginProgress = ref(10);

const submitLogin = () => {
  showWelcome.value = true;
  loginProgress.value = 10;
  const timer = setInterval(() => {
    if (loginProgress.value >= 100) {
      clearInterval(timer);
      router.push('/main');
    } else {
      loginProgress.value += 30;
    }
  }, 300);
};
</script>
