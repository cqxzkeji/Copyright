<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">维护管理助手</div>
      <nav class="menu">
        <RouterLink to="/main/ledger" class="menu-item" :class="{ active: route.name === 'ledger' }">制品台账</RouterLink>
        <RouterLink to="/main/maintenance" class="menu-item" :class="{ active: route.name === 'maintenance' }">巡检维护</RouterLink>
        <RouterLink to="/main/alert" class="menu-item" :class="{ active: route.name === 'alert' }">异常预警</RouterLink>
        <RouterLink to="/main/inventory" class="menu-item" :class="{ active: route.name === 'inventory' }">库存备件</RouterLink>
        <RouterLink to="/main/analysis" class="menu-item" :class="{ active: route.name === 'analysis' }">统计分析</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="ghost" @click="openLogout">退出登录</button>
      </div>
    </aside>
    <section class="content">
      <header class="topbar">
        <div class="breadcrumb">首页 / 业务面板</div>
        <div class="topbar-actions">
          <input class="search" placeholder="搜索制品、工单、备件" />
          <button class="primary" @click="openNotice">提醒中心</button>
        </div>
      </header>
      <div class="content-body">
        <RouterView />
      </div>
    </section>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <div class="modal-actions">
          <button class="ghost" @click="closeModal">取消</button>
          <button class="primary" @click="confirmModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  action: ""
});

const openLogout = () => {
  modal.title = "退出登录";
  modal.message = "确认要退出当前账号吗？";
  modal.action = "logout";
  modal.visible = true;
};

const openNotice = () => {
  modal.title = "提醒中心";
  modal.message = "今日共有 5 条提醒待处理，请进入各模块查看详情。";
  modal.action = "notice";
  modal.visible = true;
};

const closeModal = () => {
  modal.visible = false;
};

const confirmModal = () => {
  modal.visible = false;
  if (modal.action === "logout") {
    router.push("/login");
  }
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f8fb;
}

.sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  font-weight: 700;
  color: #1d4ed8;
  font-size: 18px;
}

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 10px;
  color: #475569;
  font-size: 14px;
  background: transparent;
}

.menu-item.active,
.menu-item:hover {
  background: #e0eaff;
  color: #1d4ed8;
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
}

.breadcrumb {
  font-size: 14px;
  color: #64748b;
}

.topbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  min-width: 180px;
}

.primary {
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
}

.ghost {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  color: #1e3a8a;
  padding: 0 16px;
  cursor: pointer;
}

.content-body {
  padding: 24px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 40;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(380px, 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.modal h3 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .sidebar {
    width: 180px;
  }

  .content-body {
    padding: 16px;
  }
}

@media (max-width: 720px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }

  .menu {
    display: flex;
    gap: 6px;
  }

  .sidebar-footer {
    margin-left: auto;
  }
}
</style>
