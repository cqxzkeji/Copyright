<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">TS</div>
        <div>
          <div class="title">轨枕检测平台</div>
          <div class="subtitle">光学巡检中心</div>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/device" class="menu-item" active-class="active">
          设备接入与采集管理
        </router-link>
        <router-link to="/main/image" class="menu-item" active-class="active">
          轨枕图像检测与识别
        </router-link>
        <router-link to="/main/assessment" class="menu-item" active-class="active">
          状态评估与病害分级
        </router-link>
        <router-link to="/main/alarm" class="menu-item" active-class="active">
          告警联动与工单处置
        </router-link>
        <router-link to="/main/analytics" class="menu-item" active-class="active">
          数据统计分析与报告
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="ghost-btn" type="button" @click="openProfileModal">
          账户与站点
        </button>
      </div>
    </aside>

    <div class="content-area">
      <header class="topbar">
        <div>
          <div class="page-title">轨道轨枕状态感知与图像检测软件</div>
          <div class="page-subtitle">
            统一任务流 · 实时推理 · 处置闭环
          </div>
        </div>
        <div class="topbar-actions">
          <button class="secondary-btn" type="button" @click="openBroadcastModal">
            公告推送
          </button>
          <button class="primary-btn" type="button" @click="openSupportModal">
            值守支持
          </button>
        </div>
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <Modal
      v-if="showProfileModal"
      title="账户与站点设置"
      :on-close="closeProfileModal"
      :on-confirm="closeProfileModal"
    >
      <div class="form-grid">
        <label class="form-field">
          当前人员
          <input v-model="profile.name" />
        </label>
        <label class="form-field">
          所属站点
          <select v-model="profile.site">
            <option>华北中心</option>
            <option>华东枢纽</option>
            <option>西南检测站</option>
          </select>
        </label>
        <label class="form-field">
          联系方式
          <input v-model="profile.phone" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showBroadcastModal"
      title="运行公告推送"
      :on-close="closeBroadcastModal"
      :on-confirm="closeBroadcastModal"
    >
      <div class="form-grid">
        <label class="form-field">
          公告类型
          <select v-model="broadcast.type">
            <option>线路维护</option>
            <option>设备检修</option>
            <option>巡检提醒</option>
          </select>
        </label>
        <label class="form-field">
          接收范围
          <select v-model="broadcast.scope">
            <option>全部线路</option>
            <option>重点区段</option>
            <option>当前站点</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          公告内容
          <textarea v-model="broadcast.message" rows="3"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showSupportModal"
      title="值守支持登记"
      :on-close="closeSupportModal"
      :on-confirm="closeSupportModal"
    >
      <div class="form-grid">
        <label class="form-field">
          值班人员
          <input v-model="support.staff" />
        </label>
        <label class="form-field">
          预计响应
          <select v-model="support.level">
            <option>10分钟内</option>
            <option>30分钟内</option>
            <option>1小时内</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          支持说明
          <textarea v-model="support.note" rows="3"></textarea>
        </label>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Modal from "../components/Modal.vue";

const showProfileModal = ref(false);
const showBroadcastModal = ref(false);
const showSupportModal = ref(false);

const profile = reactive({
  name: "李巡检",
  site: "华北中心",
  phone: "138-4521-8890",
});

const broadcast = reactive({
  type: "线路维护",
  scope: "重点区段",
  message: "今晚 22:00 后进行设备保养，届时暂停采集。",
});

const support = reactive({
  staff: "周值班",
  level: "30分钟内",
  note: "重点关注 GNSS 信号稳定性与触发器同步。",
});

const openProfileModal = () => {
  showProfileModal.value = true;
};

const closeProfileModal = () => {
  showProfileModal.value = false;
};

const openBroadcastModal = () => {
  showBroadcastModal.value = true;
};

const closeBroadcastModal = () => {
  showBroadcastModal.value = false;
};

const openSupportModal = () => {
  showSupportModal.value = true;
};

const closeSupportModal = () => {
  showSupportModal.value = false;
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f6f9ff;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e3e9f7;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  gap: 20px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar .logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f6bff, #7dd3fc);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.title {
  font-weight: 700;
}

.subtitle {
  font-size: 12px;
  color: #7a8ab1;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #42547a;
  font-weight: 600;
  background: transparent;
  transition: all 0.2s ease;
}

.menu-item.active,
.menu-item:hover {
  background: #edf2ff;
  color: #2f6bff;
}

.sidebar-footer {
  margin-top: auto;
}

.content-area {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: #ffffff;
  border-bottom: 1px solid #e3e9f7;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
}

.page-subtitle {
  font-size: 13px;
  color: #6f81a8;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.main-content {
  padding: 24px 28px 40px;
}

@media (max-width: 1100px) {
  .main-layout {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content-area {
    min-height: calc(100vh - 140px);
  }
}
</style>
