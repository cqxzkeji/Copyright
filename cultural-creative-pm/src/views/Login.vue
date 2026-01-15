<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">CC</div>
        <div>
          <h1>文化创意项目全流程管理系统</h1>
          <p>登录后进入主界面管理全部模块</p>
        </div>
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label>
          身份
          <select v-model="form.role">
            <option>项目经理</option>
            <option>策划负责人</option>
            <option>运营负责人</option>
            <option>财务监控</option>
          </select>
        </label>
        <div class="actions">
          <button class="primary" type="submit">登录系统</button>
          <button class="ghost" type="button" @click="openTip">登录说明</button>
        </div>
      </form>
      <div class="highlight">
        <div>
          <h3>今日运行概览</h3>
          <p>正在推进 12 个文创项目，已归档案例 186 份。</p>
        </div>
        <div class="meter">
          <span>协同完成度</span>
          <div class="bar">
            <div class="fill" style="width: 72%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal :open="tipOpen" title="登录提示" @close="tipOpen = false" @confirm="tipOpen = false">
    <p>请使用分配的组织账号登录，首次登录将自动初始化个人工作台。</p>
    <p>如忘记密码，可联系管理员重置权限。</p>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";

const router = useRouter();
const tipOpen = ref(false);
const form = ref({
  username: "creative.lead",
  password: "",
  role: "项目经理"
});

const handleLogin = () => {
  router.push("/main");
};

const openTip = () => {
  tipOpen.value = true;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(150deg, #eef4ff, #fef6f1);
}

.login-card {
  width: min(960px, 100%);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
  padding: 32px;
  display: grid;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
  color: #fff;
  font-weight: 700;
  font-size: 20px;
}

h1 {
  margin: 0;
  font-size: 22px;
}

p {
  margin: 6px 0 0;
  color: #6b7280;
}

.form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #dbe2f0;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #f3f4f6;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.highlight {
  background: #f7f9ff;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.highlight h3 {
  margin: 0 0 6px;
}

.meter {
  min-width: 220px;
  display: grid;
  gap: 8px;
  font-size: 14px;
}

.bar {
  height: 10px;
  background: #e5e9f2;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
}
</style>
