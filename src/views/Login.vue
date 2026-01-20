<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">FV</div>
        <div>
          <h1>果蔬栽培环境监测与智能调控平台</h1>
          <p>数据驱动的精细化种植与智能管理</p>
        </div>
      </div>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          园区
          <select v-model="form.farm">
            <option value="东区示范基地">东区示范基地</option>
            <option value="西区种植大棚">西区种植大棚</option>
            <option value="智能温室中心">智能温室中心</option>
          </select>
        </label>
        <div class="actions">
          <button class="btn" type="submit">登录进入</button>
          <button class="btn secondary" type="button" @click="openModal('notice')">
            平台公告
          </button>
        </div>
      </form>
      <div class="tips">
        <span>登录后可查看实时环境、智能调控与预警信息。</span>
      </div>
    </div>
    <div v-if="modal" class="modal-mask" @click.self="closeModal">
      <div class="modal">
        <header>
          <h3>平台公告</h3>
          <button class="btn ghost" @click="closeModal">关闭</button>
        </header>
        <p>欢迎使用果蔬栽培环境监测与智能调控平台，当前版本支持多园区数据汇聚与设备联动。</p>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">我知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const modal = ref(false);

const form = reactive({
  username: "admin",
  password: "123456",
  farm: "东区示范基地"
});

const handleLogin = () => {
  router.push("/main/monitor");
};

const openModal = () => {
  modal.value = true;
};

const closeModal = () => {
  modal.value = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f3ff, #f7f7ff);
  padding: 24px;
}

.login-card {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  width: min(460px, 100%);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

h1 {
  font-size: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tips {
  font-size: 13px;
  color: var(--muted);
}
</style>
