<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>声学与振动分析</h2>
        <p>整车 NVH 仿真与舒适性优化。</p>
      </div>
      <div class="actions">
        <button class="outline" type="button" @click="showCaseModal = true">创建NVH工况</button>
        <button class="outline" type="button" @click="showSensorModal = true">传感器布置</button>
        <button class="primary" type="button" @click="startSimulation">开始声学求解</button>
        <button class="outline" type="button" @click="showReportModal = true">导出NVH报告</button>
        <button class="ghost" type="button" @click="showTipModal = true">提示信息</button>
      </div>
    </div>

    <div class="module-body">
      <div class="left-panel">
        <img :src="caeVisual" alt="声学振动示意图" />
        <div class="card">
          <h3>NVH配置</h3>
          <ul>
            <li>频率范围：20-2000 Hz</li>
            <li>激励类型：路噪 + 电机噪</li>
            <li>测点数量：48</li>
            <li>隔音材料：吸声棉增强</li>
          </ul>
        </div>
        <div class="card">
          <h3>求解进度</h3>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
          <p class="progress-text">已完成 {{ progress }}%</p>
        </div>
      </div>

      <div class="right-panel">
        <div class="metrics">
          <div class="metric">
            <span>峰值声压级</span>
            <strong>68 dB</strong>
          </div>
          <div class="metric">
            <span>车内振动 RMS</span>
            <strong>0.12 g</strong>
          </div>
          <div class="metric">
            <span>隔音提升</span>
            <strong>+4.2 dB</strong>
          </div>
          <div class="metric">
            <span>共振频率</span>
            <strong>230 Hz</strong>
          </div>
        </div>

        <div class="table-card">
          <h3>声学测点数据</h3>
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>测点</th>
                <th>频率</th>
                <th>声压级</th>
                <th>振动</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.point }}</td>
                <td>{{ row.freq }}</td>
                <td>{{ row.spl }}</td>
                <td>{{ row.vib }}</td>
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

    <BaseModal v-if="showCaseModal" title="创建NVH工况" @close="showCaseModal = false">
      <form class="modal-form">
        <label>
          工况名称
          <input type="text" placeholder="高速巡航" />
        </label>
        <label>
          频率范围
          <input type="text" placeholder="20-1500 Hz" />
        </label>
        <label>
          激励类型
          <select>
            <option>路噪</option>
            <option>电机噪声</option>
            <option>风噪</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showCaseModal = false">取消</button>
        <button class="primary" type="button" @click="showCaseModal = false">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showSensorModal" title="传感器布置" @close="showSensorModal = false">
      <form class="modal-form">
        <label>
          车内测点数量
          <input type="text" value="24" />
        </label>
        <label>
          车外测点数量
          <input type="text" value="12" />
        </label>
        <label>
          校准方式
          <select>
            <option>自动校准</option>
            <option>手动校准</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showSensorModal = false">取消</button>
        <button class="primary" type="button" @click="showSensorModal = false">应用</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showReportModal" title="导出NVH报告" @close="showReportModal = false">
      <form class="modal-form">
        <label>
          报告包含
          <select>
            <option>频谱 + 时域响应</option>
            <option>仅频谱</option>
          </select>
        </label>
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>PPT</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showReportModal = false">取消</button>
        <button class="primary" type="button" @click="showReportModal = false">生成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showTipModal" title="提示信息" @close="showTipModal = false">
      <p>建议在 250-300 Hz 区间增加阻尼片，可显著降低峰值噪声。</p>
      <template #footer>
        <button class="primary" type="button" @click="showTipModal = false">知道了</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showProgressModal" title="声学求解进度" @close="closeProgress">
      <p>声学求解正在执行中。</p>
      <div class="progress-track large">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="progress-text">已完成 {{ progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeProgress">后台运行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detailModal" title="测点详情" @close="detailModal = null">
      <p>测点：{{ detailModal?.point }}</p>
      <p>频率：{{ detailModal?.freq }}</p>
      <p>声压级：{{ detailModal?.spl }}</p>
      <p>振动：{{ detailModal?.vib }}</p>
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
const showSensorModal = ref(false);
const showReportModal = ref(false);
const showTipModal = ref(false);
const showProgressModal = ref(false);
const detailModal = ref(null);

const progress = ref(58);
let timer;

const tableRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    point: `测点-${id}`,
    freq: `${80 + id * 5} Hz`,
    spl: `${55 + id * 0.6} dB`,
    vib: `${0.05 + id * 0.002} g`,
    status: id % 6 === 0 ? '超标' : '稳定',
    statusClass: id % 6 === 0 ? 'warn' : 'ok'
  };
});

const startSimulation = () => {
  showProgressModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  progress.value = 0;
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 11, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 520);
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
