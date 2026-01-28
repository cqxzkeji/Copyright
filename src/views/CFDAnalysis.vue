<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>流体动力学仿真（CFD）</h2>
        <p>空气动力学与散热性能分析。</p>
      </div>
      <div class="actions">
        <button class="outline" type="button" @click="showCaseModal = true">创建风洞工况</button>
        <button class="outline" type="button" @click="showMeshModal = true">网格参数设置</button>
        <button class="primary" type="button" @click="startSimulation">启动流场求解</button>
        <button class="outline" type="button" @click="showReportModal = true">导出气动报告</button>
        <button class="ghost" type="button" @click="showTipModal = true">提示信息</button>
      </div>
    </div>

    <div class="module-body">
      <div class="left-panel">
        <img :src="caeVisual" alt="流体分析示意图" />
        <div class="card">
          <h3>流场设置</h3>
          <ul>
            <li>来流速度：120 km/h</li>
            <li>湍流模型：k-omega SST</li>
            <li>边界层层数：8</li>
            <li>散热器区域：启用</li>
          </ul>
        </div>
        <div class="card">
          <h3>求解进度</h3>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
          <p class="progress-text">迭代完成 {{ progress }}%</p>
        </div>
      </div>

      <div class="right-panel">
        <div class="metrics">
          <div class="metric">
            <span>空气阻力系数</span>
            <strong>0.28</strong>
          </div>
          <div class="metric">
            <span>升力系数</span>
            <strong>-0.05</strong>
          </div>
          <div class="metric">
            <span>进气流量</span>
            <strong>1.8 kg/s</strong>
          </div>
          <div class="metric">
            <span>散热效率</span>
            <strong>93%</strong>
          </div>
        </div>

        <div class="table-card">
          <h3>流场监测点数据</h3>
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>位置</th>
                <th>速度</th>
                <th>压力</th>
                <th>温度</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.position }}</td>
                <td>{{ row.speed }}</td>
                <td>{{ row.pressure }}</td>
                <td>{{ row.temp }}</td>
                <td><span :class="['status', row.statusClass]">{{ row.status }}</span></td>
                <td>
                  <button class="link" type="button" @click="openDetail(row)">查看</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <BaseModal v-if="showCaseModal" title="创建风洞工况" @close="showCaseModal = false">
      <form class="modal-form">
        <label>
          工况名称
          <input type="text" placeholder="高速直行" />
        </label>
        <label>
          来流速度
          <input type="text" placeholder="120 km/h" />
        </label>
        <label>
          环境温度
          <input type="text" placeholder="25 ℃" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showCaseModal = false">取消</button>
        <button class="primary" type="button" @click="showCaseModal = false">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showMeshModal" title="网格参数设置" @close="showMeshModal = false">
      <form class="modal-form">
        <label>
          网格类型
          <select>
            <option>混合网格</option>
            <option>结构化网格</option>
            <option>非结构化网格</option>
          </select>
        </label>
        <label>
          最小尺寸
          <input type="text" value="1.5 mm" />
        </label>
        <label>
          边界层厚度
          <input type="text" value="8 mm" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showMeshModal = false">取消</button>
        <button class="primary" type="button" @click="showMeshModal = false">应用</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showReportModal" title="导出气动报告" @close="showReportModal = false">
      <form class="modal-form">
        <label>
          报告内容
          <select>
            <option>气动力 + 散热</option>
            <option>仅气动力</option>
          </select>
        </label>
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>HTML</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showReportModal = false">取消</button>
        <button class="primary" type="button" @click="showReportModal = false">生成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showTipModal" title="提示信息" @close="showTipModal = false">
      <p>建议在 A 柱区域增加监测点，以捕捉涡流脱落特征。</p>
      <template #footer>
        <button class="primary" type="button" @click="showTipModal = false">知道了</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showProgressModal" title="流场求解进度" @close="closeProgress">
      <p>流体求解正在进行中。</p>
      <div class="progress-track large">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="progress-text">已完成 {{ progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeProgress">后台运行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detailModal" title="监测点详情" @close="detailModal = null">
      <p>位置：{{ detailModal?.position }}</p>
      <p>速度：{{ detailModal?.speed }}</p>
      <p>压力：{{ detailModal?.pressure }}</p>
      <p>温度：{{ detailModal?.temp }}</p>
      <template #footer>
        <button class="primary" type="button" @click="detailModal = null">关闭</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import caeVisual from '../assets/cae-visual.svg';

const showCaseModal = ref(false);
const showMeshModal = ref(false);
const showReportModal = ref(false);
const showTipModal = ref(false);
const showProgressModal = ref(false);
const detailModal = ref(null);

const progress = ref(42);
let timer;

const tableRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    position: `监测点-${id}`,
    speed: `${30 + id} m/s`,
    pressure: `${95 + id * 0.4} kPa`,
    temp: `${22 + id * 0.3} ℃`,
    status: id % 5 === 0 ? '偏差' : '稳定',
    statusClass: id % 5 === 0 ? 'warn' : 'ok'
  };
});

const startSimulation = () => {
  showProgressModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  progress.value = 0;
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 10, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 500);
};

const closeProgress = () => {
  showProgressModal.value = false;
};

const openDetail = (row) => {
  detailModal.value = row;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.module-header p {
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.actions button {
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
}

.ghost {
  background: #f1f5f9;
  border: none;
}

.module-body {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 24px;
}

@media (max-width: 960px) {
  .module-body {
    grid-template-columns: 1fr;
  }
}

.left-panel {
  display: grid;
  gap: 16px;
}

.left-panel img {
  width: 100%;
  border-radius: 18px;
}

.card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.card ul {
  margin-top: 8px;
  padding-left: 18px;
  color: #475569;
  display: grid;
  gap: 6px;
}

.progress-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-track.large {
  height: 14px;
  margin: 16px 0 8px;
}

.progress-bar {
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  height: 100%;
  border-radius: inherit;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.metric {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  display: grid;
  gap: 6px;
}

.metric span {
  color: #64748b;
  font-size: 12px;
}

.table-card {
  margin-top: 16px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  overflow-x: auto;
}

.table-card h3 {
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.ok {
  background: #dcfce7;
  color: #15803d;
}

.status.warn {
  background: #fef3c7;
  color: #b45309;
}

.link {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
}
</style>
