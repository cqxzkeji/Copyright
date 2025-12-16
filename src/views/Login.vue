<template>
  <div style="min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at 30% 20%, #e0edff, #ffffff 45%); padding: 20px;">
    <div class="card" style="width: min(420px, 100%);">
      <h2 style="margin: 0 0 6px;">自适应安全治理系统登录</h2>
      <p style="margin: 0 0 18px; color: #6b7280;">请使用安全管理员账号登录</p>
      <form class="grid" style="gap: 12px;" @submit.prevent="login">
        <div>
          <label>用户名</label>
          <input v-model="form.username" required placeholder="admin" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" required placeholder="••••••" />
        </div>
        <button class="btn primary" type="submit" style="width: 100%;">登录</button>
      </form>
      <div style="margin-top: 12px; color: #6b7280; font-size: 14px;">默认体验账号：admin / admin123</div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'admin', password: 'admin123' });

const login = () => {
  if (form.username && form.password) {
    localStorage.setItem('asg-auth', JSON.stringify({ user: form.username, ts: Date.now() }));
    router.push('/data-ingest');
  }
};
</script>
