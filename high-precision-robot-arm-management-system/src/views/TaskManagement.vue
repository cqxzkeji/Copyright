<template>
  <div class="grid cols-2">
    <div class="card">
      <h3>任务列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>优先级</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.priority }}</td>
            <td>{{ task.status }}</td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <button class="btn" @click="showAssign = true">新建任务</button>
        <button class="btn secondary" @click="openProgress">下发调度</button>
      </div>
    </div>
    <div class="card">
      <h3>队列概览</h3>
      <ul class="muted">
        <li>当前执行：{{ activeTask }}</li>
        <li>待执行队列：{{ tasks.length - 1 }} 条</li>
        <li>排程规则：深度优先 · 安全模式</li>
      </ul>
      <button class="btn" @click="showMessage('队列重排', '已按照优先级和安全等级重新排序。')">
        队列重排
      </button>
    </div>
  </div>

  <div v-if="showAssign" class="modal-backdrop" @click.self="showAssign = false">
    <div class="modal-panel">
      <h3>下达新任务</h3>
      <div class="grid">
        <label class="form-group">
          <span>任务名称</span>
          <input v-model="newTask.name" placeholder="示例：相机标定/拧螺钉" />
        </label>
        <label class="form-group">
          <span>优先级</span>
          <select v-model="newTask.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
      <div class="footer">
        <button class="btn" @click="addTask">确认</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
    <div class="modal-panel">
      <h3>调度执行中</h3>
      <p>正在下发路径规划与碰撞检测指令。</p>
      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted small">{{ progress }}% 已完成</p>
      <div class="footer">
        <button class="btn secondary" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="message" class="modal-backdrop" @click.self="message = null">
    <div class="modal-panel">
      <h3>{{ message.title }}</h3>
      <p>{{ message.body }}</p>
      <div class="footer">
        <button class="btn secondary" @click="message = null">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const tasks = reactive([
  { name: '视觉检测线体', priority: '高', status: '运行中' },
  { name: '分拣搬运', priority: '高', status: '排队中' },
  { name: '打磨工站', priority: '中', status: '待机' },
  { name: '码垛工位', priority: '中', status: '待机' },
  { name: '快换末端测试', priority: '低', status: '完成' },
]);

const activeTask = computed(() => tasks[0]?.name ?? '暂无');
const showAssign = ref(false);
const showProgress = ref(false);
const progress = ref(24);
const message = ref(null);
const newTask = reactive({ name: '力控抛光', priority: '高' });

const addTask = () => {
  if (!newTask.name) return;
  tasks.push({ name: newTask.name, priority: newTask.priority, status: '排队中' });
  showAssign.value = false;
  showMessage('创建成功', `${newTask.name} 已进入队列`);
};

const openProgress = () => {
  progress.value = 24;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 14);
    if (progress.value >= 100) clearInterval(timer);
  }, 420);
};

const showMessage = (title, body) => {
  message.value = { title, body };
};
</script>
