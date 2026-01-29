<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="login-header">
        <div>
          <p class="login-tag">ChemVision 教学平台</p>
          <h1>官能团-药物活性结构性质可视化教学平台</h1>
          <p class="login-subtitle">
            通过官能团分析、活性预测与分子模拟，构建完整的药物设计学习路径。
          </p>
        </div>
        <img :src="heroImage" alt="分子结构示意图" class="login-hero" />
      </div>

      <form class="login-form" @submit.prevent="openLoginModal">
        <div class="form-grid">
          <label class="form-field">
            学号 / 工号
            <input v-model="form.account" required placeholder="请输入账号" />
          </label>
          <label class="form-field">
            学习角色
            <select v-model="form.role">
              <option>学生</option>
              <option>教师</option>
              <option>研究人员</option>
            </select>
          </label>
          <label class="form-field">
            研究主题
            <input v-model="form.topic" required placeholder="如：抗肿瘤分子设计" />
          </label>
          <label class="form-field">
            实验批次
            <input v-model="form.batch" required placeholder="如：2024-教学-03" />
          </label>
        </div>
        <div class="login-actions">
          <button class="btn" type="submit">进入平台</button>
          <button class="btn secondary" type="button" @click="openTipModal">登录提示</button>
        </div>
      </form>
    </div>

    <BaseModal :show="showLoginModal" title="登录确认" @close="showLoginModal = false">
      <p>
        请确认以下信息，系统将为你加载对应的教学模块与药物案例。
      </p>
      <div class="summary-grid">
        <div>
          <span>账号</span>
          <strong>{{ form.account }}</strong>
        </div>
        <div>
          <span>角色</span>
          <strong>{{ form.role }}</strong>
        </div>
        <div>
          <span>研究主题</span>
          <strong>{{ form.topic }}</strong>
        </div>
        <div>
          <span>实验批次</span>
          <strong>{{ form.batch }}</strong>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="showLoginModal = false">返回修改</button>
        <button class="btn" type="button" @click="handleLogin">进入主界面</button>
      </div>
    </BaseModal>

    <BaseModal :show="showTipModal" title="登录提示信息" @close="showTipModal = false">
      <ul class="tip-list">
        <li>建议使用教学邮箱或实验室账号登录，便于同步学习进度。</li>
        <li>登录后可在主界面左侧切换五大功能模块。</li>
        <li>所有操作结果将生成教学记录，可用于课程汇报。</li>
      </ul>
      <div class="modal-actions">
        <button class="btn" type="button" @click="showTipModal = false">我知道了</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();

const heroImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260" fill="none">
      <rect width="420" height="260" rx="24" fill="#EEF3FF"/>
      <circle cx="130" cy="130" r="56" fill="#2F5BFF" opacity="0.2"/>
      <circle cx="250" cy="110" r="70" fill="#54B8FF" opacity="0.3"/>
      <path d="M80 170C120 120 200 110 250 80C280 60 340 70 360 120" stroke="#2F5BFF" stroke-width="6" stroke-linecap="round"/>
      <circle cx="90" cy="170" r="10" fill="#2F5BFF"/>
      <circle cx="180" cy="125" r="8" fill="#2F5BFF"/>
      <circle cx="260" cy="95" r="8" fill="#2F5BFF"/>
      <circle cx="350" cy="120" r="10" fill="#2F5BFF"/>
    </svg>`
  );

const form = reactive({
  account: '',
  role: '学生',
  topic: '',
  batch: ''
});

const showLoginModal = ref(false);
const showTipModal = ref(false);

const openLoginModal = () => {
  showLoginModal.value = true;
};

const openTipModal = () => {
  showTipModal.value = true;
};

const handleLogin = () => {
  showLoginModal.value = false;
  router.push('/app/functional-groups');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-card {
  max-width: 980px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.login-header {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  align-items: center;
}

.login-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef3ff;
  color: #2f5bff;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #5f6c8a;
  line-height: 1.6;
}

.login-hero {
  width: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.summary-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 20px 0;
  background: #f8f9fd;
  border-radius: 12px;
  padding: 16px;
}

.summary-grid span {
  display: block;
  font-size: 12px;
  color: #7b879d;
}

.summary-grid strong {
  font-size: 14px;
  color: #1f2a44;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.tip-list {
  padding-left: 20px;
  color: #4c5a78;
  line-height: 1.8;
}
</style>
