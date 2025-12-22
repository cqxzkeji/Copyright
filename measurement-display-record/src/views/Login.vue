<template>
  <div class="login-page">
    <div class="login-card">
      <h2>智能多参数测量数据显示与记录系统</h2>
      <p>请登录后进入主界面。</p>
      <div class="form-field">
        <label>账号</label>
        <input v-model="form.account" placeholder="请输入账号" />
      </div>
      <div class="form-field">
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </div>
      <div class="form-field">
        <label>角色</label>
        <select v-model="form.role">
          <option value="管理员">管理员</option>
          <option value="工程师">工程师</option>
          <option value="访客">访客</option>
        </select>
      </div>
      <div style="display:flex; gap:12px;">
        <button class="primary-btn" @click="openProgress">登录系统</button>
        <button class="secondary-btn" @click="openTip">登录提示</button>
      </div>
    </div>
  </div>

  <teleport to="body">
    <div v-if="progressVisible" class="modal-backdrop">
      <div class="modal">
        <h3>登录中</h3>
        <p>正在验证账号并加载主界面，请稍候。</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeProgress">取消</button>
        </div>
      </div>
    </div>

    <div v-if="tipVisible" class="modal-backdrop">
      <div class="modal">
        <h3>登录提示</h3>
        <p>请使用授权账号登录，首次登录默认密码为 123456。</p>
        <div class="modal-actions">
          <button class="primary-btn" @click="tipVisible = false">知道了</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: 'admin',
  password: '123456',
  role: '管理员'
});

const progressVisible = ref(false);
const tipVisible = ref(false);
const progress = ref(0);
let timer;

const openProgress = () => {
  progressVisible.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      clearInterval(timer);
      progressVisible.value = false;
      router.push('/app');
    }
  }, 200);
};

const closeProgress = () => {
  clearInterval(timer);
  progressVisible.value = false;
};

const openTip = () => {
  tipVisible.value = true;
};

watch(progressVisible, (visible) => {
  if (!visible) {
    clearInterval(timer);
  }
});
</script>
