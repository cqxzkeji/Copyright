<template>
  <section>
    <div class="toolbar">
      <button class="btn primary" @click="openTip('已生成质量分析报告')">生成报告</button>
      <button class="btn" @click="showProgress = true">实时巡检</button>
      <button class="btn" @click="openTip('异常工单已自动预警')">异常预警</button>
    </div>

    <SimpleBarChart :data="chartData" />

    <table>
      <thead><tr><th>日期</th><th>响应时长(分钟)</th><th>一次解决率</th><th>满意度</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="item in qualityRows" :key="item.date">
          <td>{{ item.date }}</td><td>{{ item.response }}</td><td>{{ item.solveRate }}%</td><td>{{ item.satisfaction }}%</td>
          <td>
            <button class="btn small" @click="openTip(`${item.date} 指标详情已打开`)">详情</button>
            <button class="btn small" @click="optimize(item)">优化建议</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog :show="showProgress" title="巡检进度" @close="showProgress = false">
      <div class="progress"><div class="progress-inner" :style="{ width: progress + '%' }"></div></div>
      <p>巡检中... {{ progress }}%</p>
      <template #footer><button class="btn primary" @click="runCheck">继续巡检</button></template>
    </ModalDialog>

    <ModalDialog :show="showTip" title="提示" @close="showTip = false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';

const chartData = ref([
  { label: '响应及时率', value: 93 },
  { label: '服务满意度', value: 95 },
  { label: '一次解决率', value: 88 },
  { label: '质检通过率', value: 97 },
]);

const qualityRows = ref(Array.from({ length: 20 }).map((_, i) => ({
  date: `2026-01-${String(i + 1).padStart(2, '0')}`,
  response: 8 + (i % 6),
  solveRate: 82 + (i % 10),
  satisfaction: 88 + (i % 8),
})));

const showTip = ref(false);
const showProgress = ref(false);
const tip = ref('');
const progress = ref(20);

const openTip = (text) => { tip.value = text; showTip.value = true; };
const optimize = (item) => openTip(`${item.date} 优化建议：增加高峰值班人员，缩短${item.response}分钟响应时间`);
const runCheck = () => { progress.value = Math.min(100, progress.value + 20); };
</script>
