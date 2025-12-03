<template>
  <div style="min-height:100vh; display:grid; place-items:center; background: linear-gradient(120deg, #eef2ff 0%, #f9fbff 100%);">
    <div class="card" style="width:min(480px, 100%);">
      <div style="text-align:center; margin-bottom:16px;">
        <div style="width:72px;height:72px;border-radius:18px;background:linear-gradient(135deg,var(--primary),var(--accent));display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:800;">UT</div>
        <h2 style="margin:12px 0 4px;">优特钢销售协同中台</h2>
        <p style="color:var(--muted);margin:0;">一键登录，进入多客户定制销售匹配系统</p>
      </div>
      <form @submit.prevent="handleLogin" class="grid" style="gap:12px;">
        <div>
          <label>账号</label>
          <input v-model="form.username" required placeholder="请输入工号或邮箱" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" required placeholder="请输入密码" />
        </div>
        <button class="primary" type="submit">登录</button>
      </form>
    </div>

    <ModalDialog :open="showModal" title="正在登录" @close="showModal = false">
      <p style="margin:0 0 8px;">系统正在校验账号密码并加载个性化模块…</p>
      <div class="progress"><div class="bar" :style="{ width: progress + '%' }"></div></div>
      <p style="color: var(--muted); margin-top: 8px;">完成后将自动进入主界面</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showModal = ref(false);
const progress = ref(0);

const handleLogin = () => {
  showModal.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
      showModal.value = false;
      router.push('/main');
    }
  }, 250);
};
</script>
