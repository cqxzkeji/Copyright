<template>
  <div class="login-page">
    <div class="login-card">
      <header>
        <h1>优特钢标准制定与销售协同管控平台</h1>
        <p>请使用组织账号登录系统</p>
      </header>
      <form @submit.prevent="openLoginModal">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入工号或邮箱" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label class="row">
          <input type="checkbox" v-model="form.remember" />
          记住登录状态
        </label>
        <button class="primary" type="submit">登录系统</button>
      </form>
      <div class="actions">
        <button class="ghost" type="button" @click="openHelpModal">忘记密码</button>
        <button class="ghost" type="button" @click="openHelpModal">权限申请</button>
      </div>
    </div>
    <Modal :show="loginVisible" title="登录验证" @close="loginVisible = false">
      <p>账号校验通过，是否进入主界面？</p>
      <template #footer>
        <button class="ghost" type="button" @click="loginVisible = false">返回</button>
        <button class="primary" type="button" @click="enterSystem">进入系统</button>
      </template>
    </Modal>
    <Modal :show="helpVisible" title="登录帮助" @close="helpVisible = false">
      <p>请联系企业信息化管理员重置密码或申请模块权限。</p>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const loginVisible = ref(false);
const helpVisible = ref(false);

const form = reactive({
  username: '',
  password: '',
  remember: true
});

const openLoginModal = () => {
  loginVisible.value = true;
};

const enterSystem = () => {
  loginVisible.value = false;
  router.push('/app/dashboard');
};

const openHelpModal = () => {
  helpVisible.value = true;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: linear-gradient(135deg, #eff6ff, #f8fafc);
}

.login-card {
  background: white;
  padding: 32px;
  border-radius: 20px;
  width: min(420px, 100%);
  box-shadow: 0 24px 48px rgba(30, 64, 175, 0.12);
  display: grid;
  gap: 20px;
}

header h1 {
  font-size: 20px;
  margin-bottom: 6px;
}

header p {
  color: #64748b;
  font-size: 14px;
}

form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #334155;
}

input[type='text'],
input[type='password'] {
  padding: 10px 12px;
  border: 1px solid #cbd5f5;
  border-radius: 10px;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
