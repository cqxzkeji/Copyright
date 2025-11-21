<template>
  <div class="login-page">
    <div class="login-card">
      <h1>住宅地下室及裙楼公区装修验收</h1>
      <p>登陆后统一管理项目、计划、验收、分析与文档</p>
      <form @submit.prevent="handleLogin">
        <div>
          <label>用户名</label>
          <input v-model="form.user" placeholder="例如: 张工" required />
        </div>
        <div>
          <label>口令</label>
          <input v-model="form.password" type="password" placeholder="******" required />
        </div>
        <div class="flex space-between">
          <label class="flex" style="align-items: center; gap: 8px">
            <input type="checkbox" v-model="remember" /> 记住登录
          </label>
          <span class="badge tag-blue">演示账号不限</span>
        </div>
        <button type="submit">登陆系统</button>
      </form>
      <div v-if="toast" class="toast" style="margin-top: 12px">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = inject('auth');
const form = reactive({ user: '', password: '' });
const toast = ref('');
const remember = ref(true);

const handleLogin = () => {
  auth.loggedIn = true;
  auth.user = form.user || '访客用户';
  localStorage.setItem('loggedIn', '1');
  localStorage.setItem('user', auth.user);
  toast.value = '登录成功，正在进入主界面...';
  setTimeout(() => router.push('/project-management'), 400);
  if (!remember.value) {
    setTimeout(() => localStorage.removeItem('loggedIn'), 1000 * 60 * 60);
  }
};
</script>
