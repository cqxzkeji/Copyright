<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>质量检测与过程追溯</h2>
        <p>集成尺寸与表面检测数据，实现批次追溯与异常分析。</p>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="openRecord">录入检测</button>
        <button class="btn ghost" type="button" @click="openAnalysis">异常分析</button>
        <button class="btn ghost" type="button" @click="openExport">导出报告</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>尺寸合格率</h3>
        <svg viewBox="0 0 320 140" class="chart">
          <circle cx="80" cy="70" r="50" fill="#dbeafe" />
          <path d="M80 20 A50 50 0 1 1 45 110" fill="none" stroke="#2563eb" stroke-width="12" stroke-linecap="round" />
          <text x="65" y="78" font-size="16" fill="#1e40af">98.6%</text>
          <circle cx="220" cy="70" r="50" fill="#dcfce7" />
          <path d="M220 20 A50 50 0 1 1 200 118" fill="none" stroke="#16a34a" stroke-width="12" stroke-linecap="round" />
          <text x="205" y="78" font-size="16" fill="#166534">97.9%</text>
        </svg>
        <div class="legend">
          <span>成型尺寸</span>
          <span>打磨表面</span>
        </div>
      </div>
      <div class="card">
        <h3>质量指标</h3>
        <div class="kpi-list">
          <div>
            <strong>3</strong>
            <span>异常批次</span>
          </div>
          <div>
            <strong>1.2%</strong>
            <span>返工率</span>
          </div>
          <div>
            <strong>52 分钟</strong>
            <span>平均追溯时间</span>
          </div>
          <div>
            <strong>128 条</strong>
            <span>检测记录</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>质量检测记录</h3>
        <button class="btn ghost" type="button" @click="openTrace">批次追溯</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>记录号</th>
            <th>批次</th>
            <th>检测项目</th>
            <th>结果</th>
            <th>偏差</th>
            <th>检测员</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.record }}</td>
            <td>{{ row.batch }}</td>
            <td>{{ row.item }}</td>
            <td>{{ row.result }}</td>
            <td>{{ row.offset }}</td>
            <td>{{ row.inspector }}</td>
            <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :open="recordModal" title="录入检测" confirm-text="保存记录" @close="recordModal = false" @confirm="recordModal = false">
      <div class="form-grid">
        <label>
          批次号
          <input v-model="record.batch" type="text" />
        </label>
        <label>
          检测项目
          <select v-model="record.item">
            <option>尺寸</option>
            <option>表面粗糙度</option>
            <option>毛刺高度</option>
          </select>
        </label>
        <label>
          实测值
          <input v-model="record.value" type="text" />
        </label>
        <label>
          判定
          <select v-model="record.status">
            <option>合格</option>
            <option>待复检</option>
            <option>不合格</option>
          </select>
        </label>
        <label class="full">
          备注
          <textarea v-model="record.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="analysisModal" title="异常分析" confirm-text="生成分析" @close="analysisModal = false" @confirm="analysisModal = false">
      <p>SN-2024-078 批次尺寸偏差集中在成型阶段，建议检查模具磨损。</p>
      <div class="chips">
        <span>异常项：孔距偏差</span>
        <span>关联设备：FC-08</span>
        <span>原因：模具磨损</span>
      </div>
    </Modal>

    <Modal :open="exportModal" title="报告导出进度" @close="exportModal = false">
      <p>正在汇总检测记录与统计指标。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${exportProgress}%` }"></div>
      </div>
      <p class="muted">已完成 {{ exportProgress }}%，即将生成 PDF。</p>
    </Modal>

    <Modal :open="traceModal" title="批次追溯" @close="traceModal = false">
      <ul class="notice-list">
        <li>批次 SN-2024-082 成型时间：09:20-10:05</li>
        <li>打磨工位：W3/W4，耗时 42 分钟</li>
        <li>检测员：王质检，合格率 98.9%</li>
      </ul>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import Modal from '../components/Modal.vue';

const recordModal = ref(false);
const analysisModal = ref(false);
const exportModal = ref(false);
const traceModal = ref(false);
const exportProgress = ref(0);
let exportTimer;

const record = reactive({
  batch: 'SN-2024-082',
  item: '尺寸',
  value: '12.01 mm',
  status: '合格',
  note: '尺寸稳定，表面良好。'
});

const rows = computed(() =>
  Array.from({ length: 20 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      record: `QC-${String(200 + id).padStart(3, '0')}`,
      batch: `SN-2024-${String(70 + id).padStart(3, '0')}`,
      item: id % 2 === 0 ? '尺寸' : '表面粗糙度',
      result: id % 5 === 0 ? '超差' : '合格',
      offset: id % 5 === 0 ? '+0.08' : '+0.02',
      inspector: id % 3 === 0 ? '王质检' : '李质检',
      status: id % 5 === 0 ? '待复检' : '已通过',
      statusClass: id % 5 === 0 ? 'warn' : 'good'
    };
  })
);

const openRecord = () => {
  recordModal.value = true;
};

const openAnalysis = () => {
  analysisModal.value = true;
};

const openExport = () => {
  exportModal.value = true;
};

const openTrace = () => {
  traceModal.value = true;
};

watchEffect(() => {
  if (exportModal.value) {
    exportProgress.value = 0;
    exportTimer = setInterval(() => {
      exportProgress.value = Math.min(exportProgress.value + 11, 100);
      if (exportProgress.value === 100) {
        clearInterval(exportTimer);
      }
    }, 200);
  } else if (exportTimer) {
    clearInterval(exportTimer);
  }
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.module-header h2 {
  margin: 0;
  font-size: 20px;
}

.module-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.chart {
  width: 100%;
  height: 140px;
}

.legend {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.kpi-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.kpi-list strong {
  font-size: 18px;
  color: #1d4ed8;
}

.kpi-list span {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.table-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 8px;
  text-align: left;
}

thead {
  background: #e2e8f0;
}

tbody tr:nth-child(even) {
  background: #ffffff;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.good {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fee2e2;
  color: #b91c1c;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.2s ease;
}

.muted {
  color: #94a3b8;
  font-size: 12px;
}

.notice-list {
  padding-left: 18px;
  color: #475569;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.chips span {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}
</style>
