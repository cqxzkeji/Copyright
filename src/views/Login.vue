<template>
  <div class="login-page">
    <div class="login-card">
      <h1>消防设备管理平台登录</h1>
      <p>请输入账号信息进入运行监控与维护管理系统。</p>
      <form class="form-grid" @submit.prevent="handleLogin">
        <div>
          <label>账号</label>
          <input v-model="form.username" placeholder="请输入账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div>
          <label>登录角色</label>
          <select v-model="form.role">
            <option>系统管理员</option>
            <option>消防维保员</option>
            <option>运行值班员</option>
          </select>
        </div>
        <button class="btn" type="submit">登录进入</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  role: '系统管理员'
});

const handleLogin = () => {
  localStorage.setItem('fire-platform-auth', 'true');
  router.push('/dashboard');
};
</script>
