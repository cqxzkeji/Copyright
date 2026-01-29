<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>系统登录</h2>
      <p>请输入账号信息进入非接触式动作识别交互实训系统。</p>
      <div class="form-grid">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label>
          训练中心
          <select v-model="form.center">
            <option value="">请选择训练中心</option>
            <option value="A">A区动捕中心</option>
            <option value="B">B区智能实验室</option>
            <option value="C">C区康复训练馆</option>
          </select>
        </label>
      </div>
      <div class="button-group" style="margin-top: 18px;">
        <button class="primary-button" type="button" @click="openLoginModal">登录</button>
        <button class="secondary-button" type="button" @click="openResetModal">重置</button>
      </div>
    </div>
    <BaseModal
      :open="modal.open"
      :title="modal.title"
      :show-footer="modal.showFooter"
      @close="closeModal"
      @confirm="handleConfirm"
    >
      <div v-if="modal.type === 'login'">
        <p>请确认登录信息，并填写一次性验证码完成验证。</p>
        <div class="form-grid">
          <label>
            验证码
            <input v-model="form.code" placeholder="请输入短信验证码" />
          </label>
          <label>
            安全等级
            <select v-model="form.security">
              <option value="normal">标准模式</option>
              <option value="strict">高敏感模式</option>
            </select>
          </label>
        </div>
        <div style="margin-top: 14px;">
          <div class="progress-track">
            <span :style="{ width: `${progress}%` }"></span>
          </div>
          <small>身份校验进度 {{ progress }}%</small>
        </div>
      </div>
      <div v-else>
        <p>已清空当前输入内容，请重新填写登录信息。</p>
        <div class="progress-track" style="margin-top: 12px;">
          <span style="width: 100%"></span>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const router = useRouter()
const progress = ref(72)

const form = reactive({
  account: '',
  password: '',
  center: '',
  code: '',
  security: 'normal'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'login',
  showFooter: true
})

const openLoginModal = () => {
  modal.open = true
  modal.title = '登录验证'
  modal.type = 'login'
  modal.showFooter = true
  progress.value = 72
}

const openResetModal = () => {
  modal.open = true
  modal.title = '重置提示'
  modal.type = 'reset'
  modal.showFooter = false
  form.account = ''
  form.password = ''
  form.center = ''
}

const closeModal = () => {
  modal.open = false
}

const handleConfirm = () => {
  modal.open = false
  router.push('/main')
}
</script>
