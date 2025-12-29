<template>
  <div class="grid-two">
    <div class="content-card full-height-card">
      <div class="section-title">多维可视化展示</div>
      <div class="table-toolbar">
        <el-button type="primary" :icon="Refresh" @click="refreshDashboard">刷新看板</el-button>
        <el-button type="success" :icon="Download" @click="showExport = true">导出视图</el-button>
        <el-button type="info" :icon="HelpFilled" @click="openGuide">交互指南</el-button>
      </div>
      <div ref="chartRef" class="chart-box"></div>
    </div>

    <div class="content-card full-height-card">
      <div class="section-title">指标监控表</div>
      <el-table :data="metrics" border stripe height="360px">
        <el-table-column prop="name" label="指标" width="180" />
        <el-table-column prop="value" label="当前值" width="120" />
        <el-table-column prop="change" label="日环比" width="110" />
        <el-table-column prop="alert" label="阈值" width="90" />
        <el-table-column prop="owner" label="Owner" />
      </el-table>
    </div>
  </div>

  <el-dialog v-model="showExport" title="导出看板" width="420px" align-center>
    <el-form label-width="90px" :model="exportForm">
      <el-form-item label="格式">
        <el-select v-model="exportForm.format">
          <el-option label="PNG" value="png" />
          <el-option label="PDF" value="pdf" />
          <el-option label="CSV" value="csv" />
        </el-select>
      </el-form-item>
      <el-form-item label="粒度">
        <el-radio-group v-model="exportForm.range">
          <el-radio-button label="当日" />
          <el-radio-button label="近7天" />
          <el-radio-button label="近30天" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showExport = false">取消</el-button>
      <el-button type="primary" @click="doExport">导出</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';

const metrics = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    name: `核心指标-${i + 1}`,
    value: (2000 + i * 120).toLocaleString(),
    change: `${(Math.random() * 4 + 1).toFixed(1)}%`,
    alert: `${2200 + i * 60}`,
    owner: ['增长组', '推荐组', '算法组'][i % 3]
  }))
);

const chartRef = ref();
const showExport = ref(false);
const exportForm = reactive({ format: 'png', range: '近7天' });

const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['PV', 'UV', '留存'], top: 10 },
    grid: { left: 40, right: 20, top: 50, bottom: 40 },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'PV', type: 'line', smooth: true, data: [12000, 13800, 15000, 14200, 15800, 16600, 17200], areaStyle: { color: 'rgba(59,130,246,0.15)' } },
      { name: 'UV', type: 'line', smooth: true, data: [6200, 6600, 7000, 6880, 7300, 7600, 8050], areaStyle: { color: 'rgba(34,197,94,0.12)' } },
      { name: '留存', type: 'bar', data: [52, 54, 55, 53, 57, 58, 60], itemStyle: { color: '#f59e0b', borderRadius: 6 }, yAxisIndex: 0 }
    ]
  });
};

onMounted(renderChart);

const refreshDashboard = () => {
  renderChart();
  ElMessage.success('仪表盘已刷新并同步最新数据');
};

const doExport = () => {
  showExport.value = false;
  ElMessageBox.alert(`已导出为 ${exportForm.format.toUpperCase()} ，范围：${exportForm.range}`, '导出成功', {
    type: 'success'
  });
};

const openGuide = () => {
  ElMessageBox.alert('可通过框选高亮、维度切换与时序播放进行深度探索。', '交互指南', {
    type: 'info'
  });
};
</script>
