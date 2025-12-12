<template>
  <div class="login-page">
    <div class="hero"></div>
    <div class="modal-overlay">
      <div class="modal">
        <h2>登录 Mgoshort</h2>
        <p class="muted">输入凭证以进入平台主界面</p>
        <form class="form-grid" @submit.prevent="submitLogin">
          <div>
            <label>邮箱</label>
            <input v-model="form.email" type="email" placeholder="team@mgoshort.com" required />
          </div>
          <div>
            <label>密码</label>
            <input v-model="form.password" type="password" placeholder="••••••" required />
          </div>
          <div class="actions">
            <button class="btn" type="submit">登录</button>
            <button class="btn secondary" type="button" @click="showHint = true">需要帮助</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="showHint" class="modal-overlay" @click.self="showHint = false">
      <div class="modal">
        <h3>登录提示</h3>
        <p>使用任意邮箱和密码即可体验，信息仅用于演示。</p>
        <button class="btn" @click="showHint = false">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showHint = ref(false);
const form = reactive({ email: '', password: '' });

const submitLogin = () => {
  router.push('/videos');
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 70px);
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 35%),
    radial-gradient(circle at 80% 10%, #c7d2fe, transparent 30%),
    radial-gradient(circle at 50% 80%, #d1fae5, transparent 30%);
  position: relative;
}

.hero {
  height: 220px;
  background: url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80')
    center/cover;
  filter: brightness(0.9);
}

.modal h2 {
  margin: 0 0 4px;
}

.muted {
  color: #6b7280;
  margin-bottom: 12px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
