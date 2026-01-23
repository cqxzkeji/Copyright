<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">CA</div>
        <div>
          <h2>竣工验收与移交流程管控</h2>
          <p>登录后进入总览看板与模块管理</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openModal">
        <label class="field">
          <span>账号</span>
          <input v-model="form.account" class="input" placeholder="请输入账号" required />
        </label>
        <label class="field">
          <span>密码</span>
          <input v-model="form.password" class="input" placeholder="请输入密码" type="password" required />
        </label>
        <label class="field">
          <span>项目</span>
          <select v-model="form.project" class="select">
            <option>天际湾商住综合体</option>
            <option>云启中心复合社区</option>
            <option>海韵广场二期</option>
          </select>
        </label>
        <button class="btn primary" type="submit">登录进入</button>
      </form>
      <div class="login-tip">
        <span class="tag">提示</span>
        <p>登录后可查看各专业验收计划、问题整改与移交证书。</p>
      </div>
    </div>
    <BaseModal
      :open="modalOpen"
      title="登录确认"
      subtitle="提示信息弹窗"
      @close="modalOpen = false"
    >
      <p>确认以 <strong>{{ form.account }}</strong> 登录 {{ form.project }}？</p>
      <template #footer>
        <button class="btn ghost" type="button" @click="modalOpen = false">返回修改</button>
        <button class="btn primary" type="button" @click="handleLogin">确认登录</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const form = reactive({
  account: "project_admin",
  password: "",
  project: "天际湾商住综合体"
});
const modalOpen = ref(false);

const openModal = () => {
  modalOpen.value = true;
};

const handleLogin = () => {
  modalOpen.value = false;
  router.push("/dashboard");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe, #f8fafc);
  padding: 40px 20px;
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(148, 163, 184, 0.3);
  display: grid;
  gap: 20px;
}

.login-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, #38bdf8, #3b82f6);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

.login-header h2 {
  font-size: 18px;
}

.login-header p {
  color: #64748b;
  margin-top: 6px;
  font-size: 13px;
}

.login-form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.login-tip {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 13px;
  color: #475569;
}
</style>
