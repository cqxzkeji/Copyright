<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>多功能高精度切割装备控制系统</h1>
        <p>统一接入 · 智能编排 · 全程可视 · 数据驱动</p>
      </div>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="操作员编号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          班组
          <select v-model="form.team">
            <option>白班 A 组</option>
            <option>白班 B 组</option>
            <option>夜班 A 组</option>
          </select>
        </label>
        <button class="primary" type="submit">登录系统</button>
      </form>
    </div>

    <Modal :show="showModal" title="身份确认" :onClose="closeModal">
      <div class="modal-grid">
        <div>
          <h4>登录信息确认</h4>
          <p>账号：{{ form.account }}</p>
          <p>班组：{{ form.team }}</p>
        </div>
        <div class="login-status">
          <span>权限校验</span>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <small>系统正在同步操作员权限与设备清单。</small>
        </div>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">返回修改</button>
        <button class="primary" type="button" @click="enterSystem">进入主界面</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const showModal = ref(false);
const progress = ref(25);
const timer = ref(null);
const form = ref({
  account: 'OP-2024-01',
  password: '',
  team: '白班 A 组'
});

const openLoginModal = () => {
  showModal.value = true;
  progress.value = 25;
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(() => {
    progress.value = Math.min(progress.value + 15, 100);
  }, 400);
};

const closeModal = () => {
  showModal.value = false;
  if (timer.value) clearInterval(timer.value);
};

const enterSystem = () => {
  closeModal();
  router.push('/main/device');
};

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: radial-gradient(circle at top, #eef3ff, #f7f9ff 55%, #f5f7fb);
}

.login-card {
  width: min(520px, 100%);
  background: var(--card);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-header h1 {
  font-size: 22px;
  margin-bottom: 8px;
}

.login-header p {
  color: var(--muted);
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
}

input,
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 16px;
}

.modal-grid h4 {
  margin-bottom: 8px;
}

.login-status {
  display: grid;
  gap: 8px;
}

.progress {
  background: #e7eefc;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #12b981);
  transition: width 0.4s ease;
}

.ghost {
  border: 1px solid var(--border);
  background: white;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
