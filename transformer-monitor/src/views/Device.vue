<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h2>设备接入与基础信息管理</h2>
        <p>管理台账、在线监测装置接入与运行状态维护。</p>
      </div>
      <div class="actions">
        <el-button type="primary" @click="openDialog('create')">新增设备</el-button>
        <el-button @click="openDialog('import')">批量导入</el-button>
        <el-button @click="openDialog('deploy')">启动接入</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card>
        <div class="stat">
          <div>
            <h3>接入设备</h3>
            <p>36 台</p>
          </div>
          <el-tag type="success">在线 32</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>运行告警</h3>
            <p>4 项</p>
          </div>
          <el-tag type="warning">需巡检</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>装置健康度</h3>
            <p>92%</p>
          </div>
          <el-tag type="success">优</el-tag>
        </div>
      </el-card>
    </div>

    <div class="panel-grid">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>接入统计</span>
            <el-button size="small" @click="openDialog('detail')">查看详情</el-button>
          </div>
        </template>
        <div ref="chartRef" class="chart"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>设备台账</span>
            <el-button size="small" type="primary" @click="openDialog('edit')">编辑台账</el-button>
          </div>
        </template>
        <el-table :data="tableData" height="380">
          <el-table-column prop="code" label="设备编号" width="120" />
          <el-table-column prop="site" label="站点" width="140" />
          <el-table-column prop="capacity" label="容量" width="120" />
          <el-table-column prop="status" label="运行状态" width="120" />
          <el-table-column prop="updated" label="最近维护" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="dialogs.create" title="新增设备" width="520px" :close-on-click-modal="false">
      <el-form :model="deviceForm" label-width="90px">
        <el-form-item label="设备编号"><el-input v-model="deviceForm.code" /></el-form-item>
        <el-form-item label="站点名称"><el-input v-model="deviceForm.site" /></el-form-item>
        <el-form-item label="容量"><el-input v-model="deviceForm.capacity" /></el-form-item>
        <el-form-item label="监测装置">
          <el-select v-model="deviceForm.sensor" placeholder="选择装置">
            <el-option label="应变监测" value="strain" />
            <el-option label="振动监测" value="vibration" />
            <el-option label="油温监测" value="temperature" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.create = false">取消</el-button>
        <el-button type="primary" @click="dialogs.create = false">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.import" title="批量导入进度" width="420px" :close-on-click-modal="false">
      <p>正在校验设备参数与接入信息。</p>
      <el-progress :percentage="78" status="success" />
      <template #footer>
        <el-button type="primary" @click="dialogs.import = false">完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.deploy" title="启动接入" width="480px" :close-on-click-modal="false">
      <el-form :model="deployForm" label-width="100px">
        <el-form-item label="接入时间">
          <el-date-picker v-model="deployForm.date" type="datetime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="deployForm.owner" />
        </el-form-item>
        <el-form-item label="接入说明">
          <el-input v-model="deployForm.note" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.deploy = false">取消</el-button>
        <el-button type="primary" @click="dialogs.deploy = false">确认接入</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.detail" title="接入统计详情" width="500px" :close-on-click-modal="false">
      <p>本周新增接入 6 台，在线率达到 88%，重点站点已完成双重接入校验。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.detail = false">知道了</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.edit" title="编辑台账" width="480px" :close-on-click-modal="false">
      <el-form :model="ledgerForm" label-width="90px">
        <el-form-item label="维护周期"><el-input v-model="ledgerForm.cycle" /></el-form-item>
        <el-form-item label="现场经理"><el-input v-model="ledgerForm.manager" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="ledgerForm.remark" type="textarea" rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.edit = false">取消</el-button>
        <el-button type="primary" @click="dialogs.edit = false">保存调整</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);

const tableData = Array.from({ length: 20 }, (_, index) => ({
  code: `TR-${String(index + 1).padStart(3, '0')}`,
  site: `站点-${index + 1}`,
  capacity: `${50 + index * 2} MVA`,
  status: index % 3 === 0 ? '重点监测' : index % 2 === 0 ? '正常' : '待巡检',
  updated: `2024-0${(index % 9) + 1}-1${index % 9}`
}));

const dialogs = ref({
  create: false,
  import: false,
  deploy: false,
  detail: false,
  edit: false
});

const deviceForm = ref({
  code: 'TR-036',
  site: '城北变电站',
  capacity: '80 MVA',
  sensor: ''
});

const deployForm = ref({
  date: '',
  owner: '李工',
  note: '接入监测与远程巡检' 
});

const ledgerForm = ref({
  cycle: '30 天',
  manager: '陈工',
  remark: '下次维护前完成校准'
});

const openDialog = (key) => {
  dialogs.value[key] = true;
};

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: [3, 5, 4, 6, 5, 7, 6],
        type: 'line',
        smooth: true,
        areaStyle: { color: '#d6e6ff' }
      }
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
