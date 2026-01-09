<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>存量用地评估与更新决策支持系统</h1>
        <p>统一入口 · 多源数据治理 · 更新决策可解释</p>
      </div>
      <div class="login-form">
        <label>
          账号
          <input v-model="form.account" class="input" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" class="input" placeholder="请输入密码" />
        </label>
        <label>
          登录角色
          <select v-model="form.role" class="select">
            <option>规划管理</option>
            <option>数据专员</option>
            <option>评估分析</option>
            <option>决策审批</option>
          </select>
        </label>
        <div class="login-actions">
          <button class="btn btn-outline" @click="openHelp">登录说明</button>
          <button class="btn btn-primary" @click="openLogin">进入系统</button>
        </div>
      </div>
    </div>
    <div class="login-side">
      <div class="side-card">
        <h3>系统能力亮点</h3>
        <ul>
          <li>集成土地权属、规划属性、面积结构、利用现状等多源数据。</li>
          <li>支持价值评估、潜力分级与更新优先级排序。</li>
          <li>方案模拟对比经济、社会、空间影响。</li>
        </ul>
      </div>
      <div class="side-card">
        <h3>最新动态</h3>
        <p>已接入 32 个更新单元、18 个专题数据库、6 类评估模型。</p>
        <div class="tag">系统稳定运行 128 天</div>
      </div>
    </div>
    <BaseModal v-model="helpVisible" title="登录说明">
      <p>默认账号为 data-admin，密码为 123456。首次登录需完善角色与单位信息。</p>
      <p>系统支持单点登录，统一身份认证后自动载入数据权限。</p>
    </BaseModal>
    <BaseModal v-model="loginVisible" title="登录确认" @confirm="submitLogin">
      <p>将以 <strong>{{ form.role }}</strong> 角色进入系统，是否继续？</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const helpVisible = ref(false);
const loginVisible = ref(false);

const form = reactive({
  account: 'data-admin',
  password: '123456',
  role: '规划管理'
});

const openHelp = () => {
  helpVisible.value = true;
};

const openLogin = () => {
  loginVisible.value = true;
};

const submitLogin = () => {
  loginVisible.value = false;
  router.push('/app/overview');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 1.1fr) minmax(280px, 0.9fr);
  gap: 32px;
  padding: 48px;
  background: linear-gradient(135deg, #f5f9ff, #eef2ff);
}

.login-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-header h1 {
  margin: 0 0 10px;
  font-size: 26px;
}

.login-header p {
  margin: 0;
  color: var(--muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
}

.login-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.login-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-card {
  background: rgba(255, 255, 255, 0.86);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.side-card h3 {
  margin-top: 0;
}

.side-card ul {
  padding-left: 18px;
  margin: 0;
  color: var(--muted);
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}
</style>
