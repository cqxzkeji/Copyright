<template>
  <div style="min-height: 100vh; display: grid; place-items: center; padding: 24px;">
    <div class="card" style="width: min(420px, 100%); text-align: center;">
      <h1 style="margin: 0 0 6px; font-size: 26px;">农产品销售与库存管理</h1>
      <p class="tagline">登录后进入主界面使用全部功能模块</p>
      <form @submit.prevent="handleLogin" style="margin-top: 20px; text-align: left;">
        <label for="user">用户名</label>
        <input id="user" v-model="form.user" required class="input" placeholder="输入用户名" />
        <label for="password">密码</label>
        <input id="password" type="password" v-model="form.password" required class="input" placeholder="输入密码" />
        <button class="btn" type="submit" style="width: 100%; margin-top: 12px;">立即登录</button>
      </form>
    </div>
    <ModalDialog v-model="showTip" title="登录提示">
      <p>{{ tip }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ user: '', password: '' });
const showTip = ref(false);
const tip = ref('');

const handleLogin = () => {
  if (!form.user || !form.password) {
    tip.value = '请完整填写用户名和密码';
  } else {
    tip.value = '验证通过，正在跳转主界面…';
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  }
  showTip.value = true;
};
</script>
