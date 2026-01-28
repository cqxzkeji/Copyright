<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <h2>CAE仿真</h2>
        <span>综合分析平台</span>
      </div>
      <nav>
        <RouterLink to="/main/dashboard" class="nav-item">仿真总览</RouterLink>
        <RouterLink to="/main/fea" class="nav-item">有限元分析</RouterLink>
        <RouterLink to="/main/mbd" class="nav-item">多体动力学</RouterLink>
        <RouterLink to="/main/cfd" class="nav-item">流体动力学</RouterLink>
        <RouterLink to="/main/thermal" class="nav-item">热分析</RouterLink>
        <RouterLink to="/main/vibration" class="nav-item">声学与振动</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button type="button" @click="openSupportModal">技术支持</button>
      </div>
    </aside>
    <div class="main-area">
      <header class="topbar">
        <div>
          <h1>汽车CAE全面分析仿真软件</h1>
          <p>统一加载功能模块到内容窗口，快速切换仿真场景。</p>
        </div>
        <div class="topbar-actions">
          <button type="button" class="outline" @click="openNoticeModal">系统公告</button>
          <button type="button" class="primary" @click="openProfileModal">用户中心</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </div>

    <BaseModal v-if="showNoticeModal" title="系统公告" @close="showNoticeModal = false">
      <ul class="modal-list">
        <li>新增热分析求解器 3.2 版本，支持多区耦合。</li>
        <li>数据中心今晚 22:00-23:00 进行维护。</li>
        <li>本周示例模型库新增 5 套悬挂系统模板。</li>
      </ul>
    </BaseModal>

    <BaseModal v-if="showProfileModal" title="用户中心" @close="showProfileModal = false">
      <form class="modal-form">
        <label>
          姓名
          <input type="text" value="王晓宇" />
        </label>
        <label>
          角色
          <input type="text" value="仿真工程师" />
        </label>
        <label>
          主题偏好
          <select>
            <option>亮色</option>
            <option>中性灰</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showProfileModal = false">取消</button>
        <button class="primary" type="button" @click="showProfileModal = false">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showSupportModal" title="技术支持" @close="showSupportModal = false">
      <p>我们将为当前会话生成支持工单，并提供远程排查服务。</p>
      <form class="modal-form">
        <label>
          问题描述
          <textarea rows="4" placeholder="请描述需要协助的问题"></textarea>
        </label>
        <label>
          联系方式
          <input type="text" placeholder="手机号/邮箱" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showSupportModal = false">稍后</button>
        <button class="primary" type="button" @click="showSupportModal = false">提交工单</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const showNoticeModal = ref(false);
const showProfileModal = ref(false);
const showSupportModal = ref(false);

const openNoticeModal = () => {
  showNoticeModal.value = true;
};

const openProfileModal = () => {
  showProfileModal.value = true;
};

const openSupportModal = () => {
  showSupportModal.value = true;
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f6f8fb;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand h2 {
  font-size: 20px;
}

.brand span {
  font-size: 12px;
  color: #94a3b8;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #1e293b;
  font-size: 14px;
}

.nav-item.router-link-active {
  background: #e0f2fe;
  color: #2563eb;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
}

.sidebar-footer button {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: #f1f5f9;
  cursor: pointer;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.topbar p {
  color: #64748b;
  margin-top: 4px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.topbar-actions button {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.outline {
  border: 1px solid #cbd5f5;
  background: #fff;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.content {
  padding: 0 32px 32px;
  flex: 1;
}

.modal-list {
  padding-left: 18px;
  color: #475569;
  display: grid;
  gap: 8px;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
