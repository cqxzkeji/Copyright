<template>
  <div>
    <div class="card header-card">
      <div>
        <h2>数据预处理与融合</h2>
        <p>执行噪声滤波、时空对齐与Transformer编码前的数据标准化。</p>
      </div>
      <div class="btn-group">
        <button class="primary-btn" @click="openCleanModal">批量清洗</button>
        <button class="primary-btn" @click="openAlignModal">时序对齐</button>
        <button class="primary-btn" @click="openFuseModal">预融合</button>
      </div>
    </div>

    <div class="card">
      <h3>预处理任务队列</h3>
      <table>
        <thead>
          <tr>
            <th>任务ID</th>
            <th>数据源</th>
            <th>滤波器</th>
            <th>补全率</th>
            <th>耗时(ms)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.source }}</td>
            <td>{{ task.filter }}</td>
            <td>{{ task.completeness }}%</td>
            <td>{{ task.duration }}</td>
            <td><span class="chip">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>特征覆盖率</h3>
      <div class="chart-row">
        <div v-for="feature in features" :key="feature.label" class="chart-bar" :style="{ height: feature.value + 'px' }" :title="feature.label + ' ' + feature.value + '%' "></div>
      </div>
    </div>

    <div v-if="cleanModal" class="modal-backdrop" @click.self="cleanModal = false">
      <div class="modal-content">
        <h3>批量清洗</h3>
        <p>选择要清洗的来源并设置滤波阈值。</p>
        <div class="form-grid">
          <label>数据源</label>
          <select v-model="cleanForm.source">
            <option>视频流</option>
            <option>点云流</option>
            <option>雷达数据</option>
          </select>
          <label>滤波阈值</label>
          <input v-model.number="cleanForm.threshold" type="number" />
          <label>缺失插值</label>
          <select v-model="cleanForm.interpolate">
            <option>线性插值</option>
            <option>样条插值</option>
            <option>零填充</option>
          </select>
          <label>批次大小</label>
          <input v-model.number="cleanForm.batch" type="number" />
        </div>
        <div class="btn-row">
          <button class="primary-btn" @click="triggerClean">执行</button>
          <button class="secondary" @click="cleanModal = false">取消</button>
        </div>
      </div>
    </div>

    <div v-if="alignModal" class="modal-backdrop" @click.self="alignModal = false">
      <div class="modal-content">
        <h3>时间对齐</h3>
        <p>利用时钟漂移估计与Transformer 对齐层完成统一时序。</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: alignProgress + '%' }"></div>
        </div>
        <p v-if="alignProgress === 100">对齐完成，偏差 < 3ms。</p>
        <button class="primary-btn" @click="startAlign">重新对齐</button>
      </div>
    </div>

    <div v-if="fuseModal" class="modal-backdrop" @click.self="fuseModal = false">
      <div class="modal-content">
        <h3>预融合执行</h3>
        <p>将多模态数据编码为统一表示，预估输出差异。</p>
        <div class="form-grid">
          <label>融合策略</label>
          <select v-model="fuseForm.strategy">
            <option>早期融合</option>
            <option>特征级融合</option>
            <option>Transformer 自注意力融合</option>
          </select>
          <label>加权系数</label>
          <input v-model.number="fuseForm.weight" type="number" />
          <label>输出分片</label>
          <input v-model.number="fuseForm.shard" type="number" />
          <label>缓存时长(ms)</label>
          <input v-model.number="fuseForm.cache" type="number" />
        </div>
        <div class="btn-row">
          <button class="primary-btn" @click="runFuse">提交</button>
          <button class="secondary" @click="fuseModal = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tasks = ref([
  { id: 'T-101', source: '视频流', filter: '高斯平滑', completeness: 98, duration: 120, status: '完成' },
  { id: 'T-102', source: '点云', filter: '离群剔除', completeness: 96, duration: 240, status: '运行中' },
  { id: 'T-103', source: '雷达', filter: '卡尔曼滤波', completeness: 97, duration: 180, status: '运行中' },
  { id: 'T-104', source: '视频流', filter: '直方均衡', completeness: 95, duration: 130, status: '排队' },
  { id: 'T-105', source: '雷达', filter: '运动补偿', completeness: 94, duration: 170, status: '排队' },
  { id: 'T-106', source: '点云', filter: '曲面拟合', completeness: 93, duration: 210, status: '排队' },
  { id: 'T-107', source: '视频流', filter: '去雾', completeness: 92, duration: 195, status: '完成' },
  { id: 'T-108', source: '雷达', filter: '相位校准', completeness: 95, duration: 155, status: '完成' },
  { id: 'T-109', source: '点云', filter: '栅格重采样', completeness: 96, duration: 205, status: '运行中' },
  { id: 'T-110', source: '视频流', filter: '边缘增强', completeness: 91, duration: 160, status: '排队' },
  { id: 'T-111', source: '雷达', filter: '目标跟踪', completeness: 97, duration: 188, status: '完成' },
  { id: 'T-112', source: '点云', filter: '密度均衡', completeness: 95, duration: 200, status: '运行中' }
]);

const features = ref([
  { label: '空间位置', value: 140 },
  { label: '速度向量', value: 130 },
  { label: '车辆ID', value: 120 },
  { label: '特征金字塔', value: 150 },
  { label: '时间戳', value: 135 }
]);

const cleanModal = ref(false);
const alignModal = ref(false);
const fuseModal = ref(false);
const alignProgress = ref(80);
const cleanForm = reactive({ source: '视频流', threshold: 2, interpolate: '线性插值', batch: 32 });
const fuseForm = reactive({ strategy: 'Transformer 自注意力融合', weight: 0.8, shard: 4, cache: 500 });
let alignTimer;

const openCleanModal = () => {
  cleanModal.value = true;
};

const openAlignModal = () => {
  alignModal.value = true;
  startAlign();
};

const openFuseModal = () => {
  fuseModal.value = true;
};

const triggerClean = () => {
  tasks.value.unshift({
    id: `T-${Math.floor(Math.random() * 1000)}`,
    source: cleanForm.source,
    filter: `${cleanForm.interpolate} / 阈值${cleanForm.threshold}`,
    completeness: 99,
    duration: 210,
    status: '运行中'
  });
  cleanModal.value = false;
};

const startAlign = () => {
  alignProgress.value = 0;
  alignTimer = setInterval(() => {
    if (alignProgress.value >= 100) {
      clearInterval(alignTimer);
    } else {
      alignProgress.value += 25;
    }
  }, 260);
};

const runFuse = () => {
  tasks.value.push({
    id: `F-${tasks.value.length + 201}`,
    source: '融合输出',
    filter: `${fuseForm.strategy} / 权重${fuseForm.weight}`,
    completeness: 98,
    duration: 230,
    status: '排队'
  });
  fuseModal.value = false;
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
