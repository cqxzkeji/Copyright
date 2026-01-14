<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h2>统计分析与系统管理</h2>
        <p>生成统计报表，配置权限与运行维护管理。</p>
      </div>
      <div class="actions">
        <el-button type="primary" @click="openDialog('report')">生成报表</el-button>
        <el-button @click="openDialog('permission')">权限配置</el-button>
        <el-button @click="openDialog('maintenance')">系统巡检</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card>
        <div class="stat">
          <div>
            <h3>月度报表</h3>
            <p>8 份</p>
          </div>
          <el-tag type="success">已生成</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>活跃用户</h3>
            <p>26 人</p>
          </div>
          <el-tag type="info">在线</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>系统负载</h3>
            <p>42%</p>
          </div>
          <el-tag type="success">稳定</el-tag>
        </div>
      </el-card>
    </div>

    <div class="panel-grid">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>统计趋势</span>
            <el-button size="small" @click="openDialog('summary')">查看摘要</el-button>
          </div>
        </template>
        <div ref="chartRef" class="chart"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>系统用户列表</span>
            <el-button size="small" type="primary" @click="openDialog('role')">调整角色</el-button>
          </div>
        </template>
        <el-table :data="tableData" height="380">
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="role" label="角色" width="140" />
          <el-table-column prop="department" label="部门" width="140" />
          <el-table-column prop="status" label="状态" width="120" />
          <el-table-column prop="last" label="最近登录" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="dialogs.report" title="报表生成" width="420px" :close-on-click-modal="false">
      <p>正在汇总统计数据并生成报表。</p>
      <el-progress :percentage="81" status="success" />
      <template #footer>
        <el-button type="primary" @click="dialogs.report = false">完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.permission" title="权限配置" width="480px" :close-on-click-modal="false">
      <el-form :model="permissionForm" label-width="100px">
        <el-form-item label="角色名称"><el-input v-model="permissionForm.role" /></el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="permissionForm.scope">
            <el-option label="全部模块" value="all" />
            <el-option label="监测与告警" value="monitor" />
            <el-option label="仅查看" value="read" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="permissionForm.note" type="textarea" rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.permission = false">取消</el-button>
        <el-button type="primary" @click="dialogs.permission = false">保存配置</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.maintenance" title="系统巡检" width="420px" :close-on-click-modal="false">
      <p>巡检任务已安排至值班工程师，并同步到运维日历。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.maintenance = false">知道了</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.summary" title="统计摘要" width="420px" :close-on-click-modal="false">
      <p>本月告警量下降 12%，高风险点位减少 2 处。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.summary = false">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.role" title="调整角色" width="480px" :close-on-click-modal="false">
      <el-form :model="roleForm" label-width="90px">
        <el-form-item label="用户"><el-input v-model="roleForm.user" /></el-form-item>
        <el-form-item label="新角色"><el-input v-model="roleForm.role" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="roleForm.note" type="textarea" rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.role = false">取消</el-button>
        <el-button type="primary" @click="dialogs.role = false">确认调整</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);

const tableData = Array.from({ length: 20 }, (_, index) => ({
  name: `用户${index + 1}`,
  role: index % 3 === 0 ? '运维管理员' : index % 2 === 0 ? '监测工程师' : '调度管理',
  department: index % 2 === 0 ? '运维中心' : '调度室',
  status: index % 4 === 0 ? '在线' : '离线',
  last: `2024-06-${String((index % 28) + 1).padStart(2, '0')} 09:30`
}));

const dialogs = ref({
  report: false,
  permission: false,
  maintenance: false,
  summary: false,
  role: false
});

const permissionForm = ref({
  role: '值班主管',
  scope: 'monitor',
  note: '夜间仅查看告警'
});

const roleForm = ref({
  user: '用户12',
  role: '监测工程师',
  note: '临时调入监测组'
});

const openDialog = (key) => {
  dialogs.value[key] = true;
};

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['告警数', '报表数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [
      { name: '告警数', type: 'line', data: [18, 16, 14, 12, 13, 11] },
      { name: '报表数', type: 'bar', data: [6, 7, 8, 7, 8, 9] }
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
