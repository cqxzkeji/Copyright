<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">RA</div>
        <div>
          <div class="brand-title">机械臂综合管理</div>
          <div class="brand-subtitle">智能驱动中心</div>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/device" class="menu-item" active-class="active">设备接入与资产管理</router-link>
        <router-link to="/main/motion" class="menu-item" active-class="active">运动控制与任务编排</router-link>
        <router-link to="/main/calibration" class="menu-item" active-class="active">高精度校准与状态监测</router-link>
        <router-link to="/main/alarm" class="menu-item" active-class="active">告警联动与运维维保</router-link>
        <router-link to="/main/analytics" class="menu-item" active-class="active">数据分析与权限中心</router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="tag">当前班组：一线运控</div>
        <div class="tag">在线设备：36</div>
      </div>
    </aside>

    <div class="content">
      <header class="topbar">
        <div>
          <div class="topbar-title">统一调度与闭环运维台</div>
          <div class="topbar-subtitle">实时掌控机械臂资产、任务、校准、告警与分析</div>
        </div>
        <div class="topbar-actions">
          <button class="btn btn-outline" @click="openNotice">系统公告</button>
          <button class="btn" @click="openShift">班次交接</button>
        </div>
      </header>

      <main class="page">
        <router-view />
      </main>
    </div>

    <Modal v-model="noticeVisible" title="系统公告">
      <p>今日已完成 12 套机械臂固件升级，2 套设备进入协同标定窗口，告警平均处理时长 18 分钟。</p>
    </Modal>

    <Modal v-model="shiftVisible" title="班次交接登记">
      <div class="form-row">
        <label class="form-group">
          <span>交接人</span>
          <input class="form-input" placeholder="请输入交接人" />
        </label>
        <label class="form-group">
          <span>接班人</span>
          <input class="form-input" placeholder="请输入接班人" />
        </label>
        <label class="form-group">
          <span>交接设备组</span>
          <input class="form-input" placeholder="输入设备组" />
        </label>
        <label class="form-group">
          <span>备注</span>
          <textarea class="form-input" rows="3" placeholder="交接事项说明"></textarea>
        </label>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="shiftVisible = false">取消</button>
        <button class="btn">提交交接</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/Modal.vue";

const noticeVisible = ref(false);
const shiftVisible = ref(false);

const openNotice = () => {
  noticeVisible.value = true;
};

const openShift = () => {
  shiftVisible.value = true;
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  padding: 24px 20px;
  border-right: 1px solid var(--border);
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
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-weight: 700;
}

.brand-title {
  font-weight: 700;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--muted);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #1f2937;
  font-weight: 600;
  font-size: 14px;
}

.menu-item.active {
  background: var(--primary-soft);
  color: var(--primary);
}

.sidebar-footer {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #ffffff;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.topbar-title {
  font-size: 18px;
  font-weight: 700;
}

.topbar-subtitle {
  font-size: 12px;
  color: var(--muted);
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
