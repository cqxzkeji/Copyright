<template>
  <main class="login-page">
    <section class="card">
      <h1>Mgoshort 短视频内容展示与播放平台</h1>
      <p>请输入账号信息登录后进入主界面。</p>
      <form @submit.prevent="login">
        <label>
          用户名
          <input v-model="form.username" required placeholder="admin" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" required placeholder="••••••" />
        </label>
        <button type="submit">登录</button>
      </form>
    </section>

    <ModalDialog :visible="modal.visible" :title="modal.title" @close="modal.visible = false">
      <p>{{ modal.content }}</p>
    </ModalDialog>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const modal = reactive({ visible: false, title: '', content: '' })

const login = () => {
  if (form.username.length < 3 || form.password.length < 3) {
    modal.title = '登录失败'
    modal.content = '用户名和密码长度至少为 3 位。'
    modal.visible = true
    return
  }
  localStorage.setItem('mgoshort-auth', 'true')
  modal.title = '登录成功'
  modal.content = `欢迎你，${form.username}。即将跳转到主界面。`
  modal.visible = true
  setTimeout(() => {
    modal.visible = false
    router.push('/main/upload')
  }, 700)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(120deg, #eaf2ff, #f4f8ff 42%, #f8fbff);
  padding: 18px;
}

.card {
  width: min(460px, 100%);
  border-radius: 18px;
  background: #fff;
  padding: 26px;
  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.14);
}

h1 {
  margin: 0;
  font-size: 24px;
  color: #1e3a8a;
}

p {
  color: #64748b;
}

form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 14px;
}

input {
  border: 1px solid #c8d5f0;
  border-radius: 10px;
  padding: 10px 12px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 11px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}
</style>
