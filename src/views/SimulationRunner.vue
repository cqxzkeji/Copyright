<template>
  <div class="grid" style="grid-template-columns: 1fr 1fr;">
    <div class="card">
      <div class="flex-between">
        <div class="section-title">自动化运行</div>
        <span class="badge">WRF & WRF-Chem</span>
      </div>
      <p class="muted">支持多线程、队列任务以及自动重启。</p>
      <div class="toolbar">
        <button @click="startRun">启动模拟</button>
        <button @click="openForm">设置任务</button>
      </div>
      <div class="grid" style="margin-top:12px; gap:10px;">
        <div v-for="task in tasks" :key="task.name" class="card" style="background:#f8fafc;">
          <div class="flex-between">
            <div>{{ task.name }}</div>
            <span class="badge" :class="task.status === '成功' ? 'tag-success' : task.status === '排队' ? 'tag-warning' : ''">{{ task.status }}</span>
          </div>
          <div class="progress-bar" style="margin-top:8px;">
            <div class="progress-inner" :style="{ width: task.progress + '%' }"></div>
          </div>
          <div class="muted" style="margin-top:6px;">{{ task.note }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <div class="section-title">进度与日志</div>
        <span class="badge">监控</span>
      </div>
      <p class="muted">实时查看节点状态与关键日志片段。</p>
      <table class="table">
        <thead>
          <tr>
            <th>节点</th><th>CPU</th><th>内存</th><th>状态</th><th>最近日志</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="node in nodes" :key="node.name">
            <td>{{ node.name }}</td>
            <td>{{ node.cpu }}</td>
            <td>{{ node.mem }}</td>
            <td>{{ node.status }}</td>
            <td>{{ node.log }}</td>
          </tr>
        </tbody>
      </table>
      <div class="toolbar" style="margin-top: 10px;">
        <button @click="showLog = true">查看完整日志</button>
        <button @click="validateFiles">完整性检查</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="flex-between">
      <div class="section-title">结果自动校验</div>
      <span class="badge">异常捕获</span>
    </div>
    <p class="muted">自动检查输出文件是否齐全并捕获异常。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
      <div v-for="check in checks" :key="check.name" class="card" style="background:#f8fafc;">
        <div class="flex-between">
          <div>{{ check.name }}</div>
          <span class="badge" :class="check.ok ? 'tag-success' : 'tag-warning'">{{ check.ok ? '通过' : '缺失' }}</span>
        </div>
        <div class="progress-bar" style="margin-top:8px;">
          <div class="progress-inner" :style="{ width: check.score + '%' }"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showForm" class="modal-overlay" @click.self="showForm=false">
    <div class="modal">
      <h3>配置运行任务</h3>
      <form class="grid" style="gap:12px;" @submit.prevent="saveTask">
        <div>
          <label>开始时间</label>
          <input v-model="form.start" type="datetime-local" required />
        </div>
        <div>
          <label>模拟时长 (小时)</label>
          <input v-model.number="form.hours" type="number" min="1" max="240" required />
        </div>
        <div>
          <label>使用队列</label>
          <select v-model="form.queue">
            <option>normal</option>
            <option>gpu</option>
            <option>debug</option>
          </select>
        </div>
        <div class="toolbar">
          <button type="submit">保存</button>
          <button type="button" @click="showForm=false">取消</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showLog" class="modal-overlay" @click.self="showLog=false">
    <div class="modal">
      <h3>关键日志</h3>
      <p v-for="(line, idx) in logs" :key="idx" style="margin:6px 0; font-family:monospace;">{{ line }}</p>
      <div class="toolbar">
        <button @click="showLog=false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tasks = reactive([
  { name: 'WRF-Chem 36h 预报', status: '运行中', progress: 68, note: '正在积分至 18h' },
  { name: '伴随灵敏度试验', status: '排队', progress: 5, note: '等待计算节点' },
  { name: '资料同化循环', status: '成功', progress: 100, note: '06Z 完成同化' }
]);

const nodes = [
  { name: 'node01', cpu: '76%', mem: '65%', status: '正常', log: 'chem driver init ok' },
  { name: 'node02', cpu: '58%', mem: '49%', status: '正常', log: 'spin-up 12km' },
  { name: 'node03', cpu: '92%', mem: '81%', status: '紧张', log: 'nested d03' },
  { name: 'node04', cpu: '33%', mem: '40%', status: '待机', log: '队列等待' },
  { name: 'node05', cpu: '61%', mem: '55%', status: '正常', log: 'postpro running' }
];

const checks = [
  { name: 'wrfout_d01', ok: true, score: 100 },
  { name: 'wrfchemi_d01', ok: true, score: 100 },
  { name: 'wrfbdy_d02', ok: false, score: 45 },
  { name: 'auxhist_d03', ok: true, score: 88 },
  { name: 'met_em_d04', ok: true, score: 92 }
];

const logs = [
  '[2024-04-02 08:10] Chem module initialized',
  '[2024-04-02 08:12] Read emission FINN fire spots',
  '[2024-04-02 08:17] Domain 2 completed 10 steps',
  '[2024-04-02 08:21] IO: write wrfout_d02_2024-04-02_06:00:00'
];

const showForm = ref(false);
const showLog = ref(false);
const form = reactive({ start: '', hours: 48, queue: 'normal' });

const startRun = () => {
  tasks[0].progress = Math.min(100, tasks[0].progress + 10);
  alert('模拟已提交队列，自动监控开始');
};

const openForm = () => {
  showForm.value = true;
};

const saveTask = () => {
  alert(`任务已保存：${form.start} +${form.hours}h，队列 ${form.queue}`);
  showForm.value = false;
};

const validateFiles = () => {
  alert('已完成输出完整性检查，缺失文件已高亮');
};
</script>
