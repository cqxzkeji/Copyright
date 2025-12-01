<template>
  <div class="card">
    <h2>材料性能测试与评估</h2>
    <p class="helper-text">记录拉伸、透气与抗菌等实验结果，实时评估甘蔗纤维素纳米膜性能。</p>
    <div class="flex">
      <button @click="showSchedule = true">安排测试</button>
      <button @click="startTesting">批量测试</button>
      <button @click="showAlert = true">测试规范</button>
    </div>

    <div class="grid" style="margin-top: 16px;">
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">力学性能</div>
        <div class="chart">
          <div v-for="item in strengthData" :key="item.name" class="bar" :style="{ height: 70 + item.value * 1.3 + 'px', background: 'linear-gradient(180deg,#9cebff,#1ccad8)' }">
            <span>{{ item.value }} MPa</span>
            <small>{{ item.name }}</small>
          </div>
        </div>
      </div>
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">透气/抗菌</div>
        <div class="chart">
          <div v-for="item in barrierData" :key="item.name" class="bar" :style="{ height: 60 + item.value * 1.5 + 'px', background: 'linear-gradient(180deg,#ffe29f,#ff8c42)' }">
            <span>{{ item.value }}</span>
            <small>{{ item.name }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="badge">实验数据记录</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>样品</th>
              <th>断裂强度 (MPa)</th>
              <th>伸长率 (%)</th>
              <th>透气率 (mm/s)</th>
              <th>抗菌率 (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in results" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.breaking }}</td>
              <td>{{ row.elongation }}</td>
              <td>{{ row.air }}</td>
              <td>{{ row.antibacterial }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showSchedule" class="modal-mask">
    <div class="modal-container">
      <h3>安排测试</h3>
      <div class="grid">
        <div class="input-row">
          <label>测试批次</label>
          <input v-model="schedule.batch" />
        </div>
        <div class="input-row">
          <label>测试类型</label>
          <select v-model="schedule.type">
            <option>力学</option>
            <option>透气</option>
            <option>抗菌</option>
          </select>
        </div>
      </div>
      <div class="input-row">
        <label>备注</label>
        <textarea v-model="schedule.note" rows="3"></textarea>
      </div>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="showSchedule = false">保存排程</button>
      </div>
    </div>
  </div>

  <div v-if="showRun" class="modal-mask">
    <div class="modal-container">
      <h3>批量测试执行中</h3>
      <p>正在调用仪器完成批次测试，预计 20 秒。</p>
      <div class="progress"><div :style="{ width: progress + '%' }"></div></div>
      <p class="helper-text">记录数：{{ completed }}/{{ results.length }}</p>
    </div>
  </div>

  <div v-if="showAlert" class="modal-mask">
    <div class="modal-container">
      <h3>实验规范</h3>
      <ul>
        <li>样品需在 23℃、50%RH 条件下平衡 24 小时。</li>
        <li>透气测试使用 100 Pa 压差并记录 3 次平均值。</li>
        <li>抗菌率采用大肠杆菌抑制率评价，留样备份。</li>
      </ul>
      <div class="flex" style="justify-content: flex-end;">
        <button @click="showAlert = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue';

const strengthData = [
  { name: '纵向', value: 92 },
  { name: '横向', value: 78 },
  { name: '湿态', value: 66 },
  { name: '干态', value: 104 }
];

const barrierData = [
  { name: '透气率', value: 18 },
  { name: '水蒸气阻隔', value: 12 },
  { name: '抗菌率', value: 98 },
  { name: '接触角', value: 72 }
];

const results = [
  { id: 'S-01', breaking: 95, elongation: 5.8, air: 18.2, antibacterial: 96 },
  { id: 'S-02', breaking: 98, elongation: 6.1, air: 17.5, antibacterial: 97 },
  { id: 'S-03', breaking: 93, elongation: 5.6, air: 19.1, antibacterial: 95 },
  { id: 'S-04', breaking: 101, elongation: 6.4, air: 16.8, antibacterial: 98 },
  { id: 'S-05', breaking: 97, elongation: 6.0, air: 17.9, antibacterial: 96 },
  { id: 'S-06', breaking: 94, elongation: 5.7, air: 18.6, antibacterial: 94 },
  { id: 'S-07', breaking: 99, elongation: 6.2, air: 17.2, antibacterial: 97 },
  { id: 'S-08', breaking: 102, elongation: 6.5, air: 16.5, antibacterial: 99 },
  { id: 'S-09', breaking: 96, elongation: 5.9, air: 18.0, antibacterial: 95 },
  { id: 'S-10', breaking: 100, elongation: 6.3, air: 16.9, antibacterial: 98 }
];

const showSchedule = ref(false);
const showRun = ref(false);
const showAlert = ref(false);
const progress = ref(0);
const completed = ref(0);
let timer;

const schedule = reactive({ batch: 'BT-2024-06', type: '力学', note: '使用加湿后的样品' });

const startTesting = () => {
  showRun.value = true;
  progress.value = 0;
  completed.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
    completed.value = Math.min(results.length, completed.value + 1);
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showRun.value = false), 800);
    }
  }, 400);
};

onBeforeUnmount(() => clearInterval(timer));
</script>
