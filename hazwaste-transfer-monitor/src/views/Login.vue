<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>危废转运监控系统</h2>
      <p>请使用监管账户登录，进入主界面。</p>
      <form @submit.prevent="handleLogin">
        <div>
          <label>账号</label>
          <input v-model="form.account" required placeholder="监管账号" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" required type="password" placeholder="••••••" />
        </div>
        <div>
          <label>角色</label>
          <select v-model="form.role">
            <option>监管人员</option>
            <option>运输单位</option>
            <option>企业管理员</option>
          </select>
        </div>
        <button class="btn" type="submit">登录并进入系统</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: '',
  password: '',
  role: '监管人员'
});

const handleLogin = () => {
  localStorage.setItem('hazwaste-auth', 'true');
  router.push('/main');
};
</script>
