<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>数据分析</h2>
        <p>统计运行与运维数据，评估设备效率与运行状况。</p>
      </div>
      <div class="actions">
        <button @click="openModal('report')">生成分析报告</button>
        <button @click="openModal('export')">导出数据集</button>
        <button @click="openModal('model')">效率模型配置</button>
      </div>
    </section>

    <div class="cards">
      <div class="card">
        <h3>综合效率评分</h3>
        <div class="score">92.4</div>
        <p>较上周提升 4.2%</p>
      </div>
      <div class="card">
        <h3>运维成本趋势</h3>
        <svg viewBox="0 0 240 120" class="chart" aria-hidden="true">
          <polyline
            fill="none"
            stroke="#2f80ed"
            stroke-width="4"
            points="10,90 40,70 70,80 100,60 130,50 160,64 190,48 220,40"
          />
        </svg>
      </div>
      <div class="card">
        <h3>场景效能对比</h3>
        <div class="bars">
          <div v-for="bar in bars" :key="bar.name">
            <span>{{ bar.name }}</span>
            <div class="bar-bg"><div class="bar" :style="{ width: bar.value + '%' }"></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <h3>效率评估明细</h3>
      <table>
        <thead>
          <tr>
            <th>场景</th>
            <th>设备利用率</th>
            <th>故障率</th>
            <th>能耗指数</th>
            <th>综合得分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in analysisTable" :key="row.scene">
            <td>{{ row.scene }}</td>
            <td>{{ row.usage }}</td>
            <td>{{ row.fault }}</td>
            <td>{{ row.energy }}</td>
            <td>{{ row.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      :open="modal.open"
      :title="modal.title"
      :confirm-text="modal.confirmText"
      @close="modal.open = false"
      @confirm="modal.open = false"
    >
      <div v-if="modal.type === 'report'">
        <p>选择分析范围，生成可视化报告。</p>
        <form class="form-grid">
          <label>统计周期<select><option>近 7 天</option><option>近 30 天</option><option>近 90 天</option></select></label>
          <label>报告格式<select><option>PDF</option><option>在线看板</option></select></label>
          <label>关注指标<select><option>效率</option><option>能耗</option><option>运维成本</option></select></label>
          <label>发送对象<select><option>指挥中心</option><option>运维组</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'export'">
        <p>导出数据集用于外部分析。</p>
        <form class="form-grid">
          <label>数据类型<select><option>运行数据</option><option>运维数据</option><option>综合数据</option></select></label>
          <label>导出格式<select><option>CSV</option><option>XLSX</option><option>JSON</option></select></label>
          <label>脱敏策略<select><option>自动脱敏</option><option>完整数据</option></select></label>
          <label>下载权限<select><option>仅管理员</option><option>分析组</option></select></label>
        </form>
      </div>
      <div v-else>
        <p>配置效率评估模型参数。</p>
        <form class="form-grid">
          <label>运行权重<input placeholder="0.45" /></label>
          <label>运维权重<input placeholder="0.35" /></label>
          <label>能耗权重<input placeholder="0.20" /></label>
          <label>模型版本<select><option>V2.1</option><option>V2.2</option></select></label>
        </form>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const bars = [
  { name: '海域巡防', value: 86 },
  { name: '机库保障', value: 78 },
  { name: '边境警戒', value: 92 },
  { name: '港口指挥', value: 74 }
];

const analysisTable = [
  { scene: '海域巡防', usage: '89%', fault: '1.4%', energy: '0.76', score: '92' },
  { scene: '机库保障', usage: '82%', fault: '2.1%', energy: '0.81', score: '86' },
  { scene: '边境警戒', usage: '91%', fault: '1.1%', energy: '0.72', score: '95' },
  { scene: '港口指挥', usage: '77%', fault: '2.5%', energy: '0.85', score: '83' }
];

const modal = reactive({
  open: false,
  type: '',
  title: '',
  confirmText: ''
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  const titles = {
    report: '生成分析报告',
    export: '导出数据集',
    model: '效率模型配置'
  };
  modal.title = titles[type];
  modal.confirmText = '确认提交';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button {
  border: none;
  background: #eef3ff;
  color: #2f3c4a;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score {
  font-size: 36px;
  color: #2f80ed;
  font-weight: 700;
}

.chart {
  width: 100%;
  height: 120px;
}

.bars {
  display: grid;
  gap: 12px;
}

.bar-bg {
  height: 8px;
  background: #e4ecfb;
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2fb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #5b6b82;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f3;
  background: #f7faff;
}
</style>
