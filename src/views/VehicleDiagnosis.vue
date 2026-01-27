<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>实时诊断概览</h3>
      <div class="grid grid-3">
        <div>
          <p class="tag">电池健康度</p>
          <h2>{{ summary.battery }}%</h2>
        </div>
        <div>
          <p class="tag">驱动系统效率</p>
          <h2>{{ summary.drive }}%</h2>
        </div>
        <div>
          <p class="tag">ECU在线率</p>
          <h2>{{ summary.ecu }}%</h2>
        </div>
      </div>
      <div style="margin-top: 16px;">
        <svg width="100%" height="120" viewBox="0 0 420 120" role="img">
          <defs>
            <linearGradient id="diag" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#2656ff" />
              <stop offset="100%" stop-color="#7cc0ff" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#diag)"
            stroke-width="4"
            points="0,90 60,70 120,80 180,45 240,50 300,35 360,45 420,25"
          />
          <circle cx="420" cy="25" r="5" fill="#2656ff" />
        </svg>
      </div>
    </div>
    <div class="card">
      <h3>诊断操作</h3>
      <p>针对电池包、驱动系统、电子控制单元执行快速诊断。</p>
      <div style="margin-top: 16px;">
        <button class="primary" type="button" @click="startScan">启动扫描</button>
        <button class="secondary" type="button" @click="openFaultForm">录入故障</button>
        <button class="ghost" type="button" @click="openTip">诊断提示</button>
      </div>
      <div class="card" style="margin-top: 16px; background: #f7f9ff;">
        <h4>扫描队列</h4>
        <ul>
          <li v-for="item in queue" :key="item.id">{{ item.name }} - {{ item.status }}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>实时检测明细</h3>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>检测部位</th>
          <th>状态</th>
          <th>电压(V)</th>
          <th>温度(°C)</th>
          <th>诊断结论</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.part }}</td>
          <td><span class="badge" :class="row.badge">{{ row.status }}</span></td>
          <td>{{ row.voltage }}</td>
          <td>{{ row.temp }}</td>
          <td>{{ row.result }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="showScan" title="扫描进度" @close="closeScan">
    <p>正在对电池、驱动系统与 ECU 进行综合扫描。</p>
    <div class="progress" style="margin-top: 12px;">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p style="margin-top: 8px;">当前进度：{{ progress }}%</p>
    <template #footer>
      <button class="secondary" type="button" @click="closeScan">后台继续</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showForm" title="录入故障信息" @close="showForm = false">
    <div class="form-grid">
      <div>
        <label>车辆编号</label>
        <input v-model="faultForm.vehicleId" type="text" placeholder="例如：EV-2024-018" />
      </div>
      <div>
        <label>故障类型</label>
        <select v-model="faultForm.type">
          <option>电池异常</option>
          <option>驱动系统异常</option>
          <option>ECU信号中断</option>
        </select>
      </div>
      <div>
        <label>故障描述</label>
        <textarea v-model="faultForm.desc" rows="3" placeholder="描述检测到的异常信息"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="submitFault">提交</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showTip" title="诊断提示" @close="showTip = false">
    <p>建议在高压工作段重点监测温度波动，异常波动高于 6°C 时建议触发深度诊断。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const summary = reactive({
  battery: 96,
  drive: 93,
  ecu: 98
});

const queue = [
  { id: 1, name: 'EV-2024-018', status: '准备中' },
  { id: 2, name: 'EV-2024-019', status: '扫描中' },
  { id: 3, name: 'EV-2024-020', status: '等待结果' }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const statusOptions = ['正常', '关注', '异常'];
  const badgeMap = ['success', 'warning', 'danger'];
  const statusIndex = index % 3;
  return {
    id: `D-${String(id).padStart(3, '0')}`,
    part: ['电池模组', '驱动逆变器', '冷却系统', 'ECU总线'][index % 4],
    status: statusOptions[statusIndex],
    badge: badgeMap[statusIndex],
    voltage: (360 + index * 1.4).toFixed(1),
    temp: (28 + index * 0.6).toFixed(1),
    result: statusIndex === 2 ? '建议复检' : '运行稳定'
  };
});

const showScan = ref(false);
const showForm = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer;

const startScan = () => {
  showScan.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      return;
    }
    progress.value += 8;
  }, 300);
};

const closeScan = () => {
  showScan.value = false;
  clearInterval(timer);
};

const openFaultForm = () => {
  showForm.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const faultForm = reactive({
  vehicleId: '',
  type: '电池异常',
  desc: ''
});

const submitFault = () => {
  showForm.value = false;
  showTip.value = true;
};
</script>
