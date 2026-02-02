<template>
  <div class="login-card">
    <div class="login-header">
      <div class="login-logo">AI</div>
      <div>
        <h2>教学场景自适应优化推荐系统</h2>
        <p>多模态诊断 · 教学策略迭代 · 效果反馈</p>
      </div>
    </div>
    <div class="login-form">
      <label>
        学校/机构
        <input v-model="form.org" placeholder="请输入机构名称" />
      </label>
      <label>
        教师账号
        <input v-model="form.user" placeholder="请输入账号" />
      </label>
      <label>
        密码
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </label>
      <label>
        教学场景
        <select v-model="form.scene">
          <option value="智慧教室">智慧教室</option>
          <option value="混合教学">混合教学</option>
          <option value="远程互动">远程互动</option>
        </select>
      </label>
    </div>
    <div class="login-actions">
      <button class="primary-btn" @click="login">登录并进入主界面</button>
      <button class="ghost-btn" @click="openModal">查看登录提示</button>
    </div>
    <ModalDialog v-if="modal.open" :title="modal.title" @close="closeModal">
      <div class="modal-body">
        <p>{{ modal.message }}</p>
        <div class="progress">
          <span :style="{ width: modal.progress + '%' }"></span>
        </div>
        <p class="tag">安全连接 {{ modal.progress }}%</p>
      </div>
      <template #actions>
        <button class="secondary-btn" @click="closeModal">知道了</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import ModalDialog from "../components/ModalDialog.vue";

const router = useRouter();

const form = reactive({
  org: "未来学堂",
  user: "teacher01",
  password: "",
  scene: "智慧教室"
});

const modal = reactive({
  open: false,
  title: "登录安全提示",
  message: "系统将验证设备与课堂环境配置，确保多模态数据采集稳定。",
  progress: 68
});

const login = () => {
  router.push("/data");
};

const openModal = () => {
  modal.open = true;
  modal.progress = 82;
};

const closeModal = () => {
  modal.open = false;
};
</script>

<style scoped>
.login-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 24px 50px rgba(15, 36, 65, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-header {
  display: flex;
  gap: 14px;
  align-items: center;
}

.login-logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4f7cff, #67d1ff);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
}

.login-header h2 {
  margin: 0;
  font-size: 20px;
}

.login-header p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.login-form {
  display: grid;
  gap: 14px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  color: #1f2a44;
}

.login-form input,
.login-form select {
  border: 1px solid #d6e0f5;
  border-radius: 12px;
  padding: 10px 12px;
  background: #f8faff;
}

.login-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
