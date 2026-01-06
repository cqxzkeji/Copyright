<template>
  <div style="display:grid;place-items:center;min-height:100vh;background:linear-gradient(120deg,#e3f2ff,#fef9f5)">
    <div class="card" style="width:min(420px,94vw);text-align:center">
      <h2>优特钢定制销售标准流程管理系统</h2>
      <p style="color:#5c6b7a">统一登录以进入标准化销售流程</p>
      <form @submit.prevent="login">
        <div class="form-row">
          <div>
            <label>账号</label>
            <input class="input" v-model="username" placeholder="sales.lead" required />
          </div>
          <div>
            <label>密码</label>
            <input class="input" type="password" v-model="password" placeholder="••••••" required />
          </div>
        </div>
        <button class="btn" style="width:100%">立即登录</button>
      </form>
      <div style="margin-top:12px;font-size:12px;color:#6b7c8c">
        支持客户、技术、报价、生产、分析五大模块的统一协同
      </div>
      <ModalDialog v-if="showHint" title="登录提示" @close="showHint=false" @confirm="showHint=false">
        <p>示例账号无需验证，点击确认直接进入系统。</p>
        <div class="progress-bar" style="margin-top:10px"><div :style="{ width: '86%' }"></div></div>
      </ModalDialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const showHint = ref(true);

const login = () => {
  localStorage.setItem('steel_token', 'demo');
  router.push('/app/overview');
};
</script>
