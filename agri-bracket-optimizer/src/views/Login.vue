<template>
  <div class="login-page">
    <div class="login-card">
      <header>
        <h1>农业机械动力支撑架优化软件</h1>
        <p>请登录以进入系统主界面</p>
      </header>
      <form @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" type="text" placeholder="请输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="actions">
          <button type="button" class="ghost" @click="openHelp">登录提示</button>
          <button type="submit">登录系统</button>
        </div>
      </form>
      <div class="meta">
        <span>支持多角色协同设计 · 版本 V1.0</span>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <div v-if="modal.type === 'progress'" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
          <span>{{ modal.progress }}%</span>
        </div>
        <div class="modal-actions">
          <button v-if="modal.type !== 'progress'" @click="closeModal">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  username: "",
  password: ""
});

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "info",
  progress: 0
});

const openHelp = () => {
  modal.visible = true;
  modal.title = "登录提示";
  modal.message = "请使用工程师账号进入系统，登录后可进入五大功能模块进行优化设计。";
  modal.type = "info";
};

const handleLogin = () => {
  modal.visible = true;
  modal.title = "正在验证身份";
  modal.message = `欢迎，${form.username || "工程师"}，系统正在加载资源...`;
  modal.type = "progress";
  modal.progress = 0;

  const timer = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer);
      modal.visible = false;
      router.push("/main");
      return;
    }
    modal.progress += 20;
  }, 200);
};

const closeModal = () => {
  modal.visible = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #f4f8ff, #ffffff);
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 24px;
}

header h1 {
  margin: 0;
  font-size: 20px;
}

header p {
  margin: 8px 0 0;
  color: var(--muted);
}

form {
  display: grid;
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
}

input {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  cursor: pointer;
  background: var(--primary);
  color: white;
  font-weight: 600;
}

button.ghost {
  background: #f1f5ff;
  color: var(--primary);
}

.meta {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 30, 50, 0.35);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 10;
}

.modal {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  width: min(360px, 100%);
  display: grid;
  gap: 12px;
}

.modal h3 {
  margin: 0;
}

.modal p {
  margin: 0;
  color: var(--muted);
}

.progress {
  display: grid;
  gap: 6px;
}

.progress .bar {
  height: 8px;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.2s ease;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
