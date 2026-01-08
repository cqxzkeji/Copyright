<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">优特钢</div>
        <div>
          <h1>销售定制化标准设计与执行平台</h1>
          <p>统一入口 · 客户需求到生产执行全流程管理</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入工号/手机号" required />
        </label>
        <label>
          密码
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>销售经理</option>
            <option>产品工程师</option>
            <option>生产调度</option>
            <option>管理层</option>
          </select>
        </label>
        <div class="login-actions">
          <button type="button" class="ghost" @click="openHelpModal">
            使用指引
          </button>
          <button type="submit" class="primary">登录系统</button>
        </div>
      </form>
    </div>

    <BaseModal
      :show="loginModal"
      title="登录确认"
      width="520px"
      @close="loginModal = false"
    >
      <div class="modal-grid">
        <div>
          <p>欢迎，{{ form.account }}。</p>
          <p>已选择角色：{{ form.role }}</p>
          <div class="progress">
            <div class="bar" />
          </div>
          <small>系统正在加载个性化配置，请稍候...</small>
        </div>
      </div>
      <template #footer>
        <button class="secondary" @click="loginModal = false">返回修改</button>
        <button class="primary" @click="enterDashboard">进入系统</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="helpModal"
      title="使用指引"
      width="520px"
      @close="helpModal = false"
    >
      <ul class="tips">
        <li>按模块完成客户需求、产品配置、报价订单、生产执行与数据分析。</li>
        <li>所有按钮均通过弹窗提交或确认，避免误操作。</li>
        <li>支持亮色自适应布局，可在模块内查看图表与明细表。</li>
      </ul>
      <template #footer>
        <button class="primary" @click="helpModal = false">我已了解</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const loginModal = ref(false);
const helpModal = ref(false);
const form = reactive({
  account: "SA-8801",
  password: "******",
  role: "销售经理",
});

const openLoginModal = () => {
  loginModal.value = true;
};

const openHelpModal = () => {
  helpModal.value = true;
};

const enterDashboard = () => {
  loginModal.value = false;
  router.push("/dashboard");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(135deg, #f0f5ff, #f9fbff);
}

.login-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  max-width: 640px;
  width: 100%;
  box-shadow: 0 24px 60px rgba(18, 38, 63, 0.15);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logo {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: linear-gradient(135deg, #7aa8ff, #b8ccff);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #4b5d8f;
  font-size: 14px;
}

input,
select {
  border: 1px solid #e1e8ff;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.login-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.ghost,
.primary,
.secondary {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eef2ff;
  color: #3c4c7b;
}

.primary {
  background: #3b6af7;
  color: #ffffff;
}

.secondary {
  background: #eef2ff;
  color: #3c4c7b;
}

.progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #eff4ff;
  margin: 14px 0 8px;
  overflow: hidden;
}

.bar {
  width: 75%;
  height: 100%;
  background: linear-gradient(90deg, #6fa0ff, #99bbff);
}

.tips {
  padding-left: 18px;
  color: #4b5d8f;
  display: grid;
  gap: 8px;
}
</style>
