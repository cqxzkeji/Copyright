<template>
  <section class="module">
    <div class="section-header">
      <div>
        <h3>数据分析与可视化</h3>
        <p class="muted">跨主体协同效率、需求趋势与异常波动洞察。</p>
      </div>
      <div class="section-actions">
        <button class="btn" @click="showFocus = true">新增监控指标</button>
        <button class="btn secondary" @click="showExport = true">导出报表</button>
        <button class="btn outline" @click="showInfo = true">分析提示</button>
      </div>
    </div>

    <div class="grid two">
      <div class="table-card">
        <div class="table-head">
          <h4>协同效率指数</h4>
          <small class="muted">日度指数与目标值对比</small>
        </div>
        <Line :data="efficiencyData" :options="lineOptions" />
      </div>
      <div class="table-card">
        <div class="table-head">
          <h4>需求品类分布</h4>
          <small class="muted">近7日累计</small>
        </div>
        <Bar :data="categoryData" :options="barOptions" />
      </div>
    </div>

    <div class="table-card">
      <div class="table-head">
        <h4>异常波动监测</h4>
        <small class="muted">基于到货时效和破损率</small>
      </div>
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>异常项</th>
            <th>影响主体</th>
            <th>波动幅度</th>
            <th>处置状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in anomalyRows" :key="row.date + row.item">
            <td>{{ row.date }}</td>
            <td>{{ row.item }}</td>
            <td>{{ row.partner }}</td>
            <td>{{ row.delta }}</td>
            <td :class="row.statusColor">{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <div v-if="showFocus" class="modal-overlay" @click.self="showFocus = false">
    <div class="modal">
      <h3>新增监控指标</h3>
      <form @submit.prevent="submitFocus">
        <label>指标名称<input v-model="focus.name" required /></label>
        <label>计算口径<textarea v-model="focus.rule" rows="3" placeholder="说明业务含义"></textarea></label>
        <label>告警阈值<input v-model="focus.threshold" placeholder="例如：95%" /></label>
        <div class="actions">
          <button class="btn outline" type="button" @click="showFocus = false">取消</button>
          <button class="btn" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showExport" class="modal-overlay" @click.self="showExport = false">
    <div class="modal">
      <h3>导出报表</h3>
      <p>生成 PDF 报表并推送至邮箱。</p>
      <div class="progress"><div class="bar" style="width: 48%"></div></div>
      <div class="actions">
        <button class="btn" @click="showExport = false">确定</button>
      </div>
    </div>
  </div>

  <div v-if="showInfo" class="modal-overlay" @click.self="showInfo = false">
    <div class="modal">
      <h3>分析提示</h3>
      <p>建议关注周末需求波谷与节假日波峰，提前锁定补货窗口。</p>
      <div class="actions">
        <button class="btn" @click="showInfo = false">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const efficiencyData = ref({
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '协同效率指数',
      data: [86, 88, 91, 90, 92, 95, 94],
      borderColor: '#3a86ff',
      tension: 0.3,
    },
    {
      label: '目标值',
      data: [88, 88, 88, 88, 88, 88, 88],
      borderColor: '#ff9f1c',
      borderDash: [6, 4],
      tension: 0.1,
    },
  ],
});

const lineOptions = ref({
  responsive: true,
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { ticks: { color: '#6b7280' } }, x: { ticks: { color: '#6b7280' }, grid: { display: false } } },
});

const categoryData = ref({
  labels: ['叶菜', '水果', '水产', '乳品', '粮油', '花卉', '禽肉'],
  datasets: [
    {
      label: '需求量(吨)',
      data: [120, 180, 90, 60, 140, 30, 110],
      backgroundColor: ['#3a86ff', '#ffbe0b', '#a78bfa', '#ef476f', '#06d6a0', '#fbbf24', '#60a5fa'],
      borderRadius: 10,
    },
  ],
});

const barOptions = ref({
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { ticks: { color: '#6b7280' }, grid: { color: '#e5e7eb' } }, x: { ticks: { color: '#6b7280' }, grid: { display: false } } },
});

const anomalyRows = ref([
  { date: '5-06', item: '到货时效', partner: '渝东柑橘基地', delta: '+14% 用时', status: '处理中', statusColor: 'status-orange' },
  { date: '5-06', item: '破损率', partner: '江南果蔬合作社', delta: '+0.8%', status: '待复核', statusColor: 'status-purple' },
  { date: '5-05', item: '到货时效', partner: '松嫩平原玉米', delta: '-5% 提升', status: '已解决', statusColor: 'status-green' },
  { date: '5-05', item: '需求波动', partner: '两湖小龙虾联盟', delta: '+18% 峰值', status: '已预警', statusColor: 'status-blue' },
  { date: '5-04', item: '仓容占用', partner: '胶东海产品加工', delta: '+12% 占用', status: '处理中', statusColor: 'status-orange' },
  { date: '5-04', item: '到货时效', partner: '赣南脐橙联盟', delta: '+9% 用时', status: '处理中', statusColor: 'status-orange' },
  { date: '5-03', item: '破损率', partner: '川西高原马铃薯', delta: '+0.5%', status: '已解决', statusColor: 'status-green' },
  { date: '5-03', item: '需求波动', partner: '岭南鲜花基地', delta: '+15% 峰值', status: '已预警', statusColor: 'status-blue' },
  { date: '5-02', item: '仓容占用', partner: '渝东柑橘基地', delta: '+8% 占用', status: '已解决', statusColor: 'status-green' },
  { date: '5-02', item: '到货时效', partner: '鲁北面粉加工', delta: '+6% 用时', status: '处理中', statusColor: 'status-orange' },
]);

const showFocus = ref(false);
const showExport = ref(false);
const showInfo = ref(false);
const focus = ref({ name: '', rule: '', threshold: '' });

const submitFocus = () => {
  showFocus.value = false;
  alert('已新增监控指标：' + focus.value.name);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.muted {
  color: var(--muted);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.progress {
  background: #f3f4f6;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.bar {
  height: 100%;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
}
</style>
