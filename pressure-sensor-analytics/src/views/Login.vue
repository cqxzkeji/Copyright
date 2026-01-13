<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">PSA</div>
        <div>
          <h1>压力传感数据采集与智能分析系统</h1>
          <p>设备接入、实时监控、智能分析一体化平台</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          验证方式
          <select v-model="form.method">
            <option value="password">密码登录</option>
            <option value="otp">动态口令</option>
            <option value="cert">证书登录</option>
          </select>
        </label>
        <button class="primary" type="submit">登录</button>
      </form>
      <div class="actions">
        <button class="ghost" type="button" @click="openFormModal">申请访问</button>
        <button class="ghost" type="button" @click="openInfoModal">查看平台公告</button>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button class="icon" type="button" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'form'" class="modal-form" @submit.prevent="submitAccess">
            <label>
              申请人姓名
              <input v-model="accessForm.name" type="text" required />
            </label>
            <label>
              组织/单位
              <input v-model="accessForm.org" type="text" required />
            </label>
            <label>
              申请说明
              <textarea v-model="accessForm.note" rows="3" required></textarea>
            </label>
            <button class="primary" type="submit">提交申请</button>
          </form>
          <div v-else-if="modal.type === 'progress'" class="progress-body">
            <p>{{ modal.message }}</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${loginProgress}%` }"></div>
            </div>
            <p class="progress-tip">正在校验身份与权限，请稍候...</p>
          </div>
          <div v-else class="info-body">
            <p>{{ modal.message }}</p>
            <ul>
              <li>支持 MQTT/Modbus/HTTP 接入</li>
              <li>异常报警闭环管理与趋势预测</li>
              <li>报表导出与审计追溯</li>
            </ul>
            <button class="primary" type="button" @click="closeModal">我已了解</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loginProgress = ref(0);
const timer = ref(null);
const form = reactive({
  username: "admin",
  password: "",
  method: "password"
});

const modal = reactive({
  visible: false,
  type: "info",
  title: "",
  message: ""
});

const accessForm = reactive({
  name: "",
  org: "",
  note: ""
});

const openModal = (type, title, message = "") => {
  modal.visible = true;
  modal.type = type;
  modal.title = title;
  modal.message = message;
};

const closeModal = () => {
  modal.visible = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const handleLogin = () => {
  openModal("progress", "登录中", "系统正在验证账号信息");
  loginProgress.value = 0;
  timer.value = setInterval(() => {
    if (loginProgress.value >= 100) {
      clearInterval(timer.value);
      timer.value = null;
      closeModal();
      router.push("/main/device");
    } else {
      loginProgress.value += 12;
    }
  }, 180);
};

const openFormModal = () => {
  openModal("form", "申请访问");
};

const openInfoModal = () => {
  openModal("info", "平台公告", "新一代压力监测平台已上线，支持多协议接入与智能分析。");
};

const submitAccess = () => {
  openModal("info", "申请已提交", `已为 ${accessForm.name} 建立访问申请，我们将尽快审核。`);
  accessForm.name = "";
  accessForm.org = "";
  accessForm.note = "";
};

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7ff, #eef2ff 45%, #ffffff);
}

.login-card {
  width: min(480px, 90vw);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
}

h1 {
  font-size: 20px;
  margin: 0 0 4px;
}

p {
  margin: 0;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

input,
select,
textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #f8fafc;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #f1f5ff;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(500px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.icon {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  margin-top: 12px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  height: 100%;
  transition: width 0.2s ease;
}

.progress-tip {
  color: #64748b;
  margin-top: 12px;
  font-size: 13px;
}

.info-body ul {
  padding-left: 18px;
}
</style>
