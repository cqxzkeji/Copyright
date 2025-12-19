<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-title">农产品直播平台</div>
        <div class="brand-sub">运营管理中枢</div>
      </div>
      <nav class="menu">
        <RouterLink to="/app/live-room">直播销售与互动管理</RouterLink>
        <RouterLink to="/app/products">农产品与商品管理</RouterLink>
        <RouterLink to="/app/content">内容与素材管理</RouterLink>
        <RouterLink to="/app/orders">订单与履约管理</RouterLink>
        <RouterLink to="/app/analytics">数据分析与运营监控</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="welcome">早安，运营经理</div>
          <div class="sub">今日直播排期、商品库存与履约数据已同步</div>
        </div>
        <div class="quick">
          <button class="ghost" @click="openAlert('系统公告已更新')">系统公告</button>
          <button class="primary" @click="openAlert('已启动一键巡检')">一键巡检</button>
        </div>
      </header>
      <section class="module-content">
        <RouterView />
      </section>
    </main>
    <div v-if="alertOpen" class="modal-backdrop">
      <div class="modal">
        <h3>提示信息</h3>
        <p>{{ alertMessage }}</p>
        <button class="primary" @click="alertOpen = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";

const router = useRouter();
const alertOpen = ref(false);
const alertMessage = ref("");

const openAlert = (message) => {
  alertMessage.value = message;
  alertOpen.value = true;
};

const logout = () => {
  router.push("/login");
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e6ecf7;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand-title {
  font-weight: 700;
  font-size: 18px;
}

.brand-sub {
  font-size: 12px;
  color: #7a8bad;
  margin-top: 4px;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu a {
  padding: 10px 14px;
  border-radius: 12px;
  color: #4a5b7c;
  background: #f5f7fb;
}

.menu a.router-link-active {
  background: #e6f0ff;
  color: #2164ff;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(30, 60, 114, 0.08);
}

.welcome {
  font-size: 18px;
  font-weight: 600;
}

.sub {
  margin-top: 4px;
  color: #7a8bad;
  font-size: 13px;
}

.quick {
  display: flex;
  gap: 12px;
  align-items: center;
}

.module-content {
  flex: 1;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

button.primary {
  background: linear-gradient(135deg, #3a7bff, #5ed0ff);
  color: #ffffff;
}

button.ghost {
  background: #f1f5ff;
  color: #35548b;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  width: min(360px, 90%);
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  display: grid;
  gap: 16px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    width: 100%;
  }
}
</style>
