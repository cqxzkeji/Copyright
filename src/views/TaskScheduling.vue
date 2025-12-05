<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">任务调度</p>
        <h2>批量任务编排</h2>
      </div>
      <div class="btns">
        <button class="primary" @click="showCreate = true">创建任务</button>
        <button @click="showPublish = true">发布调度</button>
        <button @click="showStrategy = true">策略预览</button>
      </div>
    </header>

    <section class="timeline">
      <div class="timeline-item" v-for="item in plan" :key="item.name">
        <div class="bubble">
          <div class="name">{{ item.name }}</div>
          <div class="info">{{ item.window }}</div>
        </div>
        <div class="pill">{{ item.status }}</div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-head">
        <h3>任务列表</h3>
        <button @click="showHelp = true">执行说明</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>任务名</th>
            <th>优先级</th>
            <th>目标集群</th>
            <th>预计时长</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.priority }}</td>
            <td>{{ task.cluster }}</td>
            <td>{{ task.duration }}</td>
            <td>{{ task.status }}</td>
            <td>
              <button @click="openTask(task)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-if="showCreate" title="创建任务" @close="showCreate = false">
      <form class="form" @submit.prevent="submitTask">
        <label>任务名称<input v-model="taskForm.name" required /></label>
        <label>优先级<select v-model="taskForm.priority"><option>高</option><option>中</option><option>低</option></select></label>
        <label>目标集群<input v-model="taskForm.cluster" required /></label>
        <label>预计时长<input v-model="taskForm.duration" required /></label>
        <div class="modal-actions">
          <button class="primary" type="submit">提交</button>
          <button type="button" @click="showCreate = false">取消</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal v-if="showPublish" title="发布调度" @close="showPublish = false">
      <p>系统将根据当前策略生成调度计划。</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: publishPercent + '%' }"></div>
      </div>
      <p class="desc">生成中：{{ publishPercent }}%</p>
      <div class="modal-actions">
        <button class="primary" @click="increasePublish">刷新</button>
        <button @click="showPublish = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showStrategy" title="策略预览" @close="showStrategy = false">
      <ul class="detail-list">
        <li>调度窗口：工作日 08:00-23:00</li>
        <li>智能分配：GPU 优先分配给高优任务</li>
        <li>限速策略：同区域并发 5 条</li>
        <li>回退策略：失败自动切换备用节点</li>
      </ul>
      <div class="modal-actions">
        <button class="primary" @click="showStrategy = false">确认</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showHelp" title="执行说明" @close="showHelp = false">
      <p>执行时将按优先级顺序分批推送，并实时监控失败重试。</p>
      <div class="modal-actions">
        <button class="primary" @click="showHelp = false">知道了</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeTask" :title="activeTask.name + ' 详情'" @close="activeTask = null">
      <p>目标：{{ activeTask.cluster }}，预计时长：{{ activeTask.duration }}</p>
      <div class="modal-actions">
        <button class="primary" @click="showRebalance = true">重新调度</button>
        <button @click="activeTask = null">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showRebalance" title="重新调度" @close="showRebalance = false">
      <p>将根据当前负载重新分配节点。</p>
      <div class="modal-actions">
        <button class="primary" @click="showRebalance = false">立即执行</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const tasks = ref([
  { name: '视频转码批次', priority: '高', cluster: 'cn-sh-a', duration: '45 分钟', status: '待执行' },
  { name: '日志清洗', priority: '中', cluster: 'cn-sh-b', duration: '25 分钟', status: '待执行' },
  { name: '画像计算', priority: '高', cluster: 'cn-bj-a', duration: '60 分钟', status: '运行中' },
  { name: '推荐训练', priority: '高', cluster: 'ap-sg-a', duration: '120 分钟', status: '排队' },
  { name: '安全巡检', priority: '低', cluster: 'cn-sh-c', duration: '15 分钟', status: '待执行' },
  { name: '归档入湖', priority: '中', cluster: 'us-ca-a', duration: '90 分钟', status: '运行中' },
  { name: '指标回放', priority: '低', cluster: 'eu-fr-a', duration: '35 分钟', status: '待执行' },
  { name: 'AI 训练', priority: '高', cluster: 'ap-sg-gpu', duration: '180 分钟', status: '排队' },
  { name: '表同步', priority: '中', cluster: 'cn-bj-b', duration: '40 分钟', status: '运行中' },
  { name: '索引重建', priority: '中', cluster: 'cn-sh-d', duration: '55 分钟', status: '待执行' }
]);

const plan = [
  { name: '计算预热', window: '07:00-08:00', status: '准备' },
  { name: 'GPU 分配', window: '08:00-09:00', status: '已完成' },
  { name: '队列排布', window: '09:00-11:30', status: '执行中' },
  { name: '日志采集', window: '12:00-13:00', status: '准备' },
  { name: '归档校验', window: '14:00-15:00', status: '待触发' }
];

const showCreate = ref(false);
const showPublish = ref(false);
const showStrategy = ref(false);
const showHelp = ref(false);
const activeTask = ref(null);
const showRebalance = ref(false);
const publishPercent = ref(40);

const taskForm = ref({ name: '', priority: '高', cluster: '', duration: '' });

const submitTask = () => {
  showCreate.value = false;
};

const increasePublish = () => {
  publishPercent.value = Math.min(100, publishPercent.value + 20);
};

const openTask = (task) => {
  activeTask.value = task;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.08);
}

.btns button {
  margin-left: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
}

.eyebrow {
  color: #6b7280;
  margin: 0;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.timeline-item {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bubble {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pill {
  padding: 8px 12px;
  background: #eef2ff;
  border-radius: 999px;
  font-weight: 700;
  color: #4338ca;
}

.table-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #374151;
}

.form input,
.form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  grid-column: span 2;
}

.progress {
  width: 100%;
  height: 12px;
  background: #eef2ff;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #a855f7);
}

.detail-list {
  padding-left: 18px;
  color: #374151;
}

@media (max-width: 720px) {
  .form {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
