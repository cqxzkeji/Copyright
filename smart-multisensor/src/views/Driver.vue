<template>
  <div class="page">
    <div class="card-grid">
      <div class="card">
        <div class="card-header">
          <h3>驱动导入</h3>
          <button class="primary" @click="openModal('import')">上传驱动</button>
        </div>
        <p class="muted">支持雷达、摄像头、惯导设备驱动包一键导入。</p>
        <ul class="stats">
          <li><span>当前版本</span><strong>v2.4.1</strong></li>
          <li><span>更新频率</span><strong>每周</strong></li>
          <li><span>驱动包</span><strong>12</strong></li>
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>自动加载</h3>
          <button class="primary" @click="openModal('autoload')">启用策略</button>
        </div>
        <p class="muted">开机自动加载高优先级驱动并完成依赖校验。</p>
        <div class="progress">
          <div class="bar" :style="{ width: autoLoadProgress + '%' }"></div>
        </div>
        <div class="progress-info">
          <span>依赖校验进度</span>
          <strong>{{ autoLoadProgress }}%</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>驱动扫描</h3>
          <button class="primary" @click="openModal('scan')">扫描设备</button>
        </div>
        <p class="muted">扫描现场设备并匹配对应驱动。</p>
        <div class="scan-list">
          <div class="scan-item">
            <span>雷达控制器</span>
            <strong>已匹配</strong>
          </div>
          <div class="scan-item">
            <span>工业相机</span>
            <strong>待匹配</strong>
          </div>
          <div class="scan-item">
            <span>惯导模块</span>
            <strong>已匹配</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>驱动列表</h3>
        <div class="card-actions">
          <button class="ghost" @click="openModal('filter')">筛选驱动</button>
          <button class="primary" @click="openModal('update')">批量更新</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>驱动名称</th>
              <th>类型</th>
              <th>版本</th>
              <th>状态</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="driver in drivers" :key="driver.name">
              <td>{{ driver.name }}</td>
              <td>{{ driver.type }}</td>
              <td>{{ driver.version }}</td>
              <td>{{ driver.status }}</td>
              <td>{{ driver.updated }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <template v-if="activeModal === 'import'">
          <h3>上传驱动包</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>驱动包名称</span>
              <input v-model="form.name" type="text" placeholder="例如：radar-core" />
            </label>
            <label>
              <span>版本号</span>
              <input v-model="form.version" type="text" placeholder="v2.4.1" />
            </label>
            <label>
              <span>部署范围</span>
              <select v-model="form.scope">
                <option>全部设备</option>
                <option>雷达设备</option>
                <option>摄像头设备</option>
              </select>
            </label>
            <div class="modal-actions">
              <button class="ghost" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">开始上传</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'scan'">
          <h3>扫描进度</h3>
          <p class="muted">正在检测现场设备与驱动适配情况。</p>
          <div class="progress">
            <div class="bar" :style="{ width: scanProgress + '%' }"></div>
          </div>
          <div class="modal-actions">
            <button class="primary" @click="finishScan">完成扫描</button>
          </div>
        </template>

        <template v-else>
          <h3>提示信息</h3>
          <p class="muted">{{ modalMessage }}</p>
          <div class="modal-actions">
            <button class="primary" @click="closeModal">知道了</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const drivers = [
  { name: "Radar-Core", type: "雷达", version: "v2.4.1", status: "运行中", updated: "2024-09-12" },
  { name: "Camera-Pro", type: "摄像头", version: "v1.8.6", status: "运行中", updated: "2024-09-10" },
  { name: "Fusion-Link", type: "融合", version: "v3.0.2", status: "待更新", updated: "2024-09-08" },
  { name: "Radar-AUX", type: "雷达", version: "v2.3.9", status: "运行中", updated: "2024-08-30" },
  { name: "Vision-Edge", type: "摄像头", version: "v1.7.4", status: "维护中", updated: "2024-08-29" },
  { name: "IMU-Link", type: "惯导", version: "v1.2.0", status: "运行中", updated: "2024-08-20" },
  { name: "Thermal-Sense", type: "热成像", version: "v2.1.3", status: "运行中", updated: "2024-08-12" },
  { name: "Lidar-Assist", type: "雷达", version: "v1.9.1", status: "待更新", updated: "2024-08-05" },
  { name: "Logger-Agent", type: "系统", version: "v3.5.0", status: "运行中", updated: "2024-07-30" },
  { name: "Sync-Bridge", type: "同步", version: "v2.0.8", status: "运行中", updated: "2024-07-18" }
];

const activeModal = ref("");
const autoLoadProgress = ref(72);
const scanProgress = ref(55);
const form = reactive({
  name: "",
  version: "v2.4.1",
  scope: "全部设备"
});

const modalMessage = computed(() => {
  const messages = {
    autoload: "已启用自动加载策略，开机将加载优先级最高驱动。",
    filter: "筛选条件已应用，显示状态为运行中的驱动。",
    update: "批量更新任务已排队，将在 30 分钟内完成。"
  };
  return messages[activeModal.value] || "操作已执行。";
});

const openModal = (key) => {
  activeModal.value = key;
};

const closeModal = () => {
  activeModal.value = "";
};

const submitModal = () => {
  activeModal.value = "";
};

const finishScan = () => {
  scanProgress.value = 100;
  activeModal.value = "";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eff6ff;
  border: none;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
}

.muted {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.stats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.stats li {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #475569;
}

.stats strong {
  color: #1e3a8a;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  height: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.scan-list {
  display: grid;
  gap: 10px;
}

.scan-item {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 13px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  color: #475569;
  font-weight: 600;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  z-index: 30;
}

.modal {
  width: min(420px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: grid;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
