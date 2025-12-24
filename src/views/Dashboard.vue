<template>
  <div>
    <div class="cards-grid" style="margin-bottom: 16px;">
      <div class="card" v-for="card in overview" :key="card.label">
        <div class="flex" style="justify-content: space-between;">
          <div>
            <div style="font-size: 14px; color: var(--muted);">{{ card.label }}</div>
            <div style="font-size: 28px; font-weight: 700;">{{ card.value }}</div>
          </div>
          <div class="chart-bar" style="width: 120px;">
            <span :style="{ width: card.trend + '%' }"></span>
          </div>
        </div>
        <small :class="['badge', card.trend > 60 ? 'success' : 'info']">{{ card.trend }}% 完成</small>
      </div>
    </div>

    <div class="flex" style="justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0;">统计与系统</h3>
      <div class="flex" style="gap: 8px;">
        <button class="secondary" @click="syncData">同步统计</button>
        <button class="accent" @click="exportReport">导出报表</button>
      </div>
    </div>

    <div class="card" style="margin-bottom: 16px;">
      <h4>运营曲线（简易柱状图）</h4>
      <div class="simple-chart">
        <div class="bar" v-for="point in chartPoints" :key="point.label">
          <div class="flex" style="justify-content: space-between;">
            <span>{{ point.label }}</span>
            <span style="color: var(--muted);">{{ point.value }}</span>
          </div>
          <div class="chart-bar">
            <span :style="{ width: point.value + '%' }"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <h3>系统巡检结果（20 条）</h3>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>区域</th>
            <th>检查点</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inspections" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.region }}</td>
            <td>{{ item.check }}</td>
            <td><span :class="['badge', item.status === '正常' ? 'success' : 'warning']">{{ item.status }}</span></td>
            <td>{{ item.remark }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showSync" title="同步统计">
      <p>正在同步统计数据与系统配置...</p>
      <div class="progress-bar">
        <span :style="{ width: syncProgress + '%' }"></span>
      </div>
    </ModalDialog>
    <ModalDialog v-model="showExport" title="导出完成">
      <p>报表已生成，包含供应、订单、库存、客户与系统日志汇总。</p>
      <template #footer>
        <button class="secondary" @click="showExport = false">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const overview = [
  { label: '今日成交', value: '¥128,600', trend: 78 },
  { label: '活跃供应商', value: 42, trend: 66 },
  { label: '库存周转', value: '13.4天', trend: 58 },
  { label: '运营活动', value: '8 场', trend: 92 }
];

const chartPoints = [
  { label: '供应入库', value: 85 },
  { label: '库存健康', value: 72 },
  { label: '订单履约', value: 90 },
  { label: '售后响应', value: 65 },
  { label: '运营活动', value: 78 }
];

const inspections = Array.from({ length: 20 }).map((_, idx) => {
  const regions = ['湘西', '赣南', '黔东', '皖北', '陕南'];
  const checks = ['API接口', '库存任务', '订单回写', '风控策略', '客户推送'];
  const remarkList = ['正常', '轻微波动', '稍慢已优化', '重新调度', '确认完成'];
  return {
    id: idx + 1,
    region: regions[idx % regions.length],
    check: checks[idx % checks.length],
    status: idx % 6 === 0 ? '观察' : '正常',
    remark: remarkList[idx % remarkList.length]
  };
});

const showSync = ref(false);
const showExport = ref(false);
const syncProgress = ref(20);

const syncData = () => {
  showSync.value = true;
  syncProgress.value = 20;
  const timer = setInterval(() => {
    if (syncProgress.value >= 100) {
      clearInterval(timer);
      showSync.value = false;
    } else {
      syncProgress.value += 20;
    }
  }, 350);
};

const exportReport = () => {
  showExport.value = true;
};
</script>
