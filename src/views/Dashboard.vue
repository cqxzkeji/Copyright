<template>
  <div class="layout">
    <aside>
      <h2>关务合规平台</h2>
      <nav>
        <router-link to="/dashboard/risk">风险监测</router-link>
        <router-link to="/dashboard/check">合规审核</router-link>
        <router-link to="/dashboard/reports">数据报告</router-link>
        <router-link to="/dashboard/guide">操作指南</router-link>
        <router-link to="/dashboard/audit">权限审计</router-link>
      </nav>
      <button @click="logout">退出登录</button>
    </aside>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logout = () => {
  sessionStorage.removeItem('ccs_token');
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px 1fr;
}
aside {
  background: #eaf2ff;
  border-right: 1px solid #d2e3ff;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
nav {
  display: grid;
  gap: 8px;
}
a {
  text-decoration: none;
  color: #355;
  border-radius: 10px;
  padding: 10px;
  background: #f8fbff;
}
a.router-link-active {
  background: linear-gradient(90deg, #4e90ff, #6bc4ff);
  color: #fff;
}
main {
  padding: 16px;
}
button {
  border: none;
  border-radius: 8px;
  background: #fff;
  padding: 10px;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  aside {
    border-right: none;
    border-bottom: 1px solid #d2e3ff;
  }
}
</style>
