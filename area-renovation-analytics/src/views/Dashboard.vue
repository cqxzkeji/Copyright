<template>
  <section>
    <div class="card-grid">
      <div class="card">
        <div class="label">项目数量</div>
        <h3>36 个</h3>
        <p class="label">覆盖全部片区整治任务</p>
      </div>
      <div class="card">
        <div class="label">资金执行</div>
        <h3>82%</h3>
        <p class="label">拨付进度稳定</p>
      </div>
      <div class="card">
        <div class="label">巡查完成</div>
        <h3>128 次</h3>
        <p class="label">现场巡检与影像核验</p>
      </div>
      <div class="card">
        <div class="label">综合满意度</div>
        <h3>89 分</h3>
        <p class="label">居民反馈持续提升</p>
      </div>
    </div>

    <div class="button-row">
      <button class="primary-btn" @click="activeModal = 'refresh'">刷新看板</button>
      <button class="ghost-btn" @click="activeModal = 'share'">分享链接</button>
      <button class="ghost-btn" @click="activeModal = 'export'">导出图片</button>
      <button class="ghost-btn" @click="activeModal = 'subscribe'">订阅日报</button>
    </div>

    <div class="card-grid" style="margin-bottom:16px;">
      <div class="chart-card">
        <div class="label">核心指标趋势</div>
        <canvas ref="chartRef" height="200"></canvas>
      </div>
      <div class="chart-card">
        <div class="label">决策提示</div>
        <p>建议优先推进进度低于80%的片区，并在月底前完成资金拨付审核。</p>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>指标</th>
            <th>本期</th>
            <th>环比</th>
            <th>同比</th>
            <th>责任人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in metrics" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.qoq }}</td>
            <td>{{ item.yoy }}</td>
            <td>{{ item.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="activeModal" title="刷新看板" sub-title="实时拉取" v-if="activeModal === 'refresh'">
      <p>正在刷新数据源并重绘图表，请稍后。</p>
    </ModalDialog>
    <ModalDialog v-model="activeModal" title="分享链接" sub-title="外部协同" v-else-if="activeModal === 'share'">
      <p>生成可访问的只读链接，支持限定有效期与访问权限。</p>
    </ModalDialog>
    <ModalDialog v-model="activeModal" title="导出图片" sub-title="看板快照" v-else-if="activeModal === 'export'">
      <p>选择PNG或PDF格式导出当前可视化面板。</p>
    </ModalDialog>
    <ModalDialog v-model="activeModal" title="订阅日报" sub-title="推送配置" v-else-if="activeModal === 'subscribe'">
      <p>配置邮件或企业微信推送时间与接收人。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const activeModal = ref('');
const chartRef = ref(null);
let chartInstance = null;

const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
const metrics = ref(
  Array.from({ length: 20 }, (_, i) => ({
    name: ['资金拨付', '巡查完成', '验收通过', '投诉处理', '绿化完成'][i % 5] + `指标 ${i + 1}`,
    value: `${70 + (i * 2) % 25}`,
    qoq: `${((i % 4) - 1) * 3}%`,
    yoy: `${5 + (i % 6)}%`,
    owner: ['运营组', '监理组', '施工组'][i % 3]
  }))
);

onMounted(() => {
  const ctx = chartRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: '项目完成率',
          data: [65, 72, 78, 83, 86, 90],
          borderColor: '#2f80ed',
          backgroundColor: 'rgba(47,128,237,0.2)',
          tension: 0.3
        },
        {
          label: '资金执行率',
          data: [58, 66, 75, 80, 82, 85],
          borderColor: '#56ccf2',
          backgroundColor: 'rgba(86,204,242,0.2)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>
