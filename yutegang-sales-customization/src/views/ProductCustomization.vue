<template>
  <div class="module-page">
    <section class="module-header">
      <div>
        <h3>产品配置与定制</h3>
        <p>制定规格、性能与工艺参数，生成定制化生产计划。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm">创建配置</button>
        <button class="ghost" @click="openProgress">计划生成进度</button>
        <button class="ghost" @click="openTips">参数提示</button>
      </div>
    </section>

    <section class="card-grid">
      <ChartPanel
        title="性能指标达成"
        subtitle="硬度、韧性与耐磨性"
        :labels="['硬度', '韧性', '耐磨']"
        :values="[82, 70, 64]"
      />
      <ChartPanel
        title="产线适配度"
        subtitle="可执行产线匹配率"
        :labels="['A线', 'B线', 'C线', 'D线']"
        :values="[66, 54, 42, 36]"
      />
      <div class="summary-card">
        <h4>当前定制热点</h4>
        <ul>
          <li>高强耐磨钢棒需求增长 18%。</li>
          <li>低温韧性指标提升需求集中。</li>
          <li>客户偏好快速试样反馈。</li>
        </ul>
      </div>
    </section>

    <DataTable :headers="headers" :rows="rows" />

    <BaseModal
      :show="formModal"
      title="产品配置方案"
      width="640px"
      @close="formModal = false"
    >
      <form class="modal-form">
        <label>
          钢种型号
          <input v-model="form.grade" placeholder="如：42CrMo、20MnSi" />
        </label>
        <label>
          规格尺寸
          <input v-model="form.size" placeholder="如：Φ90 × 6m" />
        </label>
        <label>
          性能目标
          <input v-model="form.performance" placeholder="硬度、韧性等指标" />
        </label>
        <label>
          工艺路线
          <input v-model="form.process" placeholder="冶炼 + 热处理方案" />
        </label>
        <label>
          交付批次
          <input v-model="form.batch" placeholder="批次数量/频次" />
        </label>
      </form>
      <template #footer>
        <button class="secondary" @click="formModal = false">取消</button>
        <button class="primary" @click="saveForm">生成方案</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="progressModal"
      title="定制计划生成"
      width="560px"
      @close="progressModal = false"
    >
      <div class="progress-card">
        <p>系统正在校验工艺参数并生成生产计划。</p>
        <div class="progress">
          <div class="bar" />
        </div>
        <ul>
          <li>物料匹配完成</li>
          <li>工艺验证进行中</li>
          <li>产线排程待确认</li>
        </ul>
      </div>
    </BaseModal>

    <BaseModal
      :show="tipsModal"
      title="参数建议"
      width="520px"
      @close="tipsModal = false"
    >
      <ul class="tips">
        <li>建议硬度目标范围：285-320 HB。</li>
        <li>热处理需预留 12 小时稳定期。</li>
        <li>关键尺寸公差控制在 ±0.05mm。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import DataTable from "../components/DataTable.vue";
import ChartPanel from "../components/ChartPanel.vue";

const headers = [
  "配置编号",
  "钢种型号",
  "规格尺寸",
  "性能目标",
  "工艺路线",
  "产线",
  "状态",
];

const rows = [
  ["PC-001", "42CrMo", "Φ90×6m", "高强", "调质", "A线", "验证中"],
  ["PC-002", "20MnSi", "Φ80×5m", "韧性", "正火", "B线", "已确认"],
  ["PC-003", "35CrMo", "Φ120×6m", "耐磨", "调质", "C线", "待审核"],
  ["PC-004", "40Cr", "Φ60×4m", "高强", "调质", "A线", "已确认"],
  ["PC-005", "15CrMo", "Φ150×8m", "耐热", "回火", "D线", "验证中"],
  ["PC-006", "20CrNiMo", "Φ110×6m", "韧性", "调质", "B线", "待审核"],
  ["PC-007", "34CrNi3Mo", "Φ95×5m", "高强", "调质", "A线", "已确认"],
  ["PC-008", "30CrMnSi", "Φ88×6m", "韧性", "正火", "C线", "验证中"],
  ["PC-009", "12Cr1MoV", "Φ130×7m", "耐热", "回火", "D线", "待审核"],
  ["PC-010", "25Cr2Mo", "Φ140×7m", "耐磨", "调质", "A线", "已确认"],
  ["PC-011", "30CrMo", "Φ75×5m", "高强", "调质", "B线", "已确认"],
  ["PC-012", "42CrMo", "Φ105×6m", "耐磨", "调质", "C线", "验证中"],
  ["PC-013", "20CrMo", "Φ98×6m", "韧性", "正火", "A线", "待审核"],
  ["PC-014", "15CrMoG", "Φ175×8m", "耐热", "回火", "D线", "验证中"],
  ["PC-015", "40CrNiMo", "Φ130×6m", "高强", "调质", "B线", "待审核"],
  ["PC-016", "35CrMo", "Φ115×6m", "耐磨", "调质", "C线", "已确认"],
  ["PC-017", "20MnSi", "Φ90×5m", "韧性", "正火", "A线", "验证中"],
  ["PC-018", "42CrMo", "Φ70×4m", "高强", "调质", "B线", "已确认"],
  ["PC-019", "30CrMnSi", "Φ82×5m", "韧性", "正火", "C线", "待审核"],
  ["PC-020", "35CrMo", "Φ100×6m", "耐磨", "调质", "A线", "已确认"],
  ["PC-021", "20CrNiMo", "Φ125×7m", "韧性", "调质", "B线", "验证中"],
  ["PC-022", "40Cr", "Φ68×4m", "高强", "调质", "A线", "已确认"],
];

const formModal = ref(false);
const progressModal = ref(false);
const tipsModal = ref(false);
const form = reactive({
  grade: "",
  size: "",
  performance: "",
  process: "",
  batch: "",
});

const openForm = () => {
  formModal.value = true;
};

const openProgress = () => {
  progressModal.value = true;
};

const openTips = () => {
  tipsModal.value = true;
};

const saveForm = () => {
  formModal.value = false;
};
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.08);
}

.module-header h3 {
  margin: 0 0 6px;
}

.module-header p {
  margin: 0;
  color: #6b79a6;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ghost,
.primary,
.secondary {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eef2ff;
  color: #3c4c7b;
}

.primary {
  background: #3b6af7;
  color: #ffffff;
}

.secondary {
  background: #eef2ff;
  color: #3c4c7b;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 10px 30px rgba(18, 38, 63, 0.08);
}

.summary-card ul {
  margin: 8px 0 0;
  padding-left: 18px;
  color: #5a6798;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form input {
  border: 1px solid #e1e8ff;
  border-radius: 10px;
  padding: 10px 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #4b5d8f;
}

.progress-card ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #5a6798;
}

.progress {
  width: 100%;
  height: 10px;
  background: #eef2ff;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  width: 68%;
  background: linear-gradient(90deg, #6fa0ff, #9cc1ff);
}

.tips {
  padding-left: 18px;
  color: #4b5d8f;
  display: grid;
  gap: 8px;
}
</style>
