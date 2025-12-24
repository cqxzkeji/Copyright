<template>
  <div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 20%,#e6f4ff,#ffffff);">
    <div style="background:#fff;border-radius:18px;padding:26px;width:min(480px,92vw);box-shadow:0 16px 42px rgba(23,81,153,0.12);">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
        <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#50c0ff,#7ae0ff);display:flex;align-items:center;justify-content:center;color:#0c2c44;font-weight:800;">农</div>
        <div>
          <div style="font-size:22px;font-weight:800;color:#103454;">农村电商数字化运营中心</div>
          <div class="muted-text">登录后进入模块化运营桌面</div>
        </div>
      </div>
      <div class="notice" style="margin-bottom:14px;">若无账号可直接试用，系统会自动分配访客权限。</div>
      <form @submit.prevent="handleLogin" style="display:grid;gap:14px;">
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="输入手机号或工号" required />
        </div>
        <div>
          <label>口令</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <input v-model="form.remember" type="checkbox" id="remember" style="width:auto;margin:0;" />
          <label for="remember">7天内自动登录</label>
        </div>
        <button type="submit">登录并进入运营驾驶舱</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: '', password: '', remember: false });

const handleLogin = () => {
  router.push('/app/dashboard');
};
</script>
