<template>
  <section>
    <div class="toolbar">
      <button class="btn primary" @click="openTip('已导出月度经营报表')">导出报表</button>
      <button class="btn" @click="openTip('满意度报告已发送管理层')">发送报告</button>
      <button class="btn" @click="showProgress = true">统计进度</button>
    </div>

    <SimpleBarChart :data="stats" />

    <table>
      <thead><tr><th>周期</th><th>满意度</th><th>平均响应时长(分钟)</th><th>问题解决率</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="item in reports" :key="item.period">
          <td>{{ item.period }}</td><td>{{ item.sat }}%</td><td>{{ item.response }}</td><td>{{ item.resolve }}%</td>
          <td>
            <button class="btn small" @click="openTip(`${item.period} 数据详情已展示`)">详情</button>
            <button class="btn small" @click="openTip(`${item.period} 趋势分析已生成`)">趋势分析</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog :show="showProgress" title="报表统计进度" @close="showProgress = false">
      <div class="progress"><div class="progress-inner" :style="{ width: progress + '%' }"></div></div>
      <p>正在整合客户满意度、响应时长与解决率指标：{{ progress }}%</p>
      <template #footer><button class="btn primary" @click="progress = Math.min(100, progress + 20)">继续统计</button></template>
    </ModalDialog>

    <ModalDialog :show="showTip" title="提示" @close="showTip = false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';

const stats = ref([
  { label: '客户满意度', value: 94 },
  { label: '响应达标率', value: 91 },
  { label: '问题解决率', value: 89 },
  { label: '复购意向率', value: 84 },
]);

const reports = ref(Array.from({ length: 20 }).map((_, i) => ({
  period: `2025-W${String(i + 1).padStart(2, '0')}`,
  sat: 87 + (i % 8),
  response: 15 - (i % 5),
  resolve: 80 + (i % 12),
})));

const showTip = ref(false);
const showProgress = ref(false);
const tip = ref('');
const progress = ref(30);
const openTip = (text) => { tip.value = text; showTip.value = true; };
</script>
