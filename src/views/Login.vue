<template>
  <div class="login-page">
    <div class="login-card">
      <div class="title">
        <h1>智能多参数测量系统</h1>
        <p>请登录后进入实时监控平台</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          用户账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          登录密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          值班班次
          <select v-model="form.shift">
            <option>早班</option>
            <option>中班</option>
            <option>晚班</option>
          </select>
        </label>
        <button class="primary-button" type="submit">登录系统</button>
      </form>
      <button class="ghost-button" @click="openIntro">查看功能简介</button>
    </div>

    <Modal :open="introOpen" title="系统功能简介" @close="introOpen = false">
      <ol>
        <li>多参数采集：支持多类型传感器统一接入。</li>
        <li>实时展示：曲线与数值同步刷新。</li>
        <li>历史记录：支持按时间检索与下载。</li>
        <li>异常告警：阈值触发并提醒值班人员。</li>
        <li>系统配置：参数配置与导出管理。</li>
      </ol>
      <div class="modal-actions">
        <button class="primary-button" @click="introOpen = false">开始体验</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";

const router = useRouter();
const introOpen = ref(false);

const form = reactive({
  username: "admin",
  password: "",
  shift: "早班"
});

const handleLogin = () => {
  router.push("/dashboard");
};

const openIntro = () => {
  introOpen.value = true;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eff6ff, #f8fafc 40%, #f0fdf4);
}

.login-card {
  width: min(420px, 90vw);
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
  text-align: center;
}

.title h1 {
  margin: 0;
  font-size: 22px;
}

.title p {
  margin: 8px 0 24px;
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 14px;
  text-align: left;
}

label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.primary-button,
.ghost-button {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

.primary-button {
  background: #2563eb;
  color: #fff;
}

.ghost-button {
  margin-top: 12px;
  background: transparent;
  border-color: #cbd5f5;
  color: #2563eb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>
