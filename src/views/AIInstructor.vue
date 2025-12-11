<template>
  <main class="page">
    <header class="card header">
      <div>
        <h2>数字人助教</h2>
        <p>智能答疑、推送学习提醒，协助课堂互动</p>
      </div>
      <div class="actions">
        <button @click="openModal('assign')">分配助教</button>
        <button class="ghost" @click="openModal('broadcast')">推送提醒</button>
        <button class="ghost" @click="openModal('tip')">操作提示</button>
      </div>
    </header>

    <div class="card">
      <h3>助教任务列表</h3>
      <table>
        <thead>
          <tr>
            <th>任务</th>
            <th>课程</th>
            <th>优先级</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.title">
            <td>{{ task.title }}</td>
            <td>{{ task.course }}</td>
            <td>{{ task.priority }}</td>
            <td>{{ task.state }}</td>
            <td>
              <button class="ghost" @click="openModal('detail', task)">详情</button>
              <button @click="openModal('progress', task)">进度</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="assignModal" title="分配数字人助教" @close="reset" @confirm="confirmAssign">
      <form class="form">
        <label>助教名称<input v-model="assign.name" placeholder="Ava" /></label>
        <label>接入课程<select v-model="assign.course"><option v-for="task in tasks" :key="task.title">{{ task.course }}</option></select></label>
        <label>职责<input v-model="assign.role" placeholder="答疑 / 点名" /></label>
      </form>
    </Modal>

    <Modal v-if="broadcastModal" title="推送学习提醒" @close="reset" @confirm="confirmBroadcast">
      <form class="form">
        <label>提醒内容<textarea v-model="broadcast.message" rows="3" placeholder="今晚 8 点直播答疑"></textarea></label>
        <label>受众<select v-model="broadcast.target"><option>全班</option><option>缺勤学生</option><option>低于 80 分</option></select></label>
      </form>
    </Modal>

    <Modal v-if="tipModal" title="操作提示" @close="reset" :showActions="false">
      <p>所有按钮均为 modal 弹窗，并带有进度或表单。数字人助教支持多种课堂工作流。</p>
      <div class="progress info"><span style="width: 55%"></span></div>
      <p>排班覆盖率 55%，点击“分配助教”立即补齐。</p>
    </Modal>

    <Modal v-if="detailModal" title="任务详情" @close="reset" :showActions="false">
      <p>任务：{{ current?.title }}</p>
      <p>课程：{{ current?.course }}</p>
      <p>优先级：{{ current?.priority }}</p>
      <p>状态：{{ current?.state }}</p>
    </Modal>

    <Modal v-if="progressModal" title="执行进度" @close="reset" @confirm="confirmProgress">
      <p>正在为 {{ current?.course }} 执行 {{ current?.title }}。</p>
      <div class="progress info"><span style="width: 66%"></span></div>
    </Modal>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const tasks = reactive([
  { title: '课后答疑', course: '数据结构', priority: '高', state: '进行中' },
  { title: '测验批改', course: '高等数学', priority: '中', state: '队列中' },
  { title: '发放通知', course: '计算机网络', priority: '高', state: '完成' },
  { title: '课堂点名', course: '线性代数', priority: '低', state: '进行中' },
  { title: '作业讲评', course: '大学物理', priority: '中', state: '待开始' },
  { title: '随堂提问', course: '人工智能导论', priority: '高', state: '进行中' },
  { title: '数据洞察', course: '操作系统', priority: '中', state: '进行中' },
  { title: '直播陪同', course: '数据库原理', priority: '高', state: '队列中' },
  { title: '演示提醒', course: '软件工程', priority: '低', state: '完成' },
  { title: '口语陪练', course: '英语演讲', priority: '中', state: '进行中' },
  { title: '案例讨论', course: 'Python 实战', priority: '中', state: '进行中' }
]);

const assign = reactive({ name: 'Ava', course: '数据结构', role: '答疑' });
const broadcast = reactive({ message: '', target: '全班' });
const current = ref(null);

const assignModal = ref(false);
const broadcastModal = ref(false);
const tipModal = ref(false);
const detailModal = ref(false);
const progressModal = ref(false);

const openModal = (type, item) => {
  current.value = item || null;
  assignModal.value = type === 'assign';
  broadcastModal.value = type === 'broadcast';
  tipModal.value = type === 'tip';
  detailModal.value = type === 'detail';
  progressModal.value = type === 'progress';
};

const reset = () => {
  assignModal.value = false;
  broadcastModal.value = false;
  tipModal.value = false;
  detailModal.value = false;
  progressModal.value = false;
};

const confirmAssign = () => {
  alert(`已为 ${assign.course} 分配 ${assign.name}`);
  reset();
};

const confirmBroadcast = () => {
  alert(`已推送：${broadcast.message || '提醒消息'}`);
  reset();
};

const confirmProgress = () => {
  alert('执行进度已记录');
  reset();
};
</script>

<style scoped>
.page {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  color: #2563eb;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
}

.progress.info {
  margin: 10px 0;
}

.form {
  display: grid;
  gap: 10px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
select,
textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-family: inherit;
}
</style>
