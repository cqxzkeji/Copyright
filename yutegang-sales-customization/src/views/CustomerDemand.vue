<template>
  <div class="module-page">
    <section class="module-header">
      <div>
        <h3>客户需求管理</h3>
        <p>收集、分析与匹配客户定制需求，形成可执行方案。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm">录入需求</button>
        <button class="ghost" @click="openProgress">需求匹配进度</button>
        <button class="ghost" @click="openTips">跟进提示</button>
      </div>
    </section>

    <section class="card-grid">
      <ChartPanel
        title="需求来源占比"
        subtitle="按行业渠道分布"
        :labels="['汽车', '能源', '轨交', '工程']"
        :values="[68, 52, 44, 38]"
      />
      <ChartPanel
        title="需求响应时效"
        subtitle="本周平均响应时长"
        :labels="['2h', '4h', '8h', '12h']"
        :values="[72, 56, 40, 28]"
      />
      <div class="summary-card">
        <h4>重点需求提醒</h4>
        <ul>
          <li>华北汽车客户急需耐磨钢方案。</li>
          <li>能源行业新增高温合金询价。</li>
          <li>轨交项目要求交期缩短 15%。</li>
        </ul>
      </div>
    </section>

    <DataTable :headers="headers" :rows="rows" />

    <BaseModal
      :show="formModal"
      title="客户需求录入"
      width="640px"
      @close="formModal = false"
    >
      <form class="modal-form">
        <label>
          客户名称
          <input v-model="form.customer" placeholder="输入客户名称" />
        </label>
        <label>
          需求规格
          <input v-model="form.spec" placeholder="如：Φ80mm / 42CrMo" />
        </label>
        <label>
          应用场景
          <input v-model="form.scene" placeholder="例如：汽车传动轴" />
        </label>
        <label>
          交期要求
          <input v-model="form.deadline" placeholder="例如：15 天内" />
        </label>
        <label>
          需求描述
          <textarea v-model="form.detail" rows="3" />
        </label>
      </form>
      <template #footer>
        <button class="secondary" @click="formModal = false">取消</button>
        <button class="primary" @click="saveForm">提交需求</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="progressModal"
      title="需求分析进度"
      width="560px"
      @close="progressModal = false"
    >
      <div class="progress-card">
        <p>正在为客户进行规格匹配与产能验证。</p>
        <div class="progress">
          <div class="bar" />
        </div>
        <ul>
          <li>需求分类已完成</li>
          <li>材料性能匹配进行中</li>
          <li>产能评估待审批</li>
        </ul>
      </div>
    </BaseModal>

    <BaseModal
      :show="tipsModal"
      title="跟进提示"
      width="520px"
      @close="tipsModal = false"
    >
      <ul class="tips">
        <li>高优先级需求需在 2 小时内回应。</li>
        <li>确认客户验收标准，避免返工风险。</li>
        <li>同步技术部门进行方案校核。</li>
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
  "需求编号",
  "客户名称",
  "规格/材质",
  "应用行业",
  "优先级",
  "状态",
  "提交时间",
];

const rows = [
  ["CD-001", "华北汽车集团", "Φ80 42CrMo", "汽车", "高", "分析中", "08-01"],
  ["CD-002", "宏通能源", "Φ120 15CrMo", "能源", "高", "待匹配", "08-01"],
  ["CD-003", "中车轨道", "Φ60 20MnSi", "轨交", "中", "已受理", "08-02"],
  ["CD-004", "海工装备", "Φ200 35CrMo", "海工", "高", "评估中", "08-02"],
  ["CD-005", "鑫源重工", "Φ150 40Cr", "工程", "中", "已受理", "08-02"],
  ["CD-006", "北方风电", "Φ90 42CrMo", "能源", "高", "匹配中", "08-03"],
  ["CD-007", "锦航船舶", "Φ180 20CrNiMo", "海工", "中", "已受理", "08-03"],
  ["CD-008", "鹏程矿机", "Φ110 35CrMo", "矿山", "中", "评估中", "08-03"],
  ["CD-009", "中达装备", "Φ65 20CrMnTi", "工程", "低", "已受理", "08-04"],
  ["CD-010", "华宇工程", "Φ95 30CrMo", "工程", "中", "待匹配", "08-04"],
  ["CD-011", "天合汽车", "Φ70 42CrMo", "汽车", "高", "分析中", "08-04"],
  ["CD-012", "远航装备", "Φ140 25Cr2Mo", "海工", "中", "评估中", "08-05"],
  ["CD-013", "鑫科能源", "Φ160 12Cr1MoV", "能源", "高", "匹配中", "08-05"],
  ["CD-014", "科达轨道", "Φ88 30CrMnSi", "轨交", "中", "已受理", "08-05"],
  ["CD-015", "力拓设备", "Φ130 40CrNiMo", "矿山", "中", "评估中", "08-06"],
  ["CD-016", "凌云工程", "Φ105 34CrNi3Mo", "工程", "低", "已受理", "08-06"],
  ["CD-017", "星耀能源", "Φ175 15CrMoG", "能源", "高", "分析中", "08-06"],
  ["CD-018", "华能装备", "Φ125 20CrMo", "能源", "中", "匹配中", "08-07"],
  ["CD-019", "天际汽车", "Φ72 42CrMo", "汽车", "中", "已受理", "08-07"],
  ["CD-020", "泰丰轨交", "Φ86 30CrMnSi", "轨交", "高", "待匹配", "08-07"],
  ["CD-021", "盛海工程", "Φ98 35CrMo", "工程", "中", "评估中", "08-08"],
  ["CD-022", "联航船舶", "Φ190 20CrNiMo", "海工", "高", "分析中", "08-08"],
];

const formModal = ref(false);
const progressModal = ref(false);
const tipsModal = ref(false);
const form = reactive({
  customer: "",
  spec: "",
  scene: "",
  deadline: "",
  detail: "",
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

.modal-form input,
.modal-form textarea {
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
  width: 62%;
  background: linear-gradient(90deg, #6fa0ff, #9cc1ff);
}

.tips {
  padding-left: 18px;
  color: #4b5d8f;
  display: grid;
  gap: 8px;
}
</style>
