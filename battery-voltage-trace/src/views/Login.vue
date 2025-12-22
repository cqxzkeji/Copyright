<template>
  <div class="login-card">
    <div class="login-header">
      <h1>系统登录</h1>
      <p>统一认证后进入蓄电池电压检测数据溯源平台</p>
    </div>
    <form class="login-form" @submit.prevent="handleLogin">
      <label>
        账号
        <input v-model="form.account" type="text" placeholder="请输入账号" required />
      </label>
      <label>
        密码
        <input v-model="form.password" type="password" placeholder="请输入密码" required />
      </label>
      <label>
        角色选择
        <select v-model="form.role">
          <option>运维管理员</option>
          <option>质检工程师</option>
          <option>数据审计员</option>
        </select>
      </label>
      <button class="primary" type="submit">立即登录</button>
      <div class="helper">
        <span>示例账号：admin</span>
        <span>默认密码：123456</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: '',
  password: '',
  role: '运维管理员'
});

const handleLogin = () => {
  router.push('/device');
};
</script>

<style scoped>
.login-card {
  max-width: 420px;
  margin: 80px auto;
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(31, 42, 68, 0.1);
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.login-header p {
  margin: 0 0 24px;
  color: #6f7b94;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #374562;
}

input,
select {
  border: 1px solid #d9e1f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

.primary {
  border: none;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.helper {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #7d8aa5;
}
</style>
