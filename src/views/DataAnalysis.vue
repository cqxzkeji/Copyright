<template>
  <div class="page">
    <div class="flex-between">
      <div>
        <p class="muted">多维指标可视化</p>
        <h2 class="section-title">数据分析</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="refreshCharts">刷新分析</button>
        <button class="secondary" @click="showExport = true">导出报表</button>
      </div>
    </div>

    <div class="card-grid">
      <ChartPanel title="产量提升趋势" subtitle="田间验证产量指数" :config="yieldConfig">
        <template #actions>
          <button class="secondary" @click="showToast('已切换为最近12个月')">切换维度</button>
        </template>
      </ChartPanel>
      <ChartPanel title="抗性表现" subtitle="病害指数" :config="resistanceConfig">
        <template #actions>
          <button class="secondary" @click="showToast('已对齐病害分布曲线')">重新对齐</button>
        </template>
      </ChartPanel>
    </div>

    <h3 class="section-title">统计明细</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>批次</th>
            <th>地区</th>
            <th>平均产量</th>
            <th>抗病指数</th>
            <th>有效样本</th>
            <th>进度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in stats" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.region }}</td>
            <td>{{ row.yield }} kg/亩</td>
            <td>{{ row.disease }}%</td>
            <td>{{ row.samples }}</td>
            <td>
              <div class="progress small">
                <div class="progress-bar" :style="{ width: row.progress + '%' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showExport" title="导出统计报表">
      <p>可选择导出PDF或CSV，包含图表与明细数据。</p>
      <div class="actions">
        <button class="primary" @click="showToast('报表生成中，完成后自动下载')">导出PDF</button>
        <button class="secondary" @click="showExport = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showToastModal" title="提示">
      <p>{{ toastText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChartPanel from '../components/ChartPanel.vue';
import ModalDialog from '../components/ModalDialog.vue';

const yieldConfig = ref({
  type: 'line',
  data: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
    datasets: [
      { label: '试验田', data: [6.2, 6.4, 6.7, 7.1, 7.3, 7.5, 7.8, 7.9, 8.0, 8.2], borderColor: '#2563eb', fill: false },
      { label: '对照田', data: [5.8, 5.9, 6.0, 6.1, 6.3, 6.3, 6.5, 6.4, 6.5, 6.6], borderColor: '#f59e0b', fill: false }
    ]
  },
  options: {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false
  }
});

const resistanceConfig = ref({
  type: 'bar',
  data: {
    labels: ['纹枯病', '稻瘟病', '稻曲病', '白叶枯', '飞虱抗性'],
    datasets: [
      { label: '抗性指数', data: [82, 90, 76, 70, 88], backgroundColor: '#1e90ff' }
    ]
  },
  options: {
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false
  }
});

const stats = ref([
  { batch: '2024-01', region: '黑龙江', yield: 8.2, disease: 92, samples: 32, progress: 100 },
  { batch: '2024-02', region: '河南', yield: 7.9, disease: 88, samples: 28, progress: 92 },
  { batch: '2024-03', region: '四川', yield: 7.6, disease: 86, samples: 30, progress: 84 },
  { batch: '2024-04', region: '湖南', yield: 7.4, disease: 85, samples: 26, progress: 77 },
  { batch: '2024-05', region: '江苏', yield: 7.8, disease: 90, samples: 35, progress: 69 },
  { batch: '2024-06', region: '吉林', yield: 7.3, disease: 83, samples: 27, progress: 62 },
  { batch: '2024-07', region: '安徽', yield: 7.1, disease: 81, samples: 25, progress: 58 },
  { batch: '2024-08', region: '云南', yield: 7.0, disease: 79, samples: 24, progress: 48 },
  { batch: '2024-09', region: '甘肃', yield: 6.8, disease: 76, samples: 23, progress: 41 },
  { batch: '2024-10', region: '浙江', yield: 7.2, disease: 82, samples: 29, progress: 35 }
]);

const showExport = ref(false);
const showToastModal = ref(false);
const toastText = ref('');

const refreshCharts = () => {
  showToast('已更新到最新田间数据');
};

const showToast = (text) => {
  toastText.value = text;
  showToastModal.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress.small {
  height: 8px;
}
</style>
