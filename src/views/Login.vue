<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>果蔬订单式采摘预约与销售系统</h1>
        <p>请登录后进入系统主界面</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          登录账号
          <input v-model="form.account" placeholder="请输入账号" />
        </label>
        <label>
          登录密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label>
          身份选择
          <select v-model="form.role">
            <option value="">请选择角色</option>
            <option value="manager">经营负责人</option>
            <option value="planner">采摘调度员</option>
            <option value="sales">销售专员</option>
          </select>
        </label>
        <button type="submit" class="primary">登录进入系统</button>
      </form>
      <div class="login-footer">
        <span>支持订单预约、库存联动、价格管理与数据分析</span>
      </div>
    </div>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <p>{{ modalMessage }}</p>
      <template #footer>
        <button class="ghost" @click="modalVisible = false">取消</button>
        <button class="primary" @click="confirmLogin">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = reactive({
  account: '',
  password: '',
  role: ''
});

const modalVisible = ref(false);
const modalTitle = ref('登录提示');
const modalMessage = ref('');

const handleLogin = () => {
  if (!form.account || !form.password || !form.role) {
    modalTitle.value = '登录信息不完整';
    modalMessage.value = '请补充账号、密码与角色后再登录。';
    modalVisible.value = true;
    return;
  }
  modalTitle.value = '确认登录';
  modalMessage.value = `账号 ${form.account} 将以 ${form.role} 身份登录，是否继续？`;
  modalVisible.value = true;
};

const confirmLogin = () => {
  modalVisible.value = false;
  router.push('/main/order');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #e8f5e9 0%, #f7fbf8 50%, #fff3e0 100%);
}

.login-card {
  width: min(520px, 100%);
  background: var(--card);
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(46, 92, 60, 0.12);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.login-header p {
  margin: 0;
  color: var(--muted);
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
}

.login-form input,
.login-form select {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fdfefe;
}

.primary {
  background: var(--primary);
  border: none;
  color: white;
  padding: 12px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
}

.login-footer {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}
</style>
