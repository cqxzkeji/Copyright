<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 class="header-title">验收任务</h2>
          <p class="subtle">每日计划与执行状态</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="button" @click="openModal('create')">新建任务</button>
          <button class="button secondary" @click="openModal('progress')">批量更新进度</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>责任人</th>
            <th>区域</th>
            <th>计划日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.area }}</td>
            <td>{{ task.date }}</td>
            <td>
              <span class="badge">{{ task.status }}</span>
            </td>
            <td>
              <button class="button secondary" @click="openEdit(task)">指派/调整</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="header-title">今日要点</h3>
      <p class="subtle">关键关注项</p>
      <div class="tag-list" style="margin-top: 12px;">
        <span class="tag">防火门闭合</span>
        <span class="tag">照明通电</span>
        <span class="tag">排水坡度</span>
        <span class="tag">防滑设施</span>
        <span class="tag">管线标识</span>
        <span class="tag">避难指示</span>
      </div>
    </div>
  </div>

  <div v-if="modal === 'create'" class="modal-backdrop">
    <div class="modal">
      <h3>创建验收任务</h3>
      <form @submit.prevent="addTask">
        <div class="form-group">
          <label>任务名称</label>
          <input v-model="form.name" required placeholder="如：消防泵房土建验收" />
        </div>
        <div class="form-group">
          <label>责任人</label>
          <input v-model="form.owner" required placeholder="张工" />
        </div>
        <div class="form-group">
          <label>区域</label>
          <input v-model="form.area" required placeholder="B2 设备间" />
        </div>
        <div class="form-group">
          <label>计划日期</label>
          <input v-model="form.date" type="date" required />
        </div>
        <div class="form-group">
          <label>状态</label>
          <select v-model="form.status">
            <option>待安排</option>
            <option>进行中</option>
            <option>已完成</option>
          </select>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button class="button secondary" type="button" @click="closeModal">取消</button>
          <button class="button" type="submit">保存任务</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modal === 'edit'" class="modal-backdrop">
    <div class="modal">
      <h3>指派/调整</h3>
      <p class="subtle">{{ current?.name }}</p>
      <div class="form-group">
        <label>责任人</label>
        <input v-model="current.owner" />
      </div>
      <div class="form-group">
        <label>状态</label>
        <select v-model="current.status">
          <option>待安排</option>
          <option>进行中</option>
          <option>已完成</option>
        </select>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="saveEdit">保存调整</button>
      </div>
    </div>
  </div>

  <div v-if="modal === 'progress'" class="modal-backdrop">
    <div class="modal">
      <h3>批量更新进度</h3>
      <p class="subtle">分步执行，展示进度条</p>
      <div class="progress-bar" style="margin: 16px 0;">
        <div class="progress-bar__value" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前进度：{{ progress }}%</p>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">关闭</button>
        <button class="button" @click="simulateProgress">继续推进</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tasks = reactive([
  { id: 1, name: 'B2 消防泵房设备安装', owner: '王强', area: '泵房', date: '2024-06-18', status: '进行中' },
  { id: 2, name: '地下室排烟风道密闭性', owner: '刘伟', area: '风机房', date: '2024-06-18', status: '待安排' },
  { id: 3, name: '喷淋主管压力测试', owner: '张敏', area: '车库A区', date: '2024-06-19', status: '进行中' },
  { id: 4, name: '照明支路通电验收', owner: '陈浩', area: '车库B区', date: '2024-06-19', status: '已完成' },
  { id: 5, name: '人防门闭锁检查', owner: '李倩', area: '人防区', date: '2024-06-20', status: '待安排' },
  { id: 6, name: '排水沟坡度复核', owner: '赵云', area: '坡道', date: '2024-06-20', status: '进行中' },
  { id: 7, name: '弱电桥架封堵', owner: '周晨', area: '弱电间', date: '2024-06-21', status: '进行中' },
  { id: 8, name: '车库交通标识核验', owner: '何佳', area: '车库C区', date: '2024-06-21', status: '待安排' },
  { id: 9, name: '排烟风机试运转', owner: '孙悦', area: '设备层', date: '2024-06-22', status: '进行中' },
  { id: 10, name: '基坑排水泵更换', owner: '蒋勇', area: '泵坑', date: '2024-06-22', status: '已完成' }
]);

const modal = ref('');
const progress = ref(30);
const current = ref(null);
const form = reactive({ name: '', owner: '', area: '', date: '', status: '待安排' });

const openModal = (type) => {
  modal.value = type;
};

const openEdit = (task) => {
  current.value = task;
  modal.value = 'edit';
};

const closeModal = () => {
  modal.value = '';
};

const addTask = () => {
  tasks.push({ id: tasks.length + 1, ...form });
  Object.assign(form, { name: '', owner: '', area: '', date: '', status: '待安排' });
  closeModal();
};

const saveEdit = () => {
  closeModal();
};

const simulateProgress = () => {
  progress.value = Math.min(100, progress.value + 20);
};
</script>
