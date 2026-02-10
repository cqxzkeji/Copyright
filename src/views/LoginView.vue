<template>
  <div class="login-page">
    <div class="login-card">
      <h1>幸福管家服务流程与客户管理系统</h1>
      <p>请输入账号信息登录系统</p>
      <form @submit.prevent="handleLogin">
        <label>账号</label>
        <input v-model="form.username" placeholder="请输入账号" required />
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" required />
        <button class="btn primary" type="submit">登录</button>
      </form>
    </div>

    <ModalDialog :show="showMsg" title="登录提示" @close="showMsg = false">
      <p>{{ msg }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showMsg = ref(false);
const msg = ref('');

const handleLogin = () => {
  if (form.username.length < 2 || form.password.length < 4) {
    msg.value = '账号至少2位，密码至少4位。';
    showMsg.value = true;
    return;
  }
  localStorage.setItem('hh_logged_in', '1');
  router.push('/main');
};
</script>
