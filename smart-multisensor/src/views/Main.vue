<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">SM</div>
        <div>
          <h2>智能多传感器</h2>
          <p>检测管理平台</p>
        </div>
      </div>
      <nav class="nav">
        <RouterLink to="/main/monitor" class="nav-link">实时画面</RouterLink>
        <RouterLink to="/main/driver" class="nav-link">驱动管理</RouterLink>
        <RouterLink to="/main/device" class="nav-link">在线传感器</RouterLink>
        <RouterLink to="/main/record" class="nav-link">记录中心</RouterLink>
        <RouterLink to="/main/report" class="nav-link">报告导出</RouterLink>
      </nav>
      <div class="side-footer">
        <div class="status">
          <span class="dot"></span>
          <span>系统运行中</span>
        </div>
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div>
          <h1>智能多传感器检测系统</h1>
          <p>实时监控、驱动控制、设备扫描与报告生成</p>
        </div>
        <div class="top-actions">
          <button class="ghost" @click="openNotice">系统通知</button>
          <button class="primary" @click="openQuick">快速任务</button>
        </div>
      </header>

      <section class="content">
        <RouterView />
      </section>
    </div>

    <div v-if="noticeOpen" class="modal-backdrop" @click.self="noticeOpen = false">
      <div class="modal">
        <h3>系统通知</h3>
        <ul>
          <li>08:30 雷达-北区已进入高精度模式。</li>
          <li>09:05 新增 2 台摄像头已就绪。</li>
          <li>09:40 数据存储空间剩余 78%。</li>
        </ul>
        <button class="primary" @click="noticeOpen = false">知道了</button>
      </div>
    </div>

    <div v-if="quickOpen" class="modal-backdrop" @click.self="quickOpen = false">
      <div class="modal">
        <h3>快速任务</h3>
        <form class="modal-form" @submit.prevent="submitQuick">
          <label>
            <span>任务名称</span>
            <input v-model="quickTask.name" type="text" placeholder="例如：夜间扫描" />
          </label>
          <label>
            <span>设备组</span>
            <select v-model="quickTask.group">
              <option>雷达组 A</option>
              <option>摄像头组 B</option>
              <option>混合组 C</option>
            </select>
          </label>
          <label>
            <span>优先级</span>
            <select v-model="quickTask.priority">
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="quickOpen = false">取消</button>
            <button type="submit" class="primary">提交任务</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const noticeOpen = ref(false);
const quickOpen = ref(false);
const quickTask = reactive({
  name: "",
  group: "雷达组 A",
  priority: "高"
});

const openNotice = () => {
  noticeOpen.value = true;
};

const openQuick = () => {
  quickOpen.value = true;
};

const submitQuick = () => {
  quickOpen.value = false;
};

const logout = () => {
  router.push("/login");
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f8fafc;
}

.sidebar {
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 24px;
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
  background: #2563eb;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav-link {
  text-decoration: none;
  color: #475569;
  padding: 10px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.nav-link.router-link-active {
  background: #e0e7ff;
  color: #1d4ed8;
  font-weight: 600;
}

.side-footer {
  margin-top: auto;
  display: grid;
  gap: 12px;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #16a34a;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
}

.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  padding: 24px 32px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.topbar h1 {
  margin: 0;
  font-size: 22px;
}

.topbar p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.content {
  padding: 16px 32px 32px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  border-radius: 12px;
  padding: 10px 16px;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  z-index: 20;
}

.modal {
  width: min(420px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  display: grid;
  gap: 16px;
}

.modal h3 {
  margin: 0;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.modal-form input,
.modal-form select {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .nav {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    overflow-x: auto;
  }
}

@media (max-width: 640px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .content {
    padding: 16px;
  }
}
</style>
