<template>
  <div class="container" style="min-height: 100vh; display: grid; place-items: center;">
    <div class="card" style="width: min(420px, 96vw);">
      <div class="flex-between" style="margin-bottom: 16px;">
        <div>
          <p class="tag">冷链运输监控与调度平台</p>
          <h2 style="margin: 8px 0 4px;">欢迎登录</h2>
          <p style="color: var(--muted);">输入账号密码进入主界面</p>
        </div>
        <div class="badge">亮色界面</div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>账号</label>
          <input v-model="form.username" placeholder="调度员/管理员" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" />
        </div>
      </div>
      <div class="form-group" style="margin-top: 10px;">
        <label>角色</label>
        <select v-model="form.role">
          <option value="dispatcher">调度员</option>
          <option value="monitor">监控员</option>
          <option value="admin">管理员</option>
        </select>
      </div>
      <button class="btn" style="width: 100%; margin-top: 16px;" @click="login">进入平台</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'dispatch01', password: '123456', role: 'dispatcher' });

const login = () => {
  router.push('/dashboard/monitor');
};
</script>
