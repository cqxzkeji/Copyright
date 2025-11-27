<template>
  <div class="card" style="display: grid; gap: 14px;">
    <header style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div>
        <h3 style="margin: 0;">数据分析与报告</h3>
        <p class="muted" style="margin: 4px 0 0;">产能、能耗与稳定性图表齐备，点击按钮弹出报告</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="primary-btn" @click="showExport = true">导出报告</button>
        <button class="secondary-btn" @click="showInsight = true">分析说明</button>
      </div>
    </header>

    <div class="grid responsive-grid" style="grid-template-columns: 1.4fr 1fr;">
      <div class="card">
        <h4 style="margin: 0 0 8px;">产量与良率</h4>
        <svg viewBox="0 0 240 140" style="width: 100%; height: auto;">
          <rect x="10" y="15" width="220" height="110" rx="14" fill="#fff" stroke="#e5e7eb" />
          <polyline points="20,110 60,80 100,90 140,60 180,70 220,50" stroke="#4ea8de" fill="none" stroke-width="4" />
          <polyline points="20,100 60,70 100,60 140,50 180,45 220,40" stroke="#16a34a" fill="none" stroke-width="3" />
        </svg>
        <p class="muted">蓝色为产量，绿色为良率趋势，两条曲线均维持在目标之上。</p>
      </div>
      <div class="card">
        <h4 style="margin: 0 0 8px;">能耗分布</h4>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">
          <div v-for="item in energy" :key="item.name" class="stat">
            <small>{{ item.name }}</small>
            <strong>{{ item.value }} kWh</strong>
            <div class="progress">
              <span :style="{ width: item.value + '%' }"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h4 style="margin: 0 0 8px;">过程数据</h4>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>材料</th>
            <th>耗时(min)</th>
            <th>偏差(μm)</th>
            <th>能耗(kWh)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.material }}</td>
            <td>{{ row.duration }}</td>
            <td>{{ row.deviation }}</td>
            <td>{{ row.energy }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showExport" class="modal-backdrop" @click.self="showExport = false">
      <div class="modal-card">
        <h3>导出报告</h3>
        <p class="muted">选择导出格式与邮件分发，报告包含所有趋势图与表格。</p>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          <label class="field">
            <span>格式</span>
            <select v-model="exportForm.format">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </label>
          <label class="field">
            <span>邮件</span>
            <input v-model="exportForm.email" placeholder="ops@example.com" />
          </label>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="showExport = false">取消</button>
          <button class="primary-btn" @click="exportReport">发送</button>
        </div>
      </div>
    </div>

    <div v-if="showInsight" class="modal-backdrop" @click.self="showInsight = false">
      <div class="modal-card">
        <h3>分析说明</h3>
        <p class="muted">所有图表均实时采集，若需校验请比对维保记录与任务日志。</p>
        <button class="secondary-btn" @click="showInsight = false">知道了</button>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop">
      <div class="modal-card">
        <h3>生成报告</h3>
        <p class="muted">正在汇总过程数据、趋势图与设备告警信息...</p>
        <div class="progress" style="margin-top: 10px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const rows = [
  { batch: 'B-01', material: '不锈钢', duration: 26, deviation: 8.4, energy: 42 },
  { batch: 'B-02', material: '铝合金', duration: 18, deviation: 6.1, energy: 35 },
  { batch: 'B-03', material: '铜板', duration: 22, deviation: 7.2, energy: 38 },
  { batch: 'B-04', material: '碳钢', duration: 30, deviation: 9.5, energy: 45 },
  { batch: 'B-05', material: '钛合金', duration: 28, deviation: 6.8, energy: 41 },
  { batch: 'B-06', material: '复合板', duration: 24, deviation: 7.0, energy: 39 }
];

const energy = [
  { name: '激光', value: 42 },
  { name: '伺服', value: 28 },
  { name: '冷却', value: 18 },
  { name: '气体', value: 12 }
];

const showExport = ref(false);
const showInsight = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const exportForm = reactive({ format: 'PDF', email: 'ops@example.com' });

const exportReport = () => {
  showExport.value = false;
  showProgress.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    } else {
      progress.value += 20;
    }
  }, 300);
};
</script>
