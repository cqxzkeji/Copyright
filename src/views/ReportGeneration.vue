<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>报告生成概览</h3>
      <div class="grid grid-3">
        <div>
          <p class="tag">今日生成</p>
          <h2>{{ metrics.generated }}</h2>
        </div>
        <div>
          <p class="tag">待审核</p>
          <h2>{{ metrics.pending }}</h2>
        </div>
        <div>
          <p class="tag">导出成功率</p>
          <h2>{{ metrics.exportRate }}%</h2>
        </div>
      </div>
      <svg width="100%" height="130" viewBox="0 0 420 130" role="img" style="margin-top: 12px;">
        <rect x="40" y="30" width="60" height="80" fill="#90caf9" />
        <rect x="140" y="50" width="60" height="60" fill="#a5d6a7" />
        <rect x="240" y="20" width="60" height="90" fill="#ffcc80" />
        <rect x="340" y="40" width="60" height="70" fill="#ce93d8" />
      </svg>
    </div>
    <div class="card">
      <h3>报告操作</h3>
      <p>自动生成检测报告，并支持定制化格式与导出建议。</p>
      <div style="margin-top: 16px;">
        <button class="primary" type="button" @click="openReportForm">生成报告</button>
        <button class="secondary" type="button" @click="openExport">导出报告</button>
        <button class="ghost" type="button" @click="openPreview">预览建议</button>
      </div>
      <div class="card" style="margin-top: 16px; background: #f7f9ff;">
        <h4>最新报告</h4>
        <ul>
          <li v-for="item in latest" :key="item.id">{{ item.time }} - {{ item.desc }}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>报告列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>报告编号</th>
          <th>车辆编号</th>
          <th>报告类型</th>
          <th>生成时间</th>
          <th>状态</th>
          <th>修复建议</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.vehicle }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.time }}</td>
          <td><span class="badge" :class="row.badge">{{ row.status }}</span></td>
          <td>{{ row.advice }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="showReportForm" title="生成检测报告" @close="showReportForm = false">
    <div class="form-grid">
      <div>
        <label>车辆编号</label>
        <input v-model="reportForm.vehicle" type="text" />
      </div>
      <div>
        <label>报告类型</label>
        <select v-model="reportForm.type">
          <option>综合诊断报告</option>
          <option>电池健康报告</option>
          <option>系统校准报告</option>
        </select>
      </div>
      <div>
        <label>输出格式</label>
        <select v-model="reportForm.format">
          <option>PDF</option>
          <option>Word</option>
          <option>Excel</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="submitReport">开始生成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showExport" title="导出进度" @close="closeExport">
    <p>正在打包导出所选报告。</p>
    <div class="progress" style="margin-top: 12px;">
      <span :style="{ width: exportProgress + '%' }"></span>
    </div>
    <p style="margin-top: 8px;">当前进度：{{ exportProgress }}%</p>
    <template #footer>
      <button class="secondary" type="button" @click="closeExport">后台导出</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showPreview" title="分析与修复建议" @close="showPreview = false">
    <p>建议优先处理电池热管理与 ECU 信号完整性，确保 SOC 预测精度高于 95%。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = reactive({
  generated: 26,
  pending: 4,
  exportRate: 98
});

const latest = [
  { id: 1, time: '09:05', desc: 'EV-2024-045 综合诊断报告完成' },
  { id: 2, time: '09:20', desc: 'EV-2024-046 电池健康报告完成' }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const statusOptions = ['已完成', '待审核', '生成中'];
  const badgeMap = ['success', 'warning', 'danger'];
  const statusIndex = index % 3;
  return {
    id: `R-${String(id).padStart(3, '0')}`,
    vehicle: `EV-2024-${String(200 + id).padStart(3, '0')}`,
    type: ['综合诊断', '电池健康', '系统自检'][index % 3],
    time: `2024-10-${String((index % 20) + 1).padStart(2, '0')} 1${index % 10}:00`,
    status: statusOptions[statusIndex],
    badge: badgeMap[statusIndex],
    advice: statusIndex === 2 ? '生成中' : '查看详情'
  };
});

const showReportForm = ref(false);
const showExport = ref(false);
const showPreview = ref(false);
const exportProgress = ref(0);
let timer;

const reportForm = reactive({
  vehicle: 'EV-2024-045',
  type: '综合诊断报告',
  format: 'PDF'
});

const openReportForm = () => {
  showReportForm.value = true;
};

const openExport = () => {
  showExport.value = true;
  exportProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (exportProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    exportProgress.value += 14;
  }, 220);
};

const closeExport = () => {
  showExport.value = false;
  clearInterval(timer);
};

const openPreview = () => {
  showPreview.value = true;
};

const submitReport = () => {
  showReportForm.value = false;
  showPreview.value = true;
};
</script>
