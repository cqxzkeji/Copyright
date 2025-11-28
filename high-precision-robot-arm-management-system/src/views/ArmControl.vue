<template>
  <div class="grid cols-2">
    <div class="card">
      <h3>控制与姿态</h3>
      <p class="muted">通过虚拟控制器调整姿态和运动窗口。</p>
      <div class="grid cols-2">
        <label class="form-group">
          <span>运动模式</span>
          <select v-model="controls.mode">
            <option value="joint">关节空间</option>
            <option value="cartesian">笛卡尔</option>
            <option value="hybrid">混合</option>
          </select>
        </label>
        <label class="form-group">
          <span>速度 (%)</span>
          <input type="number" v-model.number="controls.speed" min="10" max="120" />
        </label>
        <label class="form-group">
          <span>末端力矩阈值 (Nm)</span>
          <input type="number" v-model.number="controls.torque" min="20" max="120" />
        </label>
        <label class="form-group">
          <span>安全区</span>
          <select v-model="controls.zone">
            <option value="A">柔性 A 区</option>
            <option value="B">高速 B 区</option>
            <option value="C">维护 C 区</option>
          </select>
        </label>
      </div>
      <div class="actions">
        <button class="btn" @click="applyControl">应用控制</button>
        <button class="btn secondary" @click="openCalibration">零点标定</button>
      </div>
    </div>
    <div class="card">
      <h3>执行器状态</h3>
      <p class="muted">实时刷新六关节负载与伺服温度。</p>
      <div class="grid cols-3">
        <div v-for="joint in joints" :key="joint.name" class="status-card">
          <p class="muted small">{{ joint.name }}</p>
          <strong>{{ joint.load }}%</strong>
          <span class="muted small">温度 {{ joint.temp }}℃</span>
        </div>
      </div>
      <button class="btn" @click="showLoadModal = true">刷新状态</button>
    </div>
  </div>

  <div v-if="showControlModal" class="modal-backdrop" @click.self="showControlModal = false">
    <div class="modal-panel">
      <h3>控制方案已提交</h3>
      <p>模式：{{ controlResult.mode }} · 速度：{{ controlResult.speed }}% · 阈值：{{ controlResult.torque }}Nm</p>
      <div class="footer">
        <button class="btn secondary" @click="showControlModal = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showCalibration" class="modal-backdrop" @click.self="showCalibration = false">
    <div class="modal-panel">
      <h3>零点标定</h3>
      <p>确认参考姿态并选择标定目标。</p>
      <div class="grid">
        <label class="form-group">
          <span>标定轴</span>
          <select v-model="calibration.axis">
            <option v-for="axis in ['J1','J2','J3','J4','J5','J6']" :key="axis" :value="axis">
              {{ axis }}
            </option>
          </select>
        </label>
        <label class="form-group">
          <span>参考点</span>
          <input v-model="calibration.reference" placeholder="示例：光栅 12.5mm" />
        </label>
      </div>
      <div class="footer">
        <button class="btn" @click="startCalibration">开始标定</button>
      </div>
    </div>
  </div>

  <div v-if="showLoadModal" class="modal-backdrop" @click.self="showLoadModal = false">
    <div class="modal-panel">
      <h3>载荷刷新</h3>
      <p>刷新完成，最新负载/温度数据已写入状态表。</p>
      <div class="footer">
        <button class="btn secondary" @click="showLoadModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const controls = reactive({
  mode: 'joint',
  speed: 85,
  torque: 45,
  zone: 'A',
});

const joints = reactive([
  { name: 'J1', load: 26, temp: 48 },
  { name: 'J2', load: 38, temp: 46 },
  { name: 'J3', load: 33, temp: 44 },
  { name: 'J4', load: 29, temp: 42 },
  { name: 'J5', load: 24, temp: 41 },
  { name: 'J6', load: 32, temp: 45 },
]);

const showControlModal = ref(false);
const showCalibration = ref(false);
const showLoadModal = ref(false);
const controlResult = reactive({ mode: '', speed: 0, torque: 0 });
const calibration = reactive({ axis: 'J1', reference: '光栅 12.5mm' });

const applyControl = () => {
  Object.assign(controlResult, controls);
  showControlModal.value = true;
};

const openCalibration = () => {
  showCalibration.value = true;
};

const startCalibration = () => {
  showCalibration.value = false;
  showControlModal.value = false;
  setTimeout(() => {
    showLoadModal.value = true;
  }, 300);
};
</script>

<style scoped>
.status-card {
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}
</style>
