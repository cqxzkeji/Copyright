<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>热分析</h2>
        <p>发动机、排气系统等部件温度分布与热管理评估。</p>
      </div>
      <div class="actions">
        <button class="outline" type="button" @click="showCaseModal = true">新建热工况</button>
        <button class="outline" type="button" @click="showBoundaryModal = true">边界条件设置</button>
        <button class="primary" type="button" @click="startSimulation">启动热求解</button>
        <button class="outline" type="button" @click="showReportModal = true">导出热报告</button>
        <button class="ghost" type="button" @click="showTipModal = true">提示信息</button>
      </div>
    </div>

    <div class="module-body">
      <div class="left-panel">
        <img :src="caeVisual" alt="热分析示意图" />
        <div class="card">
          <h3>热管理配置</h3>
          <ul>
            <li>冷却液流量：28 L/min</li>
            <li>散热器效率：91%</li>
            <li>环境温度：40 ℃</li>
            <li>热源数量：12</li>
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
            <span>最高温度</span>
            <strong>128 ℃</strong>
          </div>
          <div class="metric">
            <span>平均温度</span>
            <strong>86 ℃</strong>
          </div>
          <div class="metric">
            <span>散热裕度</span>
            <strong>15 ℃</strong>
          </div>
          <div class="metric">
            <span>热阻系数</span>
            <strong>0.38</strong>
          </div>
        </div>

        <div class="table-card">
          <h3>温度监测点列表</h3>
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>部件</th>
                <th>位置</th>
                <th>温度</th>
                <th>热流密度</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.part }}</td>
                <td>{{ row.position }}</td>
                <td>{{ row.temp }}</td>
                <td>{{ row.flow }}</td>
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

    <BaseModal v-if="showCaseModal" title="新建热工况" @close="showCaseModal = false">
      <form class="modal-form">
        <label>
          工况名称
          <input type="text" placeholder="高温爬坡" />
        </label>
        <label>
          外界温度
          <input type="text" placeholder="45 ℃" />
        </label>
        <label>
          目标运行时间
          <input type="text" placeholder="30 min" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showCaseModal = false">取消</button>
        <button class="primary" type="button" @click="showCaseModal = false">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showBoundaryModal" title="边界条件设置" @close="showBoundaryModal = false">
      <form class="modal-form">
        <label>
          热源功率
          <input type="text" value="18 kW" />
        </label>
        <label>
          对流系数
          <input type="text" value="35 W/m²K" />
        </label>
        <label>
          风扇模式
          <select>
            <option>自动调速</option>
            <option>固定高速</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showBoundaryModal = false">取消</button>
        <button class="primary" type="button" @click="showBoundaryModal = false">应用</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showReportModal" title="导出热分析报告" @close="showReportModal = false">
      <form class="modal-form">
        <label>
          报告内容
          <select>
            <option>温度分布 + 热流</option>
            <option>仅温度分布</option>
          </select>
        </label>
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>XLSX</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showReportModal = false">取消</button>
        <button class="primary" type="button" @click="showReportModal = false">生成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showTipModal" title="提示信息" @close="showTipModal = false">
      <p>排气歧管区域温度梯度较大，建议增加隔热层。</p>
      <template #footer>
        <button class="primary" type="button" @click="showTipModal = false">知道了</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showProgressModal" title="热求解进度" @close="closeProgress">
      <p>热仿真求解正在进行中。</p>
      <div class="progress-track large">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="progress-text">已完成 {{ progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeProgress">后台运行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detailModal" title="监测点详情" @close="detailModal = null">
      <p>部件：{{ detailModal?.part }}</p>
      <p>位置：{{ detailModal?.position }}</p>
      <p>温度：{{ detailModal?.temp }}</p>
      <p>热流密度：{{ detailModal?.flow }}</p>
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
const showBoundaryModal = ref(false);
const showReportModal = ref(false);
const showTipModal = ref(false);
const showProgressModal = ref(false);
const detailModal = ref(null);

const progress = ref(36);
let timer;

const tableRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    part: `动力电池-${id}`,
    position: `区域-${id}`,
    temp: `${70 + id} ℃`,
    flow: `${120 + id * 3} W/m²`,
    status: id % 4 === 0 ? '偏热' : '稳定',
    statusClass: id % 4 === 0 ? 'warn' : 'ok'
  };
});

const startSimulation = () => {
  showProgressModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  progress.value = 0;
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 14, 100);
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
