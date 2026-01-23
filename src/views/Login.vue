<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>智慧建筑验收资料数字化归档平台</h1>
        <p>统一管理项目档案与验收资料，实时掌控归档进度。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          <span>账号</span>
          <input v-model="form.username" placeholder="请输入管理员账号" required />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          <span>角色</span>
          <select v-model="form.role">
            <option>项目管理员</option>
            <option>监理工程师</option>
            <option>施工单位</option>
          </select>
        </label>
        <button class="btn" type="submit">登录进入系统</button>
      </form>
      <div class="login-stats">
        <div>
          <div class="stat-value">32</div>
          <div class="stat-label">在建项目</div>
        </div>
        <div>
          <div class="stat-value">286</div>
          <div class="stat-label">待验收分项</div>
        </div>
        <div>
          <div class="stat-value">98%</div>
          <div class="stat-label">资料归档率</div>
        </div>
      </div>
    </div>
  </div>
  <AppModal :open="modalOpen" title="登录确认" @close="modalOpen = false" @confirm="confirmLogin">
    <div class="notice">
      系统检测到当前账号为 {{ form.role }}，是否进入主界面？
    </div>
  </AppModal>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AppModal from "../components/AppModal.vue";

const router = useRouter();
const modalOpen = ref(false);
const form = reactive({
  username: "admin",
  password: "",
  role: "项目管理员"
});

const handleLogin = () => {
  modalOpen.value = true;
};

const confirmLogin = () => {
  modalOpen.value = false;
  router.push("/app");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 20px;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 55%);
}

.login-card {
  width: min(520px, 92vw);
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
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
  margin: 24px 0;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #334155;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.login-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}
</style>
