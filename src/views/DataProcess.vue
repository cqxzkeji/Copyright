<template>
  <div class="grid-two">
    <div class="content-card">
      <div class="section-title">数据治理与处理</div>
      <div class="table-toolbar">
        <el-button type="primary" :icon="RefreshRight" @click="runCleansing">执行清洗</el-button>
        <el-button type="success" :icon="Timer" @click="showSchedule = true">调度任务</el-button>
        <el-button type="info" :icon="View" @click="showPreview = true">预览样本</el-button>
      </div>
      <el-table :data="qualityRows" border stripe height="340px">
        <el-table-column prop="dataset" label="数据集" width="150" />
        <el-table-column prop="rows" label="记录数" width="120" />
        <el-table-column prop="dup" label="重复率" width="110" />
        <el-table-column prop="missing" label="缺失率" width="110" />
        <el-table-column prop="updated" label="最近更新" width="160" />
        <el-table-column prop="owner" label="负责人" />
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button link size="small" type="primary" @click="openRule(scope.row)">治理规则</el-button>
            <el-button link size="small" type="danger" @click="markAnomaly(scope.row)">标记异常</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="content-card full-height-card">
      <div class="section-title">指标处理进度</div>
      <div class="stat-grid" style="margin-bottom: 12px;">
        <div class="stat-card" v-for="item in stats" :key="item.label">
          <div style="color: #6b7280;">{{ item.label }}</div>
          <div class="stat-value">{{ item.value }}</div>
          <div style="color: #22c55e; font-weight: 600;">{{ item.trend }}</div>
        </div>
      </div>
      <div ref="chartRef" class="chart-box"></div>
    </div>
  </div>

  <el-dialog v-model="showSchedule" title="任务调度" width="460px" align-center>
    <el-form :model="schedule" label-width="90px">
      <el-form-item label="任务名称">
        <el-input v-model="schedule.name" placeholder="如：离线清洗" />
      </el-form-item>
      <el-form-item label="周期">
        <el-select v-model="schedule.cron" placeholder="选择周期">
          <el-option label="每小时" value="0 * * * *" />
          <el-option label="每日" value="0 2 * * *" />
          <el-option label="每周" value="0 3 * * 1" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级">
        <el-rate v-model="schedule.priority" :colors="['#22c55e', '#a855f7', '#ef4444']" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showSchedule = false">取消</el-button>
      <el-button type="primary" @click="saveSchedule">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="showPreview" title="治理样本" width="520px" align-center>
    <el-table :data="previewRows" height="320px" border>
      <el-table-column prop="field" label="字段" width="160" />
      <el-table-column prop="origin" label="原始值" />
      <el-table-column prop="clean" label="清洗后" />
    </el-table>
  </el-dialog>

  <el-dialog v-model="showProgress" title="清洗执行" width="400px" align-center>
    <p style="margin-bottom: 10px;">治理任务正在运行，实时显示处理进度。</p>
    <el-progress :percentage="progress" status="success" :stroke-width="14" :striped="true" />
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';

const qualityRows = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    dataset: `ODS_行为表_${i + 1}`,
    rows: 120000 + i * 3210,
    dup: `${(2 + (i % 5))}%`,
    missing: `${(1 + (i % 4))}%`,
    updated: `2024-06-${(i % 9) + 10} 0${i % 9}:00`,
    owner: ['数据平台', '风控', '推荐', '增长'][i % 4]
  }))
);

const stats = reactive([
  { label: '已清洗表', value: '186', trend: '+12 本周' },
  { label: '规则命中率', value: '98.3%', trend: '+1.1%' },
  { label: '异常修复', value: '742', trend: '+36' },
  { label: '标准化字段', value: '1,280', trend: '+58' }
]);

const previewRows = reactive([
  { field: '手机号', origin: '138****', clean: '13812345678' },
  { field: '邮箱', origin: 'test@@abc.com', clean: 'test@abc.com' },
  { field: '省份', origin: '广東', clean: '广东' },
  { field: '创建时间', origin: '20240610', clean: '2024-06-10' },
  { field: '性别', origin: '未知', clean: '未披露' }
]);

const showSchedule = ref(false);
const showPreview = ref(false);
const showProgress = ref(false);
const progress = ref(16);
const schedule = reactive({ name: '离线清洗', cron: '0 2 * * *', priority: 3 });

const chartRef = ref();

const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value', name: '任务数' },
    series: [
      {
        name: '清洗任务',
        type: 'bar',
        data: [18, 22, 26, 19, 30, 32, 24],
        itemStyle: { color: '#3b82f6', borderRadius: 6 }
      },
      {
        name: '标准化',
        type: 'line',
        data: [12, 15, 18, 14, 20, 22, 18],
        smooth: true,
        symbolSize: 10,
        lineStyle: { width: 3, color: '#22c55e' },
        areaStyle: { color: 'rgba(34,197,94,0.12)' }
      }
    ]
  });
};

onMounted(renderChart);

const runCleansing = () => {
  progress.value = 16;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 22;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      ElMessageBox.alert('清洗完成，质量报告已生成。', '任务完成', { type: 'success' });
      showProgress.value = false;
    }
  }, 650);
};

const saveSchedule = () => {
  showSchedule.value = false;
  ElMessage.success(`任务 ${schedule.name} 已按 ${schedule.cron} 调度`);
};

const openRule = (row) => {
  ElMessageBox.alert(`为 ${row.dataset} 自动应用规范校验、主键去重与缺失补全。`, '治理策略', {
    type: 'info'
  });
};

const markAnomaly = (row) => {
  ElMessageBox.alert(`已标记 ${row.dataset} 存在异常，生成工单分配至 ${row.owner}。`, '异常确认', {
    type: 'warning'
  });
};
</script>
