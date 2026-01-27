<template>
  <div class="login-card">
    <h2>新能源汽车光学扫描分析软件</h2>
    <p>请使用企业账号登录后进入主界面。</p>
    <label>
      账号
      <input v-model="form.username" type="text" placeholder="工程师编号" />
    </label>
    <label>
      密码
      <input v-model="form.password" type="password" placeholder="输入登录密码" />
    </label>
    <button @click="openLoginModal">登录</button>
    <ModalDialog
      v-if="showModal"
      title="登录确认"
      @close="showModal = false"
      @confirm="handleLogin"
    >
      <p>即将进入主控制面板，是否确认使用该账号登录？</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ModalDialog from "../components/ModalDialog.vue";

const router = useRouter();
const showModal = ref(false);
const form = reactive({
  username: "scan.engineer",
  password: ""
});

const openLoginModal = () => {
  showModal.value = true;
};

const handleLogin = () => {
  showModal.value = false;
  router.push("/dashboard");
};
</script>
