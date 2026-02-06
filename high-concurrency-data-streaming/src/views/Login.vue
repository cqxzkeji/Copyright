<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="brand-mark">H</div>
        <div>
          <h1>高并发实时数据流处理与分析系统</h1>
          <p>统一接入 · 实时处理 · 智能分析</p>
        </div>
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
          项目空间
          <select v-model="form.workspace">
            <option>城市运行中心</option>
            <option>工业物联平台</option>
            <option>网络安全态势</option>
          </select>
        </label>
        <button type="submit">登录进入主界面</button>
      </form>
      <div class="tips">
        <span>建议使用专线网络接入</span>
        <span>当前并发容量：12.8M/s</span>
      </div>
    </div>
  </div>

  <Modal v-model="showLoginModal" title="登录确认" @confirm="confirmLogin">
    <p class="modal-text">账号校验完成，即将进入主界面。</p>
  </Modal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const showLoginModal = ref(false);
const form = reactive({
  account: '',
  password: '',
  workspace: '城市运行中心'
});

const handleLogin = () => {
  showLoginModal.value = true;
};

const confirmLogin = () => {
  showLoginModal.value = false;
  router.push('/app/collection');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e0f2fe, #f8fafc 45%, #ede9fe);
  padding: 24px;
}

.login-card {
  width: min(520px, 94vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.brand-mark {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
}

.brand h1 {
  font-size: 18px;
  margin-bottom: 6px;
}

.brand p {
  font-size: 13px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #334155;
}

input,
select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

button {
  margin-top: 8px;
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}

.tips {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.modal-text {
  font-size: 14px;
  color: #475569;
}

@media (max-width: 520px) {
  .tips {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
