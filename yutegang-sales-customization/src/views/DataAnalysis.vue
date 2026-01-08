<template>
  <div class="module-page">
    <section class="module-header">
      <div>
        <h3>数据分析与决策支持</h3>
        <p>覆盖销售、订单与生产多维度数据，辅助管理决策。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm">生成分析报告</button>
        <button class="ghost" @click="openProgress">分析进度</button>
        <button class="ghost" @click="openTips">经营提示</button>
      </div>
    </section>

    <section class="card-grid">
      <ChartPanel
        title="销售额趋势"
        subtitle="近四周（万元）"
        :labels="['W1', 'W2', 'W3', 'W4']"
        :values="[48, 62, 56, 72]"
      />
      <ChartPanel
        title="利润贡献度"
        subtitle="主要行业贡献"
        :labels="['汽车', '能源', '工程', '轨交']"
        :values="[66, 58, 46, 40]"
      />
      <div class="summary-card">
        <h4>决策建议摘要</h4>
        <ul>
          <li>高毛利客户集中在汽车与能源行业。</li>
          <li>生产效率提升可释放 12% 产能。</li>
          <li>建议锁定重点客户年度协议。</li>
        </ul>
      </div>
    </section>

    <DataTable :headers="headers" :rows="rows" />

    <BaseModal
      :show="formModal"
      title="分析报告配置"
      width="640px"
      @close="formModal = false"
    >
      <form class="modal-form">
        <label>
          报告主题
          <input v-model="form.topic" placeholder="如：季度销售与产能分析" />
        </label>
        <label>
          分析维度
          <input v-model="form.dimension" placeholder="行业/区域/产线" />
        </label>
        <label>
          时间范围
          <input v-model="form.range" placeholder="例如：2024 Q2" />
        </label>
        <label>
          重点指标
          <input v-model="form.kpi" placeholder="利润率、交付准时率等" />
        </label>
        <label>
          输出格式
          <input v-model="form.format" placeholder="PDF/仪表盘" />
        </label>
      </form>
      <template #footer>
        <button class="secondary" @click="formModal = false">取消</button>
        <button class="primary" @click="saveForm">生成报告</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="progressModal"
      title="数据分析进度"
      width="560px"
      @close="progressModal = false"
    >
      <div class="progress-card">
        <p>系统正在汇总销售与生产数据。</p>
        <div class="progress">
          <div class="bar" />
        </div>
        <ul>
          <li>销售数据清洗完成</li>
          <li>订单履约统计完成</li>
          <li>成本核算进行中</li>
          <li>利润评估待输出</li>
        </ul>
      </div>
    </BaseModal>

    <BaseModal
      :show="tipsModal"
      title="经营提示"
      width="520px"
      @close="tipsModal = false"
    >
      <ul class="tips">
        <li>高利润订单优先排产以提升资金周转。</li>
        <li>交付延迟客户需增加合同风险预警。</li>
        <li>建议优化能源类订单成本结构。</li>
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
  "分析编号",
  "维度",
  "指标",
  "当前值",
  "目标值",
  "偏差",
  "建议",
];

const rows = [
  ["DA-001", "销售", "本月收入", "6.8亿", "6.5亿", "+4.6%", "保持"],
  ["DA-002", "销售", "重点客户签约率", "78%", "75%", "+3%", "深耕"],
  ["DA-003", "订单", "准时交付率", "92%", "95%", "-3%", "跟踪"],
  ["DA-004", "订单", "平均交期", "18天", "20天", "+2天", "优化"],
  ["DA-005", "生产", "产线利用率", "84%", "80%", "+4%", "扩产"],
  ["DA-006", "生产", "一次合格率", "96%", "97%", "-1%", "复检"],
  ["DA-007", "成本", "原料成本", "4.2万", "4.0万", "+5%", "议价"],
  ["DA-008", "成本", "能耗成本", "1.1万", "1.0万", "+10%", "节能"],
  ["DA-009", "利润", "毛利率", "18%", "17%", "+1%", "保持"],
  ["DA-010", "利润", "高毛利客户占比", "46%", "50%", "-4%", "提升"],
  ["DA-011", "销售", "新客户线索", "58", "50", "+16%", "推进"],
  ["DA-012", "订单", "变更率", "6%", "5%", "+1%", "控制"],
  ["DA-013", "生产", "计划达成率", "88%", "90%", "-2%", "排查"],
  ["DA-014", "生产", "设备稼动率", "82%", "85%", "-3%", "维护"],
  ["DA-015", "成本", "物流成本", "0.8万", "0.7万", "+14%", "优化"],
  ["DA-016", "利润", "订单利润贡献", "2.1亿", "2.0亿", "+5%", "提升"],
  ["DA-017", "销售", "区域覆盖率", "72%", "70%", "+2%", "扩展"],
  ["DA-018", "订单", "客户满意度", "4.6/5", "4.7/5", "-0.1", "改进"],
  ["DA-019", "生产", "库存周转", "28天", "25天", "+3天", "压缩"],
  ["DA-020", "成本", "返工成本", "0.12万", "0.1万", "+20%", "改善"],
  ["DA-021", "利润", "重点行业贡献", "52%", "55%", "-3%", "提升"],
  ["DA-022", "销售", "报价转化率", "63%", "60%", "+3%", "保持"],
];

const formModal = ref(false);
const progressModal = ref(false);
const tipsModal = ref(false);
const form = reactive({
  topic: "",
  dimension: "",
  range: "",
  kpi: "",
  format: "",
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
  width: 76%;
  background: linear-gradient(90deg, #6fa0ff, #9cc1ff);
}

.tips {
  padding-left: 18px;
  color: #4b5d8f;
  display: grid;
  gap: 8px;
}
</style>
