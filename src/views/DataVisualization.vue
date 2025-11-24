<template>
  <div class="module">
    <header class="header">
      <div>
        <p class="eyebrow">数据可视化与结果展示</p>
        <h3>汇总建模、调控与分析结果，一键导出报告</h3>
      </div>
      <div class="actions">
        <button class="ghost" @click="showShare = true">分享快照</button>
        <button class="primary" @click="startProgress('正在绘制仪表盘...')">刷新仪表盘</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <div class="card-header">
          <h4>指标看板</h4>
          <button class="mini" @click="startProgress('同步最新结果...')">同步</button>
        </div>
        <div class="chart">
          <div v-for="metric in metrics" :key="metric.label" class="slice">
            <span>{{ metric.label }}</span>
            <div class="bar">
              <div class="value" :style="{ width: metric.value + '%' }"></div>
            </div>
            <small>{{ metric.value }}%</small>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h4>导出记录</h4>
          <button class="mini" @click="showExport = true">导出报告</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>类型</th>
              <th>摘要</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in exports" :key="item.time">
              <td>{{ item.time }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.summary }}</td>
              <td><button class="mini" @click="startProgress('生成 ' + item.type)">重新生成</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDialog v-model="showShare" title="分享仪表盘快照" @confirm="confirmShare">
      <form class="form" @submit.prevent>
        <label>分享对象
          <input placeholder="team@lab.com" />
        </label>
        <label>保留时间 (天)
          <input type="number" min="1" value="7" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showExport" title="导出报告" @confirm="confirmExport">
      <form class="form" @submit.prevent>
        <label>导出格式
          <select v-model="exportFormat">
            <option>PDF</option>
            <option>CSV</option>
            <option>图片</option>
          </select>
        </label>
        <label>包含模块
          <div class="tag-row">
            <label v-for="tag in tags" :key="tag" class="tag">
              <input type="checkbox" checked /> {{ tag }}
            </label>
          </div>
        </label>
      </form>
    </ModalDialog>

    <ProgressDialog
      v-model="showProgress"
      :progress="progress"
      title="可视化渲染"
      :description="progressLabel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';

const metrics = ref([
  { label: '膜均匀性', value: 82 },
  { label: '模拟收敛度', value: 88 },
  { label: '调控效率', value: 75 },
  { label: '测试覆盖率', value: 80 },
  { label: '报告完整度', value: 91 }
]);

const exports = ref([
  { time: '2024-05-01 14:32', type: 'PDF', summary: '含模拟、参数与测试摘要' },
  { time: '2024-05-03 09:20', type: 'CSV', summary: '关键监测点数据' },
  { time: '2024-05-05 16:42', type: '图片', summary: '主要图表截图' },
  { time: '2024-05-06 10:15', type: 'PDF', summary: '调控优化迭代报告' },
  { time: '2024-05-08 08:55', type: 'PDF', summary: '复合膜稳定性分析' }
]);

const tags = ['建模', '参数', '材料', '可视化'];
const showShare = ref(false);
const showExport = ref(false);
const exportFormat = ref('PDF');

const showProgress = ref(false);
const progress = ref(0);
const progressLabel = ref('加载仪表盘...');

const confirmShare = () => startProgress('推送分享链接...');
const confirmExport = () => startProgress(`导出${exportFormat.value}报告...`);

const startProgress = (label) => {
  progress.value = 0;
  progressLabel.value = label;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + 15, 100);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(() => {
        showProgress.value = false;
      }, 400);
    }
  }, 240);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  color: #6b7280;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h3 {
  margin: 4px 0 0;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 10px 14px;
  font-weight: 700;
}

.primary {
  background: linear-gradient(120deg, var(--primary), #60a5fa);
  color: white;
}

.ghost {
  background: #f3f4f6;
  border-color: var(--border);
}

.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 14px;
  display: grid;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mini {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
  padding: 6px 10px;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.bar {
  width: 100%;
  height: 10px;
  background: #eef2ff;
  border-radius: 999px;
  overflow: hidden;
}

.value {
  height: 100%;
  background: linear-gradient(120deg, #22c55e, #60a5fa);
}

.chart {
  display: grid;
  gap: 8px;
}

.slice {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  align-items: center;
  gap: 8px;
}

.form {
  display: grid;
  gap: 10px;
}

input, select {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f3f4f6;
  border-radius: 10px;
  border: 1px solid var(--border);
  font-size: 13px;
}
</style>
