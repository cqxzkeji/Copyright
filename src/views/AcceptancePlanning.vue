<template>
  <div class="panel">
    <div class="flex space-between" style="margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">验收计划与任务分配</h2>
        <p class="page-sub">分解验收批次、绑定负责人与时间节点，支撑现场排期</p>
      </div>
      <div class="flex" style="gap: 10px">
        <button @click="generateWeekly">生成周计划</button>
        <button class="secondary" @click="showAssign = true">新增验收批次</button>
      </div>
    </div>

    <div v-if="showAssign" class="panel" style="margin-bottom: 16px">
      <h3 style="margin-top: 0">新增验收批次</h3>
      <div class="card-grid">
        <div>
          <label>批次名称</label>
          <input v-model="newBatch.name" placeholder="B3 防水验收" />
        </div>
        <div>
          <label>责任人</label>
          <input v-model="newBatch.owner" placeholder="监理/施工单位" />
        </div>
        <div>
          <label>计划日期</label>
          <input v-model="newBatch.date" type="date" />
        </div>
        <div>
          <label>区域</label>
          <input v-model="newBatch.zone" placeholder="裙楼屋面或地下车库" />
        </div>
      </div>
      <div class="flex space-between" style="margin-top: 12px">
        <button @click="createBatch">加入计划</button>
        <button class="secondary" @click="showAssign = false">收起</button>
      </div>
    </div>

    <table class="table" aria-label="验收计划列表">
      <thead>
        <tr>
          <th>批次</th>
          <th>区域</th>
          <th>验收时间</th>
          <th>责任人</th>
          <th>当前状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in plans" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.zone }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.owner }}</td>
          <td><span class="badge" :class="statusClass(item.status)">{{ item.status }}</span></td>
          <td class="flex" style="align-items: center">
            <button class="secondary" @click="assign(item)">指派</button>
            <button @click="confirm(item)">确认检查</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :progress="progress"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const plans = reactive([
  {
    id: 1,
    name: '裙楼大堂石材验收',
    zone: '裙楼首层',
    date: '2024-05-22',
    owner: '陈监理',
    status: '待指派',
  },
  {
    id: 2,
    name: 'B3 消防泵房防水',
    zone: '地下三层',
    date: '2024-05-24',
    owner: '刘监理',
    status: '待检查',
  },
]);

const showAssign = ref(false);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const progress = ref(null);
const newBatch = reactive({ name: '', owner: '', date: '', zone: '' });

const statusClass = (status) => {
  if (status === '待检查') return 'tag-orange';
  if (status === '已确认') return 'tag-green';
  return 'tag-blue';
};

const generateWeekly = () => {
  modalTitle.value = '生成周计划';
  modalMessage.value = '正在整合项目进度与资源排班...';
  progress.value = 0;
  showModal.value = true;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      clearInterval(timer);
      modalMessage.value = '已生成周计划草案，并同步负责人。';
    }
  }, 220);
};

const assign = (item) => {
  modalTitle.value = '任务指派';
  modalMessage.value = `${item.owner} 将负责 ${item.name} ，通知已发送。`;
  progress.value = null;
  item.status = '待检查';
  showModal.value = true;
};

const confirm = (item) => {
  modalTitle.value = '检查安排';
  modalMessage.value = `${item.name} 将在 ${item.date} 组织验收，系统已锁定资源。`;
  progress.value = 100;
  item.status = '已确认';
  showModal.value = true;
};

const createBatch = () => {
  if (!newBatch.name) {
    modalTitle.value = '信息不足';
    modalMessage.value = '请填写批次名称。';
    progress.value = null;
    showModal.value = true;
    return;
  }
  plans.push({
    id: Date.now(),
    name: newBatch.name,
    owner: newBatch.owner || '未指定',
    date: newBatch.date || '待确定',
    zone: newBatch.zone || '未指定',
    status: '待指派',
  });
  Object.assign(newBatch, { name: '', owner: '', date: '', zone: '' });
  modalTitle.value = '新增成功';
  modalMessage.value = '已加入周计划，等待指派。';
  progress.value = null;
  showModal.value = true;
};
</script>
