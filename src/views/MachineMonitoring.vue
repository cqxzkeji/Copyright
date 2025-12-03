<template>
  <section>
    <div class="section-header">
      <div>
        <div class="section-title">机器状态监控</div>
        <div style="color: #6b7a99;">实时采集打磨、冲压、抛光机台的温度与震动</div>
      </div>
      <div class="section-actions">
        <button class="primary-btn" @click="openTicket">提交检修</button>
        <button class="secondary-btn" @click="openProgress('正在同步传感器状态...')">同步传感器</button>
        <button class="secondary-btn" @click="openProgress('推送巡检路线到移动端...')">派发巡检</button>
      </div>
    </div>

    <div class="card-grid" style="margin: 16px 0;">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <h3>{{ metric.label }}</h3>
        <div class="stat-value">{{ metric.value }}</div>
        <div style="color: #6b7a99;">{{ metric.desc }}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <h3>机台稼动率</h3>
        <div class="inline-chart">
          <div v-for="point in utilization" :key="point.label" class="chart-bar" :style="{ '--bar-height': point.height + 'px' }" :title="point.label + ' ' + point.rate">
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <div class="section-title" style="font-size: 18px;">机台列表</div>
        <div class="section-actions">
          <button class="secondary-btn" @click="openProgress('正在导出设备状态...')">导出清单</button>
          <button class="secondary-btn" @click="openProgress('开始批量校准...')">批量校准</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>机台</th>
            <th>类型</th>
            <th>温度</th>
            <th>振动</th>
            <th>状态</th>
            <th>产能</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="machine in machineRows" :key="machine.name">
            <td>{{ machine.name }}</td>
            <td>{{ machine.type }}</td>
            <td>{{ machine.temp }}℃</td>
            <td>{{ machine.vibration }} mm/s</td>
            <td>
              <span class="chip" :class="machine.status === '运行' ? 'success' : machine.status === '停机' ? 'danger' : 'warning'">{{ machine.status }}</span>
            </td>
            <td>{{ machine.throughput }} 件/时</td>
            <td><button class="text-btn" @click="openMachine(machine)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 提交检修 -->
    <div v-if="showTicket" class="modal-overlay" @click.self="showTicket = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">提交检修工单</div>
          <button class="text-btn" @click="showTicket = false">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="label">机台</label>
              <select v-model="ticket.machine">
                <option v-for="m in machineRows" :key="m.name" :value="m.name">{{ m.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">异常描述</label>
              <input v-model="ticket.desc" placeholder="例如：振动超过 6mm/s" />
            </div>
          </div>
          <div style="margin-top: 10px;">
            <label class="label">停机窗口</label>
            <input v-model="ticket.window" type="datetime-local" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showTicket = false">取消</button>
          <button class="primary-btn" @click="submitTicket">提交</button>
        </div>
      </div>
    </div>

    <!-- 机台详情 -->
    <div v-if="selectedMachine" class="modal-overlay" @click.self="selectedMachine = null">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">机台详情 - {{ selectedMachine.name }}</div>
          <button class="text-btn" @click="selectedMachine = null">关闭</button>
        </div>
        <div class="modal-body">
          <div class="info-row">
            <div>
              <div class="label">类型</div>
              <div>{{ selectedMachine.type }}</div>
            </div>
            <div>
              <div class="label">温度</div>
              <div>{{ selectedMachine.temp }}℃</div>
            </div>
            <div>
              <div class="label">振动</div>
              <div>{{ selectedMachine.vibration }} mm/s</div>
            </div>
            <div>
              <div class="label">计划产能</div>
              <div>{{ selectedMachine.throughput }} 件/时</div>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <label class="label">维护备注</label>
            <textarea v-model="selectedMachine.note" rows="2" placeholder="更换冷却液、检查刀头..." />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="selectedMachine = null">关闭</button>
          <button class="primary-btn" @click="saveMachine">保存备注</button>
        </div>
      </div>
    </div>

    <!-- 进度提示 -->
    <div v-if="progressMessage" class="modal-overlay" @click.self="progressMessage = ''">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">执行中</div>
          <button class="text-btn" @click="progressMessage = ''">关闭</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 10px;">{{ progressMessage }}</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const metrics = [
  { label: '温度告警', value: '0 台', desc: '全部温度处于安全范围' },
  { label: '振动告警', value: '1 台', desc: 'M4 超过 5mm/s' },
  { label: '保养到期', value: '2 台', desc: '建议在本班完成预防维护' },
  { label: '在线设备', value: '10 台', desc: '采集频率 2s/次' }
];

const utilization = [
  { label: 'M1', rate: '92%', height: 120 },
  { label: 'M2', rate: '85%', height: 110 },
  { label: 'M3', rate: '78%', height: 96 },
  { label: 'M4', rate: '70%', height: 86 },
  { label: 'M5', rate: '65%', height: 78 },
  { label: 'M6', rate: '80%', height: 102 }
];

const machineRows = reactive([
  { name: 'M1', type: '打磨', temp: 45, vibration: 3.2, status: '运行', throughput: 42, note: '' },
  { name: 'M2', type: '冲压', temp: 48, vibration: 3.8, status: '运行', throughput: 36, note: '' },
  { name: 'M3', type: '抛光', temp: 46, vibration: 2.9, status: '运行', throughput: 35, note: '' },
  { name: 'M4', type: '打磨', temp: 55, vibration: 6.1, status: '预警', throughput: 30, note: '' },
  { name: 'M5', type: '冲压', temp: 44, vibration: 3.0, status: '运行', throughput: 32, note: '' },
  { name: 'M6', type: '打磨', temp: 47, vibration: 3.5, status: '运行', throughput: 33, note: '' },
  { name: 'M7', type: '冲压', temp: 43, vibration: 2.8, status: '运行', throughput: 31, note: '' },
  { name: 'M8', type: '抛光', temp: 45, vibration: 3.1, status: '运行', throughput: 29, note: '' },
  { name: 'M9', type: '打磨', temp: 49, vibration: 3.7, status: '运行', throughput: 34, note: '' },
  { name: 'M10', type: '抛光', temp: 42, vibration: 2.5, status: '停机', throughput: 0, note: '' }
]);

const showTicket = ref(false);
const ticket = reactive({ machine: 'M1', desc: '', window: '' });
const progressMessage = ref('');
const progress = ref(10);
const selectedMachine = ref(null);

const openProgress = (msg) => {
  progressMessage.value = msg;
  progress.value = 10;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) clearInterval(timer);
  }, 360);
};

const openTicket = () => {
  showTicket.value = true;
};

const submitTicket = () => {
  showTicket.value = false;
  openProgress('检修工单已提交至维修组');
};

const openMachine = (machine) => {
  selectedMachine.value = { ...machine };
};

const saveMachine = () => {
  if (!selectedMachine.value) return;
  const idx = machineRows.findIndex((m) => m.name === selectedMachine.value.name);
  if (idx !== -1) machineRows[idx] = { ...selectedMachine.value };
  selectedMachine.value = null;
  openProgress('机台备注已保存');
};
</script>
