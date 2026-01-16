<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>运行监控与数据分析决策</h2>
        <p>设备利用率、节拍效率、在制品状态可视化与优化建议。</p>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="openRefresh">刷新指标</button>
        <button class="btn ghost" type="button" @click="openBottleneck">瓶颈识别</button>
        <button class="btn ghost" type="button" @click="openExport">导出看板</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>设备利用率</h3>
        <svg viewBox="0 0 320 140" class="chart">
          <rect x="20" y="30" width="40" height="90" fill="#bfdbfe" />
          <rect x="80" y="20" width="40" height="100" fill="#93c5fd" />
          <rect x="140" y="40" width="40" height="80" fill="#60a5fa" />
          <rect x="200" y="15" width="40" height="105" fill="#3b82f6" />
          <rect x="260" y="35" width="40" height="85" fill="#1d4ed8" />
        </svg>
        <div class="legend">
          <span>冲压</span>
          <span>锻造</span>
          <span>热处理</span>
          <span>打磨</span>
          <span>检测</span>
        </div>
      </div>
      <div class="card">
        <h3>关键指标</h3>
        <div class="kpi-list">
          <div>
            <strong>88%</strong>
            <span>设备利用率</span>
          </div>
          <div>
            <strong>52 秒</strong>
            <span>平均节拍</span>
          </div>
          <div>
            <strong>318 件</strong>
            <span>在制品</span>
          </div>
          <div>
            <strong>4.2 小时</strong>
            <span>预计完工</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>设备与产线监控数据</h3>
        <button class="btn ghost" type="button" @click="openAlert">告警详情</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>产线</th>
            <th>设备</th>
            <th>利用率</th>
            <th>节拍</th>
            <th>在制品</th>
            <th>瓶颈指数</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.line }}</td>
            <td>{{ row.device }}</td>
            <td>{{ row.utilization }}</td>
            <td>{{ row.takt }}</td>
            <td>{{ row.wip }}</td>
            <td>{{ row.bottleneck }}</td>
            <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :open="refreshModal" title="指标刷新" @close="refreshModal = false">
      <p>系统正在拉取最新设备状态与产线指标。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${refreshProgress}%` }"></div>
      </div>
      <p class="muted">已完成 {{ refreshProgress }}%，稍后自动更新。</p>
    </Modal>

    <Modal :open="bottleneckModal" title="瓶颈识别" confirm-text="生成建议" @close="bottleneckModal = false" @confirm="bottleneckModal = false">
      <ul class="notice-list">
        <li>打磨 2 号线瓶颈指数 0.82，建议调整任务顺序。</li>
        <li>冲压 3 号线利用率偏低，可转移部分工单。</li>
        <li>检测工位待检积压 46 件，建议增加临时班次。</li>
      </ul>
    </Modal>

    <Modal :open="exportModal" title="导出看板" confirm-text="生成报表" @close="exportModal = false" @confirm="exportModal = false">
      <div class="form-grid">
        <label>
          报表周期
          <select v-model="exportForm.range">
            <option>今日</option>
            <option>本周</option>
            <option>本月</option>
          </select>
        </label>
        <label>
          格式
          <select v-model="exportForm.type">
            <option>PDF</option>
            <option>Excel</option>
          </select>
        </label>
        <label class="full">
          备注
          <textarea v-model="exportForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="alertModal" title="告警详情" @close="alertModal = false">
      <ul class="notice-list">
        <li>FC-06 设备温度波动，已安排工程师巡检。</li>
        <li>GM-03 打磨机震动超标，建议减速运行。</li>
        <li>QC-02 检测仪需校准，预计 14:30 完成。</li>
      </ul>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import Modal from '../components/Modal.vue';

const refreshModal = ref(false);
const bottleneckModal = ref(false);
const exportModal = ref(false);
const alertModal = ref(false);
const refreshProgress = ref(0);
let refreshTimer;

const exportForm = reactive({
  range: '本周',
  type: 'PDF',
  note: '包含成型与打磨关键指标。'
});

const rows = computed(() =>
  Array.from({ length: 22 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      line: `L-${(id % 5) + 1}`,
      device: id % 2 === 0 ? `FC-${String(id).padStart(2, '0')}` : `GM-${String(id).padStart(2, '0')}`,
      utilization: `${78 + (id % 7)}%`,
      takt: `${48 + (id % 6)} 秒`,
      wip: 20 + (id % 9) * 6,
      bottleneck: (0.6 + (id % 5) * 0.08).toFixed(2),
      status: id % 6 === 0 ? '关注' : '正常',
      statusClass: id % 6 === 0 ? 'warn' : 'good'
    };
  })
);

const openRefresh = () => {
  refreshModal.value = true;
};

const openBottleneck = () => {
  bottleneckModal.value = true;
};

const openExport = () => {
  exportModal.value = true;
};

const openAlert = () => {
  alertModal.value = true;
};

watchEffect(() => {
  if (refreshModal.value) {
    refreshProgress.value = 0;
    refreshTimer = setInterval(() => {
      refreshProgress.value = Math.min(refreshProgress.value + 13, 100);
      if (refreshProgress.value === 100) {
        clearInterval(refreshTimer);
      }
    }, 180);
  } else if (refreshTimer) {
    clearInterval(refreshTimer);
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
</style>
