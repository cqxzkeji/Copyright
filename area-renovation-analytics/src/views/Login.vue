<template>
  <div style="display:flex; justify-content:center; align-items:center; min-height:100vh; padding:20px;">
    <div style="width:100%; max-width:520px; background:#fff; border-radius:20px; padding:28px; box-shadow: var(--shadow);">
      <h2 style="margin:0 0 8px; color: var(--primary);">片区整治项目数据采集与分析平台</h2>
      <p style="margin:0 0 16px; color: var(--muted);">登录后进入五大功能模块</p>
      <form @submit.prevent="handleLogin" style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <div class="label">用户名</div>
          <input v-model="form.username" placeholder="请输入账号" required />
        </div>
        <div>
          <div class="label">密码</div>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div class="flex" style="justify-content: space-between;">
          <label class="flex" style="gap:6px;">
            <input type="checkbox" v-model="remember" style="width:auto;" />
            <span class="label">记住密码</span>
          </label>
          <a class="label" href="javascript:void(0)">忘记密码?</a>
        </div>
        <button class="primary-btn" type="submit">立即登录</button>
      </form>
      <div v-if="toast" style="margin-top:10px; color: var(--primary); font-weight:600;">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const remember = ref(false);
const toast = ref('');
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  toast.value = '登录成功，即将进入平台...';
  setTimeout(() => {
    router.push('/main');
  }, 600);
};
</script>
