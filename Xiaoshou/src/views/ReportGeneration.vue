<template>
  <div class="grid-layout">
    <div>
      <div class="flex-between">
        <h3>报表生成</h3>
        <div class="flex" style="gap: 8px;">
          <button class="btn" @click="showGenerate = true">生成报表</button>
          <button class="btn secondary" @click="showShare">分享链接</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>报表</th>
            <th>周期</th>
            <th>负责人</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.name">
            <td>{{ report.name }}</td>
            <td>{{ report.cycle }}</td>
            <td>{{ report.owner }}</td>
            <td><span class="badge">{{ report.status }}</span></td>
            <td>{{ report.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h4>利润/吨趋势</h4>
      <div class="chart">
        <div v-for="item in profitChart" :key="item.label" class="chart-bar" :style="{ height: item.value * 4 + 'px' }">
          <div>{{ item.value }}</div>
          <small>{{ item.label }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showGenerate" class="overlay">
    <div class="modal">
      <header>
        <h3>生成报表</h3>
        <button class="btn secondary" @click="showGenerate = false">关闭</button>
      </header>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin-top: 10px;">正在汇总订单、生产和库存数据…</p>
      <footer>
        <button class="btn" @click="complete">完成</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const reports = ref([
  { name: '订单执行周报', cycle: '周', owner: '李雯', status: '待发布', updated: '2024-06-10' },
  { name: '库存健康度', cycle: '周', owner: '陈亮', status: '已发布', updated: '2024-06-09' },
  { name: '销售漏斗', cycle: '周', owner: '王毅', status: '发布中', updated: '2024-06-08' },
  { name: '定制方案进度', cycle: '周', owner: '高原', status: '已发布', updated: '2024-06-07' },
  { name: '质量指标', cycle: '月', owner: '丁楠', status: '发布中', updated: '2024-06-05' },
  { name: '成本分析', cycle: '月', owner: '杨工', status: '已发布', updated: '2024-06-02' },
  { name: '关键物料预警', cycle: '周', owner: '刘京', status: '待发布', updated: '2024-06-11' },
  { name: '产能负荷', cycle: '周', owner: '陈晨', status: '已发布', updated: '2024-06-06' },
  { name: '项目回款', cycle: '月', owner: '张林', status: '发布中', updated: '2024-06-04' },
  { name: '客户满意度', cycle: '季', owner: '李强', status: '待发布', updated: '2024-05-30' },
  { name: '年度预算偏差', cycle: '年', owner: '杨工', status: '已发布', updated: '2024-05-20' }
]);

const showGenerate = ref(false);
const progress = ref(40);

const profitChart = computed(() =>
  ['1月', '2月', '3月', '4月', '5月', '6月'].map((m, idx) => ({ label: m, value: 18 + idx * 3 }))
);

const showShare = () => {
  alert('分享链接已生成，权限与登录账号一致。');
};

const complete = () => {
  progress.value = 100;
  setTimeout(() => {
    reports.value = [
      { name: '订单执行周报', cycle: '周', owner: '李雯', status: '已发布', updated: '2024-06-12' },
      ...reports.value.slice(1)
    ];
    showGenerate.value = false;
  }, 300);
};
</script>
