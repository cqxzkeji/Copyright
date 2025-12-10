<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h2>数据分析与报告</h2>
        <p class="muted">综合生产、健康与饲料数据，生成决策报告。</p>
      </div>
      <div class="flex-between" style="gap: 8px;">
        <button class="button" @click="generateReport">生成报告</button>
        <button class="button secondary" @click="openShare">分享链接</button>
      </div>
    </div>
    <div class="chart-row">
      <div class="card">
        <h4>产奶量趋势 (吨)</h4>
        <svg viewBox="0 0 200 120" style="width: 100%;">
          <polyline
            :points="milkPoints"
            fill="none"
            stroke="#3d8bfd"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div class="muted">最近10天平均 {{ avgMilk }} 吨</div>
      </div>
      <div class="card">
        <h4>健康风险占比</h4>
        <div class="progress" v-for="risk in riskStats" :key="risk.label" style="margin-bottom: 8px;">
          <span :style="{ width: risk.percent + '%' }"></span>
        </div>
        <div class="muted" v-for="risk in riskStats" :key="risk.label + '-label'">{{ risk.label }} · {{ risk.count }} 头</div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>指标</th>
          <th>当前值</th>
          <th>对比昨日</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in metrics" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.value }}</td>
          <td><span class="badge">{{ row.diff }}</span></td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="reporting" class="modal-backdrop">
    <div class="modal">
      <h3>生成报告中</h3>
      <div class="progress"><span :style="{ width: reportProgress + '%' }"></span></div>
      <p class="muted">数据整合、图表渲染、PDF导出</p>
      <div class="flex-between" style="margin-top: 12px;">
        <span class="muted">{{ reportProgress }}%</span>
        <button class="button secondary" @click="reporting = false">取消</button>
      </div>
    </div>
  </div>

  <div v-if="showShare" class="modal-backdrop">
    <div class="modal">
      <h3>分享报告</h3>
      <p class="muted">复制链接发送给团队成员。</p>
      <input style="width: 100%;" :value="shareLink" readonly />
      <div class="flex-between" style="margin-top: 12px;">
        <button class="button secondary" @click="showShare = false">关闭</button>
        <button class="button" @click="copyLink">复制链接</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const milk = ref([12, 12.3, 12.5, 12.1, 12.8, 13.0, 13.2, 12.9, 13.1, 13.3]);
const riskStats = ref([
  { label: '低风险', count: 56 },
  { label: '中风险', count: 18 },
  { label: '高风险', count: 6 },
  { label: '需复查', count: 4 },
  { label: '隔离观察', count: 2 }
]);

const metrics = ref([
  { name: '单日产奶量', value: '13.3 吨', diff: '+0.3%', desc: '与昨日相比略有提升' },
  { name: '体温异常告警', value: '2 次', diff: '-1', desc: '自动触发复查流程' },
  { name: '饲料库存覆盖天数', value: '18 天', diff: '+2', desc: '新采购批次已入库' },
  { name: '平均反刍次数', value: '52 次', diff: '+1.5%', desc: '处于健康区间' },
  { name: '抗生素使用率', value: '3%', diff: '-0.5%', desc: '严格控制，符合计划' },
  { name: '疫苗完成率', value: '98%', diff: '+1%', desc: '本周免疫批次已完成' },
  { name: '设备在线率', value: '99%', diff: '0%', desc: '传感器运行稳定' },
  { name: '水源PH值', value: '7.1', diff: '+0.1', desc: '水质安全' },
  { name: '空气氨气浓度', value: '8 ppm', diff: '-1 ppm', desc: '通风系统运行正常' },
  { name: '粪污处理完成率', value: '92%', diff: '+3%', desc: '环保指标达标' },
  { name: '碳排放强度', value: '1.8 kg/吨奶', diff: '-0.1', desc: '降碳措施见效' }
]);

const reporting = ref(false);
const reportProgress = ref(0);
const showShare = ref(false);
const shareLink = ref('https://farm.example.com/report/weekly');
let timer;

const avgMilk = computed(() => (milk.value.reduce((s, v) => s + v, 0) / milk.value.length).toFixed(2));
const milkPoints = computed(() => {
  const max = Math.max(...milk.value);
  const min = Math.min(...milk.value);
  const span = max - min || 1;
  return milk.value
    .map((v, idx) => {
      const x = (idx / (milk.value.length - 1)) * 200;
      const y = 110 - ((v - min) / span) * 100;
      return `${x},${y}`;
    })
    .join(' ');
});

const generateReport = () => {
  reporting.value = true;
  reportProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (reportProgress.value >= 100) {
      clearInterval(timer);
    } else {
      reportProgress.value += 25;
    }
  }, 500);
};

const openShare = () => {
  showShare.value = true;
};

const copyLink = () => {
  navigator.clipboard?.writeText(shareLink.value);
  showShare.value = false;
};
</script>
