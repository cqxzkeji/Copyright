<template>
  <div class="login-page">
    <div class="login-card">
      <h1>农产品直播销售管理软件</h1>
      <p>统一身份认证，安全进入运营平台。</p>
      <div class="form-grid">
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="请输入账号" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <div>
          <label>角色</label>
          <select v-model="form.role">
            <option>运营负责人</option>
            <option>直播管理员</option>
            <option>仓储主管</option>
          </select>
        </div>
      </div>
      <div class="login-actions">
        <button class="button secondary" @click="openNotice">密码说明</button>
        <button class="button" @click="handleLogin">登录系统</button>
      </div>
    </div>
  </div>
  <ModalDialog
    v-if="noticeVisible"
    title="登录提示"
    confirm-text="好的"
    @close="noticeVisible = false"
    @confirm="noticeVisible = false"
  >
    <p>本次演示账号无需真实校验，点击登录即可进入系统。</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const noticeVisible = ref(false)

const form = reactive({
  account: 'admin@agri-live.com',
  password: '••••••••',
  role: '运营负责人'
})

const openNotice = () => {
  noticeVisible.value = true
}

const handleLogin = () => {
  router.push('/dashboard')
}
</script>
