<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>区块链农地抵押贷款平台</h1>
      <p class="sub">请使用监管账号登录，进入主控制台</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>
          账号
          <input v-model="username" placeholder="监管员账号" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </label>
        <button type="submit">进入系统</button>
      </form>
      <div v-if="modal.visible" class="modal-mask" @click="modal.visible = false">
        <div class="modal" @click.stop>
          <h3>提示</h3>
          <p>{{ modal.message }}</p>
          <button @click="confirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = inject('store');
const username = ref('');
const password = ref('');
const modal = reactive({ visible: false, message: '' });

function handleLogin() {
  if (username.value && password.value) {
    modal.visible = true;
    modal.message = `欢迎 ${username.value}，将跳转到主控制台`;
  }
}

function confirm() {
  modal.visible = false;
  router.push('/main');
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-card {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(13, 38, 76, 0.1);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-card h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #14213d;
}

.sub {
  margin: 0;
  color: #6c7a89;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #415a77;
  gap: 0.4rem;
}

input {
  border: 1px solid #dce3f0;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
}

button {
  padding: 0.9rem 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(120deg, #2ec4b6, #0b7fab);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: min(360px, 90vw);
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
