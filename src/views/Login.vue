<template>
  <div class="login-page">
    <div class="login-card">
      <div class="title">片区更新改造过程监测与评估系统</div>
      <p class="subtitle">统一入口 · 数据权威 · 决策支撑</p>
      <form @submit.prevent="openConfirm">
        <label>用户名</label>
        <input v-model="form.username" placeholder="请输入用户名" required />
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" required />
        <button type="submit">登录</button>
      </form>
    </div>

    <div v-if="showModal" class="modal-mask">
      <div class="modal">
        <h3>登录确认</h3>
        <p>确认以 {{ form.username || '访客' }} 身份进入系统吗？</p>
        <div class="actions">
          <button class="ghost" @click="showModal = false">取消</button>
          <button @click="login">进入系统</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showModal = ref(false);

const openConfirm = () => {
  showModal.value = true;
};

const login = () => {
  showModal.value = false;
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f4ff 0%, #f8faff 40%, #e1ecff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.login-card {
  width: 420px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 70px rgba(41, 120, 255, 0.15);
  padding: 32px 36px;
  text-align: center;
}

.title {
  font-weight: 700;
  font-size: 22px;
  color: #1f2937;
}

.subtitle {
  margin: 6px 0 20px;
  color: #5b6b7a;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

label {
  text-align: left;
  font-size: 13px;
  color: #4b5563;
}

input {
  padding: 12px;
  border: 1px solid #d8e2f2;
  border-radius: 10px;
  outline: none;
  transition: border 0.2s;
}

input:focus {
  border-color: #3b82f6;
}

button {
  margin-top: 8px;
  padding: 12px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.25);
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 22px 24px;
  width: 360px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
}

.modal h3 {
  margin: 0 0 8px;
}

.modal p {
  margin: 0 0 18px;
  color: #4b5563;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ghost {
  background: #e5edff;
  color: #3157c3;
}
</style>
