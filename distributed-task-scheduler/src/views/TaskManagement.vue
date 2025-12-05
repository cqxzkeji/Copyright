<template>
  <div class="card">
    <div class="flex-between">
      <h2>任务管理</h2>
      <div class="actions">
        <button class="ghost" @click="openAssignModal('新建任务')">新建任务</button>
        <button class="ghost" @click="openProgress">批量分发</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <div class="flex-between">
          <span>待分发任务</span>
          <span class="chip">{{ pendingCount }}</span>
        </div>
        <div class="progress-bar" style="margin: 8px 0 4px">
          <div :style="{ width: `${pendingPercent}%` }"></div>
        </div>
        <p class="hint">已分发 {{ 100 - pendingPercent }}%，确保分布均衡。</p>
      </div>
      <div class="card">
        <div class="flex-between">
          <span>失败重试</span>
          <span class="badge">{{ retryCount }} 次</span>
        </div>
        <p class="hint">自动降级与重试策略正在运行。</p>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>任务</th>
          <th>优先级</th>
          <th>分组</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.name }}</td>
          <td><span class="tag">{{ task.priority }}</span></td>
          <td>{{ task.group }}</td>
          <td>{{ task.status }}</td>
          <td class="actions">
            <button class="ghost" @click="openAssignModal(task.name)">分发</button>
            <button class="ghost" @click="openEdit(task)">编辑</button>
            <button class="ghost" @click="openDelete(task)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showAssign" class="modal-backdrop" @click.self="showAssign = false">
    <div class="modal">
      <header>分发任务：{{ currentTask }}</header>
      <div class="body">
        <div class="input-row">
          <label>选择执行节点</label>
          <select>
            <option>计算节点 A</option>
            <option>计算节点 B</option>
            <option>GPU 池</option>
            <option>离线批处理</option>
          </select>
        </div>
        <div class="input-row">
          <label>并发度</label>
          <input type="number" min="1" value="5" />
        </div>
        <div class="input-row">
          <label>调度策略</label>
          <select>
            <option>轮询</option>
            <option>最短耗时优先</option>
            <option>成本优先</option>
          </select>
        </div>
      </div>
      <div class="footer">
        <button @click="showAssign = false">取消</button>
        <button @click="confirmAssign">确认分发</button>
      </div>
    </div>
  </div>

  <div v-if="showEdit" class="modal-backdrop" @click.self="showEdit = false">
    <div class="modal">
      <header>编辑任务：{{ editTask?.name }}</header>
      <div class="body">
        <div class="input-row">
          <label>优先级</label>
          <select v-model="editTask.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </div>
        <div class="input-row">
          <label>分组</label>
          <input v-model="editTask.group" />
        </div>
        <div class="input-row">
          <label>备注</label>
          <textarea rows="3" placeholder="描述任务目标"></textarea>
        </div>
      </div>
      <div class="footer">
        <button @click="showEdit = false">取消</button>
        <button @click="saveEdit">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showDelete" class="modal-backdrop" @click.self="showDelete = false">
    <div class="modal">
      <header>删除任务</header>
      <div class="body">
        <p>确认删除任务「{{ editTask?.name }}」，相关分发计划会自动清空。</p>
      </div>
      <div class="footer">
        <button @click="showDelete = false">取消</button>
        <button @click="confirmDelete">确认删除</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
    <div class="modal">
      <header>批量分发进度</header>
      <div class="body">
        <p>批处理正在并行分发，预计完成时间 2 分钟。</p>
        <div class="progress-bar" style="margin-top: 10px">
          <div :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
      <div class="footer">
        <button @click="showProgress = false">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const tasks = reactive([
  { id: 1, name: '计算作业 A', priority: '高', group: 'GPU 组', status: '就绪' },
  { id: 2, name: '日志压缩', priority: '中', group: '离线', status: '排队' },
  { id: 3, name: '推荐特征生成', priority: '高', group: 'GPU 组', status: '运行中' },
  { id: 4, name: '指标同步', priority: '低', group: '实时', status: '就绪' },
  { id: 5, name: '报告汇总', priority: '中', group: '离线', status: '运行中' },
  { id: 6, name: '监控聚合', priority: '低', group: '实时', status: '排队' },
  { id: 7, name: '清理临时文件', priority: '低', group: '维护', status: '就绪' },
  { id: 8, name: 'AB 实验计算', priority: '高', group: 'GPU 组', status: '运行中' },
  { id: 9, name: '热度排行更新', priority: '中', group: '实时', status: '排队' },
  { id: 10, name: '备份验证', priority: '中', group: '维护', status: '就绪' },
]);

const pendingCount = computed(() => tasks.filter((t) => t.status === '排队').length);
const retryCount = ref(3);
const pendingPercent = computed(() => Math.max(10, 100 - pendingCount.value * 8));
const showAssign = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const showProgress = ref(false);
const currentTask = ref('');
const editTask = ref(null);
const progress = ref(60);

const openAssignModal = (taskName) => {
  currentTask.value = taskName;
  showAssign.value = true;
};

const openEdit = (task) => {
  editTask.value = { ...task };
  showEdit.value = true;
};

const openDelete = (task) => {
  editTask.value = { ...task };
  showDelete.value = true;
};

const confirmAssign = () => {
  showAssign.value = false;
  showProgress.value = true;
  progress.value = 20;
  setTimeout(() => (progress.value = 80), 600);
};

const saveEdit = () => {
  const idx = tasks.findIndex((t) => t.id === editTask.value.id);
  tasks[idx] = { ...tasks[idx], ...editTask.value };
  showEdit.value = false;
};

const confirmDelete = () => {
  const idx = tasks.findIndex((t) => t.id === editTask.value.id);
  if (idx > -1) {
    tasks.splice(idx, 1);
  }
  showDelete.value = false;
};

const openProgress = () => {
  progress.value = 45;
  showProgress.value = true;
  setTimeout(() => (progress.value = 96), 700);
};
</script>

<style scoped>
h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.hint {
  color: #6a7a8b;
  margin-top: 4px;
  font-size: 13px;
}
</style>
