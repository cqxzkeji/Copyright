<template>
  <div class="container" style="max-width: 520px; padding-top: 80px;">
    <div class="card">
      <h2>纤维素纳米膜设计平台登陆</h2>
      <p class="helper-text">登陆后可进入建模、优化、测试、模拟与报告全流程工作台。</p>
      <form class="grid" @submit.prevent="handleLogin">
        <div class="input-row">
          <label>用户名</label>
          <input v-model="form.user" required placeholder="输入科研账号" />
        </div>
        <div class="input-row">
          <label>密码</label>
          <input v-model="form.pass" type="password" required placeholder="输入密码" />
        </div>
        <div class="input-row">
          <label>项目代号</label>
          <input v-model="form.project" placeholder="如 CNM-2024" />
        </div>
        <div class="input-row" style="grid-column: 1 / -1;">
          <button type="submit">登陆平台</button>
        </div>
      </form>
    </div>
    <div v-if="showModal" class="modal-mask">
      <div class="modal-container">
        <h3>登陆成功</h3>
        <p>欢迎进入纤维素纳米膜设计平台，正在为您加载模块。</p>
        <div class="progress">
          <div :style="{ width: progress + '%' }"></div>
        </div>
        <div class="flex" style="margin-top: 16px; justify-content: flex-end;">
          <button @click="proceed">进入工作台</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ user: '科研人员', pass: '', project: 'CNM-2024' });
const showModal = ref(false);
const progress = ref(30);
let timer;

const handleLogin = () => {
  showModal.value = true;
  progress.value = 30;
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
  }, 220);
};

const proceed = () => {
  clearInterval(timer);
  router.push('/app');
};

onMounted(() => {
  timer = undefined;
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
