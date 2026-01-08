<template>
  <div class="login">
    <div class="login-card">
      <div class="brand">
        <div class="logo">PM2.5</div>
        <div>
          <h1>区域PM2.5污染过程模拟与预报平台</h1>
          <p>多源数据、模拟同化、预报预警与决策评估一体化。</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openModal('登录验证')">
        <label>
          用户名
          <input v-model="form.username" placeholder="请输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>平台管理员</option>
            <option>模拟工程师</option>
            <option>预报分析师</option>
            <option>应急值班员</option>
          </select>
        </label>
        <div class="actions">
          <button class="primary" type="submit">登录</button>
          <button class="ghost" type="button" @click="openModal('访客预览')">访客预览</button>
        </div>
      </form>
      <div class="tips">
        <span>最近登录:</span>
        <span>区域联合会商中心</span>
      </div>
    </div>
  </div>

  <ModalShell
    v-if="activeModal"
    :title="activeModal"
    @close="activeModal = ''"
    @confirm="handleConfirm"
  >
    <div class="modal-section">
      <h4>登录校验表单</h4>
      <div class="modal-grid">
        <label>
          账号
          <input v-model="form.username" />
        </label>
        <label>
          登录节点
          <select>
            <option>区域中心 A</option>
            <option>区域中心 B</option>
            <option>云备份节点</option>
          </select>
        </label>
        <label>
          动态口令
          <input placeholder="请输入动态口令" />
        </label>
        <label>
          验证方式
          <select>
            <option>短信</option>
            <option>邮件</option>
            <option>APP</option>
          </select>
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>验证进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前校验进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>系统将根据角色自动加载功能模块与权限策略。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ModalShell from "../components/ModalShell.vue";

const router = useRouter();
const form = reactive({
  username: "",
  password: "",
  role: "平台管理员",
});

const activeModal = ref("");
const progress = ref(42);

const openModal = (title) => {
  activeModal.value = title;
  progress.value = 32;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 12);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 180);
};

const handleConfirm = () => {
  activeModal.value = "";
  router.push("/main");
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe, #f8fafc 55%, #fef9c3);
  padding: 24px;
}

.login-card {
  width: min(960px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 36px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.15);
  display: grid;
  gap: 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

h1 {
  margin: 0;
  font-size: 26px;
}

p {
  margin: 6px 0 0;
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
  color: #334155;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.actions {
  display: flex;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
}

.ghost {
  background: #fff;
  border: 1px solid #cbd5f5;
  color: #334155;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
}

.tips {
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: #64748b;
}

.modal-section {
  margin-bottom: 20px;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
}

.info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #475569;
}
</style>
