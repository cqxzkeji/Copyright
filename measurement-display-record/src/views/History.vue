<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">历史趋势</div>
      <div class="chart">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none">
          <polyline
            :points="trendPoints"
            fill="none"
            stroke="#1b5cff"
            stroke-width="3"
          />
          <polyline
            :points="averagePoints"
            fill="none"
            stroke="#ffb347"
            stroke-width="2"
            stroke-dasharray="4 6"
          />
        </svg>
      </div>
      <div style="margin-top: 16px; display:flex; gap: 12px; flex-wrap: wrap;">
        <button class="primary-btn" @click="openForm">筛选条件</button>
        <button class="secondary-btn" @click="openProgress">导出报告</button>
        <button class="secondary-btn" @click="openTip">历史提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">历史记录</div>
      <table class="table">
        <thead>
          <tr>
            <th>日期</th>
            <th>平均温度</th>
            <th>平均湿度</th>
            <th>压力范围</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historyRows" :key="item.date">
            <td>{{ item.date }}</td>
            <td>{{ item.temp }}</td>
            <td>{{ item.humidity }}</td>
            <td>{{ item.pressure }}</td>
            <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <teleport to="body">
    <div v-if="formVisible" class="modal-backdrop">
      <div class="modal">
        <h3>历史筛选</h3>
        <div class="form-field">
          <label>起始日期</label>
          <input v-model="filter.start" placeholder="2024-09-01" />
        </div>
        <div class="form-field">
          <label>结束日期</label>
          <input v-model="filter.end" placeholder="2024-09-10" />
        </div>
        <div class="form-field">
          <label>站点</label>
          <select v-model="filter.site">
            <option value="一号站">一号站</option>
            <option value="二号站">二号站</option>
            <option value="三号站">三号站</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="formVisible = false">取消</button>
          <button class="primary-btn" @click="formVisible = false">应用</button>
        </div>
      </div>
    </div>

    <div v-if="progressVisible" class="modal-backdrop">
      <div class="modal">
        <h3>导出报告</h3>
        <p>正在生成历史报告并打包下载。</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="progressVisible = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="tipVisible" class="modal-backdrop">
      <div class="modal">
        <h3>历史提示</h3>
        <p>支持导出 CSV、PDF 和图片报告，便于归档。</p>
        <div class="modal-actions">
          <button class="primary-btn" @click="tipVisible = false">知道了</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const historyRows = ref([
  { date: '2024-09-01', temp: '24.1℃', humidity: '57%', pressure: '100.8-101.4', status: '正常', statusClass: 'success' },
  { date: '2024-09-02', temp: '24.3℃', humidity: '58%', pressure: '100.9-101.3', status: '正常', statusClass: 'success' },
  { date: '2024-09-03', temp: '24.5℃', humidity: '59%', pressure: '100.7-101.2', status: '正常', statusClass: 'success' },
  { date: '2024-09-04', temp: '24.8℃', humidity: '60%', pressure: '100.8-101.5', status: '注意', statusClass: 'warning' },
  { date: '2024-09-05', temp: '25.0℃', humidity: '61%', pressure: '100.9-101.6', status: '注意', statusClass: 'warning' },
  { date: '2024-09-06', temp: '24.7℃', humidity: '59%', pressure: '100.8-101.3', status: '正常', statusClass: 'success' },
  { date: '2024-09-07', temp: '24.4℃', humidity: '58%', pressure: '100.7-101.2', status: '正常', statusClass: 'success' },
  { date: '2024-09-08', temp: '24.2℃', humidity: '57%', pressure: '100.9-101.1', status: '正常', statusClass: 'success' },
  { date: '2024-09-09', temp: '24.6℃', humidity: '58%', pressure: '100.8-101.4', status: '正常', statusClass: 'success' },
  { date: '2024-09-10', temp: '24.9℃', humidity: '60%', pressure: '101.0-101.6', status: '注意', statusClass: 'warning' }
]);

const formVisible = ref(false);
const progressVisible = ref(false);
const tipVisible = ref(false);
const progress = ref(55);

const filter = reactive({
  start: '2024-09-01',
  end: '2024-09-10',
  site: '一号站'
});

const openForm = () => {
  formVisible.value = true;
};

const openProgress = () => {
  progressVisible.value = true;
  progress.value = 55;
};

const openTip = () => {
  tipVisible.value = true;
};

const trendPoints = computed(() => {
  const values = historyRows.value.map((row) => Number(row.temp.replace('℃', '')));
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 400;
    const y = 180 - (value - 24) * 30;
    return `${x},${y}`;
  }).join(' ');
});

const averagePoints = computed(() => {
  const values = historyRows.value.map((row) => Number(row.humidity.replace('%', '')));
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 400;
    const y = 180 - (value - 55) * 5;
    return `${x},${y}`;
  }).join(' ');
});
</script>
