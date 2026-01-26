<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">SCM</div>
        <div>
          <div class="brand-title">供应链运营</div>
          <div class="brand-subtitle">管理控制台</div>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/app/suppliers" class="menu-item" active-class="active">
          供应商管理
        </RouterLink>
        <RouterLink to="/app/inventory" class="menu-item" active-class="active">
          库存管理
        </RouterLink>
        <RouterLink to="/app/orders" class="menu-item" active-class="active">
          订单管理
        </RouterLink>
        <RouterLink to="/app/logistics" class="menu-item" active-class="active">
          物流管理
        </RouterLink>
        <RouterLink to="/app/analytics" class="menu-item" active-class="active">
          数据分析与报告
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="secondary" @click="openInfo">系统公告</button>
        <button class="danger" @click="openLogout">退出登录</button>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageSubtitle }}</p>
        </div>
        <div class="user-info">
          <div class="avatar">{{ initials }}</div>
          <div>
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
        </div>
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>

  <ModalBase :open="showInfo" title="系统公告" @close="showInfo = false">
    <p>
      运营中心已同步最新供应链风险指数，建议在库存与物流模块中关注预警提示，并及时完成
      审批流程。
    </p>
    <template #footer>
      <button class="primary" @click="showInfo = false">知道了</button>
    </template>
  </ModalBase>

  <ModalBase :open="showLogout" title="确认退出" @close="showLogout = false">
    <p>确定要退出系统吗？退出后将返回登录界面。</p>
    <template #footer>
      <button class="secondary" @click="showLogout = false">取消</button>
      <button class="danger" @click="confirmLogout">确认退出</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ModalBase from "../components/ModalBase.vue";

const route = useRoute();
const router = useRouter();
const showInfo = ref(false);
const showLogout = ref(false);

const userName = computed(() => localStorage.getItem("scm-user") || "运营专员");
const userRole = computed(() => localStorage.getItem("scm-role") || "运营经理");

const pageTitle = computed(() => {
  const mapping = {
    SupplierManagement: "供应商管理",
    InventoryManagement: "库存管理",
    OrderManagement: "订单管理",
    LogisticsManagement: "物流管理",
    DataAnalysis: "数据分析与报告"
  };
  return mapping[route.name] || "供应链运营面板";
});

const pageSubtitle = computed(() => {
  const mapping = {
    SupplierManagement: "评估供应商表现，管理合同与准入流程",
    InventoryManagement: "实时监控库存与仓库调度状态",
    OrderManagement: "覆盖客户、采购与供应商订单全流程",
    LogisticsManagement: "运输调度与配送履约可视化",
    DataAnalysis: "洞察绩效趋势并生成可视化报告"
  };
  return mapping[route.name] || "欢迎进入系统，请选择左侧模块";
});

const initials = computed(() => {
  const name = userName.value;
  return name ? name.slice(0, 1) : "U";
});

const openInfo = () => {
  showInfo.value = true;
};

const openLogout = () => {
  showLogout.value = true;
};

const confirmLogout = () => {
  localStorage.removeItem("scm-auth");
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
  border-right: 1px solid #e4e9f2;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #2f6bff;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand-title {
  font-weight: 600;
  font-size: 16px;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7384;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #3b4556;
  font-weight: 500;
  background: #f5f7fb;
}

.menu-item.active {
  background: #e8f0ff;
  color: #2f6bff;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 12px;
}

.secondary,
.danger,
.primary {
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.secondary {
  background: #f2f4f9;
  color: #2b3445;
}

.danger {
  background: #ff6b6b;
  color: #ffffff;
}

.primary {
  background: #2f6bff;
  color: #ffffff;
}

.content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  background: #ffffff;
  border-bottom: 1px solid #e4e9f2;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.topbar h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.topbar p {
  margin: 0;
  color: #6b7384;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e8f0ff;
  color: #2f6bff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 12px;
  color: #6b7384;
}

.main-content {
  padding: 24px 32px 32px;
  flex: 1;
  background: #f4f7fb;
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
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
