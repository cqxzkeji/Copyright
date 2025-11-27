<template>
  <div class="light-card module-card">
    <div class="card-header">
      <div>
        <h3>预警管理</h3>
        <p>集中处理告警工单、通知和处置流程。</p>
      </div>
      <div class="flex-row" style="align-items:center;">
        <button class="secondary-btn" @click="showDispatchForm">派单</button>
        <button class="primary-btn" @click="openNotify">批量通知</button>
      </div>
    </div>

    <table class="table" aria-label="alarm table">
      <thead>
        <tr>
          <th>编号</th>
          <th>类型</th>
          <th>状态</th>
          <th>负责人</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="alarm in alarms" :key="alarm.id">
          <td>{{ alarm.id }}</td>
          <td>{{ alarm.type }}</td>
          <td><span :class="['status-pill', statusClass(alarm.status)]">{{ alarm.status }}</span></td>
          <td>{{ alarm.owner }}</td>
          <td>{{ alarm.updated }}</td>
          <td>
            <button class="secondary-btn" @click="viewFlow(alarm)">查看</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="notice">每条预警均可查看流程，派单按钮弹出表单，通知按钮弹出带进度的弹窗。</div>
  </div>

  <div v-if="current" class="modal-backdrop" @click.self="current = null">
    <div class="modal">
      <h3>预警流程 - {{ current.id }}</h3>
      <ul>
        <li>检测来源：{{ current.type }}</li>
        <li>状态：{{ current.status }}</li>
        <li>负责人：{{ current.owner }}</li>
        <li>最后更新时间：{{ current.updated }}</li>
      </ul>
      <footer>
        <button class="primary-btn" @click="current = null">关闭</button>
      </footer>
    </div>
  </div>

  <div v-if="dispatchForm" class="modal-backdrop" @click.self="dispatchForm = false">
    <div class="modal">
      <h3>派单处理</h3>
      <div class="form-row">
        <label>预警编号 <input v-model="dispatch.id" placeholder="ALM-2024-001" /></label>
        <label>执行人 <input v-model="dispatch.owner" placeholder="巡检员" /></label>
        <label>截止时间 <input v-model="dispatch.deadline" type="datetime-local" /></label>
      </div>
      <footer>
        <button class="secondary-btn" @click="dispatchForm = false">取消</button>
        <button class="primary-btn" @click="confirmDispatch">确认派单</button>
      </footer>
    </div>
  </div>

  <div v-if="notify" class="modal-backdrop" @click.self="notify = false">
    <div class="modal">
      <h3>批量通知</h3>
      <p>正在推送给责任人和管理者，确保同时收到预警。</p>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: notifyProgress + '%' }"></div>
      </div>
      <p style="text-align:right;margin-top:8px;">{{ notifyProgress }}%</p>
      <footer>
        <button class="primary-btn" @click="notify = false">完成</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const alarms = reactive([
  { id: 'ALM-301', type: '烟雾报警', status: '未处理', owner: '李伟', updated: '09:10' },
  { id: 'ALM-302', type: '温度异常', status: '处理中', owner: '张敏', updated: '09:02' },
  { id: 'ALM-303', type: '手报触发', status: '处理中', owner: '王凯', updated: '08:55' },
  { id: 'ALM-304', type: '联网告警', status: '已关闭', owner: '赵磊', updated: '08:48' },
  { id: 'ALM-305', type: '电气故障', status: '未处理', owner: '孙倩', updated: '08:40' }
]);

const current = ref(null);
const dispatchForm = ref(false);
const notify = ref(false);
const notifyProgress = ref(0);
const dispatch = reactive({ id: '', owner: '', deadline: '' });

const statusClass = (status) => {
  if (status === '已关闭') return 'success';
  if (status === '处理中') return 'warning';
  return 'danger';
};

const viewFlow = (row) => {
  current.value = row;
};

const showDispatchForm = () => {
  dispatchForm.value = true;
};

const confirmDispatch = () => {
  if (dispatch.id) {
    alarms.unshift({
      id: dispatch.id,
      type: '手动派单',
      status: '已派单',
      owner: dispatch.owner || '待分配',
      updated: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    current.value = alarms[0];
    Object.assign(dispatch, { id: '', owner: '', deadline: '' });
  }
  dispatchForm.value = false;
};

const openNotify = () => {
  notify.value = true;
  notifyProgress.value = 0;
  const timer = setInterval(() => {
    notifyProgress.value = Math.min(100, notifyProgress.value + 25);
    if (notifyProgress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        notify.value = false;
      }, 400);
    }
  }, 280);
};
</script>

<style scoped>
.module-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
