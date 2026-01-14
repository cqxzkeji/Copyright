<template>
  <section class="module-grid">
    <div class="app-card overview">
      <div>
        <h2>设备接入与采集管理</h2>
        <p>统一管理相机、补光、触发器与里程计/GNSS，确保采集任务按时同步。</p>
        <div class="metrics">
          <div>
            <strong>28</strong>
            <span>在线设备</span>
          </div>
          <div>
            <strong>6</strong>
            <span>待校准</span>
          </div>
          <div>
            <strong>98%</strong>
            <span>时间同步率</span>
          </div>
        </div>
      </div>
      <img :src="chartImage" alt="设备接入状态" />
    </div>

    <div class="app-card">
      <div class="toolbar">
        <button class="primary-btn" type="button" @click="openDeviceModal">新增设备</button>
        <button class="secondary-btn" type="button" @click="openTaskModal">配置采集任务</button>
        <button class="ghost-btn" type="button" @click="openSyncModal">时间同步策略</button>
        <button class="ghost-btn" type="button" @click="openProgressModal">启动采集</button>
      </div>
      <table class="app-table">
        <thead>
          <tr>
            <th>设备编号</th>
            <th>类型</th>
            <th>位置</th>
            <th>状态</th>
            <th>采集频率</th>
            <th>最近校准</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in deviceRows" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.location }}</td>
            <td><span :class="['badge', item.statusClass]">{{ item.status }}</span></td>
            <td>{{ item.frequency }}</td>
            <td>{{ item.calibration }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      v-if="showDeviceModal"
      title="新增设备接入"
      :on-close="closeDeviceModal"
      :on-confirm="closeDeviceModal"
    >
      <div class="form-grid">
        <label class="form-field">
          设备类型
          <select v-model="deviceForm.type">
            <option>线阵相机</option>
            <option>面阵相机</option>
            <option>补光灯</option>
            <option>触发器</option>
            <option>里程计/GNSS</option>
          </select>
        </label>
        <label class="form-field">
          编号
          <input v-model="deviceForm.code" placeholder="自动生成或手动录入" />
        </label>
        <label class="form-field">
          安装位置
          <input v-model="deviceForm.location" placeholder="如 3号轨检车" />
        </label>
        <label class="form-field">
          采集频率
          <input v-model="deviceForm.frequency" placeholder="如 40 FPS" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showTaskModal"
      title="采集任务配置"
      :on-close="closeTaskModal"
      :on-confirm="closeTaskModal"
    >
      <div class="form-grid">
        <label class="form-field">
          任务名称
          <input v-model="taskForm.name" />
        </label>
        <label class="form-field">
          里程范围
          <input v-model="taskForm.mileage" />
        </label>
        <label class="form-field">
          触发策略
          <select v-model="taskForm.trigger">
            <option>按里程触发</option>
            <option>按帧率触发</option>
            <option>混合触发</option>
          </select>
        </label>
        <label class="form-field">
          时间同步
          <select v-model="taskForm.sync">
            <option>GNSS 对时</option>
            <option>NTP 服务</option>
            <option>本地晶振</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          备注
          <textarea v-model="taskForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showSyncModal"
      title="时间同步策略"
      :on-close="closeSyncModal"
      :on-confirm="closeSyncModal"
    >
      <p>系统已检测到 <strong>6</strong> 台设备存在时间漂移。</p>
      <div class="form-grid" style="margin-top: 12px">
        <label class="form-field">
          同步模式
          <select v-model="syncForm.mode">
            <option>自动校正</option>
            <option>人工复核</option>
            <option>夜间批处理</option>
          </select>
        </label>
        <label class="form-field">
          校正阈值
          <input v-model="syncForm.threshold" />
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          通知人员
          <input v-model="syncForm.notify" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showProgressModal"
      title="采集任务启动中"
      :on-close="closeProgressModal"
      :on-confirm="closeProgressModal"
    >
      <p>采集任务 {{ progressTask }} 正在加载设备并完成标定。</p>
      <div class="progress-bar" style="margin-top: 16px">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin-top: 10px; color: #60729b">进度 {{ progress }}%</p>
    </Modal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const chartImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180'>
      <defs>
        <linearGradient id='g' x1='0' x2='1'>
          <stop offset='0%' stop-color='#2f6bff'/>
          <stop offset='100%' stop-color='#6dd3ff'/>
        </linearGradient>
      </defs>
      <rect width='300' height='180' rx='16' fill='#f1f6ff'/>
      <path d='M20 130 L80 90 L140 110 L200 70 L260 80' fill='none' stroke='url(#g)' stroke-width='6'/>
      <circle cx='80' cy='90' r='6' fill='#2f6bff'/>
      <circle cx='140' cy='110' r='6' fill='#2f6bff'/>
      <circle cx='200' cy='70' r='6' fill='#2f6bff'/>
      <circle cx='260' cy='80' r='6' fill='#2f6bff'/>
    </svg>`
  );

const deviceRows = Array.from({ length: 20 }, (_, index) => {
  const id = `CAM-${index + 101}`;
  const types = ["线阵相机", "面阵相机", "补光灯", "触发器", "里程计/GNSS"];
  const locations = ["检测车 1 号", "检测车 2 号", "检修基地", "区段 A", "区段 B"];
  const statusOptions = [
    { label: "运行中", class: "success" },
    { label: "待校准", class: "warning" },
    { label: "离线", class: "danger" },
  ];
  const status = statusOptions[index % statusOptions.length];
  return {
    id,
    type: types[index % types.length],
    location: locations[index % locations.length],
    status: status.label,
    statusClass: status.class,
    frequency: `${30 + (index % 5) * 5} FPS`,
    calibration: `2024-07-${(index % 28) + 1}`,
  };
});

const showDeviceModal = ref(false);
const showTaskModal = ref(false);
const showSyncModal = ref(false);
const showProgressModal = ref(false);
const progress = ref(0);
const progressTask = ref("任务 A-12");
let progressTimer;

const deviceForm = ref({
  type: "线阵相机",
  code: "",
  location: "检测车 1 号",
  frequency: "40 FPS",
});

const taskForm = ref({
  name: "夜间区段采集",
  mileage: "K12+300 - K18+900",
  trigger: "按里程触发",
  sync: "GNSS 对时",
  note: "重点跟踪道岔区域。",
});

const syncForm = ref({
  mode: "自动校正",
  threshold: "±30 ms",
  notify: "运维组/巡检管理员",
});

const openDeviceModal = () => {
  showDeviceModal.value = true;
};

const closeDeviceModal = () => {
  showDeviceModal.value = false;
};

const openTaskModal = () => {
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
};

const openSyncModal = () => {
  showSyncModal.value = true;
};

const closeSyncModal = () => {
  showSyncModal.value = false;
};

const openProgressModal = () => {
  progress.value = 12;
  progressTask.value = "任务 A-12";
  showProgressModal.value = true;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + 12, 100);
    if (progress.value >= 100) {
      clearInterval(progressTimer);
    }
  }, 400);
};

const closeProgressModal = () => {
  showProgressModal.value = false;
  clearInterval(progressTimer);
};

onBeforeUnmount(() => {
  clearInterval(progressTimer);
});
</script>

<style scoped>
.module-grid {
  display: grid;
  gap: 20px;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  align-items: center;
}

.overview h2 {
  margin: 0 0 8px;
}

.overview p {
  margin: 0 0 16px;
  color: #60729b;
}

.overview img {
  width: 100%;
  border-radius: 14px;
  background: #f1f6ff;
}

.metrics {
  display: flex;
  gap: 16px;
}

.metrics div {
  background: #f4f7ff;
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 90px;
}

.metrics strong {
  font-size: 18px;
  display: block;
}

.metrics span {
  font-size: 12px;
  color: #6a7aa3;
}
</style>
