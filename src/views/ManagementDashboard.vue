<template>
  <div class="module-wrapper">
    <div class="section-header">
      <div>
        <h2>管理与控制</h2>
        <p>任务排程、巡检、备件、权限在一个界面集中管理。</p>
      </div>
      <div class="actions">
        <button @click="showTask = true">安排巡检</button>
        <button @click="showSpare = true">备件补货</button>
        <button @click="showNotice = true">公告推送</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-title">班组任务看板</div>
        <div class="pill" v-for="task in tasks" :key="task.name">
          <span>{{ task.name }}</span>
          <div class="pill-bar">
            <div class="pill-fill" :style="{ width: task.progress + '%' }"></div>
          </div>
          <span class="value">{{ task.progress }}%</span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">在线控制</div>
        <div class="controls">
          <div class="control" v-for="control in controls" :key="control.name">
            <div>
              <strong>{{ control.name }}</strong>
              <p>{{ control.desc }}</p>
            </div>
            <button @click="openControl(control)">执行</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-title">巡检记录（不少于10条）</div>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>位置</th>
            <th>检查项</th>
            <th>结果</th>
            <th>整改</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in patrols" :key="row.time + row.place">
            <td>{{ row.time }}</td>
            <td>{{ row.place }}</td>
            <td>{{ row.item }}</td>
            <td>{{ row.result }}</td>
            <td>{{ row.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal title="巡检计划" :visible="showTask" @close="showTask = false">
      <form class="modal-form">
        <label>班组<select v-model="taskForm.team"><option>运行一班</option><option>运行二班</option></select></label>
        <label>时间<input v-model="taskForm.time" type="datetime-local" /></label>
        <label>巡检点<input v-model="taskForm.point" placeholder="曝气池西侧" /></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showTask = false">取消</button>
        <button class="primary" @click="submitTask">发布任务</button>
      </template>
    </BaseModal>

    <BaseModal title="备件补货" :visible="showSpare" @close="showSpare = false">
      <form class="modal-form">
        <label>物料名称<input v-model="spareForm.name" placeholder="搅拌桨" /></label>
        <label>数量<input v-model="spareForm.count" type="number" /></label>
        <label>备注<input v-model="spareForm.note" placeholder="急件" /></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showSpare = false">取消</button>
        <button class="primary" @click="submitSpare">提交申请</button>
      </template>
    </BaseModal>

    <BaseModal title="推送公告" :visible="showNotice" @close="showNotice = false">
      <form class="modal-form">
        <label>标题<input v-model="noticeForm.title" placeholder="设备停机维护" /></label>
        <label>正文<textarea v-model="noticeForm.body" rows="4"></textarea></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showNotice = false">取消</button>
        <button class="primary" @click="submitNotice">推送</button>
      </template>
    </BaseModal>

    <BaseModal :title="controlModal.title" :visible="controlModal.open" @close="controlModal.open = false">
      <p>{{ controlModal.body }}</p>
      <div class="progress">
        <div class="progress-header">
          <span>执行进度</span>
          <span>{{ controlModal.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: controlModal.progress + '%' }"></div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showTask = ref(false);
const showSpare = ref(false);
const showNotice = ref(false);
const controlModal = reactive({ title: '控制指令', body: '', progress: 0, open: false });

const taskForm = reactive({ team: '运行一班', time: '', point: '' });
const spareForm = reactive({ name: '', count: 1, note: '' });
const noticeForm = reactive({ title: '', body: '' });

const tasks = [
  { name: '滤布检查', progress: 76 },
  { name: '加药间清理', progress: 54 },
  { name: '在线仪表校准', progress: 62 }
];

const controls = [
  { name: '切换备用泵', desc: '主泵维护时自动切换备用泵组' },
  { name: '重启曝气', desc: '短时曝气停机后的手动重启' },
  { name: '远程压滤', desc: '远程启动板框机脱水循环' }
];

const patrols = [
  { time: '05-01 08:00', place: '格栅间', item: '异物堆积', result: '未见堵塞', action: '记录' },
  { time: '05-01 08:40', place: '提升泵房', item: '泵噪声', result: '正常', action: '记录' },
  { time: '05-01 09:20', place: '调节池', item: '液位计', result: '正常', action: '记录' },
  { time: '05-01 10:00', place: '加药间', item: '药剂余量', result: '足量', action: '记录' },
  { time: '05-01 10:30', place: '沉砂池', item: '刮泥机', result: '正常', action: '记录' },
  { time: '05-01 11:10', place: '曝气池', item: '鼓风机', result: '正常', action: '记录' },
  { time: '05-01 11:40', place: '初沉池', item: '污泥界面', result: '正常', action: '记录' },
  { time: '05-01 12:10', place: '压滤机房', item: '滤布', result: '需冲洗', action: '安排冲洗' },
  { time: '05-01 12:40', place: '集水井', item: '气味', result: '轻微', action: '通风' },
  { time: '05-01 13:20', place: '出水口', item: '水样', result: '清澈', action: '记录' }
];

const openControl = (control) => {
  controlModal.title = `${control.name} 指令`;
  controlModal.body = `${control.desc}，已提交至 PLC，等待反馈。`;
  controlModal.progress = Math.min(100, 60 + Math.round(Math.random() * 35));
  controlModal.open = true;
};

const submitTask = () => {
  showTask.value = false;
  taskForm.time = '';
  taskForm.point = '';
};

const submitSpare = () => {
  showSpare.value = false;
  spareForm.name = '';
  spareForm.note = '';
};

const submitNotice = () => {
  showNotice.value = false;
  noticeForm.title = '';
  noticeForm.body = '';
};
</script>

<style scoped>
.module-wrapper {
  display: grid;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

h2 {
  margin: 0;
}

p {
  margin: 6px 0 0;
  color: #475569;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  background: #ffe4e6;
  color: #9f1239;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(244, 63, 94, 0.18);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.card {
  background: #fff1f2;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #fecdd3;
}

.card-title {
  font-weight: 700;
  margin-bottom: 10px;
}

.pill {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.pill-bar {
  width: 100%;
  background: #ffe4e6;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.pill-fill {
  height: 100%;
  background: linear-gradient(90deg, #f43f5e, #fb7185);
}

.controls {
  display: grid;
  gap: 10px;
}

.control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #fecdd3;
}

.control p {
  margin: 4px 0 0;
  color: #9f1239;
}

.control button {
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f43f5e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.table-wrapper {
  border: 1px solid #fecdd3;
  border-radius: 14px;
  overflow: hidden;
}

.table-title {
  background: #ffe4e6;
  padding: 12px;
  font-weight: 700;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #fecdd3;
  text-align: left;
}

tr:nth-child(even) {
  background: #fff8f9;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.modal-form input,
.modal-form textarea,
.modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #fecdd3;
}

.ghost {
  background: #ffe4e6;
}

.primary {
  background: #f43f5e;
  color: #fff;
}
</style>
