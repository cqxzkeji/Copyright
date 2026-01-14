<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h2>预警与异常处置</h2>
        <p>自动预警、告警记录与处置流程跟踪。</p>
      </div>
      <div class="actions">
        <el-button type="primary" @click="openDialog('process')">一键处置</el-button>
        <el-button @click="openDialog('ticket')">创建工单</el-button>
        <el-button @click="openDialog('clear')">确认消警</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card>
        <div class="stat">
          <div>
            <h3>今日告警</h3>
            <p>12 条</p>
          </div>
          <el-tag type="danger">紧急 2</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>处置中</h3>
            <p>5 条</p>
          </div>
          <el-tag type="warning">处理中</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>已闭环</h3>
            <p>28 条</p>
          </div>
          <el-tag type="success">闭环率 90%</el-tag>
        </div>
      </el-card>
    </div>

    <div class="panel-grid">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>告警等级趋势</span>
            <el-button size="small" @click="openDialog('note')">处置建议</el-button>
          </div>
        </template>
        <div ref="chartRef" class="chart"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>告警列表</span>
            <el-button size="small" type="primary" @click="openDialog('assign')">派单</el-button>
          </div>
        </template>
        <el-table :data="tableData" height="380">
          <el-table-column prop="time" label="时间" width="150" />
          <el-table-column prop="device" label="设备" width="140" />
          <el-table-column prop="level" label="等级" width="90" />
          <el-table-column prop="status" label="状态" width="120" />
          <el-table-column prop="handler" label="负责人" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="dialogs.process" title="处置进度" width="420px" :close-on-click-modal="false">
      <p>正在协同处理紧急告警，请确认现场反馈。</p>
      <el-progress :percentage="64" status="exception" />
      <template #footer>
        <el-button type="primary" @click="dialogs.process = false">继续跟踪</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.ticket" title="创建工单" width="480px" :close-on-click-modal="false">
      <el-form :model="ticketForm" label-width="90px">
        <el-form-item label="告警编号"><el-input v-model="ticketForm.alarm" /></el-form-item>
        <el-form-item label="派工人员"><el-input v-model="ticketForm.owner" /></el-form-item>
        <el-form-item label="处置要求"><el-input v-model="ticketForm.require" type="textarea" rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.ticket = false">取消</el-button>
        <el-button type="primary" @click="dialogs.ticket = false">提交工单</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.clear" title="消警确认" width="420px" :close-on-click-modal="false">
      <p>确认该告警已处理完成并进入归档吗？</p>
      <template #footer>
        <el-button @click="dialogs.clear = false">取消</el-button>
        <el-button type="primary" @click="dialogs.clear = false">确认消警</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.note" title="处置建议" width="420px" :close-on-click-modal="false">
      <p>紧急告警需优先安排现场巡检并同步调度策略。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.note = false">知道了</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.assign" title="派单" width="480px" :close-on-click-modal="false">
      <el-form :model="assignForm" label-width="90px">
        <el-form-item label="责任班组"><el-input v-model="assignForm.team" /></el-form-item>
        <el-form-item label="到场时间"><el-input v-model="assignForm.time" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="assignForm.note" type="textarea" rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.assign = false">取消</el-button>
        <el-button type="primary" @click="dialogs.assign = false">确认派单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);

const tableData = Array.from({ length: 20 }, (_, index) => ({
  time: `2024-06-${String((index % 28) + 1).padStart(2, '0')} 1${index % 9}:20`,
  device: `TR-${String(index + 5).padStart(3, '0')}`,
  level: index % 5 === 0 ? '紧急' : index % 2 === 0 ? '重要' : '一般',
  status: index % 3 === 0 ? '处理中' : '待确认',
  handler: index % 2 === 0 ? '刘工' : '赵工'
}));

const dialogs = ref({
  process: false,
  ticket: false,
  clear: false,
  note: false,
  assign: false
});

const ticketForm = ref({
  alarm: 'ALM-20240615-03',
  owner: '周工',
  require: '2小时内完成检查并反馈结果'
});

const assignForm = ref({
  team: '电气运维一班',
  time: '今日 18:30 前',
  note: '现场需携带振动监测仪'
});

const openDialog = (key) => {
  dialogs.value[key] = true;
};

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['紧急', '重要', '一般'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      { name: '紧急', type: 'bar', data: [1, 2, 1, 3, 2, 1, 2] },
      { name: '重要', type: 'bar', data: [2, 3, 2, 4, 3, 2, 3] },
      { name: '一般', type: 'bar', data: [3, 4, 3, 5, 4, 3, 4] }
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
