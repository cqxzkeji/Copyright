<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="logo">
        <div class="badge">耐久</div>
        <div>
          <strong>连接板测试平台</strong>
          <p>Durability Lab</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/param">连接板参数配置</router-link>
        <router-link to="/dashboard/test">耐久工况设置</router-link>
        <router-link to="/dashboard/monitor">数据采集监测</router-link>
        <router-link to="/dashboard/analysis">寿命与损伤分析</router-link>
        <router-link to="/dashboard/report">结果与报告管理</router-link>
      </nav>
      <div class="sidebar-footer">
        <div>
          <p>当前用户</p>
          <strong>测试工程师</strong>
        </div>
        <button class="ghost" @click="showLogout = true">退出登录</button>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <h2>农业机械连接板耐久性测试系统</h2>
          <span>同步设备状态与试验数据</span>
        </div>
        <div class="status">
          <div>
            <p>今日试验</p>
            <strong>5</strong>
          </div>
          <div>
            <p>在线通道</p>
            <strong>18</strong>
          </div>
          <div>
            <p>报警</p>
            <strong>0</strong>
          </div>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>

    <BaseModal v-if="showLogout" title="退出登录" @close="showLogout = false">
      <p>确认退出系统并返回登录页？</p>
      <div class="modal-actions">
        <button class="ghost" @click="showLogout = false">取消</button>
        <button class="btn primary" @click="handleLogout">确认退出</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const showLogout = ref(false);
const handleLogout = () => {
  router.push("/login");
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #2b77f3;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.logo p {
  color: #7a8ba7;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu a {
  padding: 10px 14px;
  border-radius: 12px;
  color: #3a4a66;
  font-weight: 600;
  background: #f6f8fc;
}

.menu a.router-link-active {
  background: #e0ebff;
  color: #215ad6;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #5a6b86;
}

.ghost {
  border: 1px solid #d2dcf0;
  background: #f9fbff;
  color: #3a4a66;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn.primary {
  background: #2b77f3;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.topbar h2 {
  color: #1c2a4a;
  margin-bottom: 6px;
}

.topbar span {
  color: #6b7c98;
}

.status {
  display: flex;
  gap: 24px;
  background: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.status p {
  font-size: 12px;
  color: #7384a3;
}

.status strong {
  font-size: 20px;
  color: #1c2a4a;
}

.content {
  padding: 0 32px 32px;
  flex: 1;
}

@media (max-width: 980px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .main {
    width: 100%;
  }
}
</style>
