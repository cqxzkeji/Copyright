<template>
  <section class="grid" style="grid-template-columns: 1.3fr 1fr; align-items: start;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>监测数据</h2>
          <p>展示各监测点的实时总磷与透明度</p>
        </div>
        <div class="section-actions">
          <button class="btn primary" @click="openFilter">筛选数据</button>
          <button class="btn" @click="openExport">导出报表</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>监测点</th>
            <th>总磷(mg/L)</th>
            <th>透明度(cm)</th>
            <th>更新时间</th>
            <th>风险级别</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.site">
            <td>{{ row.site }}</td>
            <td>{{ row.tp }}</td>
            <td>{{ row.sd }}</td>
            <td>{{ row.time }}</td>
            <td><span class="badge">{{ row.risk }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>走势分析</h2>
          <p>对比总磷下降趋势与透明度提升</p>
        </div>
        <button class="btn" @click="openInsight">查看结论</button>
      </header>
      <div class="chart">
        <div v-for="point in trend" :key="point.day" class="bar" :style="{ height: `${point.tp}%` }">
          <span>{{ point.day }}</span>
          <strong>{{ point.tp }}%</strong>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showFilter" class="modal-backdrop" @click.self="showFilter = false">
    <div class="modal">
      <header>
        <span>筛选条件</span>
        <button class="btn" @click="showFilter = false">关闭</button>
      </header>
      <form class="form" @submit.prevent="applyFilter">
        <label>风险级别<select v-model="filter.risk"><option value="">全部</option><option>低</option><option>中</option><option>高</option></select></label>
        <label>透明度下限<input v-model.number="filter.sd" type="number" placeholder="cm" /></label>
        <footer>
          <button class="btn" type="button" @click="showFilter = false">取消</button>
          <button class="btn primary" type="submit">应用</button>
        </footer>
      </form>
    </div>
  </div>

  <div v-if="showExport" class="modal-backdrop" @click.self="showExport = false">
    <div class="modal">
      <header>
        <span>导出报表</span>
        <button class="btn" @click="showExport = false">关闭</button>
      </header>
      <p>正在生成数据分析报表，请稍候。</p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${exportProgress}%` }"></div>
      </div>
      <footer>
        <button class="btn primary" @click="simulateExport">重新导出</button>
      </footer>
    </div>
  </div>

  <div v-if="showInsight" class="modal-backdrop" @click.self="showInsight = false">
    <div class="modal">
      <header>
        <span>分析结论</span>
        <button class="btn" @click="showInsight = false">关闭</button>
      </header>
      <ul>
        <li>近 7 天总磷平均下降 12%，透明度提升 15 cm。</li>
        <li>高风险点集中在入湖口，建议提高投加量。</li>
        <li>低风险点可转入维持性监测，减少检测频次。</li>
      </ul>
      <footer>
        <button class="btn primary" @click="showInsight = false">我已阅读</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const baseRows = [
  { site: 'A1', tp: 0.12, sd: 35, time: '09:00', risk: '中' },
  { site: 'A2', tp: 0.08, sd: 42, time: '09:05', risk: '低' },
  { site: 'B1', tp: 0.16, sd: 30, time: '09:10', risk: '中' },
  { site: 'B2', tp: 0.21, sd: 24, time: '09:12', risk: '高' },
  { site: 'C1', tp: 0.10, sd: 40, time: '09:15', risk: '低' },
  { site: 'C2', tp: 0.18, sd: 32, time: '09:17', risk: '中' },
  { site: 'D1', tp: 0.14, sd: 36, time: '09:20', risk: '低' },
  { site: 'D2', tp: 0.22, sd: 26, time: '09:22', risk: '高' },
  { site: 'E1', tp: 0.11, sd: 38, time: '09:25', risk: '低' },
  { site: 'E2', tp: 0.19, sd: 33, time: '09:28', risk: '中' }
];

const rows = ref(baseRows);
const trend = ref([
  { day: 'D1', tp: 88 },
  { day: 'D2', tp: 82 },
  { day: 'D3', tp: 74 },
  { day: 'D4', tp: 70 },
  { day: 'D5', tp: 65 },
  { day: 'D6', tp: 61 },
  { day: 'D7', tp: 56 }
]);

const showFilter = ref(false);
const showExport = ref(false);
const showInsight = ref(false);
const exportProgress = ref(40);
const filter = reactive({ risk: '', sd: null });

const openFilter = () => (showFilter.value = true);
const openExport = () => {
  showExport.value = true;
  simulateExport();
};
const openInsight = () => (showInsight.value = true);

const applyFilter = () => {
  rows.value = baseRows.filter((row) => {
    const riskOk = filter.risk ? row.risk === filter.risk : true;
    const sdOk = filter.sd ? row.sd >= filter.sd : true;
    return riskOk && sdOk;
  });
  showFilter.value = false;
};

const simulateExport = () => {
  exportProgress.value = 0;
  const tick = () => {
    if (exportProgress.value < 100) {
      exportProgress.value += 25;
      setTimeout(tick, 200);
    }
  };
  tick();
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}

input, select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 12px;
  align-items: end;
}

.bar {
  background: linear-gradient(180deg, #bbf7d0, #22c55e);
  border-radius: 12px 12px 8px 8px;
  color: #0f172a;
  position: relative;
  padding: 12px 8px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset 0 -6px 12px rgba(255, 255, 255, 0.35);
}

.bar span {
  position: absolute;
  top: 8px;
  left: 8px;
  font-weight: 700;
}

.bar strong {
  text-align: center;
  color: #fff;
}
</style>
