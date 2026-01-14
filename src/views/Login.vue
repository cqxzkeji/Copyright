<template>
  <div class="login-page">
    <div class="login-card">
      <div>
        <h1>VR 非遗文化场景再现与展示系统</h1>
        <p>沉浸式数字化非遗体验入口</p>
      </div>
      <form class="login-form" @submit.prevent="onLogin">
        <label>
          账号
          <input v-model="form.account" class="input" placeholder="请输入管理员账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" class="input" placeholder="请输入密码" />
        </label>
        <div class="login-actions">
          <button type="submit" class="primary-btn">登录进入系统</button>
          <button type="button" class="ghost-btn" @click="showHelp = true">登录帮助</button>
        </div>
      </form>
    </div>
    <div class="login-highlight">
      <div class="card">
        <div class="section-title">体验指引</div>
        <ul>
          <li>支持 360° 全景浏览与第一人称漫游。</li>
          <li>非遗资源模型库与工艺流程数字化采集。</li>
          <li>互动学习教学与数据洞察一体化。</li>
        </ul>
      </div>
    </div>
    <BaseModal v-if="showHelp" title="登录提示" @close="showHelp = false" @confirm="showHelp = false">
      <p>演示账号：heritage-admin</p>
      <p>演示密码：demo-2024</p>
      <p>登录后将跳转到主界面并加载功能模块。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const form = ref({
  account: "heritage-admin",
  password: "demo-2024"
});
const showHelp = ref(false);

const onLogin = () => {
  router.push("/app/scene");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  padding: 48px clamp(24px, 6vw, 80px);
  align-items: center;
}

.login-card {
  background: #fff;
  border-radius: 24px;
  padding: 36px;
  display: grid;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.login-card h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.login-card p {
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.login-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.login-highlight ul {
  display: grid;
  gap: 10px;
  padding-left: 18px;
  color: #475569;
}
</style>
