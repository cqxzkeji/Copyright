<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h2>实时数据采集与监测</h2>
        <p>实时采集运行与变形数据，展示状态曲线与当前工况。</p>
      </div>
      <div class="actions">
        <el-button type="primary" @click="openDialog('collect')">开始采集</el-button>
        <el-button @click="openDialog('calibrate')">指标校验</el-button>
        <el-button @click="openDialog('export')">导出曲线</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card>
        <div class="stat">
          <div>
            <h3>实时负载</h3>
            <p>68%</p>
          </div>
          <el-tag type="success">稳定</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>油温</h3>
            <p>63℃</p>
          </div>
          <el-tag type="warning">需关注</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>振动指数</h3>
            <p>0.82</p>
          </div>
          <el-tag type="success">正常</el-tag>
        </div>
      </el-card>
    </div>

    <div class="panel-grid">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>实时工况曲线</span>
            <el-button size="small" @click="openDialog('detail')">查看说明</el-button>
          </div>
        </template>
        <div ref="chartRef" class="chart"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>最新采集数据</span>
            <el-button size="small" type="primary" @click="openDialog('point')">调整采集点</el-button>
          </div>
        </template>
        <el-table :data="tableData" height="380">
          <el-table-column prop="time" label="采集时间" width="160" />
          <el-table-column prop="load" label="负载" width="100" />
          <el-table-column prop="temp" label="油温" width="100" />
          <el-table-column prop="strain" label="变形值" width="100" />
          <el-table-column prop="status" label="工况" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="dialogs.collect" title="启动采集" width="420px" :close-on-click-modal="false">
      <p>采集任务已启动，正在同步监测装置数据流。</p>
      <el-progress :percentage="86" status="success" />
      <template #footer>
        <el-button type="primary" @click="dialogs.collect = false">完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.calibrate" title="指标校验" width="480px" :close-on-click-modal="false">
      <el-form :model="calibrateForm" label-width="100px">
        <el-form-item label="校验类型">
          <el-select v-model="calibrateForm.type">
            <el-option label="负载传感" value="load" />
            <el-option label="温度传感" value="temp" />
            <el-option label="振动传感" value="vibration" />
          </el-select>
        </el-form-item>
        <el-form-item label="校验频率">
          <el-input v-model="calibrateForm.frequency" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="calibrateForm.owner" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.calibrate = false">取消</el-button>
        <el-button type="primary" @click="dialogs.calibrate = false">提交校验</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.export" title="导出提示" width="420px" :close-on-click-modal="false">
      <p>已生成今日曲线报告，点击确认后推送至运维邮箱。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.export = false">确认导出</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.detail" title="曲线说明" width="420px" :close-on-click-modal="false">
      <p>曲线展示负载、温度与变形耦合趋势，偏离阈值将触发预警。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.detail = false">知道了</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.point" title="调整采集点" width="480px" :close-on-click-modal="false">
      <el-form :model="pointForm" label-width="90px">
        <el-form-item label="采集点位"><el-input v-model="pointForm.point" /></el-form-item>
        <el-form-item label="采集周期"><el-input v-model="pointForm.interval" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="pointForm.note" type="textarea" rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.point = false">取消</el-button>
        <el-button type="primary" @click="dialogs.point = false">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);

const tableData = Array.from({ length: 20 }, (_, index) => ({
  time: `2024-06-${String((index % 28) + 1).padStart(2, '0')} 0${index % 9}:30`,
  load: `${60 + index % 20}%`,
  temp: `${55 + index % 10}℃`,
  strain: `${(0.6 + index * 0.01).toFixed(2)} mm`,
  status: index % 4 === 0 ? '高负载' : index % 3 === 0 ? '需关注' : '稳定'
}));

const dialogs = ref({
  collect: false,
  calibrate: false,
  export: false,
  detail: false,
  point: false
});

const calibrateForm = ref({
  type: 'load',
  frequency: '每6小时',
  owner: '王工'
});

const pointForm = ref({
  point: '主变套管A相',
  interval: '10s',
  note: '新增振动采样'
});

const openDialog = (key) => {
  dialogs.value[key] = true;
};

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['负载', '油温', '变形'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    },
    yAxis: { type: 'value' },
    series: [
      { name: '负载', type: 'line', data: [62, 68, 70, 66, 64, 60, 58] },
      { name: '油温', type: 'line', data: [58, 60, 63, 64, 62, 61, 59] },
      { name: '变形', type: 'line', data: [0.68, 0.72, 0.78, 0.8, 0.76, 0.74, 0.7] }
    ]
  });
  window.addEventListener('resize', () => chart.resize());
});
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h2 {
  margin: 0 0 6px;
  color: #1a2b5c;
}

.module-header p {
  margin: 0;
  color: #7b8bb3;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat h3 {
  margin: 0 0 6px;
  color: #2c3a66;
}

.stat p {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a2b5c;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart {
  width: 100%;
  height: 360px;
}
</style>
