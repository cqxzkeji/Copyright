<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-hero">
        <h1>汽车安全带连接件成型与打磨调度系统</h1>
        <p>统一工艺、协同调度、质量追溯、数据决策一体化平台</p>
        <div class="hero-metrics">
          <div>
            <strong>8</strong>
            <span>条产线接入</span>
          </div>
          <div>
            <strong>96.4%</strong>
            <span>计划达成率</span>
          </div>
          <div>
            <strong>18</strong>
            <span>设备在线</span>
          </div>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openVerify">
        <h2>用户登录</h2>
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="输入工号或账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入登录密码" required />
        </label>
        <label>
          班组
          <select v-model="form.team">
            <option>冲压一班</option>
            <option>锻造二班</option>
            <option>打磨三班</option>
            <option>质检四班</option>
          </select>
        </label>
        <button class="primary" type="submit">登录系统</button>
        <button class="ghost" type="button" @click="openHelp">权限说明</button>
      </form>
    </div>

    <Modal
      :open="verifyModal"
      title="登录验证"
      confirm-text="进入系统"
      @close="closeVerify"
      @confirm="enterSystem"
    >
      <p>正在校验账号、角色与当班权限，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="muted">验证完成后可进入主界面。</p>
    </Modal>

    <Modal :open="helpModal" title="权限说明" @close="helpModal = false">
      <ul class="help-list">
        <li>调度主管：可生成计划、调整优先级、发布工单。</li>
        <li>工艺工程师：可维护成型工艺、设备参数与配方。</li>
        <li>质检员：可录入检测结果、发起异常分析。</li>
        <li>班组长：可查看任务、确认执行与汇报进度。</li>
      </ul>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const form = reactive({
  account: 'op-1024',
  password: '********',
  team: '冲压一班'
});

const verifyModal = ref(false);
const helpModal = ref(false);
const progress = ref(0);
let timer;

const openVerify = () => {
  verifyModal.value = true;
};

const closeVerify = () => {
  verifyModal.value = false;
  progress.value = 0;
};

const openHelp = () => {
  helpModal.value = true;
};

const enterSystem = () => {
  verifyModal.value = false;
  router.push('/dashboard');
};

watchEffect(() => {
  if (verifyModal.value) {
    progress.value = 0;
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 12, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 200);
  } else if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #fef9ff 50%, #ecfeff 100%);
  padding: 24px;
}

.login-card {
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) minmax(260px, 1fr);
  gap: 32px;
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  width: min(980px, 95vw);
  box-shadow: 0 30px 80px rgba(30, 64, 175, 0.15);
}

.login-hero h1 {
  font-size: 26px;
  margin: 0 0 10px;
}

.login-hero p {
  margin: 0 0 24px;
  color: #475569;
}

.hero-metrics {
  display: flex;
  gap: 20px;
}

.hero-metrics div {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  flex: 1;
}

.hero-metrics strong {
  font-size: 20px;
  display: block;
  color: #1d4ed8;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form h2 {
  margin: 0 0 4px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
}

.ghost {
  background: #e2e8f0;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.2s ease;
}

.muted {
  color: #94a3b8;
  font-size: 12px;
}

.help-list {
  padding-left: 18px;
  color: #475569;
}

@media (max-width: 860px) {
  .login-card {
    grid-template-columns: 1fr;
  }
}
</style>
