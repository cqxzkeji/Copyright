<template>
  <div class="app-shell">
    <aside v-if="showLayout" class="sidebar">
      <div class="brand">
        <div class="logo">IT</div>
        <div>
          <p class="brand-title">咨询与项目管理平台</p>
          <p class="brand-subtitle">信息技术咨询中心</p>
        </div>
      </div>
      <nav class="nav">
        <RouterLink to="/dashboard" class="nav-link">项目仪表盘</RouterLink>
        <RouterLink to="/projects" class="nav-link">项目管理</RouterLink>
        <RouterLink to="/resources" class="nav-link">资源规划</RouterLink>
        <RouterLink to="/risks" class="nav-link">风险管理</RouterLink>
        <RouterLink to="/analytics" class="nav-link">数据分析与报告</RouterLink>
      </nav>
    </aside>

    <main class="content" :class="{ full: !showLayout }">
      <header v-if="showLayout" class="topbar">
        <div>
          <h1>{{ currentTitle }}</h1>
          <p>数据实时更新 · 支持项目生命周期全过程管理</p>
        </div>
        <div class="top-actions">
          <button class="ghost" @click="openModal('messages')">查看消息</button>
          <button class="primary" @click="openModal('collaboration')">协同中心</button>
        </div>
      </header>
      <RouterView />
      <BaseModal :open="modalKey === 'messages'" title="消息中心" @close="closeModal">
        <ul class="modal-list">
          <li v-for="item in messages" :key="item.id">
            <strong>{{ item.title }}</strong>
            <span>{{ item.detail }}</span>
          </li>
        </ul>
        <template #footer>
          <button class="ghost" type="button" @click="closeModal">稍后处理</button>
          <button class="primary" type="button" @click="closeModal">全部已读</button>
        </template>
      </BaseModal>
      <BaseModal :open="modalKey === 'collaboration'" title="协同中心" @close="closeModal">
        <form class="modal-form">
          <label>
            协作主题
            <input v-model="collaborationForm.topic" type="text" placeholder="输入协作主题" />
          </label>
          <label>
            参与部门
            <select v-model="collaborationForm.department">
              <option value="咨询管理部">咨询管理部</option>
              <option value="技术交付部">技术交付部</option>
              <option value="资源协调部">资源协调部</option>
            </select>
          </label>
          <label>
            说明
            <textarea v-model="collaborationForm.note" rows="3" placeholder="描述协同需求"></textarea>
          </label>
        </form>
        <template #footer>
          <button class="ghost" type="button" @click="closeModal">取消</button>
          <button class="primary" type="button" @click="closeModal">提交协同</button>
        </template>
      </BaseModal>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import BaseModal from "./components/BaseModal.vue";

const route = useRoute();

const showLayout = computed(() => route.path !== "/login");

const titleMap = {
  "/dashboard": "项目仪表盘",
  "/projects": "项目管理",
  "/resources": "资源规划",
  "/risks": "风险管理",
  "/analytics": "数据分析与报告"
};

const currentTitle = computed(() => titleMap[route.path] || "");

const modalKey = ref("");
const messages = [
  { id: 1, title: "预算审批提醒", detail: "云迁移项目等待审批" },
  { id: 2, title: "进度更新", detail: "数据治理项目完成度达85%" },
  { id: 3, title: "风险预警", detail: "集成测试风险等级提升" }
];

const collaborationForm = reactive({
  topic: "",
  department: "咨询管理部",
  note: ""
});

const openModal = (key) => {
  modalKey.value = key;
};

const closeModal = () => {
  modalKey.value = "";
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand-title {
  font-weight: 600;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-link {
  padding: 10px 14px;
  border-radius: 10px;
  color: #334155;
  font-weight: 500;
  background: #f8fafc;
}

.nav-link.router-link-active {
  background: #e0ecff;
  color: #1d4ed8;
}

.content {
  flex: 1;
  padding: 28px 32px 36px;
}

.content.full {
  padding: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.topbar h1 {
  font-size: 24px;
  margin-bottom: 6px;
}

.topbar p {
  color: #64748b;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.ghost {
  padding: 10px 16px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #334155;
}

.primary {
  padding: 10px 16px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
}

.modal-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.modal-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
}

.modal-list span {
  color: #64748b;
  font-size: 14px;
}

.modal-form {
  display: grid;
  gap: 16px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 880px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 20px;
  }
}
</style>
