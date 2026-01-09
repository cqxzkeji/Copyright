<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">橡胶制品维护管理助手</div>
      <p class="subtitle">欢迎登录，管理全生命周期维护数据</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="field">
          <span>账号</span>
          <input v-model="form.account" type="text" placeholder="请输入账号" />
        </label>
        <label class="field">
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label class="field">
          <span>站点</span>
          <select v-model="form.site">
            <option value="">请选择站点</option>
            <option value="华东基地">华东基地</option>
            <option value="华南基地">华南基地</option>
            <option value="西南基地">西南基地</option>
          </select>
        </label>
        <button class="primary" type="submit">进入系统</button>
      </form>
      <div class="login-tips">
        <div>
          <strong>今日提醒：</strong>3项巡检计划待执行，2项备件低库存。
        </div>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button class="primary" @click="closeModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  account: "",
  password: "",
  site: ""
});

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  redirect: false
});

const handleLogin = () => {
  if (!form.account || !form.password || !form.site) {
    modal.title = "登录信息未完善";
    modal.message = "请填写账号、密码并选择站点后再登录。";
    modal.visible = true;
    modal.redirect = false;
    return;
  }
  modal.title = "登录成功";
  modal.message = `欢迎 ${form.account} ，当前站点：${form.site}`;
  modal.visible = true;
  modal.redirect = true;
};

const closeModal = () => {
  modal.visible = false;
  if (modal.redirect) {
    router.push("/main/ledger");
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(135deg, #eef5ff, #fefefe);
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(36, 72, 119, 0.15);
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #1e3a8a;
}

.subtitle {
  margin: 12px 0 24px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #1f2937;
}

.field input,
.field select {
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.primary {
  height: 44px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.login-tips {
  margin-top: 20px;
  padding: 12px 16px;
  background: #eff6ff;
  border-radius: 12px;
  color: #1e40af;
  font-size: 13px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 30;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(360px, 100%);
  text-align: center;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.modal h3 {
  margin-top: 0;
  color: #1f2937;
}

.modal p {
  color: #475569;
}
</style>
