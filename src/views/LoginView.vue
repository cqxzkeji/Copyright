<template>
  <div class="login-page">
    <div class="login-card">
      <h2>系统登录</h2>
      <p>登录后进入新能源汽车综合扫描检测系统主界面。</p>
      <div class="form-grid">
        <div>
          <label>账号</label>
          <input v-model="form.username" type="text" placeholder="输入工号" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" />
        </div>
        <div>
          <label>值班中心</label>
          <select v-model="form.center">
            <option>华东新能源检测中心</option>
            <option>华南电池安全中心</option>
            <option>西南动力系统中心</option>
          </select>
        </div>
      </div>
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <button class="secondary" type="button" @click="showTip = true">忘记密码</button>
        <button class="primary" type="button" @click="login">登录</button>
      </div>
    </div>
  </div>
  <BaseModal v-if="showTip" title="找回密码指引" @close="showTip = false">
    <p>请联系系统管理员或使用工号邮箱进行密码重置，预计 10 分钟内完成验证。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const showTip = ref(false);

const form = reactive({
  username: '',
  password: '',
  center: '华东新能源检测中心'
});

const login = () => {
  if (!form.username || !form.password) {
    showTip.value = true;
    return;
  }
  router.push('/vehicle-diagnosis');
};
</script>
