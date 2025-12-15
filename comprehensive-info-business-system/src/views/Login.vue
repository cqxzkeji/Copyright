<template>
  <div class="login-shell">
    <div class="login-card card">
      <div class="badge">综合信息服务与业务管理系统</div>
      <h1 style="margin: 12px 0 6px 0;">统一身份登录</h1>
      <p class="subtext">请输入凭证后进入主界面。演示环境无需真实验证。</p>
      <form class="grid" style="gap: 14px; margin-top: 14px;" @submit.prevent="handleLogin">
        <div>
          <label class="label" for="username">用户名</label>
          <input id="username" v-model="username" class="input" placeholder="如：data.admin" required />
        </div>
        <div>
          <label class="label" for="password">密码</label>
          <input id="password" v-model="password" class="input" type="password" placeholder="******" required />
        </div>
        <div class="flex-between" style="gap: 10px;">
          <label class="subtext"><input type="checkbox" v-model="remember" /> 记住设备</label>
          <button class="primary-btn" type="submit">进入系统</button>
        </div>
      </form>
      <div class="quick-tips">
        <div>
          <p class="section-title" style="margin: 0;">智能提示</p>
          <p class="subtext">支持扫码和单点入口，首次访问建议重置密码。</p>
        </div>
        <button class="ghost-btn" @click="showTips = true">查看说明</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showTips" title="登录说明" description="为了保护数据安全，我们启用了多因素验证。">
    <ol class="subtext" style="line-height: 1.7;">
      <li>演示账号默认拥有只读权限。</li>
      <li>连续失败三次将触发设备校验。</li>
      <li>如需开通接口调用权限，请联系管理员。</li>
    </ol>
    <div style="text-align: right; margin-top: 10px;">
      <button class="primary-btn" @click="showTips = false">知道了</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const remember = ref(true);
const showTips = ref(false);

function handleLogin() {
  router.push('/dashboard');
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 30%),
    radial-gradient(circle at 80% 0%, #a5f3fc, transparent 25%),
    #f8fafc;
  padding: 20px;
}

.login-card {
  width: min(480px, 96vw);
  border-radius: 20px;
}

.quick-tips {
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
