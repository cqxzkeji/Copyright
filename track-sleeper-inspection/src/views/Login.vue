<template>
  <div class="login-page">
    <div class="login-card app-card">
      <div class="brand">
        <div class="logo">TS</div>
        <div>
          <h1>轨道轨枕状态感知与图像检测软件</h1>
          <p>统一入口 · 权限与设备接入管理</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label class="form-field">
          工号/账号
          <input v-model="form.username" placeholder="请输入账号" />
        </label>
        <label class="form-field">
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label class="form-field">
          登录角色
          <select v-model="form.role">
            <option>巡检管理员</option>
            <option>设备维护员</option>
            <option>质检审核员</option>
          </select>
        </label>
        <div class="login-actions">
          <button class="secondary-btn" type="button" @click="openHintModal">
            登录说明
          </button>
          <button class="primary-btn" type="submit">登录</button>
        </div>
      </form>
    </div>

    <Modal
      v-if="showLoginModal"
      title="登录确认"
      :on-close="closeLoginModal"
      :on-confirm="confirmLogin"
    >
      <p>将以 <strong>{{ form.role }}</strong> 身份进入主界面。</p>
      <div class="form-grid" style="margin-top: 12px">
        <label class="form-field">
          登录站点
          <select v-model="form.site">
            <option>华北中心</option>
            <option>华东枢纽</option>
            <option>西南检测站</option>
          </select>
        </label>
        <label class="form-field">
          安全密钥
          <input v-model="form.token" placeholder="请输入一次性密钥" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showHintModal"
      title="登录说明"
      :on-close="closeHintModal"
      :on-confirm="closeHintModal"
    >
      <ul class="hint-list">
        <li>支持轨枕检测任务分级权限。</li>
        <li>管理员可查看全线路里程数据。</li>
        <li>请在进入系统后完成设备校准。</li>
      </ul>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";

const router = useRouter();
const showLoginModal = ref(false);
const showHintModal = ref(false);

const form = reactive({
  username: "",
  password: "",
  role: "巡检管理员",
  site: "华北中心",
  token: "",
});

const openLoginModal = () => {
  showLoginModal.value = true;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const confirmLogin = () => {
  showLoginModal.value = false;
  router.push("/main/device");
};

const openHintModal = () => {
  showHintModal.value = true;
};

const closeHintModal = () => {
  showHintModal.value = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: radial-gradient(circle at top, #eaf1ff, #f7f9ff);
}

.login-card {
  max-width: 520px;
  width: 100%;
}

.brand {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.logo {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2f6bff, #6dd3ff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
}

.brand h1 {
  font-size: 20px;
  margin: 0 0 4px;
}

.brand p {
  margin: 0;
  color: #61739c;
  font-size: 13px;
}

.login-form {
  display: grid;
  gap: 14px;
}

.login-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.hint-list {
  margin: 0;
  padding-left: 18px;
  color: #55658a;
  line-height: 1.8;
}
</style>
