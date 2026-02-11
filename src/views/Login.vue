<template>
  <div class="page" style="display:flex;align-items:center;justify-content:center;padding:20px;">
    <div class="card" style="width:min(420px,100%);padding:24px;">
      <h2 style="margin-top:0">异位发酵床监测系统</h2>
      <p style="color:#64748b">请输入账号信息以进入主界面</p>
      <label>账号<input v-model="form.username" placeholder="admin" /></label>
      <label>密码<input v-model="form.password" type="password" placeholder="请输入密码" /></label>
      <button class="btn primary" style="width:100%" @click="openLoginModal">登录</button>
    </div>
    <ModalDialog :visible="showModal" title="登录确认" confirm-text="确认登录" @close="showModal=false" @confirm="doLogin">
      <p>将使用当前账号进入系统：</p>
      <p><strong>{{ form.username || '未填写账号' }}</strong></p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const form = reactive({ username: 'admin', password: '' })
const showModal = ref(false)

const openLoginModal = () => {
  showModal.value = true
}

const doLogin = () => {
  localStorage.setItem('ferment-auth', form.username || 'operator')
  showModal.value = false
  router.push('/dashboard')
}
</script>
