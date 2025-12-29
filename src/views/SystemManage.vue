<template>
  <div class="grid-two">
    <div class="content-card">
      <div class="section-title">用户与权限</div>
      <div class="table-toolbar">
        <el-button type="primary" :icon="User" @click="showUser = true">新增用户</el-button>
        <el-button type="success" :icon="Key" @click="openRole">角色策略</el-button>
        <el-button type="info" :icon="BellFilled" @click="openAudit">审计通知</el-button>
      </div>
      <el-table :data="users" border stripe height="340px">
        <el-table-column prop="name" label="姓名" width="140" />
        <el-table-column prop="role" label="角色" width="140" />
        <el-table-column prop="dept" label="部门" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最近登录" />
      </el-table>
    </div>

    <div class="content-card full-height-card">
      <div class="section-title">运行与监控</div>
      <div class="table-actions" style="margin-bottom: 12px;">
        <el-button type="warning" :icon="Cpu" @click="reloadService">重载服务</el-button>
        <el-button type="primary" :icon="TrendCharts" @click="showLog = true">查看日志</el-button>
      </div>
      <div ref="chartRef" class="chart-box"></div>
    </div>
  </div>

  <el-dialog v-model="showUser" title="新增用户" width="460px" align-center>
    <el-form :model="userForm" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="userForm.name" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="userForm.role">
          <el-option label="管理员" value="管理员" />
          <el-option label="数据开发" value="数据开发" />
          <el-option label="分析师" value="分析师" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="userForm.dept" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showUser = false">取消</el-button>
      <el-button type="primary" @click="saveUser">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="showLog" title="运行日志" width="520px" align-center>
    <el-table :data="logs" border height="320px">
      <el-table-column prop="time" label="时间" width="180" />
      <el-table-column prop="level" label="级别" width="100" />
      <el-table-column prop="detail" label="详情" />
    </el-table>
  </el-dialog>

  <el-dialog v-model="showProgress" title="服务重载" width="400px" align-center>
    <p style="margin-bottom: 10px;">正在重载 API 网关与调度器，请稍候。</p>
    <el-progress :percentage="progress" status="success" :striped="true" :stroke-width="14" />
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';

const users = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    name: `用户-${i + 1}`,
    role: ['管理员', '数据开发', '分析师'][i % 3],
    dept: ['数据平台', '风控', '商业化', '推荐'][i % 4],
    status: i % 5 === 0 ? '停用' : '启用',
    lastLogin: `2024-06-${(i % 9) + 11} 1${i % 9}:12`
  }))
);

const logs = reactive(
  Array.from({ length: 8 }, (_, i) => ({
    time: `2024-06-1${i} 10:2${i}`,
    level: ['INFO', 'WARN', 'INFO', 'ERROR'][i % 4],
    detail: ['同步任务完成', 'Kafka 延迟升高', '指标刷新成功', '权限变更触发审计'][i % 4]
  }))
);

const showUser = ref(false);
const showLog = ref(false);
const showProgress = ref(false);
const progress = ref(8);
const userForm = reactive({ name: '', role: '分析师', dept: '数据平台' });
const chartRef = ref();

const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: ['网关', '调度', '计算', '存储', '可视化', '模型'] },
    yAxis: { type: 'value', name: 'QPS' },
    series: [
      {
        name: '当前流量',
        type: 'bar',
        data: [1200, 980, 1430, 1100, 960, 880],
        itemStyle: { color: '#3b82f6', borderRadius: 6 }
      },
      {
        name: '警戒线',
        type: 'line',
        data: [1600, 1400, 1600, 1500, 1300, 1200],
        lineStyle: { color: '#ef4444', width: 2, type: 'dashed' }
      }
    ]
  });
};

onMounted(renderChart);

const saveUser = () => {
  if (!userForm.name) {
    ElMessage.warning('请输入姓名');
    return;
  }
  users.unshift({ ...userForm, status: '启用', lastLogin: '刚刚' });
  showUser.value = false;
  ElMessage.success('用户已创建并赋权');
};

const reloadService = () => {
  progress.value = 8;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 24;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      showProgress.value = false;
      ElMessageBox.alert('服务已重载完成，所有节点运行健康。', '完成', { type: 'success' });
    }
  }, 650);
};

const openRole = () => {
  ElMessageBox.alert('默认最小权限策略已启用，敏感操作需二次审批。', '角色策略', { type: 'info' });
};

const openAudit = () => {
  ElMessageBox.alert('审计通知已开启，关键操作将记录到安全中心。', '审计通知', { type: 'info' });
};
</script>
