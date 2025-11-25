<template>
  <div class="login-page" style="min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #e7f2ff, #f9fbff);">
    <div class="card" style="width: min(420px, 90vw);">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div>
          <h2 style="margin:0;">城市更新项目可行性评估与预警系统</h2>
          <p style="margin:4px 0 0;color:var(--muted);">登录后进入综合工作台</p>
        </div>
        <span class="badge info">亮色主题</span>
      </div>
      <form @submit.prevent="login" style="display:flex;flex-direction:column;gap:14px; margin-top:10px;">
        <div class="form-row">
          <label>账号</label>
          <input v-model="form.username" required placeholder="输入账号" />
        </div>
        <div class="form-row">
          <label>密码</label>
          <input v-model="form.password" type="password" required placeholder="输入密码" />
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <label style="display:flex;align-items:center;gap:8px;color:var(--muted);">
            <input type="checkbox" v-model="remember" style="width:16px;height:16px;" />
            记住配置
          </label>
          <button class="btn" type="submit">进入工作台</button>
        </div>
      </form>
      <div class="chip-row">
        <span class="tag">数据安全校验</span>
        <span class="tag">多模块解耦</span>
        <span class="tag">自适应布局</span>
      </div>
      <div v-if="showDialog" class="overlay" @click.self="showDialog=false">
        <div class="modal">
          <h3>登录成功</h3>
          <p>系统将跳转至主界面并加载模块。</p>
          <div class="progress-bar"><span :style="{ width: '100%' }"></span></div>
          <div style="display:flex;justify-content:flex-end;gap:10px;">
            <button class="btn secondary" @click="showDialog=false">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const remember = ref(true);
const showDialog = ref(false);
const form = reactive({ username: '', password: '' });

const login = () => {
  showDialog.value = true;
  setTimeout(() => {
    showDialog.value = false;
    router.push('/main');
  }, 800);
};
</script>
