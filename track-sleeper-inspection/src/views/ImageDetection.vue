<template>
  <section class="module-grid">
    <div class="app-card overview">
      <div>
        <h2>轨枕图像检测与识别</h2>
        <p>覆盖轨枕定位、裂纹/掉块/破损/缺失识别，并支持批处理与在线推理。</p>
        <div class="metrics">
          <div>
            <strong>12.8万</strong>
            <span>已处理帧</span>
          </div>
          <div>
            <strong>1.8%</strong>
            <span>异常占比</span>
          </div>
          <div>
            <strong>89ms</strong>
            <span>平均推理</span>
          </div>
        </div>
      </div>
      <img :src="chartImage" alt="检测分布" />
    </div>

    <div class="app-card">
      <div class="toolbar">
        <button class="primary-btn" type="button" @click="openModelModal">模型配置</button>
        <button class="secondary-btn" type="button" @click="openBatchModal">批处理任务</button>
        <button class="ghost-btn" type="button" @click="openOnlineModal">在线推理通道</button>
        <button class="ghost-btn" type="button" @click="openProgressModal">运行检测</button>
      </div>
      <table class="app-table">
        <thead>
          <tr>
            <th>里程区段</th>
            <th>轨枕编号</th>
            <th>检测类型</th>
            <th>置信度</th>
            <th>遮挡情况</th>
            <th>判定结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in detectRows" :key="row.id">
            <td>{{ row.section }}</td>
            <td>{{ row.code }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.score }}</td>
            <td>{{ row.cover }}</td>
            <td><span :class="['badge', row.statusClass]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      v-if="showModelModal"
      title="检测模型配置"
      :on-close="closeModelModal"
      :on-confirm="closeModelModal"
    >
      <div class="form-grid">
        <label class="form-field">
          模型版本
          <select v-model="modelForm.version">
            <option>V3.2 精细版</option>
            <option>V3.1 标准版</option>
            <option>V2.9 轻量版</option>
          </select>
        </label>
        <label class="form-field">
          置信度阈值
          <input v-model="modelForm.threshold" />
        </label>
        <label class="form-field">
          轨枕定位
          <select v-model="modelForm.locate">
            <option>自动分割</option>
            <option>人工校正</option>
          </select>
        </label>
        <label class="form-field">
          重点缺陷
          <input v-model="modelForm.focus" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showBatchModal"
      title="批处理任务下发"
      :on-close="closeBatchModal"
      :on-confirm="closeBatchModal"
    >
      <div class="form-grid">
        <label class="form-field">
          数据源
          <select v-model="batchForm.source">
            <option>夜间采集 A</option>
            <option>日间巡检 B</option>
            <option>历史回放 C</option>
          </select>
        </label>
        <label class="form-field">
          优先级
          <select v-model="batchForm.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          任务描述
          <textarea v-model="batchForm.note" rows="3"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showOnlineModal"
      title="在线推理通道"
      :on-close="closeOnlineModal"
      :on-confirm="closeOnlineModal"
    >
      <p>当前在线推理队列已连接 3 条主线通道。</p>
      <div class="form-grid" style="margin-top: 12px">
        <label class="form-field">
          通道优先级
          <select v-model="onlineForm.channel">
            <option>轨检车 1 号</option>
            <option>轨检车 2 号</option>
            <option>站内巡检车</option>
          </select>
        </label>
        <label class="form-field">
          缓冲帧数
          <input v-model="onlineForm.buffer" />
        </label>
        <label class="form-field">
          推理策略
          <select v-model="onlineForm.strategy">
            <option>实时优先</option>
            <option>均衡调度</option>
            <option>高精度</option>
          </select>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showProgressModal"
      title="检测任务执行中"
      :on-close="closeProgressModal"
      :on-confirm="closeProgressModal"
    >
      <p>正在处理 {{ progressName }}，预计 3 分钟完成。</p>
      <div class="progress-bar" style="margin-top: 16px">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin-top: 10px; color: #60729b">识别进度 {{ progress }}%</p>
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
      <rect width='300' height='180' rx='16' fill='#eef6ff'/>
      <rect x='30' y='90' width='28' height='60' fill='#8bd0ff'/>
      <rect x='75' y='70' width='28' height='80' fill='#2f6bff'/>
      <rect x='120' y='50' width='28' height='100' fill='#4fa2ff'/>
      <rect x='165' y='80' width='28' height='70' fill='#6ed4ff'/>
      <rect x='210' y='60' width='28' height='90' fill='#2f6bff'/>
    </svg>`
  );

const detectRows = Array.from({ length: 20 }, (_, index) => {
  const types = ["裂纹", "掉块", "破损", "缺失", "异物遮挡"];
  const covers = ["无遮挡", "轻度遮挡", "严重遮挡"];
  const statusOptions = [
    { label: "需复核", class: "warning" },
    { label: "正常", class: "success" },
    { label: "严重缺陷", class: "danger" },
  ];
  const status = statusOptions[index % statusOptions.length];
  return {
    id: index + 1,
    section: `K${12 + index}+${(index * 4) % 1000}`,
    code: `S-${index + 200}`,
    type: types[index % types.length],
    score: `${86 + (index % 12)}%`,
    cover: covers[index % covers.length],
    status: status.label,
    statusClass: status.class,
  };
});

const showModelModal = ref(false);
const showBatchModal = ref(false);
const showOnlineModal = ref(false);
const showProgressModal = ref(false);
const progress = ref(0);
const progressName = ref("线路批处理-夜班");
let timer;

const modelForm = ref({
  version: "V3.2 精细版",
  threshold: "0.82",
  locate: "自动分割",
  focus: "裂纹/缺失/掉块",
});

const batchForm = ref({
  source: "夜间采集 A",
  priority: "高",
  note: "重点分析站场道岔与曲线段。",
});

const onlineForm = ref({
  channel: "轨检车 1 号",
  buffer: "48 帧",
  strategy: "均衡调度",
});

const openModelModal = () => {
  showModelModal.value = true;
};
const closeModelModal = () => {
  showModelModal.value = false;
};
const openBatchModal = () => {
  showBatchModal.value = true;
};
const closeBatchModal = () => {
  showBatchModal.value = false;
};
const openOnlineModal = () => {
  showOnlineModal.value = true;
};
const closeOnlineModal = () => {
  showOnlineModal.value = false;
};

const openProgressModal = () => {
  progress.value = 15;
  progressName.value = "线路批处理-夜班";
  showProgressModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 10, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 350);
};

const closeProgressModal = () => {
  showProgressModal.value = false;
  clearInterval(timer);
};

onBeforeUnmount(() => {
  clearInterval(timer);
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
