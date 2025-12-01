<template>
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(120deg,#f0f7ff,#f8fff4);padding:20px;">
    <div class="card" style="max-width:440px;width:100%;">
      <h2 style="margin-top:0;">车路协同仿真系统登录</h2>
      <p class="kpi-label">登陆后跳转主界面并加载功能模块</p>
      <form @submit.prevent="handleLogin">
        <label>账号</label>
        <input v-model="form.username" placeholder="邮箱或工号" required />
        <label>密码</label>
        <input type="password" v-model="form.password" placeholder="请输入密码" required />
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <label style="display:flex;align-items:center;gap:6px;color:var(--muted);">
            <input type="checkbox" v-model="form.remember" style="width:auto;margin:0;" />
            记住会话
          </label>
          <a href="#" style="color:var(--primary);font-weight:600;">忘记密码?</a>
        </div>
        <button class="button" style="width:100%;margin-top:14px;" type="submit">登录</button>
      </form>
    </div>
  </div>
  <div v-if="showMessage" class="modal-mask">
    <div class="modal">
      <header>
        <h3>提示</h3>
        <button class="button ghost" @click="showMessage = false">关闭</button>
      </header>
      <p>登录成功，正在跳转到主界面加载模块。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      showMessage: false,
      form: {
        username: '',
        password: '',
        remember: true
      }
    };
  },
  methods: {
    handleLogin() {
      this.showMessage = true;
      setTimeout(() => {
        this.$router.push('/');
      }, 600);
    }
  }
};
</script>
