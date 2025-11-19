<template>
  <div class="module">
    <header>
      <div>
        <h2>设备管理</h2>
        <p>监控炼胶、压片、加硫等关键设备运行状态</p>
      </div>
      <button @click="showAddModal = true">登记新设备</button>
    </header>
    <section class="device-grid">
      <article v-for="device in devices" :key="device.id" class="device-card">
        <div class="device-head">
          <h3>{{ device.name }}</h3>
          <span :class="['badge', device.status]">{{ device.statusText }}</span>
        </div>
        <p>本班次运行 {{ device.hours }} 小时，巡检 {{ device.inspections }} 次</p>
        <div class="actions">
          <button @click="viewDetail(device)">详情</button>
          <button @click="schedule(device)">排程维护</button>
        </div>
      </article>
    </section>
  </div>

  <BaseModal
    v-if="detailDevice"
    :show="!!detailDevice"
    title="设备运行详情"
    @close="detailDevice = null"
  >
    <p>{{ detailDevice?.name }} 最近三日报警 {{ detailDevice?.alarms }} 次，润滑周期剩余 {{ detailDevice?.lubrication }} 小时。</p>
  </BaseModal>

  <BaseModal
    v-if="scheduleDevice"
    :show="!!scheduleDevice"
    title="维护排程"
    @close="scheduleDevice = null"
  >
    <p>已为 {{ scheduleDevice?.name }} 安排 {{ scheduleDevice?.nextPlan }} 的保养任务。</p>
  </BaseModal>

  <BaseModal
    v-if="showAddModal"
    :show="showAddModal"
    title="新增设备"
    @close="showAddModal = false"
  >
    <form class="new-form" @submit.prevent="addDevice">
      <input v-model="newDevice.name" placeholder="设备名称" required />
      <input v-model="newDevice.nextPlan" placeholder="下次保养时间" required />
      <button type="submit">保存</button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const devices = ref([
  { id: 1, name: '炼胶机 A1', status: 'running', statusText: '运行中', hours: 6, inspections: 2, alarms: 1, lubrication: 24, nextPlan: '周四夜班' },
  { id: 2, name: '压延线 B3', status: 'warning', statusText: '待检', hours: 4, inspections: 3, alarms: 2, lubrication: 16, nextPlan: '周五白班' },
  { id: 3, name: '加硫机 C2', status: 'offline', statusText: '待机', hours: 0, inspections: 1, alarms: 0, lubrication: 48, nextPlan: '周六白班' }
]);

const detailDevice = ref(null);
const scheduleDevice = ref(null);
const showAddModal = ref(false);
const newDevice = ref({ name: '', nextPlan: '' });

const viewDetail = (device) => {
  detailDevice.value = device;
};

const schedule = (device) => {
  scheduleDevice.value = device;
};

const addDevice = () => {
  devices.value.push({
    id: Date.now(),
    name: newDevice.value.name,
    status: 'running',
    statusText: '运行中',
    hours: 0,
    inspections: 0,
    alarms: 0,
    lubrication: 36,
    nextPlan: newDevice.value.nextPlan
  });
  newDevice.value = { name: '', nextPlan: '' };
  showAddModal.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header button {
  border: none;
  background: #16a34a;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
}

.device-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.device-card {
  flex: 1 1 260px;
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  color: #fff;
}

.badge.running {
  background: #22c55e;
}

.badge.warning {
  background: #f97316;
}

.badge.offline {
  background: #94a3b8;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 10px;
  background: #1d4ed8;
  color: #fff;
}

.new-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.new-form input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
}

.new-form button {
  border: none;
  border-radius: 10px;
  padding: 10px;
  background: #2563eb;
  color: #fff;
}
</style>
