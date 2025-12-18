<template>
  <div class="content-card">
    <div class="section-title">质量追溯与监管</div>
    <div class="actions-row">
      <button class="primary-btn" @click="showCodeModal = true">生成溯源码</button>
      <button class="secondary-btn" @click="showInspectModal = true">上传抽检记录</button>
      <button class="secondary-btn" @click="startSync">监管对接</button>
    </div>

    <div class="card-grid" style="margin-top: 16px; align-items: stretch;">
      <div class="stat-card" style="grid-column: span 2; min-width: 320px;">
        <strong>风险预警走势</strong>
        <canvas ref="riskCanvas" height="120"></canvas>
      </div>
      <div class="stat-card">
        <div class="stat-label">当月合格率</div>
        <div class="stat-value">99.3%</div>
        <span class="badge">抽检 144 批 · 合格 143</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">监管接口</div>
        <div class="stat-value">4</div>
        <span class="badge">省级平台 / 市场监管 / 质检 / 海关</span>
      </div>
    </div>

    <div class="table-wrapper" style="margin-top: 18px;">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 8px;">
        <strong>批次质量与追溯</strong>
        <span class="tag">总计 {{ traceList.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>批次号</th>
            <th>产品</th>
            <th>检测结果</th>
            <th>检测机构</th>
            <th>报告编号</th>
            <th>溯源码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in traceList" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.product }}</td>
            <td>{{ row.result }}</td>
            <td>{{ row.lab }}</td>
            <td>{{ row.report }}</td>
            <td><span class="badge">{{ row.trace }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal title="生成溯源码" :show="showCodeModal" @close="showCodeModal = false">
    <form class="form-grid" @submit.prevent="createCode">
      <label>批次号<input v-model="codeForm.batch" required /></label>
      <label>产品名称<input v-model="codeForm.product" required /></label>
      <label>生产日期<input v-model="codeForm.date" type="date" required /></label>
      <label>有效期至<input v-model="codeForm.expire" type="date" required /></label>
      <label style="grid-column: span 2;">备注<textarea rows="3" v-model="codeForm.note"></textarea></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" class="secondary-btn" @click="showCodeModal = false">取消</button>
        <button type="submit" class="primary-btn">生成</button>
      </div>
    </form>
  </Modal>

  <Modal title="抽检记录" :show="showInspectModal" @close="showInspectModal = false">
    <form class="form-grid" @submit.prevent="submitInspect">
      <label>检测机构<input v-model="inspectForm.lab" required /></label>
      <label>检测项目<input v-model="inspectForm.item" required /></label>
      <label>批次号<input v-model="inspectForm.batch" required /></label>
      <label>结论<select v-model="inspectForm.result">
        <option>合格</option>
        <option>限量合格</option>
        <option>复检中</option>
      </select></label>
      <label style="grid-column: span 2;">说明<textarea rows="3" v-model="inspectForm.desc"></textarea></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" class="secondary-btn" @click="showInspectModal = false">取消</button>
        <button type="submit" class="primary-btn">上传记录</button>
      </div>
    </form>
  </Modal>

  <Modal title="监管平台同步" :show="showSyncModal" @close="showSyncModal = false">
    <p>正在推送批次检测数据和溯源二维码。</p>
    <div class="progress-track" style="margin: 12px 0;">
      <div class="progress-bar" :style="{ width: syncProgress + '%' }"></div>
    </div>
    <p style="margin:0;">同步进度：{{ syncProgress }}%</p>
  </Modal>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import Modal from '../components/Modal.vue';

const traceList = [
  { id: 'QC-7101', product: '番茄', result: '合格', lab: '省农科院', report: 'REP-3201', trace: 'TR-9001' },
  { id: 'QC-7102', product: '草莓', result: '合格', lab: '市农检中心', report: 'REP-3202', trace: 'TR-9002' },
  { id: 'QC-7103', product: '生菜', result: '合格', lab: '省农科院', report: 'REP-3203', trace: 'TR-9003' },
  { id: 'QC-7104', product: '青椒', result: '限量合格', lab: '第三方检测', report: 'REP-3204', trace: 'TR-9004' },
  { id: 'QC-7105', product: '玉米', result: '合格', lab: '市农检中心', report: 'REP-3205', trace: 'TR-9005' },
  { id: 'QC-7106', product: '土豆', result: '合格', lab: '省农科院', report: 'REP-3206', trace: 'TR-9006' },
  { id: 'QC-7107', product: '黄瓜', result: '合格', lab: '第三方检测', report: 'REP-3207', trace: 'TR-9007' },
  { id: 'QC-7108', product: '茄子', result: '复检中', lab: '市农检中心', report: 'REP-3208', trace: 'TR-9008' },
  { id: 'QC-7109', product: '油菜', result: '合格', lab: '第三方检测', report: 'REP-3209', trace: 'TR-9009' },
  { id: 'QC-7110', product: '大豆', result: '合格', lab: '省农科院', report: 'REP-3210', trace: 'TR-9010' }
];

const showCodeModal = ref(false);
const showInspectModal = ref(false);
const showSyncModal = ref(false);
const syncProgress = ref(0);
const timer = ref(null);

const codeForm = reactive({ batch: '', product: '', date: '', expire: '', note: '' });
const inspectForm = reactive({ lab: '', item: '', batch: '', result: '合格', desc: '' });

const riskCanvas = ref(null);
let chartInstance;

onMounted(() => {
  chartInstance = new Chart(riskCanvas.value, {
    type: 'line',
    data: {
      labels: ['01日', '05日', '09日', '13日', '17日', '21日', '25日', '29日'],
      datasets: [
        {
          label: '风险预警指数',
          data: [6, 10, 8, 12, 9, 7, 5, 4],
          borderColor: '#ef476f',
          backgroundColor: 'rgba(239, 71, 111, 0.15)',
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#ef476f'
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, suggestedMax: 14 } }
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  clearInterval(timer.value);
});

const createCode = () => {
  alert(`批次 ${codeForm.batch} 已生成溯源码`);
  showCodeModal.value = false;
};

const submitInspect = () => {
  alert(`已上传 ${inspectForm.batch} 抽检：${inspectForm.result}`);
  showInspectModal.value = false;
};

const startSync = () => {
  syncProgress.value = 0;
  showSyncModal.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (syncProgress.value >= 100) {
      clearInterval(timer.value);
      return;
    }
    syncProgress.value += 14;
  }, 420);
};
</script>
