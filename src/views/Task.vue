<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>任务管理与场景策略</h3>
        <div class="flex">
          <button @click="openNew = true">新建任务</button>
          <button @click="openSchedule = true">执行控制</button>
        </div>
      </div>
      <table class="table" style="margin-top: 12px">
        <thead>
          <tr>
            <th>任务</th>
            <th>场景</th>
            <th>优先级</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tasks" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.scene }}</td>
            <td>{{ item.priority }}</td>
            <td>{{ item.state }}</td>
            <td><button style="padding: 6px 10px" @click="viewTask(item)">流程</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between">
        <h4>策略面板</h4>
        <button @click="openStrategy = true">策略编辑</button>
      </div>
      <p>预案：复杂地形巡检 | 避障等级 中 | 站立稳定性 增强</p>
      <p>执行窗口：09:00-18:00，自动切换巡逻与回充。</p>
      <div class="progress-bar" style="margin-top: 10px">
        <div class="progress-inner" :style="{ width: 70 + '%' }"></div>
      </div>
      <p>场景完成度 70%</p>
    </div>
  </div>

  <div v-if="openNew" class="modal-overlay" @click.self="openNew = false">
    <div class="modal">
      <h3>新建任务</h3>
      <label>任务名称<input v-model="taskForm.name" /></label>
      <label>场景<select v-model="taskForm.scene"><option>楼宇巡检</option><option>洞穴探测</option><option>灾后搜索</option></select></label>
      <label>优先级<select v-model="taskForm.priority"><option>高</option><option>中</option><option>低</option></select></label>
      <div class="flex-between" style="margin-top: 10px">
        <span class="badge">将自动生成流程</span>
        <button @click="createTask">创建</button>
      </div>
    </div>
  </div>

  <div v-if="openSchedule" class="modal-overlay" @click.self="openSchedule = false">
    <div class="modal">
      <h3>执行控制</h3>
      <p>选择要启动的任务并配置执行窗口。</p>
      <label>任务<select v-model="scheduleTask"><option v-for="item in tasks" :key="item.name">{{ item.name }}</option></select></label>
      <label>执行窗口<input v-model="scheduleWindow" placeholder="10:00-12:00" /></label>
      <button style="margin-top: 10px" @click="startSchedule">启动</button>
    </div>
  </div>

  <div v-if="openStrategy" class="modal-overlay" @click.self="openStrategy = false">
    <div class="modal">
      <h3>策略编辑</h3>
      <label>避障等级<select v-model="strategy.obstacle"><option>高</option><option>中</option><option>低</option></select></label>
      <label>能耗模式<select v-model="strategy.power"><option>性能优先</option><option>平衡</option><option>低功耗</option></select></label>
      <label>足端控制<select v-model="strategy.feet"><option>软着地</option><option>稳定支撑</option></select></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>避障 {{ strategy.obstacle }} | 模式 {{ strategy.power }}</span>
        <button @click="saveStrategy">保存</button>
      </div>
    </div>
  </div>

  <div v-if="flow" class="modal-overlay" @click.self="flow = null">
    <div class="modal">
      <h3>{{ flow.name }} 流程编排</h3>
      <ul>
        <li v-for="step in flow.steps" :key="step">{{ step }}</li>
      </ul>
      <button style="margin-top: 10px" @click="flow = null">关闭</button>
    </div>
  </div>

  <div v-if="statusModal.open" class="modal-overlay" @click.self="statusModal.open = false">
    <div class="modal">
      <h3>{{ statusModal.title }}</h3>
      <p>{{ statusModal.message }}</p>
      <div class="flex-between" style="margin-top: 12px">
        <span class="tag">任务管理</span>
        <button @click="statusModal.open = false">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tasks = ref([
  { name: 'A-楼宇巡检', scene: '楼宇', priority: '高', state: '排队' },
  { name: 'B-洞穴探测', scene: '洞穴', priority: '高', state: '执行中' },
  { name: 'C-灾后搜索', scene: '灾区', priority: '中', state: '已完成' },
  { name: 'D-电力巡线', scene: '输电廊道', priority: '中', state: '排队' },
  { name: 'E-化工巡检', scene: '厂区', priority: '高', state: '执行中' }
]);

const taskForm = reactive({ name: 'F-地下停车场巡检', scene: '楼宇', priority: '中' });
const scheduleTask = ref('A-楼宇巡检');
const scheduleWindow = ref('10:00-12:00');
const strategy = reactive({ obstacle: '中', power: '平衡', feet: '软着地' });
const flow = ref(null);
const statusModal = reactive({ open: false, title: '', message: '' });

const openNew = ref(false);
const openSchedule = ref(false);
const openStrategy = ref(false);

const createTask = () => {
  tasks.value.push({ name: taskForm.name, scene: taskForm.scene, priority: taskForm.priority, state: '排队' });
  openNew.value = false;
};

const startSchedule = () => {
  statusModal.title = '任务已排程';
  statusModal.message = `${scheduleTask.value} 已安排在 ${scheduleWindow.value}`;
  statusModal.open = true;
  openSchedule.value = false;
};

const saveStrategy = () => {
  statusModal.title = '策略已保存';
  statusModal.message = `${strategy.obstacle} 避障 / ${strategy.power} 模式 / ${strategy.feet} 已写入。`;
  statusModal.open = true;
  openStrategy.value = false;
};

const viewTask = (item) => {
  flow.value = {
    name: item.name,
    steps: ['连接检查', '视觉初始化', '姿态收敛', '路径规划', '执行动作', '结果上报']
  };
};
</script>
