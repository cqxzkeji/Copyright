<template>
  <div class="grid" style="gap:16px;">
    <div class="section-header">
      <div>
        <h3 class="section-title">数据分析与报表</h3>
        <p style="margin:0;color:var(--muted);">销售漏斗、订单交付率与客户贡献度</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="primary" @click="exportReport">导出报表</button>
        <button class="ghost" @click="refresh">刷新数据</button>
      </div>
    </div>

    <div class="responsive-two">
      <div class="card">
        <h4 class="section-title" style="margin-bottom:8px;">销售漏斗</h4>
        <BarChart :data="funnel" />
      </div>
      <div class="card">
        <h4 class="section-title" style="margin-bottom:8px;">区域贡献度</h4>
        <BarChart :data="regions" />
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h4 class="section-title">经营看板</h4>
        <button class="ghost" @click="clearHighlight">取消高亮</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="table">
          <thead>
            <tr>
              <th>指标</th>
              <th>数值</th>
              <th>目标</th>
              <th>完成度</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="metric in metrics"
              :key="metric.name"
              :style="metric.name === highlightRow ? 'background:#eef2ff' : ''"
              @click="highlightRow = metric.name"
            >
              <td>{{ metric.name }}</td>
              <td>{{ metric.value }}</td>
              <td>{{ metric.target }}</td>
              <td>
                <div class="progress"><div class="bar" :style="{ width: metric.progress + '%' }"></div></div>
              </td>
              <td>{{ metric.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog :open="exportModal" title="导出报表" @close="exportModal = false">
      <p style="margin:0 0 10px;">正在生成 PDF 报表并推送到邮件</p>
      <div class="progress"><div class="bar" :style="{ width: exportProgress + '%' }"></div></div>
      <p style="color:var(--muted);">{{ exportText }}</p>
    </ModalDialog>

    <ModalDialog :open="refreshModal" title="刷新数据" @close="refreshModal = false">
      <p style="margin:0 0 10px;">同步最新销售、库存、订单数据</p>
      <div class="progress"><div class="bar" :style="{ width: refreshProgress + '%' }"></div></div>
      <p style="color:var(--muted);">{{ refreshText }}</p>
    </ModalDialog>

    <ModalDialog :open="infoOpen" title="提示" @close="infoOpen = false">
      <p style="margin:0;">{{ infoText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import BarChart from '../components/BarChart.vue';

const funnel = [
  { label: '线索', value: 180, color: '#0ea5e9' },
  { label: '需求确认', value: 132, color: '#22c55e' },
  { label: '技术评审', value: 96, color: '#f59e0b' },
  { label: '商务报价', value: 78, color: '#2563eb' },
  { label: '赢单', value: 44, color: '#7c3aed' }
];

const regions = [
  { label: '华东', value: 120, color: '#2563eb' },
  { label: '华北', value: 95, color: '#0ea5e9' },
  { label: '西南', value: 75, color: '#22c55e' },
  { label: '华南', value: 68, color: '#f59e0b' },
  { label: '海外', value: 54, color: '#7c3aed' }
];

const metrics = [
  { name: '本月签单额', value: '2,870 万元', target: '3,200 万元', progress: 89, note: '风电主轴大单贡献' },
  { name: '已发货订单', value: '26 单', target: '30 单', progress: 86, note: '物流时效正常' },
  { name: '回款率', value: '63%', target: '75%', progress: 63, note: '重点跟进两家款项' },
  { name: '平均交付周期', value: '18 天', target: '20 天', progress: 90, note: '排产优化提升' },
  { name: '技术评审通过率', value: '82%', target: '85%', progress: 82, note: '加强方案模板复用' },
  { name: '报价响应时间', value: '6 小时', target: '8 小时', progress: 95, note: '定制引擎支撑' },
  { name: '新增线索', value: '180 条', target: '150 条', progress: 100, note: '超额完成' },
  { name: '在制订单', value: '19 单', target: '20 单', progress: 95, note: '排产稳态' },
  { name: '库存周转', value: '35 天', target: '32 天', progress: 92, note: '热门规格补货' },
  { name: '客户满意度', value: '4.6 / 5', target: '4.5 / 5', progress: 92, note: '交付及时、反馈快' }
];

const highlightRow = ref('');
const exportModal = ref(false);
const exportProgress = ref(0);
const exportText = ref('准备中');
const refreshModal = ref(false);
const refreshProgress = ref(0);
const refreshText = ref('同步中');
const infoOpen = ref(false);
const infoText = ref('');

const exportReport = () => {
  exportModal.value = true;
  exportProgress.value = 0;
  exportText.value = '正在汇总数据...';
  const timer = setInterval(() => {
    exportProgress.value += 28;
    if (exportProgress.value >= 100) {
      exportText.value = '报表已生成并发送';
      clearInterval(timer);
    }
  }, 300);
};

const refresh = () => {
  refreshModal.value = true;
  refreshProgress.value = 0;
  refreshText.value = '获取销售数据...';
  const steps = ['合并库存数据...', '同步订单...', '计算指标...'];
  let idx = 0;
  const timer = setInterval(() => {
    refreshProgress.value += 25;
    refreshText.value = steps[idx] || refreshText.value;
    idx += 1;
    if (refreshProgress.value >= 100) {
      refreshText.value = '刷新完成';
      clearInterval(timer);
    }
  }, 320);
};

const clearHighlight = () => {
  highlightRow.value = '';
  infoText.value = '已取消表格高亮';
  infoOpen.value = true;
};
</script>
