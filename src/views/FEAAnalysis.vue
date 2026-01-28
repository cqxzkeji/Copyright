<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>有限元分析（FEA）</h2>
        <p>结构强度、刚度、疲劳与碰撞工况分析。</p>
      </div>
      <div class="actions">
        <button class="outline" type="button" @click="showProjectModal = true">新建结构项目</button>
        <button class="outline" type="button" @click="showImportModal = true">导入网格模型</button>
        <button class="primary" type="button" @click="startSimulation">运行求解</button>
        <button class="outline" type="button" @click="showReportModal = true">导出报告</button>
        <button class="ghost" type="button" @click="showTipModal = true">提示信息</button>
      </div>
    </div>

    <div class="module-body">
      <div class="left-panel">
        <img :src="caeVisual" alt="有限元分析图" />
        <div class="card">
          <h3>模型概览</h3>
          <ul>
            <li>单元数量：1,245,000</li>
            <li>材料库：高强钢 / 铝合金</li>
            <li>载荷工况：6 组</li>
            <li>边界条件：固定 + 扭转载荷</li>
          </ul>
        </div>
        <div class="card">
          <h3>求解进度</h3>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
          <p class="progress-text">当前求解完成 {{ progress }}%</p>
        </div>
      </div>

      <div class="right-panel">
        <div class="metrics">
          <div class="metric">
            <span>最大位移</span>
            <strong>2.35 mm</strong>
          </div>
          <div class="metric">
            <span>最大应力</span>
            <strong>382 MPa</strong>
          </div>
          <div class="metric">
            <span>疲劳寿命</span>
            <strong>1.2e6 次</strong>
          </div>
          <div class="metric">
            <span>安全系数</span>
            <strong>1.48</strong>
          </div>
        </div>

        <div class="table-card">
          <h3>结构分析结果清单</h3>
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>部件</th>
                <th>工况</th>
                <th>最大应力</th>
                <th>位移</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.part }}</td>
                <td>{{ row.case }}</td>
                <td>{{ row.stress }}</td>
                <td>{{ row.displacement }}</td>
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

    <BaseModal v-if="showProjectModal" title="新建结构项目" @close="showProjectModal = false">
      <form class="modal-form">
        <label>
          项目名称
          <input v-model="projectForm.name" type="text" placeholder="前纵梁结构强度" />
        </label>
        <label>
          工况类型
          <select v-model="projectForm.case">
            <option>静力</option>
            <option>疲劳</option>
            <option>碰撞</option>
          </select>
        </label>
        <label>
          备注
          <textarea v-model="projectForm.note" rows="3" placeholder="输入项目说明"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showProjectModal = false">取消</button>
        <button class="primary" type="button" @click="showProjectModal = false">创建</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showImportModal" title="导入网格模型" @close="showImportModal = false">
      <p>支持导入 .nas / .inp / .bdf 网格文件。</p>
      <form class="modal-form">
        <label>
          文件路径
          <input type="text" placeholder="/data/models/frame.bdf" />
        </label>
        <label>
          预处理选项
          <select>
            <option>自动清理网格</option>
            <option>保持原始网格</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showImportModal = false">取消</button>
        <button class="primary" type="button" @click="showImportModal = false">开始导入</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showReportModal" title="导出分析报告" @close="showReportModal = false">
      <form class="modal-form">
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>DOCX</option>
            <option>PPT</option>
          </select>
        </label>
        <label>
          是否包含详细图表
          <select>
            <option>包含</option>
            <option>仅摘要</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showReportModal = false">取消</button>
        <button class="primary" type="button" @click="showReportModal = false">生成报告</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showTipModal" title="提示信息" @close="showTipModal = false">
      <p>当前模型网格质量评分为 93 分，建议在高应力区域加密网格以提升精度。</p>
      <template #footer>
        <button class="primary" type="button" @click="showTipModal = false">知道了</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showProgressModal" title="求解进度" @close="closeProgress">
      <p>有限元求解正在进行中，请勿关闭页面。</p>
      <div class="progress-track large">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="progress-text">已完成 {{ progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeProgress">后台运行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detailModal" title="结果详情" @close="detailModal = null">
      <p>部件：{{ detailModal?.part }}</p>
      <p>工况：{{ detailModal?.case }}</p>
      <p>最大应力：{{ detailModal?.stress }}</p>
      <p>位移：{{ detailModal?.displacement }}</p>
      <p>备注：建议关注连接区域。</p>
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

const showProjectModal = ref(false);
const showImportModal = ref(false);
const showReportModal = ref(false);
const showTipModal = ref(false);
const showProgressModal = ref(false);
const detailModal = ref(null);

const projectForm = ref({
  name: '',
  case: '静力',
  note: ''
});

const progress = ref(68);
let timer;

const tableRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    part: `车身结构-${id}`,
    case: id % 2 === 0 ? '碰撞' : '静力',
    stress: `${320 + id * 2} MPa`,
    displacement: `${1.6 + id * 0.02} mm`,
    status: id % 3 === 0 ? '需优化' : '通过',
    statusClass: id % 3 === 0 ? 'warn' : 'ok'
  };
});

const startSimulation = () => {
  showProgressModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  progress.value = 0;
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 12, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 600);
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
