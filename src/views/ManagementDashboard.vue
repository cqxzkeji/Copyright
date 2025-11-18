<template>
  <div class="module dashboard">
    <div class="intro">
      <h2>展示管理与后台系统</h2>
      <p>用于控制终端上线、人员排班以及文旅活动的运维监测。</p>
      <button class="primary" @click="openModal('巡检任务已派发，后台同步更新。')">派发巡检</button>
    </div>
    <section class="grid">
      <div class="card">
        <h3>终端状态</h3>
        <ul>
          <li v-for="device in devices" :key="device.name">
            <span>{{ device.name }}</span>
            <label class="switch">
              <input type="checkbox" v-model="device.online" />
              <span class="slider"></span>
            </label>
          </li>
        </ul>
        <button @click="commitDevices">保存终端状态</button>
      </div>
      <div class="card">
        <h3>日程排班</h3>
        <table>
          <thead>
            <tr>
              <th>时间段</th>
              <th>负责人</th>
              <th>类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in schedule" :key="slot.time">
              <td>{{ slot.time }}</td>
              <td>
                <select v-model="slot.owner">
                  <option v-for="member in members" :key="member" :value="member">
                    {{ member }}
                  </option>
                </select>
              </td>
              <td>{{ slot.type }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="openModal('排班已提交至管理端。')">提交排班</button>
      </div>
      <div class="card">
        <h3>活动审批</h3>
        <div class="approvals">
          <label v-for="activity in approvals" :key="activity.name">
            <input type="checkbox" v-model="activity.approved" />
            <span>{{ activity.name }} ({{ activity.date }})</span>
          </label>
        </div>
        <button @click="approveActivities">批量审批</button>
      </div>
    </section>
    <BaseModal v-model="showModal" title="管理提示">
      <p>{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const devices = reactive([
  { name: '非遗剧场主机', online: true },
  { name: '冰雪互动终端', online: true },
  { name: '极光漫游舱', online: false }
]);

const members = ['李研', '阿娜', '陈博', '索南'];
const schedule = reactive([
  { time: '09:00-12:00', owner: '李研', type: '非遗讲解' },
  { time: '13:00-16:00', owner: '陈博', type: '冰雪体验' },
  { time: '16:00-19:00', owner: '阿娜', type: '晚间巡演' }
]);

const approvals = reactive([
  { name: '冰湖光影秀', date: '周六', approved: false },
  { name: '苗寨鼓舞巡游', date: '周日', approved: true },
  { name: '雪原集市', date: '周日', approved: false }
]);

const showModal = ref(false);
const modalMessage = ref('');

const openModal = (msg) => {
  modalMessage.value = msg;
  showModal.value = true;
};

const commitDevices = () => {
  const online = devices.filter((d) => d.online).length;
  openModal(`已保存，当前 ${online}/${devices.length} 台设备在线。`);
};

const approveActivities = () => {
  const approved = approvals.filter((a) => a.approved).map((a) => a.name).join('、') || '无';
  openModal(`审批完成：${approved}`);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 280px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5f5;
  border-radius: 34px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
}

select {
  border: 1px solid #d0d7ff;
  border-radius: 8px;
  padding: 4px 6px;
}

.approvals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary,
button {
  border: none;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  align-self: flex-start;
}
</style>
