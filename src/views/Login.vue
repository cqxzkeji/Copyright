<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>信息技术咨询与项目管理平台</h1>
        <p>统一门户登录 · 项目全生命周期管理</p>
      </div>
      <form class="login-form" @submit.prevent="openModal('login')">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>项目经理</option>
            <option>咨询顾问</option>
            <option>资源调度</option>
          </select>
        </label>
        <button class="primary" type="submit">登录</button>
        <button class="ghost" type="button" @click="openModal('reset')">忘记密码</button>
      </form>
    </div>

    <BaseModal :open="modalKey === 'login'" title="登录确认" @close="closeModal">
      <div class="modal-content">
        <p>欢迎 {{ form.username }}，系统已完成身份校验。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="hint">加载主界面模块中（{{ progress }}%）</p>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="enterPlatform">进入平台</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'reset'" title="密码找回" @close="closeModal">
      <form class="modal-form">
        <label>
          注册邮箱
          <input v-model="resetForm.email" type="email" placeholder="输入邮箱" />
        </label>
        <label>
          验证码
          <input v-model="resetForm.code" type="text" placeholder="输入验证码" />
        </label>
        <label>
          新密码
          <input v-model="resetForm.newPassword" type="password" placeholder="设置新密码" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">提交找回</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const modalKey = ref("");
const progress = ref(42);
let timer = null;

const form = reactive({
  username: "张珊",
  password: "",
  role: "项目经理"
});

const resetForm = reactive({
  email: "",
  code: "",
  newPassword: ""
});

const openModal = (key) => {
  modalKey.value = key;
};

const closeModal = () => {
  modalKey.value = "";
};

const enterPlatform = () => {
  closeModal();
  router.push("/dashboard");
};

onMounted(() => {
  timer = setInterval(() => {
    progress.value = progress.value >= 100 ? 35 : progress.value + 5;
  }, 900);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: min(480px, 90vw);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.12);
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h1 {
  font-size: 22px;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 14px;
}

.login-form input,
.login-form select {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.primary {
  padding: 12px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
}

.ghost {
  padding: 12px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #334155;
}

.modal-content {
  display: grid;
  gap: 16px;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  transition: width 0.4s ease;
}

.hint {
  color: #64748b;
  font-size: 14px;
}

.modal-form {
  display: grid;
  gap: 14px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.modal-form input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}
</style>
