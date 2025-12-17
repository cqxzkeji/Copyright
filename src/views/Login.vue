<template>
  <div class="layout" style="place-items: center; background: radial-gradient(circle at 20% 20%, #e0f2fe, #f8fafc 40%);">
    <div class="card" style="width: min(480px, 90vw); padding: 32px; border-radius: 20px;">
      <div class="hero" style="padding: 24px; margin-bottom: 16px;">
        <h1>农产品电商运营与数据分析系统</h1>
        <p>登陆后可查看商品、订单、库存、运营分析与系统配置等模块。</p>
      </div>
      <form class="form-grid" @submit.prevent="handleLogin">
        <label>
          <div class="label">用户名</div>
          <input v-model="form.user" class="input" placeholder="运营管理员" required />
        </label>
        <label>
          <div class="label">密码</div>
          <input v-model="form.pass" class="input" type="password" placeholder="••••••••" required />
        </label>
        <label>
          <div class="label">角色</div>
          <select v-model="form.role" class="input">
            <option>平台管理员</option>
            <option>品类运营</option>
            <option>仓库主管</option>
          </select>
        </label>
      </form>
      <div class="action-bar" style="margin-top: 16px; justify-content: space-between;">
        <span class="badge info dot">多因子登录已启用</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn ghost" type="button" @click="showHelper = true">查看帮助</button>
          <button class="btn primary" type="button" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
    <ModalDialog v-model="showHelper" title="登录提示" @confirm="showHelper = false">
      <p>统一身份认证已对接，测试账户可直接登录。登录后系统会根据角色加载不同的功能模块权限。</p>
      <ul class="list">
        <li><span>支持验证码与短信校验</span><span class="badge success dot">已通过</span></li>
        <li><span>登录会记录设备指纹</span><span class="badge info dot">已启用</span></li>
      </ul>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="正在登录">
      <div class="progress-bar"><div class="fill" :style="{ width: progress + '%' }" /></div>
      <p style="margin-top: 12px; color: var(--muted);">正在校验凭证并加载权限</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ user: '运营管理员', pass: '123456', role: '平台管理员' });
const showHelper = ref(false);
const showProgress = ref(false);
const progress = ref(35);

const handleLogin = () => {
  showProgress.value = true;
  progress.value = 35;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      router.push('/app');
    }
  }, 300);
};
</script>
