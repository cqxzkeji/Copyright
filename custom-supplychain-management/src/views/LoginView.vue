<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">SCM</div>
        <div>
          <h1>定制化供应链运营管理系统</h1>
          <p>统一管理供应商、库存、订单与物流。</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label>
          登录角色
          <select v-model="form.role">
            <option value="运营经理">运营经理</option>
            <option value="采购主管">采购主管</option>
            <option value="仓储主管">仓储主管</option>
            <option value="数据分析师">数据分析师</option>
          </select>
        </label>
        <button class="primary" type="submit">登录进入系统</button>
      </form>
      <div class="login-footer">
        <div class="tip">
          <strong>提示：</strong>登录后可在左侧导航切换模块，支持实时数据查看与操作。
        </div>
        <button class="ghost" type="button" @click="openGuide">
          查看登录须知
        </button>
      </div>
    </div>
  </div>

  <ModalBase :open="showGuide" title="登录须知" @close="showGuide = false">
    <ul class="guide-list">
      <li>确保账号与密码填写完整，系统会自动加载默认演示数据。</li>
      <li>登录成功后可访问五大功能模块及仪表盘。</li>
      <li>操作按钮均支持弹窗表单与进度反馈。</li>
    </ul>
    <template #footer>
      <button class="primary" @click="showGuide = false">我已了解</button>
    </template>
  </ModalBase>

  <ModalBase :open="showError" title="登录提醒" @close="showError = false">
    <p>{{ errorMessage }}</p>
    <template #footer>
      <button class="primary" @click="showError = false">返回填写</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ModalBase from "../components/ModalBase.vue";

const router = useRouter();
const showGuide = ref(false);
const showError = ref(false);
const errorMessage = ref("请完整填写账号与密码。");
const form = reactive({
  username: "",
  password: "",
  role: "运营经理"
});

const openGuide = () => {
  showGuide.value = true;
};

const handleLogin = () => {
  if (!form.username || !form.password) {
    errorMessage.value = "请完整填写账号与密码后再登录。";
    showError.value = true;
    return;
  }
  localStorage.setItem("scm-auth", "true");
  localStorage.setItem("scm-role", form.role);
  localStorage.setItem("scm-user", form.username);
  router.push("/app/suppliers");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(135deg, #eef5ff, #f7fbff);
}

.login-card {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #2f6bff;
  color: #ffffff;
  font-weight: 700;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.login-header h1 {
  margin: 0;
  font-size: 22px;
}

.login-header p {
  margin: 6px 0 0;
  color: #5b6475;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #3b4556;
  font-weight: 500;
}

input,
select {
  border-radius: 10px;
  border: 1px solid #d7e0ef;
  padding: 10px 12px;
  font-size: 14px;
}

.primary {
  background: #2f6bff;
  border: none;
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.tip {
  font-size: 13px;
  color: #6b7384;
}

.ghost {
  border: 1px solid #d7e0ef;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.guide-list {
  margin: 0;
  padding-left: 20px;
  color: #4b5563;
  line-height: 1.6;
}
</style>
