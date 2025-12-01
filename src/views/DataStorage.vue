<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <div class="section-title">数据存储分布</div>
      <div class="chart-bars">
        <div v-for="bucket in buckets" :key="bucket.name" class="chart-bar" :style="{ height: `${bucket.usage}%`, background: bucket.color }">
          <span>{{ bucket.name }}</span>
        </div>
      </div>
      <div class="chip-bar">
        <span class="badge success">冷热分层</span>
        <span class="badge info">周备份正常</span>
      </div>
    </div>
    <div class="card">
      <div class="section-title">操作</div>
      <div class="flex-row">
        <button class="btn primary" @click="showReport=true">生成日报</button>
        <button class="btn outline" @click="showExport=true">导出数据</button>
        <button class="btn danger" @click="showPurge=true">清理策略</button>
      </div>
      <p class="muted">所有导出均记录到审计日志，可选择分区或模块生成报表。</p>
    </div>
  </div>

  <div class="card">
    <div class="section-title">报告与存档</div>
    <table class="table">
      <thead>
        <tr>
          <th>报告名称</th><th>类型</th><th>生成时间</th><th>状态</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in reports" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.time }}</td>
          <td><span class="badge" :class="row.status === '完成' ? 'success' : 'info'">{{ row.status }}</span></td>
          <td class="table-actions">
            <button class="btn outline" @click="openInfo(row)">详情</button>
            <button class="btn primary" @click="startDownload(row)">下载</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showReport" title="生成日报">
    <form class="modal-form" @submit.prevent="submitReport">
      <label>选择模块</label>
      <select v-model="reportForm.module" required>
        <option>系统监控与管理</option>
        <option>水质监测与分析</option>
        <option>设备状态与故障诊断</option>
        <option>数据存储与报告生成</option>
        <option>智能调度与优化</option>
      </select>
      <label>日期</label>
      <input type="date" v-model="reportForm.date" required />
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showReport=false">取消</button>
        <button class="btn primary" type="submit">生成</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showExport" title="导出数据">
    <form class="modal-form" @submit.prevent="submitExport">
      <label>数据范围</label>
      <select v-model="exportForm.range" required>
        <option>近24小时</option>
        <option>近7天</option>
        <option>自定义</option>
      </select>
      <label>格式</label>
      <select v-model="exportForm.format" required>
        <option>CSV</option>
        <option>Excel</option>
        <option>PDF</option>
      </select>
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showExport=false">取消</button>
        <button class="btn primary" type="submit">导出</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showPurge" title="清理策略">
    <p>按规则清理超过180天的冷数据，执行前请确认备份状态。</p>
    <div class="modal-actions">
      <button class="btn outline" @click="showPurge=false">关闭</button>
      <button class="btn danger" @click="runPurge">立即清理</button>
    </div>
  </BaseModal>

  <BaseModal v-model="showInfo" :title="infoTitle">
    <p>{{ infoContent }}</p>
    <div class="modal-actions"><button class="btn primary" @click="showInfo=false">关闭</button></div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="处理中" width="520px">
    <p>后台正在生成/下载文件，请稍候...</p>
    <div class="progress-track" style="margin-top:12px; height: 14px;">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const buckets = reactive([
  { name: '实时', usage: 82, color: 'linear-gradient(160deg, #2f80ed, #56ccf2)' },
  { name: '日归档', usage: 64, color: 'linear-gradient(160deg, #27ae60, #6fcf97)' },
  { name: '月归档', usage: 48, color: 'linear-gradient(160deg, #f2c94c, #f6d365)' },
  { name: '备份', usage: 42, color: 'linear-gradient(160deg, #9b51e0, #bb6bd9)' }
]);

const reports = reactive([
  { name: '供水运行日报', type: '系统监控与管理', time: '2024-06-01 07:05', status: '完成' },
  { name: '水质风险周报', type: '水质监测与分析', time: '2024-06-01 06:50', status: '完成' },
  { name: '设备可靠性月报', type: '设备状态与故障诊断', time: '2024-05-31 18:20', status: '完成' },
  { name: '数据资产盘点', type: '数据存储与报告生成', time: '2024-05-30 20:10', status: '完成' },
  { name: '优化调度报告A', type: '智能调度与优化', time: '2024-05-29 19:40', status: '完成' },
  { name: '雨季保障方案', type: '系统监控与管理', time: '2024-05-28 17:10', status: '完成' },
  { name: '夏季余氯保障', type: '水质监测与分析', time: '2024-05-27 16:30', status: '完成' },
  { name: '泵房振动巡检', type: '设备状态与故障诊断', time: '2024-05-26 15:05', status: '完成' },
  { name: '存储分层对账', type: '数据存储与报告生成', time: '2024-05-25 09:10', status: '完成' },
  { name: '能耗优化跟踪', type: '智能调度与优化', time: '2024-05-24 08:50', status: '完成' }
]);

const showReport = ref(false);
const showExport = ref(false);
const showPurge = ref(false);
const showInfo = ref(false);
const showProgress = ref(false);
const infoTitle = ref('');
const infoContent = ref('');
const progress = ref(0);
let timer;

const reportForm = reactive({ module: '系统监控与管理', date: '' });
const exportForm = reactive({ range: '近24小时', format: 'CSV' });

const runProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 500);
    }
  }, 500);
};

const submitReport = () => {
  runProgress();
  showReport.value = false;
  reports.unshift({ name: `${reportForm.module} 日报`, type: reportForm.module, time: new Date().toLocaleString(), status: '完成' });
};

const submitExport = () => {
  runProgress();
  showExport.value = false;
};

const runPurge = () => {
  runProgress();
  showPurge.value = false;
};

const openInfo = (row) => {
  infoTitle.value = row.name;
  infoContent.value = `${row.type} 于 ${row.time} 生成，状态：${row.status}`;
  showInfo.value = true;
};

const startDownload = (row) => {
  infoTitle.value = '下载准备';
  infoContent.value = `即将下载 ${row.name}，格式为PDF。`;
  showInfo.value = true;
  runProgress();
};
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-form textarea,
.modal-form input,
.modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f0;
  background: #f8fbff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
