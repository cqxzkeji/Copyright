<template>
  <div class="module">
    <header>
      <div>
        <h2>项目管理与跟进</h2>
        <p>追踪项目里程碑，实时查看进度弹窗。</p>
      </div>
      <div class="header-actions">
        <button @click="showProgress">查看项目进度</button>
        <button class="ghost" @click="openModal('提醒发送', '执行团队已收到提醒，移动端可查看待办。')">发送执行提醒</button>
      </div>
    </header>

    <section class="milestones">
      <div class="toolbar">
        <button @click="addMilestone">添加里程碑</button>
        <button class="ghost" @click="openModal('下载提示', '最新排期表已导出为Excel。')">导出排期</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>阶段</th>
            <th>负责人</th>
            <th>预计完成</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in milestones" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.due }}</td>
            <td>
              <span :class="['status', item.status]">{{ statusCopy[item.status] }}</span>
            </td>
            <td><button @click="toggleStatus(item)">切换状态</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button @click="modal.visible = false">完成</button>
      </div>
    </div>

    <div v-if="progressModal" class="modal-mask">
      <div class="modal-box progress-box">
        <h3>整体项目进度</h3>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <p>{{ progress }}%</p>
        <button @click="closeProgress">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, reactive, ref } from 'vue';

const statusOrder = ['pending', 'doing', 'done'];
const statusCopy = {
  pending: '待启动',
  doing: '执行中',
  done: '已完成'
};

const milestones = ref([
  { id: 1, name: '创意提案确认', owner: '李一', due: '05-18', status: 'done' },
  { id: 2, name: '合作方合同签署', owner: '张二', due: '05-22', status: 'doing' },
  { id: 3, name: '场地搭建', owner: '王三', due: '05-27', status: 'pending' }
]);

const modal = reactive({ visible: false, title: '', message: '' });
const progressModal = ref(false);
const progress = ref(0);
let timer;

const addMilestone = () => {
  milestones.value.push({
    id: Date.now(),
    name: '新增活动节点',
    owner: '未分配',
    due: '待定',
    status: 'pending'
  });
  openModal('新增成功', '已添加占位里程碑，请立即完善负责人信息。');
};

const toggleStatus = (item) => {
  const index = statusOrder.indexOf(item.status);
  item.status = statusOrder[(index + 1) % statusOrder.length];
};

const showProgress = () => {
  progressModal.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 200);
};

const closeProgress = () => {
  progressModal.value = false;
  clearInterval(timer);
};

const openModal = (title, message) => {
  modal.title = title;
  modal.message = message;
  modal.visible = true;
};

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  background: #4f7bff;
  color: #fff;
}

button.ghost {
  background: transparent;
  border: 1px solid #aeb7d9;
  color: #4f7bff;
}

.milestones {
  background: #f8f9ff;
  border-radius: 1rem;
  padding: 1rem;
}

.toolbar {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #e7ebff;
}

th,
td {
  padding: 0.8rem;
  text-align: left;
}

tbody tr:nth-child(even) {
  background: #fff;
}

.status {
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
}

.status.pending {
  background: #ffe9cf;
  color: #a4600c;
}

.status.doing {
  background: #dce8ff;
  color: #2751bb;
}

.status.done {
  background: #dcf6dd;
  color: #1f7d3a;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(12, 16, 33, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  width: min(380px, 90%);
  background: #fff;
  border-radius: 1rem;
  padding: 1.4rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #eff2ff;
  margin: 1rem 0;
}

.progress {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #4f7bff, #6ce4ff);
  transition: width 0.2s ease;
}
</style>
