<template>
  <div class="login-container">
    <div class="login-header">
      <h2>工程物联网数据采集系统</h2>
      <span class="badge">安全接入</span>
    </div>
    <p>请输入账户信息登陆平台。登陆后可进入各功能模块。</p>
    <form class="login-form" @submit.prevent="login">
      <div class="input-group">
        <label>用户名</label>
        <input v-model="form.username" required placeholder="请输入用户名" />
      </div>
      <div class="input-group">
        <label>密码</label>
        <input type="password" v-model="form.password" required placeholder="请输入密码" />
      </div>
      <div class="form-actions">
        <label class="small-text">默认使用演示账户自动通过。</label>
        <button type="submit">登陆</button>
      </div>
    </form>
    <div v-if="alert" class="alert" style="margin-top: 12px;">{{ alert }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const alert = ref('');

const login = () => {
  alert.value = '登陆校验通过，正在跳转到主界面...';
  localStorage.setItem('iot-token', 'demo-token');
  setTimeout(() => router.push('/collection'), 500);
};
</script>
