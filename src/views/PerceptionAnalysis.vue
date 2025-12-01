<template>
  <div>
    <div class="card header-card">
      <div>
        <h2>感知分析与目标检测</h2>
        <p>Transformer 解码器实时检测目标并输出置信度。</p>
      </div>
      <div class="btn-group">
        <button class="primary-btn" @click="startDetection">启动检测</button>
        <button class="primary-btn" @click="uploadLabels">标签维护</button>
        <button class="primary-btn" @click="openAlert">风险提示</button>
      </div>
    </div>

    <div class="card">
      <h3>检测结果</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>类别</th>
            <th>置信度</th>
            <th>速度(km/h)</th>
            <th>车道</th>
            <th>时间戳</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in detections" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.score }}%</td>
            <td>{{ item.speed }}</td>
            <td>{{ item.lane }}</td>
            <td>{{ item.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>置信度分布</h3>
      <div class="chart-row">
        <div v-for="confidence in confidenceBins" :key="confidence.label" class="chart-bar" :style="{ height: confidence.value + 'px' }" :title="confidence.label"></div>
      </div>
    </div>

    <div v-if="detectionModal" class="modal-backdrop" @click.self="detectionModal = false">
      <div class="modal-content">
        <h3>检测进度</h3>
        <p>正在运行 Transformer 解码...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: detectionProgress + '%' }"></div>
        </div>
        <p v-if="detectionProgress === 100">完成：检测结果已刷新至列表。</p>
      </div>
    </div>

    <div v-if="labelModal" class="modal-backdrop" @click.self="labelModal = false">
      <div class="modal-content">
        <h3>标签维护</h3>
        <div class="form-grid">
          <label>类别名称</label>
          <input v-model="labelForm.name" placeholder="新增类别" />
          <label>警示等级</label>
          <select v-model="labelForm.level">
            <option>低</option>
            <option>中</option>
            <option>高</option>
          </select>
          <label>外观颜色</label>
          <input v-model="labelForm.color" placeholder="#22c55e" />
          <label>备注</label>
          <input v-model="labelForm.note" placeholder="应用场景" />
        </div>
        <div class="btn-row">
          <button class="primary-btn" @click="saveLabel">保存标签</button>
          <button class="secondary" @click="labelModal = false">取消</button>
        </div>
      </div>
    </div>

    <div v-if="alertModal" class="modal-backdrop" @click.self="alertModal = false">
      <div class="modal-content">
        <h3>风险提示</h3>
        <p>检测到施工区域，自动提高行人与非机动车敏感度。</p>
        <button class="primary-btn" @click="alertModal = false">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const detections = ref([
  { id: 'D-001', type: '小汽车', score: 98, speed: 54, lane: 'L2', time: '10:01:10' },
  { id: 'D-002', type: '行人', score: 96, speed: 5, lane: '人行', time: '10:01:10' },
  { id: 'D-003', type: '卡车', score: 94, speed: 38, lane: 'L3', time: '10:01:11' },
  { id: 'D-004', type: '自行车', score: 92, speed: 18, lane: '非机', time: '10:01:11' },
  { id: 'D-005', type: '公交车', score: 95, speed: 42, lane: 'L1', time: '10:01:12' },
  { id: 'D-006', type: '工程车', score: 90, speed: 22, lane: '施工', time: '10:01:12' },
  { id: 'D-007', type: '行人', score: 97, speed: 4, lane: '人行', time: '10:01:12' },
  { id: 'D-008', type: '摩托车', score: 93, speed: 33, lane: '非机', time: '10:01:13' },
  { id: 'D-009', type: '小汽车', score: 95, speed: 58, lane: 'L2', time: '10:01:14' },
  { id: 'D-010', type: '小汽车', score: 91, speed: 52, lane: 'L3', time: '10:01:15' },
  { id: 'D-011', type: '行人', score: 92, speed: 6, lane: '人行', time: '10:01:15' },
  { id: 'D-012', type: '行人', score: 93, speed: 6, lane: '人行', time: '10:01:16' }
]);

const confidenceBins = ref([
  { label: '90-92%', value: 110 },
  { label: '92-94%', value: 130 },
  { label: '94-96%', value: 140 },
  { label: '96-98%', value: 160 },
  { label: '98-100%', value: 145 }
]);

const detectionModal = ref(false);
const detectionProgress = ref(0);
const labelModal = ref(false);
const alertModal = ref(false);
const labelForm = reactive({ name: '', level: '中', color: '#22c55e', note: '' });
let detectionTimer;

const startDetection = () => {
  detectionModal.value = true;
  detectionProgress.value = 0;
  detectionTimer = setInterval(() => {
    if (detectionProgress.value >= 100) {
      clearInterval(detectionTimer);
    } else {
      detectionProgress.value += 20;
    }
  }, 220);
};

const uploadLabels = () => {
  labelModal.value = true;
};

const openAlert = () => {
  alertModal.value = true;
};

const saveLabel = () => {
  detections.value.unshift({
    id: `D-${detections.value.length + 200}`,
    type: labelForm.name || '新类别',
    score: 90,
    speed: 0,
    lane: '标注',
    time: '10:01:20'
  });
  labelModal.value = false;
};
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 12px 0;
}

.btn-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
