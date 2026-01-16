<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">MM</div>
        <div>
          <div class="brand-title">营销素材中心</div>
          <div class="brand-sub">多语言运营平台</div>
        </div>
      </div>
      <nav class="nav">
        <router-link to="/dashboard/content" class="nav-item">多语言内容制作</router-link>
        <router-link to="/dashboard/localization" class="nav-item">翻译与本地化</router-link>
        <router-link to="/dashboard/materials" class="nav-item">素材集中管理</router-link>
        <router-link to="/dashboard/publish" class="nav-item">多渠道发布</router-link>
        <router-link to="/dashboard/analytics" class="nav-item">数据分析与合规</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="welcome">欢迎回来，运营负责人</div>
          <div class="sub">请在左侧选择功能模块进行操作。</div>
        </div>
        <div class="top-actions">
          <button class="btn secondary" type="button" @click="openModal('message')">消息中心</button>
          <button class="btn" type="button" @click="openModal('team')">团队协作</button>
        </div>
      </header>
      <section class="content-body">
        <router-view />
      </section>
    </main>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" :on-close="closeModal">
    <template v-if="modal.type === 'message'">
      <div class="tip">
        今日共有 6 条待处理消息，包括 2 条审校请求与 4 条素材协作提醒。
      </div>
      <button class="btn" type="button" @click="submitAction('消息已全部标记已读')">一键已读</button>
    </template>
    <template v-else-if="modal.type === 'team'">
      <label class="field">
        邀请成员
        <input class="input" placeholder="输入成员邮箱" />
      </label>
      <label class="field">
        选择角色
        <select class="select">
          <option>运营负责人</option>
          <option>译审经理</option>
          <option>素材设计师</option>
        </select>
      </label>
      <button class="btn" type="button" @click="submitAction('团队协作邀请已发送')">发送邀请</button>
    </template>
    <template v-else-if="modal.type === 'result'">
      <div class="tip">{{ modal.message }}</div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modal = reactive({
  open: false,
  type: "",
  title: "",
  message: ""
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  const titles = {
    message: "消息中心",
    team: "团队协作",
    result: "操作完成"
  };
  modal.title = titles[type] || "操作";
};

const closeModal = () => {
  modal.open = false;
};

const submitAction = (message) => {
  modal.type = "result";
  modal.title = "操作完成";
  modal.message = message;
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #eef1f7;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #2f6fed;
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.brand-title {
  font-weight: 600;
}

.brand-sub {
  font-size: 12px;
  color: #7a889f;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #41506b;
  font-size: 14px;
}

.nav-item.router-link-active {
  background: #edf2ff;
  color: #2f6fed;
  font-weight: 600;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 30px;
  background: #f5f7fb;
  border-bottom: 1px solid #eef1f7;
  gap: 20px;
  flex-wrap: wrap;
}

.welcome {
  font-size: 18px;
  font-weight: 600;
}

.sub {
  color: #6c7a96;
  font-size: 14px;
}

.top-actions {
  display: flex;
  gap: 10px;
}

.content-body {
  padding: 24px 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #3a4a6b;
}

.tip {
  background: #f5f7ff;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
}

@media (max-width: 960px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>
