<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
    <div class="card" v-for="item in summary" :key="item.title">
      <p class="subtle">{{ item.title }}</p>
      <h2 class="header-title">{{ item.value }}</h2>
      <div class="progress-bar" style="margin-top: 10px;">
        <div class="progress-bar__value" :style="{ width: item.percent + '%'}"></div>
      </div>
      <p class="subtle">完成率 {{ item.percent }}%</p>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 class="header-title">周度趋势</h2>
        <p class="subtle">验收完成与问题闭合数量</p>
      </div>
      <button class="button" @click="openModal">导出图表</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>周次</th>
          <th>完成任务</th>
          <th>新增问题</th>
          <th>闭合问题</th>
          <th>合格率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in trend" :key="row.week">
          <td>{{ row.week }}</td>
          <td>{{ row.done }}</td>
          <td>{{ row.newIssues }}</td>
          <td>{{ row.closed }}</td>
          <td>{{ row.rate }}%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showExport" class="modal-backdrop">
    <div class="modal">
      <h3>导出数据</h3>
      <p class="subtle">选择导出维度</p>
      <div class="form-group">
        <label>维度</label>
        <select>
          <option>周度趋势</option>
          <option>模块汇总</option>
        </select>
      </div>
      <div class="progress-bar" style="margin: 12px 0;">
        <div class="progress-bar__value" style="width: 55%"></div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="showExport = false">取消</button>
        <button class="button" @click="showExport = false">导出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const summary = [
  { title: '本周验收任务', value: 42, percent: 75 },
  { title: '整改闭合', value: 28, percent: 63 },
  { title: '复验通过', value: 18, percent: 52 },
  { title: '待确认问题', value: 14, percent: 32 }
];

const trend = [
  { week: '第1周', done: 28, newIssues: 10, closed: 6, rate: 78 },
  { week: '第2周', done: 33, newIssues: 12, closed: 15, rate: 82 },
  { week: '第3周', done: 37, newIssues: 14, closed: 18, rate: 84 },
  { week: '第4周', done: 42, newIssues: 16, closed: 21, rate: 86 },
  { week: '第5周', done: 38, newIssues: 13, closed: 17, rate: 83 },
  { week: '第6周', done: 44, newIssues: 11, closed: 22, rate: 88 },
  { week: '第7周', done: 41, newIssues: 9, closed: 20, rate: 90 },
  { week: '第8周', done: 47, newIssues: 8, closed: 26, rate: 92 },
  { week: '第9周', done: 45, newIssues: 7, closed: 23, rate: 91 },
  { week: '第10周', done: 50, newIssues: 6, closed: 28, rate: 94 }
];

const showExport = ref(false);
const openModal = () => {
  showExport.value = true;
};
</script>
