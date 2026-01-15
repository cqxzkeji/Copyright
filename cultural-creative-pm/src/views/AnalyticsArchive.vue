<template>
  <div class="module">
    <section class="card-grid">
      <div class="metric-card">
        <p>项目绩效</p>
        <h2>87%</h2>
        <span>ROI 1.6</span>
      </div>
      <div class="metric-card">
        <p>渠道效果</p>
        <h2>4.2 万</h2>
        <span>曝光提升 18%</span>
      </div>
      <div class="metric-card">
        <p>素材复用</p>
        <h2>52</h2>
        <span>推荐复用 11</span>
      </div>
      <div class="metric-card">
        <p>知识库</p>
        <h2>186</h2>
        <span>本月新增 14</span>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>数据分析与归档沉淀</h3>
          <p>ROI、渠道效果、素材复用与审计追溯</p>
        </div>
        <div class="button-group">
          <button class="primary" @click="openModal('report')">导出报表</button>
          <button class="outline" @click="openModal('roi')">绩效分析</button>
          <button class="outline" @click="openModal('reuse')">素材复用</button>
          <button class="outline" @click="openModal('audit')">审计追溯</button>
          <button class="ghost" @click="openModal('progress')">分析进度</button>
        </div>
      </div>
      <div class="chart-area">
        <div class="chart-card">
          <h4>渠道效果趋势</h4>
          <svg viewBox="0 0 320 160">
            <rect x="0" y="0" width="320" height="160" fill="#f5f7ff" rx="12" />
            <polyline
              points="20,120 70,90 120,110 170,70 220,80 270,50"
              fill="none"
              stroke="#4f46e5"
              stroke-width="4"
            />
            <circle cx="20" cy="120" r="4" fill="#22c1c3" />
            <circle cx="70" cy="90" r="4" fill="#22c1c3" />
            <circle cx="120" cy="110" r="4" fill="#22c1c3" />
            <circle cx="170" cy="70" r="4" fill="#22c1c3" />
            <circle cx="220" cy="80" r="4" fill="#22c1c3" />
            <circle cx="270" cy="50" r="4" fill="#22c1c3" />
          </svg>
        </div>
        <div class="chart-card">
          <h4>创意素材复用推荐</h4>
          <ul class="reuse-list">
            <li v-for="item in reuseList" :key="item.name">
              <strong>{{ item.name }}</strong>
              <span>{{ item.note }}</span>
            </li>
          </ul>
          <button class="ghost" @click="openModal('tips')">查看规则</button>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>项目绩效与归档清单</h3>
          <p>支持 PDF/Excel 导出与审计追溯</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>项目</th>
              <th>ROI</th>
              <th>渠道贡献</th>
              <th>归档状态</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in analytics" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.roi }}</td>
              <td>{{ item.channel }}</td>
              <td><span :class="['status', item.statusClass]">{{ item.status }}</span></td>
              <td>{{ item.updated }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" @close="closeModal" @confirm="closeModal">
    <template v-if="activeModal === 'report'">
      <label class="modal-label">
        报表格式
        <select v-model="form.reportType">
          <option>PDF</option>
          <option>Excel</option>
        </select>
      </label>
      <label class="modal-label">
        输出范围
        <select v-model="form.reportRange">
          <option>本月项目</option>
          <option>季度总结</option>
          <option>全年归档</option>
        </select>
      </label>
      <label class="modal-label">
        备注
        <textarea v-model="form.reportNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'roi'">
      <label class="modal-label">
        绩效周期
        <input v-model="form.roiCycle" placeholder="2024-Q2" />
      </label>
      <label class="modal-label">
        指标摘要
        <textarea v-model="form.roiNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'reuse'">
      <label class="modal-label">
        复用素材
        <input v-model="form.reuseAsset" placeholder="如：古纹样图案" />
      </label>
      <label class="modal-label">
        推荐原因
        <textarea v-model="form.reuseReason" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'audit'">
      <label class="modal-label">
        审计编号
        <input v-model="form.auditId" placeholder="填写编号" />
      </label>
      <label class="modal-label">
        追溯说明
        <textarea v-model="form.auditNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <div class="progress-block" v-for="item in progress" :key="item.label">
        <div class="progress-header">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}%</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: item.value + '%' }"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>复用规则：同主题项目优先、历史 ROI ≥ 1.2、版权状态清晰。</p>
      <p>系统自动生成推荐，并同步至知识库。</p>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalOpen = ref(false);
const activeModal = ref("report");

const form = ref({
  reportType: "PDF",
  reportRange: "季度总结",
  reportNote: "用于领导汇报",
  roiCycle: "2024-Q2",
  roiNote: "ROI 提升主要来自线下活动",
  reuseAsset: "博物馆纹样",
  reuseReason: "适配多渠道投放",
  auditId: "AD-2024-07",
  auditNote: "核对授权与合同" 
});

const reuseList = [
  { name: "非遗纹样素材包", note: "适合新品礼盒" },
  { name: "城市故事脚本", note: "可延展为短视频" },
  { name: "展陈动线模板", note: "用于线下活动复用" },
  { name: "品牌色彩规范", note: "保持视觉一致" }
];

const progress = [
  { label: "ROI 计算", value: 80 },
  { label: "渠道效果归因", value: 65 },
  { label: "知识库归档", value: 52 },
  { label: "审计追溯", value: 38 }
];

const analytics = Array.from({ length: 20 }, (_, index) => {
  const id = `AN-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    name: `项目绩效 ${index + 1}`,
    roi: (1.1 + index * 0.03).toFixed(2),
    channel: ["线下展览", "电商", "短视频"][index % 3],
    status: ["已归档", "待复核", "归档中"][index % 3],
    statusClass: ["success", "pending", "warn"][index % 3],
    updated: `2024-0${(index % 6) + 4}-1${index % 9}`
  };
});

const modalTitle = computed(() => {
  const map = {
    report: "报表导出",
    roi: "项目绩效与 ROI",
    reuse: "素材复用推荐",
    audit: "审计追溯",
    progress: "分析进度",
    tips: "复用规则"
  };
  return map[activeModal.value] || "提示";
});

const openModal = (type) => {
  activeModal.value = type;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 6px;
}

.metric-card h2 {
  margin: 0;
}

.metric-card p {
  margin: 0;
  color: #6b7280;
}

.metric-card span {
  font-size: 12px;
  color: #94a3b8;
}

.card {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.card-header h3 {
  margin: 0 0 6px;
}

.card-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary,
.outline,
.ghost {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
  color: #fff;
}

.outline {
  background: #fff;
  border: 1px solid #dbe2f0;
}

.ghost {
  background: #f3f4f6;
}

.chart-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.chart-card {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.reuse-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  font-size: 14px;
}

.reuse-list li {
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 4px;
}

.reuse-list span {
  color: #6b7280;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #f1f5ff;
  text-align: left;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #eef2f7;
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status.pending {
  background: #fff4e5;
  color: #b45309;
}

.status.success {
  background: #ecfdf3;
  color: #15803d;
}

.status.warn {
  background: #fee2e2;
  color: #b91c1c;
}

.modal-label {
  display: grid;
  gap: 6px;
}

.modal-label input,
.modal-label select,
.modal-label textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #dbe2f0;
}

.progress-block {
  display: grid;
  gap: 6px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.progress-bar {
  height: 10px;
  background: #e5e9f2;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(120deg, #4f46e5, #22c1c3);
}
</style>
