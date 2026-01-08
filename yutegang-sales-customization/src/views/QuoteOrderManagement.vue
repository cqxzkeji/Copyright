<template>
  <div class="module-page">
    <section class="module-header">
      <div>
        <h3>报价与订单管理</h3>
        <p>生成个性化报价单，跟踪订单状态与变更记录。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm">生成报价</button>
        <button class="ghost" @click="openProgress">订单追踪</button>
        <button class="ghost" @click="openTips">变更提示</button>
      </div>
    </section>

    <section class="card-grid">
      <ChartPanel
        title="报价转化率"
        subtitle="本月转化情况"
        :labels="['已转化', '谈判中', '流失']"
        :values="[62, 48, 26]"
      />
      <ChartPanel
        title="订单交付分布"
        subtitle="按交付阶段"
        :labels="['生产中', '待发运', '已交付']"
        :values="[58, 42, 72]"
      />
      <div class="summary-card">
        <h4>报价策略建议</h4>
        <ul>
          <li>高价值客户建议锁定 7 天报价。</li>
          <li>交期紧张订单加收 3% 加急费。</li>
          <li>配套服务可提升续约率。</li>
        </ul>
      </div>
    </section>

    <DataTable :headers="headers" :rows="rows" />

    <BaseModal
      :show="formModal"
      title="自动报价单"
      width="640px"
      @close="formModal = false"
    >
      <form class="modal-form">
        <label>
          客户名称
          <input v-model="form.customer" placeholder="输入客户名称" />
        </label>
        <label>
          产品规格
          <input v-model="form.spec" placeholder="规格/材质" />
        </label>
        <label>
          预计吨位
          <input v-model="form.volume" placeholder="例如：120 吨" />
        </label>
        <label>
          目标单价
          <input v-model="form.price" placeholder="元/吨" />
        </label>
        <label>
          交付方式
          <input v-model="form.delivery" placeholder="分批交付/直发" />
        </label>
      </form>
      <template #footer>
        <button class="secondary" @click="formModal = false">取消</button>
        <button class="primary" @click="saveForm">生成报价单</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="progressModal"
      title="订单追踪"
      width="560px"
      @close="progressModal = false"
    >
      <div class="progress-card">
        <p>订单正在生产与物流协同调度中。</p>
        <div class="progress">
          <div class="bar" />
        </div>
        <ul>
          <li>报价确认完成</li>
          <li>合同签署完成</li>
          <li>生产执行进行中</li>
          <li>物流排车待安排</li>
        </ul>
      </div>
    </BaseModal>

    <BaseModal
      :show="tipsModal"
      title="订单变更提示"
      width="520px"
      @close="tipsModal = false"
    >
      <ul class="tips">
        <li>订单变更需同步至生产与物流系统。</li>
        <li>调整交期需重新评估产能负荷。</li>
        <li>高频变更客户需重点跟进。</li>
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
  "订单编号",
  "客户名称",
  "规格/材质",
  "报价(元/吨)",
  "数量(吨)",
  "状态",
  "交期",
];

const rows = [
  ["QO-001", "华北汽车集团", "Φ80 42CrMo", "8200", "120", "谈判中", "08-20"],
  ["QO-002", "宏通能源", "Φ120 15CrMo", "9100", "200", "已签约", "08-18"],
  ["QO-003", "中车轨道", "Φ60 20MnSi", "7600", "80", "生产中", "08-25"],
  ["QO-004", "海工装备", "Φ200 35CrMo", "9800", "150", "谈判中", "08-30"],
  ["QO-005", "鑫源重工", "Φ150 40Cr", "8600", "110", "待确认", "08-28"],
  ["QO-006", "北方风电", "Φ90 42CrMo", "8400", "95", "已签约", "08-22"],
  ["QO-007", "锦航船舶", "Φ180 20CrNiMo", "10200", "70", "生产中", "09-02"],
  ["QO-008", "鹏程矿机", "Φ110 35CrMo", "8800", "130", "谈判中", "08-26"],
  ["QO-009", "中达装备", "Φ65 20CrMnTi", "7900", "60", "待确认", "08-27"],
  ["QO-010", "华宇工程", "Φ95 30CrMo", "8300", "100", "已签约", "08-24"],
  ["QO-011", "天合汽车", "Φ70 42CrMo", "8100", "90", "生产中", "08-29"],
  ["QO-012", "远航装备", "Φ140 25Cr2Mo", "9400", "120", "谈判中", "09-01"],
  ["QO-013", "鑫科能源", "Φ160 12Cr1MoV", "9900", "160", "待确认", "09-05"],
  ["QO-014", "科达轨道", "Φ88 30CrMnSi", "7800", "75", "已签约", "08-23"],
  ["QO-015", "力拓设备", "Φ130 40CrNiMo", "9600", "140", "谈判中", "09-08"],
  ["QO-016", "凌云工程", "Φ105 34CrNi3Mo", "9200", "105", "生产中", "08-31"],
  ["QO-017", "星耀能源", "Φ175 15CrMoG", "9800", "180", "待确认", "09-10"],
  ["QO-018", "华能装备", "Φ125 20CrMo", "9000", "115", "已签约", "09-03"],
  ["QO-019", "天际汽车", "Φ72 42CrMo", "8150", "85", "谈判中", "08-27"],
  ["QO-020", "泰丰轨交", "Φ86 30CrMnSi", "7700", "70", "生产中", "08-30"],
  ["QO-021", "盛海工程", "Φ98 35CrMo", "8700", "95", "待确认", "09-04"],
  ["QO-022", "联航船舶", "Φ190 20CrNiMo", "10400", "160", "已签约", "09-12"],
];

const formModal = ref(false);
const progressModal = ref(false);
const tipsModal = ref(false);
const form = reactive({
  customer: "",
  spec: "",
  volume: "",
  price: "",
  delivery: "",
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
  width: 74%;
  background: linear-gradient(90deg, #6fa0ff, #9cc1ff);
}

.tips {
  padding-left: 18px;
  color: #4b5d8f;
  display: grid;
  gap: 8px;
}
</style>
