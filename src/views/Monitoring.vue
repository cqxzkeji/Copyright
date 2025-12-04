<template>
  <div class="page">
    <div class="flex-between">
      <div>
        <p class="muted">实时环境与设备监控</p>
        <h2 class="section-title">监控页面</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="startMonitor">开始监测</button>
        <button class="secondary" @click="showAlert = true">报警配置</button>
      </div>
    </div>

    <div class="card-grid">
      <ChartPanel title="温湿度曲线" subtitle="环境稳定性" :config="envConfig" />
      <ChartPanel title="设备在线率" subtitle="节点状态" :config="deviceConfig" />
    </div>

    <h3 class="section-title">监控日志</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>节点</th>
            <th>事件</th>
            <th>级别</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.node }}</td>
            <td>{{ log.event }}</td>
            <td>{{ log.level }}</td>
            <td><span class="badge">{{ log.status }}</span></td>
            <td class="actions">
              <button class="secondary" @click="showToastMsg('已派单到维护人员')">派单</button>
              <button class="primary" @click="openDetail(log)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showAlert" title="报警阈值配置">
      <p>为温度、湿度、光照等指标设置阈值，异常触发短信与邮件通知。</p>
      <div class="actions">
        <button class="primary" @click="showToastMsg('阈值已保存，并同步到边缘网关')">保存</button>
        <button class="secondary" @click="showAlert = false">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showDetail" title="事件详情">
      <p>{{ activeLog?.event }}</p>
      <p>节点：{{ activeLog?.node }}，级别：{{ activeLog?.level }}</p>
      <p>处理状态：{{ activeLog?.status }}</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="监测任务">
      <p>正在同步传感器数据与摄像头帧，确保环境可控。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showToast" title="提示">
      <p>{{ toastMessage }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChartPanel from '../components/ChartPanel.vue';
import ModalDialog from '../components/ModalDialog.vue';

const envConfig = ref({
  type: 'line',
  data: {
    labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    datasets: [
      { label: '温度(°C)', data: [22.1, 22.3, 22.6, 22.9, 23.1, 22.8], borderColor: '#1e90ff', fill: false },
      { label: '湿度(%)', data: [65, 64, 63, 62, 63, 64], borderColor: '#34d399', fill: false }
    ]
  },
  options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
});

const deviceConfig = ref({
  type: 'bar',
  data: {
    labels: ['相机', '温度计', '湿度计', '光照', '土壤传感器'],
    datasets: [
      { label: '在线率', data: [98, 96, 94, 97, 95], backgroundColor: '#f97316' }
    ]
  },
  options: { plugins: { legend: { display: false } }, maintainAspectRatio: false }
});

const logs = ref([
  { time: '09:12', node: '温室-01', event: '温度轻微偏高', level: '提醒', status: '观察中' },
  { time: '09:25', node: '温室-02', event: '湿度快速下降', level: '预警', status: '处理中' },
  { time: '09:47', node: '库房-03', event: '摄像头信号抖动', level: '提醒', status: '观察中' },
  { time: '10:02', node: '温室-04', event: '光照不足', level: '提示', status: '已处理' },
  { time: '10:20', node: '试验田-01', event: '土壤湿度偏低', level: '预警', status: '处理中' },
  { time: '10:35', node: '库房-01', event: '门禁刷卡异常', level: '告警', status: '处理中' },
  { time: '11:00', node: '温室-03', event: '风机电流波动', level: '提醒', status: '观察中' },
  { time: '11:22', node: '试验田-02', event: '节点离线', level: '告警', status: '处理中' },
  { time: '11:55', node: '温室-05', event: '二氧化碳偏低', level: '提示', status: '已处理' },
  { time: '12:10', node: '库房-02', event: '温湿度传感器老化', level: '提醒', status: '待跟进' }
]);

const showAlert = ref(false);
const showDetail = ref(false);
const showProgress = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const activeLog = ref(null);
const progress = ref(0);

const startMonitor = () => {
  showProgress.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      showToastMsg('监测已开启，正在拉取实时数据');
    }
  }, 400);
};

const openDetail = (log) => {
  activeLog.value = log;
  showDetail.value = true;
};

const showToastMsg = (text) => {
  toastMessage.value = text;
  showToast.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress {
  background: #e5e7eb;
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #22d3ee, #0ea5e9);
  height: 100%;
  transition: width 0.3s ease;
}
</style>
