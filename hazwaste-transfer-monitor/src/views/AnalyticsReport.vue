<template>
  <div>
    <div class="section-header">
      <h2>统计分析与追溯</h2>
      <div class="button-group">
        <button class="btn" @click="openModal('report')">生成统计报表</button>
        <button class="btn outline" @click="openModal('trace')">全过程追溯</button>
        <button class="btn secondary" @click="openModal('analyze')">异常率分析</button>
        <button class="btn secondary" @click="openModal('export')">报表导出</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h3>本月转运量</h3>
        <p>1,240 吨</p>
      </div>
      <div class="card">
        <h3>异常率</h3>
        <p>1.7%</p>
      </div>
      <div class="card">
        <h3>重点企业</h3>
        <p>8 家需重点关注</p>
      </div>
      <div class="card">
        <h3>报表导出</h3>
        <p>12 次/周</p>
      </div>
    </div>

    <div class="chart-box">
      <div class="chart card">
        <strong>转运量趋势</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in volumeBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
      <div class="chart card">
        <strong>异常率走势</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in anomalyBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2>转运统计明细</h2>
        <div class="tag">共 {{ analyticsRows.length }} 条</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>企业</th>
            <th>转运量(吨)</th>
            <th>异常次数</th>
            <th>追溯状态</th>
            <th>报告</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in analyticsRows" :key="row.date">
            <td>{{ row.date }}</td>
            <td>{{ row.enterprise }}</td>
            <td>{{ row.volume }}</td>
            <td>{{ row.anomaly }}</td>
            <td>{{ row.trace }}</td>
            <td>{{ row.report }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="modalState === 'report'" title="生成统计报表" @close="closeModal">
      <form>
        <div>
          <label>统计周期</label>
          <select>
            <option>本月</option>
            <option>最近季度</option>
            <option>自定义</option>
          </select>
        </div>
        <div>
          <label>包含指标</label>
          <input placeholder="转运量、异常率、追溯闭环" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">生成报表</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'trace'" title="全过程追溯" @close="closeModal">
      <form>
        <div>
          <label>批次或联单编号</label>
          <input placeholder="BCH-240920 / MN-240915" />
        </div>
        <div>
          <label>追溯范围</label>
          <select>
            <option>全流程</option>
            <option>出库-运输</option>
            <option>运输-处置</option>
          </select>
        </div>
        <div>
          <label>备注</label>
          <textarea rows="3" placeholder="填写追溯需求" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">发起追溯</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'analyze'" title="异常率分析" @close="closeModal">
      <p>异常率分析已完成，当前高风险路线：滨海-西部段。</p>
      <ul>
        <li>偏航占比 55%</li>
        <li>超时占比 30%</li>
        <li>超速占比 15%</li>
      </ul>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">确认</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'export'" title="报表导出" @close="closeModal">
      <p>正在打包报表数据。</p>
      <div class="progress-bar">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p>导出进度 {{ progress }}%</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">完成</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const modalState = ref('');
const progress = ref(0);

const volumeBars = [45, 60, 70, 55, 80, 65, 75];
const anomalyBars = [30, 25, 35, 20, 28, 22, 18];

const analyticsRows = [
  { date: '09-01', enterprise: '华北化工厂', volume: 62, anomaly: 1, trace: '已闭环', report: '查看' },
  { date: '09-02', enterprise: '顺达电子', volume: 54, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-03', enterprise: '新港物流', volume: 48, anomaly: 1, trace: '追溯中', report: '查看' },
  { date: '09-04', enterprise: '晨光电镀', volume: 71, anomaly: 2, trace: '待核查', report: '查看' },
  { date: '09-05', enterprise: '泰和机械', volume: 58, anomaly: 1, trace: '已闭环', report: '查看' },
  { date: '09-06', enterprise: '海辰石化', volume: 66, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-07', enterprise: '天成电池', volume: 44, anomaly: 1, trace: '追溯中', report: '查看' },
  { date: '09-08', enterprise: '绿源建材', volume: 52, anomaly: 1, trace: '待核查', report: '查看' },
  { date: '09-09', enterprise: '正航金属', volume: 59, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-10', enterprise: '诚益机械', volume: 63, anomaly: 1, trace: '已闭环', report: '查看' },
  { date: '09-11', enterprise: '泰宁制药', volume: 47, anomaly: 2, trace: '追溯中', report: '查看' },
  { date: '09-12', enterprise: '晨光电镀', volume: 60, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-13', enterprise: '华北化工厂', volume: 68, anomaly: 1, trace: '待核查', report: '查看' },
  { date: '09-14', enterprise: '顺达电子', volume: 51, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-15', enterprise: '新港物流', volume: 49, anomaly: 1, trace: '追溯中', report: '查看' },
  { date: '09-16', enterprise: '海辰石化', volume: 72, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-17', enterprise: '天成电池', volume: 46, anomaly: 1, trace: '待核查', report: '查看' },
  { date: '09-18', enterprise: '绿源建材', volume: 55, anomaly: 0, trace: '已闭环', report: '查看' },
  { date: '09-19', enterprise: '正航金属', volume: 57, anomaly: 2, trace: '追溯中', report: '查看' },
  { date: '09-20', enterprise: '诚益机械', volume: 61, anomaly: 0, trace: '已闭环', report: '查看' }
];

const openModal = (state) => {
  modalState.value = state;
  if (state === 'export') {
    progress.value = 0;
    const interval = setInterval(() => {
      progress.value = Math.min(progress.value + 20, 100);
      if (progress.value >= 100) {
        clearInterval(interval);
      }
    }, 120);
  }
};

const closeModal = () => {
  modalState.value = '';
};

const saveModal = () => {
  modalState.value = '';
};
</script>
