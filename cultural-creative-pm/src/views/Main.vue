<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">CC</div>
        <div>
          <p class="title">文化创意PM</p>
          <span class="subtitle">全流程管理</span>
        </div>
      </div>
      <nav class="nav">
        <router-link class="nav-item" to="/main/project">立项策划</router-link>
        <router-link class="nav-item" to="/main/production">内容生产</router-link>
        <router-link class="nav-item" to="/main/progress">进度成本</router-link>
        <router-link class="nav-item" to="/main/delivery">发布交付</router-link>
        <router-link class="nav-item" to="/main/analytics">分析归档</router-link>
      </nav>
      <div class="sidebar-footer">
        <p>当前组织：城市文创实验室</p>
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <h1>文化创意项目全流程管理系统</h1>
          <p>协同、进度、成本与运营数据一体化看板</p>
        </div>
        <div class="top-actions">
          <button class="primary" @click="openNotice">今日提醒</button>
          <button class="outline" @click="openProfile">个人设置</button>
        </div>
      </header>
      <section class="module-content">
        <router-view />
      </section>
    </div>
  </div>
  <Modal :open="noticeOpen" title="今日提醒" @close="noticeOpen = false" @confirm="noticeOpen = false">
    <p>您有 6 条待办任务、2 项里程碑临近、1 条合同待归档。</p>
    <div class="tag-list">
      <span>任务板待验收：3</span>
      <span>成本超支预警：1</span>
      <span>渠道素材待投放：2</span>
    </div>
  </Modal>
  <Modal :open="profileOpen" title="个人设置" @close="profileOpen = false" @confirm="profileOpen = false">
    <label class="modal-label">
      姓名
      <input v-model="profile.name" placeholder="请输入姓名" />
    </label>
    <label class="modal-label">
      角色
      <select v-model="profile.role">
        <option>项目经理</option>
        <option>内容策划</option>
        <option>运营经理</option>
      </select>
    </label>
    <label class="modal-label">
      通知频率
      <select v-model="profile.notice">
        <option>即时</option>
        <option>每日报告</option>
        <option>每周报告</option>
      </select>
    </label>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";

const router = useRouter();
const noticeOpen = ref(false);
const profileOpen = ref(false);
const profile = ref({
  name: "林若昕",
  role: "项目经理",
  notice: "每日报告"
});

const openNotice = () => {
  noticeOpen.value = true;
};

const openProfile = () => {
  profileOpen.value = true;
};

const logout = () => {
  router.push("/login");
};
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e9f2;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7c3aed, #22c1c3);
  color: #fff;
  font-weight: 700;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav-item {
  padding: 10px 14px;
  border-radius: 12px;
  color: #1f2a44;
  font-weight: 500;
  background: #f5f7ff;
}

.nav-item.router-link-active {
  background: linear-gradient(120deg, rgba(79, 70, 229, 0.2), rgba(34, 193, 195, 0.2));
  color: #4f46e5;
  font-weight: 700;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #6b7280;
  display: grid;
  gap: 8px;
}

.ghost {
  background: #f3f4f6;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 24px 32px 8px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.topbar h1 {
  margin: 0;
  font-size: 22px;
}

.topbar p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.top-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.primary {
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
  border: none;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.outline {
  background: #fff;
  border: 1px solid #dbe2f0;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.module-content {
  padding: 16px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.modal-label input,
.modal-label select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #dbe2f0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-list span {
  background: #f1f5ff;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
}

@media (max-width: 960px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .sidebar-footer {
    width: 100%;
  }
}
</style>
