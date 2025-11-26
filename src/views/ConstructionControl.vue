<template>
  <div class="grid grid-2">
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">工序控制</div>
          <h3>施工阶段控制与进度监测</h3>
        </div>
        <div class="actions">
          <button class="btn btn-outline" @click="openIssue">问题登记</button>
          <button class="btn btn-primary" @click="openProgress">同步进度</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>工序</th>
            <th>负责人</th>
            <th>完成度</th>
            <th>风险</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.owner }}</td>
            <td>
              <div class="progress">
                <div class="progress-bar" :style="{ width: task.progress + '%' }"></div>
              </div>
              <small class="muted">{{ task.progress }}%</small>
            </td>
            <td><span class="badge" :class="task.risk === '低' ? 'ok' : 'warn'">{{ task.risk }}</span></td>
            <td><button class="btn btn-outline" @click="advance(task)">推进</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">资源分配</div>
          <h3>机械与班组</h3>
        </div>
        <button class="btn btn-outline" @click="openHint">调度提示</button>
      </header>
      <div class="chart">
        <div v-for="resource in resources" :key="resource.name" class="chart-row">
          <div class="label">{{ resource.name }}</div>
          <div class="chart-bar">
            <div class="fill" :style="{ width: resource.load + '%' }"></div>
          </div>
          <span class="value">{{ resource.load }}%</span>
        </div>
      </div>
    </div>
  </div>
  <BaseModal v-if="showProgress" title="同步进度" @close="showProgress = false">
    <p>与现场看板同步阶段进度...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: syncProgress + '%' }"></div>
    </div>
    <p class="muted">{{ syncProgress }}%</p>
  </BaseModal>
  <BaseModal v-if="showIssue" title="问题登记" @close="showIssue = false" :actions="issueActions">
    <form class="modal-form" @submit.prevent>
      <label>工序</label>
      <input v-model="issue.task" />
      <label>描述</label>
      <textarea v-model="issue.desc" rows="3"></textarea>
    </form>
  </BaseModal>
  <BaseModal v-if="showHint" title="调度提示" @close="showHint = false" :actions="hintActions">
    <p>混凝土浇筑需提前 2 小时锁定吊车与泵车；夜间作业注意噪声。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tasks = reactive([
  { name: '拆除准备', owner: '张帆', progress: 35, risk: '低' },
  { name: '主体拆除', owner: '李明', progress: 60, risk: '中' },
  { name: '渣土清运', owner: '赵强', progress: 40, risk: '低' },
  { name: '基础处理', owner: '王悦', progress: 20, risk: '中' },
  { name: '基坑支护', owner: '陈鑫', progress: 10, risk: '低' }
]);

const resources = reactive([
  { name: '塔吊与泵车', load: 68 },
  { name: '拆除班组', load: 72 },
  { name: '土方运输', load: 58 },
  { name: '测量放线', load: 46 },
  { name: '支护施工', load: 36 }
]);

const showProgress = ref(false);
const showIssue = ref(false);
const showHint = ref(false);
const syncProgress = ref(12);
const issue = reactive({ task: '', desc: '' });

const advance = task => {
  task.progress = Math.min(100, task.progress + 15);
};

const openProgress = () => {
  showProgress.value = true;
  syncProgress.value = 12;
  const timer = setInterval(() => {
    syncProgress.value = Math.min(100, syncProgress.value + 18);
    if (syncProgress.value >= 100) clearInterval(timer);
  }, 450);
};

const openIssue = () => (showIssue.value = true);
const openHint = () => (showHint.value = true);

const issueActions = [
  { label: '取消', onClick: () => (showIssue.value = false) },
  {
    label: '提交',
    primary: true,
    onClick: () => {
      if (issue.task) {
        tasks.push({ name: issue.task, owner: '新指派', progress: 0, risk: '中' });
        Object.assign(issue, { task: '', desc: '' });
        showIssue.value = false;
      }
    }
  }
];

const hintActions = [{ label: '知道了', primary: true, onClick: () => (showHint.value = false) }];
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.chart {
  display: grid;
  gap: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 3fr 0.6fr;
  align-items: center;
  gap: 10px;
}

.chart-bar {
  background: rgba(45, 123, 255, 0.1);
  height: 14px;
  border-radius: 999px;
}

.fill {
  height: 100%;
  background: linear-gradient(120deg, #2d7bff, #4fe1b9);
}

.badge.ok {
  color: #0f766e;
  background: rgba(79, 225, 185, 0.15);
}

.badge.warn {
  color: #c2410c;
  background: rgba(255, 179, 71, 0.2);
}

.modal-form {
  display: grid;
  gap: 10px;
}

input,
textarea {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(45, 123, 255, 0.3);
  font-family: inherit;
}

.muted {
  color: var(--muted);
}
</style>
