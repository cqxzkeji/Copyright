<template>
  <div style="display: grid; place-items: center; min-height: 100vh; background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 25%), radial-gradient(circle at 80% 0%, #ede9fe, transparent 20%), var(--bg); padding: 20px;">
    <div class="card" style="padding: 28px; max-width: 420px; width: 100%;">
      <h1 style="font-size: 22px; margin-bottom: 12px;">恶意流量识别与行为分析平台</h1>
      <p style="color: var(--muted); margin-bottom: 20px;">登陆后可进入各独立功能模块。所有操作均通过弹窗反馈。</p>
      <div class="grid" style="gap: 12px;">
        <label class="grid">
          <span class="label">用户名</span>
          <input class="input" v-model="form.username" placeholder="如：analyst" />
        </label>
        <label class="grid">
          <span class="label">密码</span>
          <input class="input" type="password" v-model="form.password" placeholder="请输入密码" />
        </label>
        <button @click="handleLogin">立即登录</button>
        <button style="background: #e2e8f0; color: #0f172a;" @click="showHelper = true">查看接入须知</button>
      </div>
    </div>
  </div>
  <ModalDialog v-model="showHelper" title="接入须知" @confirm="showHelper = false">
    <ul style="color: var(--muted); display: grid; gap: 6px;">
      <li>登录后直接跳转主界面，模块加载到内容窗口。</li>
      <li>所有按钮均带弹窗提示或表单，确保操作清晰。</li>
      <li>系统支持亮色与自适应布局，可在移动端查看。</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showHelper = ref(false);
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (!form.username || !form.password) {
    showHelper.value = true;
    return;
  }
  sessionStorage.setItem('mtas_token', `${form.username}-token`);
  router.push('/');
};
</script>
