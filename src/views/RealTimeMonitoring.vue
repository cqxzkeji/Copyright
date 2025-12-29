<template>
  <LayoutShell>
    <div class="card">
      <div class="section-title">
        <h3>实时监控</h3>
        <div class="toolbar">
          <button @click="openForm('threshold')">调整阈值</button>
          <button class="secondary" @click="openInfo('notify')">报警通知</button>
          <button class="outline" @click="openProgress('diagnose')">运行诊断</button>
        </div>
      </div>
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>设备</th>
              <th>指标</th>
              <th>当前值</th>
              <th>阈值</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in realtime" :key="row.device + row.metric">
              <td>{{ row.device }}</td>
              <td>{{ row.metric }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.threshold }}</td>
              <td><span class="status-pill">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid">
      <div class="stat-card" v-for="alert in alerts" :key="alert.title">
        <div class="flex-between">
          <h4>{{ alert.title }}</h4>
          <span class="badge">告警</span>
        </div>
        <div class="value">{{ alert.value }}</div>
        <div class="small-text">{{ alert.desc }}</div>
        <div class="progress-container" style="margin-top: 8px;">
          <div class="progress-bar" :style="{ width: alert.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'threshold'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>阈值配置</h3>
          <button class="menu-button" @click="closeModal">保存</button>
        </div>
        <div class="input-group">
          <label>温度上限 (℃)</label>
          <input type="number" v-model.number="thresholdForm.temp" />
        </div>
        <div class="input-group">
          <label>振动上限 (mm/s)</label>
          <input type="number" v-model.number="thresholdForm.vibration" />
        </div>
        <div class="modal-footer">
          <button class="outline" @click="closeModal">取消</button>
          <button class="secondary" @click="saveThreshold">应用</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'notify'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>报警通知</h3>
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
        <div class="alert">短信、邮件已开启，超限立即推送。</div>
        <ul>
          <li>安全组：安全中心、现场负责人。</li>
          <li>运维组：7x24 轮值值班。</li>
          <li>自动拉群：IM 群 “IoT-监控”。</li>
        </ul>
      </div>
    </div>

    <div v-if="modal.type === 'diagnose'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>运行诊断</h3>
          <span class="status-pill">分析中</span>
        </div>
        <p>正在检查链路、网关和传感器的心跳健康。</p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <div class="modal-footer">
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </LayoutShell>
</template>

<script setup>
import { reactive } from 'vue';
import LayoutShell from '../components/LayoutShell.vue';

const realtime = Array.from({ length: 20 }).map((_, idx) => ({
  device: `设备-${(idx + 1).toString().padStart(2, '0')}`,
  metric: ['温度', '湿度', '压力', '振动'][idx % 4],
  value: `${(30 + idx).toFixed(1)}`,
  threshold: idx % 4 === 0 ? '60' : '80',
  status: idx % 7 === 0 ? '预警' : '正常'
}));

const alerts = [
  { title: '链路时延', value: '210 ms', progress: 65, desc: '接近阈值，建议优化路由' },
  { title: '设备在线率', value: '98.5%', progress: 92, desc: '3 台设备短时离线' },
  { title: '报警处理', value: '完成 17 条', progress: 70, desc: '工单实时跟进' }
];

const modal = reactive({ type: '', progress: 0 });
const thresholdForm = reactive({ temp: 75, vibration: 12 });
let timer;

const openForm = (type) => (modal.type = type);
const openInfo = (type) => (modal.type = type);

const openProgress = (type) => {
  modal.type = type;
  modal.progress = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 14);
    if (modal.progress >= 100) clearInterval(timer);
  }, 300);
};

const saveThreshold = () => {
  alert(`已将温度上限调整为 ${thresholdForm.temp}℃，振动 ${thresholdForm.vibration}mm/s`);
  modal.type = '';
};

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};
</script>
