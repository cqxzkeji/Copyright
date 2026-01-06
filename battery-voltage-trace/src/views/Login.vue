<template>
  <div style="min-height: 100vh; display: grid; place-items: center; background: linear-gradient(120deg, #d9e9ff, #f9fbff);">
    <div class="card" style="width: min(460px, 92vw);">
      <h2 style="margin-bottom: 12px;">防摔型蓄电池电压智能追溯分析系统</h2>
      <p style="color: var(--muted); margin-bottom: 16px;">请先登录以进入系统</p>
      <div class="form-row">
        <div>
          <label>账号</label>
          <input v-model="form.username" class="input" placeholder="请输入账号" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" class="input" placeholder="请输入密码" type="password" />
        </div>
      </div>
      <div style="display:flex; justify-content: space-between; align-items: center; margin-top: 12px;">
        <div class="tag"><span class="status-dot" style="background:#23c19a;"></span> 数据链路已连接</div>
        <button class="btn btn-primary" @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const login = () => {
  if (form.username && form.password) {
    localStorage.setItem('bv-auth', '1');
    router.push('/app');
  } else {
    alert('请输入账号和密码');
  }
};
</script>
