<template>
  <div class="login-page">
    <div class="login-card">
      <h2>智能家居营销ERP管理系统</h2>
      <p>统一登录入口，进入后可管理用户、产品、订单、营销与报表。</p>
      <div class="form-grid">
        <div>
          <label>账号</label>
          <input v-model="form.username" type="text" placeholder="输入手机号或邮箱" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入登录密码" />
        </div>
      </div>
      <div class="login-actions">
        <button class="btn" type="button" @click="openLoginModal">登录</button>
        <button class="btn secondary" type="button" @click="openRegisterModal">注册</button>
      </div>
      <button class="btn ghost" type="button" @click="openHelpModal">无法登录？</button>
    </div>
    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.formType === 'register'" class="form-grid">
        <div>
          <label>企业名称</label>
          <input type="text" placeholder="输入企业名称" />
        </div>
        <div>
          <label>联系人</label>
          <input type="text" placeholder="输入联系人" />
        </div>
        <div>
          <label>手机号</label>
          <input type="text" placeholder="输入手机号" />
        </div>
      </div>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="confirmModal">确认</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const form = reactive({
  username: '',
  password: ''
});

const modal = reactive({
  show: false,
  title: '',
  message: '',
  showProgress: false,
  progress: 60,
  formType: '',
  onConfirm: null
});

const openLoginModal = () => {
  modal.show = true;
  modal.title = '登录校验';
  modal.message = `正在验证账号 ${form.username || '访客'} 的权限配置与设备绑定信息。`;
  modal.showProgress = true;
  modal.formType = '';
  modal.onConfirm = () => {
    localStorage.setItem('loggedIn', 'true');
    router.push('/dashboard');
  };
};

const openRegisterModal = () => {
  modal.show = true;
  modal.title = '注册申请';
  modal.message = '填写企业信息后，将由系统自动配置默认角色与权限。';
  modal.showProgress = false;
  modal.formType = 'register';
  modal.onConfirm = null;
};

const openHelpModal = () => {
  modal.show = true;
  modal.title = '登录提示';
  modal.message = '如忘记密码，请联系管理员或通过短信验证码重置。';
  modal.showProgress = false;
  modal.formType = '';
  modal.onConfirm = null;
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  if (modal.onConfirm) {
    modal.onConfirm();
  }
  closeModal();
};
</script>
