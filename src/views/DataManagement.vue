<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>数据存储概览</h3>
      <div class="grid grid-3">
        <div>
          <p class="tag">今日入库</p>
          <h2>{{ metrics.today }} 条</h2>
        </div>
        <div>
          <p class="tag">历史归档</p>
          <h2>{{ metrics.archive }} TB</h2>
        </div>
        <div>
          <p class="tag">完整性</p>
          <h2>{{ metrics.integrity }}%</h2>
        </div>
      </div>
      <svg width="100%" height="130" viewBox="0 0 420 130" role="img" style="margin-top: 12px;">
        <polyline
          fill="none"
          stroke="#5ea3ff"
          stroke-width="4"
          points="0,90 60,80 120,70 180,60 240,55 300,45 360,30 420,20"
        />
        <circle cx="420" cy="20" r="5" fill="#2656ff" />
      </svg>
    </div>
    <div class="card">
      <h3>数据管理操作</h3>
      <p>支持查询、统计分析与备份归档，确保数据可追溯。</p>
      <div style="margin-top: 16px;">
        <button class="primary" type="button" @click="openQuery">查询数据</button>
        <button class="secondary" type="button" @click="openBackup">备份归档</button>
        <button class="ghost" type="button" @click="openTip">完整性说明</button>
      </div>
      <div class="card" style="margin-top: 16px; background: #f7f9ff;">
        <h4>最新入库记录</h4>
        <ul>
          <li v-for="item in recent" :key="item.id">{{ item.time }} - {{ item.desc }}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>历史检测数据</h3>
    <table class="table">
      <thead>
        <tr>
          <th>记录号</th>
          <th>车辆编号</th>
          <th>检测日期</th>
          <th>检测模块</th>
          <th>结果</th>
          <th>归档状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.vehicle }}</td>
          <td>{{ row.date }}</td>
          <td>{{ row.module }}</td>
          <td><span class="badge" :class="row.badge">{{ row.result }}</span></td>
          <td>{{ row.archive }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="showQuery" title="查询检测数据" @close="showQuery = false">
    <div class="form-grid">
      <div>
        <label>车辆编号</label>
        <input v-model="queryForm.vehicle" type="text" placeholder="输入车辆编号" />
      </div>
      <div>
        <label>检测模块</label>
        <select v-model="queryForm.module">
          <option>车辆诊断</option>
          <option>故障预警</option>
          <option>系统自检</option>
          <option>报告生成</option>
        </select>
      </div>
      <div>
        <label>日期范围</label>
        <input v-model="queryForm.range" type="text" placeholder="2024-10-01 至 2024-10-15" />
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="submitQuery">开始查询</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showBackup" title="备份归档进度" @close="closeBackup">
    <p>正在将近 30 天数据归档至冷备仓库。</p>
    <div class="progress" style="margin-top: 12px;">
      <span :style="{ width: backupProgress + '%' }"></span>
    </div>
    <p style="margin-top: 8px;">当前进度：{{ backupProgress }}%</p>
    <template #footer>
      <button class="secondary" type="button" @click="closeBackup">后台运行</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showTip" title="数据完整性说明" @close="showTip = false">
    <p>系统为每条记录生成 SHA-256 校验码并按日归档，完整性低于 98% 时自动触发复核流程。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = reactive({
  today: 468,
  archive: 12.4,
  integrity: 99.2
});

const recent = [
  { id: 1, time: '08:30', desc: 'EV-2024-021 检测数据入库完成' },
  { id: 2, time: '08:52', desc: 'EV-2024-022 报告归档完成' }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const resultOptions = ['合格', '待复核', '异常'];
  const badgeMap = ['success', 'warning', 'danger'];
  const resultIndex = index % 3;
  return {
    id: `M-${String(id).padStart(3, '0')}`,
    vehicle: `EV-2024-${String(100 + id).padStart(3, '0')}`,
    date: `2024-10-${String((index % 20) + 1).padStart(2, '0')}`,
    module: ['车辆诊断', '故障预警', '系统自检', '报告生成'][index % 4],
    result: resultOptions[resultIndex],
    badge: badgeMap[resultIndex],
    archive: index % 2 === 0 ? '已归档' : '待归档'
  };
});

const showQuery = ref(false);
const showBackup = ref(false);
const showTip = ref(false);
const backupProgress = ref(0);
let timer;

const queryForm = reactive({
  vehicle: '',
  module: '车辆诊断',
  range: ''
});

const openQuery = () => {
  showQuery.value = true;
};

const openBackup = () => {
  showBackup.value = true;
  backupProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (backupProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    backupProgress.value += 10;
  }, 250);
};

const closeBackup = () => {
  showBackup.value = false;
  clearInterval(timer);
};

const openTip = () => {
  showTip.value = true;
};

const submitQuery = () => {
  showQuery.value = false;
  showTip.value = true;
};
</script>
