<template>
  <div class="grid-two">
    <div class="content-card full-height-card">
      <div class="section-title">智能分析与挖掘</div>
      <div class="table-toolbar">
        <el-button type="primary" :icon="Monitor" @click="runCorrelation">关联分析</el-button>
        <el-button type="success" :icon="Clock" @click="showForecast = true">预测任务</el-button>
        <el-button type="info" :icon="Histogram" @click="openInsight">趋势洞察</el-button>
      </div>
      <div ref="chartRef" class="chart-box"></div>
    </div>

    <div class="content-card">
      <div class="section-title">预测结果表</div>
      <el-table :data="predictions" border stripe height="360px">
        <el-table-column prop="segment" label="客群" width="140" />
        <el-table-column prop="lift" label="转化提升" width="120" />
        <el-table-column prop="churn" label="流失预测" width="120" />
        <el-table-column prop="score" label="风险评分" width="120" />
        <el-table-column prop="action" label="推荐动作" />
      </el-table>
    </div>
  </div>

  <el-dialog v-model="showForecast" title="启动预测" width="440px" align-center>
    <el-form label-width="90px" :model="forecastForm">
      <el-form-item label="算法">
        <el-select v-model="forecastForm.model">
          <el-option label="时间序列 Prophet" value="prophet" />
          <el-option label="LSTM 深度序列" value="lstm" />
          <el-option label="XGBoost" value="xgboost" />
        </el-select>
      </el-form-item>
      <el-form-item label="预测窗口">
        <el-slider v-model="forecastForm.window" :min="7" :max="60" show-input />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showForecast = false">取消</el-button>
      <el-button type="primary" @click="startForecast">启动</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="showProgress" title="预测执行" width="400px" align-center>
    <p style="margin-bottom: 10px;">正在运行预测模型，完成后将生成洞察。</p>
    <el-progress :percentage="progress" status="success" :striped="true" :stroke-width="14" />
  </el-dialog>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Monitor, Clock, Histogram } from '@element-plus/icons-vue';
import * as echarts from 'echarts';

const predictions = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    segment: `客群-${i + 1}`,
    lift: `${(8 + (i % 5) * 1.3).toFixed(1)}%`,
    churn: `${(12 + (i % 4) * 1.6).toFixed(1)}%`,
    score: (620 + i * 6).toFixed(0),
    action: ['推送优惠券', '调整策略', '召回激活', '智能推荐'][i % 4]
  }))
);

const chartRef = ref();
const chartInstance = ref();
const showForecast = ref(false);
const showProgress = ref(false);
const progress = ref(10);
const forecastForm = reactive({ model: 'prophet', window: 21 });

const renderChart = () => {
  if (!chartRef.value) return;
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  chartInstance.value = echarts.init(chartRef.value);
  chartInstance.value.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    legend: { data: ['实际值', '预测值'] },
    xAxis: { type: 'category', data: Array.from({ length: 12 }, (_, i) => `W${i + 1}`) },
    yAxis: { type: 'value' },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: [180, 210, 220, 260, 290, 300, 320, 340, 360, 370, 400, 430],
        smooth: true,
        lineStyle: { color: '#3b82f6', width: 3 }
      },
      {
        name: '预测值',
        type: 'line',
        data: [200, 230, 245, 280, 310, 325, 340, 360, 380, 402, 430, 455],
        smooth: true,
        lineStyle: { color: '#22c55e', width: 3 },
        areaStyle: { color: 'rgba(34,197,94,0.12)' }
      }
    ]
  });
};

const handleResize = () => {
  chartInstance.value?.resize();
};

onMounted(() => {
  nextTick(() => {
    renderChart();
    window.addEventListener('resize', handleResize);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

const runCorrelation = () => {
  ElMessageBox.alert('自动计算特征相关度，已生成关联图谱并过滤弱相关噪声。', '关联分析', {
    type: 'info'
  });
};

const startForecast = () => {
  progress.value = 10;
  showForecast.value = false;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      showProgress.value = false;
      ElMessageBox.alert('预测已完成，结果写入智能洞察。', '预测完成', { type: 'success' });
    }
  }, 700);
};

const openInsight = () => {
  ElMessageBox.alert('发现高价值客群对实时优惠响应敏感，建议重点投放。', '洞察提示', {
    type: 'info'
  });
};
</script>
