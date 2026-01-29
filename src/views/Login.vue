<template>
  <div class="login">
    <div class="login-card">
      <h1>教学档案数字化归档管理系统</h1>
      <p>请使用统一身份登录，进入档案管理主界面。</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入工号/账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>教学管理员</option>
            <option>档案管理员</option>
            <option>院系审核员</option>
          </select>
        </label>
        <button class="primary" type="submit">登录</button>
      </form>
      <div class="login-footer">
        <span>服务状态：运行中</span>
        <span>版本 1.0.0</span>
      </div>
    </div>
    <BaseModal :open="modalOpen" title="登录提示" @close="modalOpen = false">
      <p>欢迎 {{ form.username || '用户' }}，已完成身份校验，即将进入主界面。</p>
      <template #footer>
        <button class="secondary" type="button" @click="modalOpen = false">取消</button>
        <button class="primary" type="button" @click="goDashboard">进入系统</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const modalOpen = ref(false);
const form = reactive({
  username: '',
  password: '',
  role: '教学管理员'
});

const handleLogin = () => {
  modalOpen.value = true;
};

const goDashboard = () => {
  modalOpen.value = false;
  router.push('/dashboard');
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 60%);
}

.login-card {
  width: min(460px, 92vw);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 22px;
  margin: 0;
}

p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #1e293b;
  font-size: 14px;
}

input,
select {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
}

.secondary {
  background: #e2e8f0;
  color: #0f172a;
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 12px;
}
</style>
