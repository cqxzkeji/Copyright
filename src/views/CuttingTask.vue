<template>
  <div class="card" style="display: grid; gap: 16px;">
    <div class="grid responsive-grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
      <div class="card">
        <header style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0;">切割任务</h3>
            <p class="muted" style="margin: 4px 0 0;">至少保持 5 条计划并随时可调整</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="primary-btn" @click="showCreate = true">新建</button>
            <button class="secondary-btn" @click="showDispatch = true">调度</button>
          </div>
        </header>
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>材料</th>
              <th>厚度(mm)</th>
              <th>优先级</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.material }}</td>
              <td>{{ task.thickness }}</td>
              <td>{{ task.priority }}</td>
              <td>{{ task.state }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3 style="margin-top: 0;">排产分布</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
          <div class="stat" v-for="line in lines" :key="line.name">
            <small>{{ line.name }}</small>
            <strong>{{ line.load }}% 负载</strong>
            <div class="progress">
              <span :style="{ width: line.load + '%' }"></span>
            </div>
          </div>
        </div>
        <button class="secondary-btn" style="margin-top: 10px;" @click="showTip = true">查看分配准则</button>
      </div>
    </div>
    <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
      <div class="modal-card">
        <h3 style="margin: 0 0 8px;">新建切割任务</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
          <label class="field">
            <span>材料</span>
            <input v-model="form.material" placeholder="如 304 不锈钢" />
          </label>
          <label class="field">
            <span>厚度 (mm)</span>
            <input v-model="form.thickness" type="number" min="0" step="0.1" />
          </label>
          <label class="field">
            <span>优先级</span>
            <select v-model="form.priority">
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select>
          </label>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="showCreate = false">取消</button>
          <button class="primary-btn" @click="createTask">提交任务</button>
        </div>
      </div>
    </div>
    <div v-if="showDispatch" class="modal-backdrop" @click.self="showDispatch = false">
      <div class="modal-card">
        <h3>任务调度</h3>
        <p class="muted">根据设备负载分配队列，自动生成执行顺序。</p>
        <button class="primary-btn" @click="dispatch">立即调度</button>
      </div>
    </div>
    <div v-if="showTip" class="modal-backdrop" @click.self="showTip = false">
      <div class="modal-card">
        <h3>分配准则</h3>
        <ul style="margin: 0 0 12px; padding-left: 18px; color: #4b5563;">
          <li>优先级高的任务优先进入轻载机台。</li>
          <li>厚板优先匹配高功率设备。</li>
          <li>保持每条产线至少保留 10% 缓冲。</li>
        </ul>
        <button class="secondary-btn" @click="showTip = false">明白</button>
      </div>
    </div>
    <div v-if="showProgress" class="modal-backdrop">
      <div class="modal-card">
        <h3 style="margin: 0 0 8px;">正在调度</h3>
        <p class="muted">任务即将被重新排序并推送到设备队列。</p>
        <div class="progress" style="margin-top: 10px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tasks = ref([
  { id: 'CT-001', material: '304 不锈钢', thickness: 3.5, priority: '高', state: '排队' },
  { id: 'CT-002', material: '铝合金', thickness: 5.2, priority: '中', state: '执行中' },
  { id: 'CT-003', material: '铜板', thickness: 2.1, priority: '高', state: '准备' },
  { id: 'CT-004', material: '碳钢', thickness: 8.0, priority: '低', state: '排队' },
  { id: 'CT-005', material: '钛合金', thickness: 6.4, priority: '中', state: '完成' },
  { id: 'CT-006', material: '复合板', thickness: 4.0, priority: '高', state: '排队' }
]);

const lines = [
  { name: 'A 线 · 高功率', load: 62 },
  { name: 'B 线 · 精切', load: 44 },
  { name: 'C 线 · 快速', load: 71 },
  { name: 'D 线 · 样件', load: 33 }
];

const showCreate = ref(false);
const showDispatch = ref(false);
const showTip = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const form = reactive({ material: '', thickness: 1, priority: '高' });

const createTask = () => {
  tasks.value.push({
    id: `CT-${String(tasks.value.length + 1).padStart(3, '0')}`,
    material: form.material || '新材料',
    thickness: form.thickness,
    priority: form.priority,
    state: '排队'
  });
  showCreate.value = false;
};

const dispatch = () => {
  showDispatch.value = false;
  showProgress.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    } else {
      progress.value += 20;
    }
  }, 260);
};
</script>
