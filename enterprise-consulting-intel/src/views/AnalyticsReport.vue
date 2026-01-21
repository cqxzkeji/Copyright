<template>
  <div class="page">
    <section class="toolbar">
      <div class="actions">
        <button class="primary" @click="openModal('report')">一键生成报告</button>
        <button class="ghost" @click="openModal('pdf')">导出 PDF</button>
        <button class="ghost" @click="openModal('excel')">导出 Excel</button>
        <button class="ghost" @click="openModal('template')">报告模板</button>
        <button class="ghost" @click="openModal('share')">共享周/月报</button>
      </div>
      <div class="search">
        <input v-model="keyword" placeholder="搜索行业/主题" />
        <button class="primary" @click="openTip('已刷新看板统计。')">刷新</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>咨询量趋势</h4>
        <strong>1,248</strong>
        <p>环比 +12%</p>
      </div>
      <div class="card">
        <h4>高风险占比</h4>
        <strong>18%</strong>
        <p>较上周下降 3%</p>
      </div>
      <div class="card">
        <h4>处置效率</h4>
        <strong>92%</strong>
        <p>按期闭环工单</p>
      </div>
      <div class="card chart-card">
        <h4>热点主题 TOP5</h4>
        <svg viewBox="0 0 240 140" class="chart">
          <rect x="20" y="20" width="180" height="16" fill="#60a5fa" />
          <rect x="20" y="45" width="150" height="16" fill="#93c5fd" />
          <rect x="20" y="70" width="130" height="16" fill="#a5b4fc" />
          <rect x="20" y="95" width="110" height="16" fill="#fca5a5" />
          <rect x="20" y="120" width="90" height="16" fill="#fdba74" />
        </svg>
        <div class="legend">
          <span>供应链</span>
          <span>合规</span>
          <span>资金链</span>
          <span>舆情</span>
          <span>出口</span>
        </div>
      </div>
    </section>

    <section class="table-card">
      <header>
        <h3>行业画像与处置效率</h3>
        <button class="ghost" @click="openModal('progress')">生成进度</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>行业</th>
            <th>咨询量</th>
            <th>高风险占比</th>
            <th>热点主题</th>
            <th>平均处置天数</th>
            <th>报告状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.industry">
            <td>{{ item.industry }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.risk }}</td>
            <td>{{ item.topic }}</td>
            <td>{{ item.days }}</td>
            <td>{{ item.status }}</td>
            <td>
              <button class="link" @click="openDetail(item)">详情</button>
              <button class="link" @click="openTip('已发送报告链接。')">发送</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-model="modalOpen" :title="modalTitle" size="large" @confirm="handleConfirm">
      <div v-if="modalType === 'report'" class="form-grid">
        <label>报告周期 <input placeholder="2024 第 24 周" /></label>
        <label>包含模块 <input placeholder="趋势 + 风险 + 处置效率" /></label>
        <label>模板选择
          <select>
            <option>周报模板</option>
            <option>月报模板</option>
            <option>专项报告模板</option>
          </select>
        </label>
        <label>摘要说明 <textarea rows="3" placeholder="自动生成摘要"></textarea></label>
      </div>
      <div v-else-if="modalType === 'pdf'" class="form-grid">
        <label>导出范围 <input placeholder="本周全部模块" /></label>
        <label>水印设置 <input placeholder="内部使用" /></label>
        <label>输出邮箱 <input placeholder="board@enterprise.com" /></label>
      </div>
      <div v-else-if="modalType === 'excel'" class="form-grid">
        <label>数据维度 <input placeholder="行业画像 + 风险分布" /></label>
        <label>字段选择 <input placeholder="咨询量/风险占比/处置效率" /></label>
        <label>存储路径 <input placeholder="/reports/2024/week24" /></label>
      </div>
      <div v-else-if="modalType === 'template'" class="form-grid">
        <label>模板名称 <input placeholder="高层决策版" /></label>
        <label>封面样式 <input placeholder="亮色简版" /></label>
        <label>图表组合 <input placeholder="趋势折线 + 风险柱状" /></label>
        <label>备注 <textarea rows="3" placeholder="模板说明"></textarea></label>
      </div>
      <div v-else-if="modalType === 'share'" class="form-grid">
        <label>分享对象 <input placeholder="领导层 / 部门负责人" /></label>
        <label>分享方式 <input placeholder="邮件 + 企业微信" /></label>
        <label>权限设置 <input placeholder="7 天内有效" /></label>
        <label>附言 <textarea rows="3" placeholder="说明事项"></textarea></label>
      </div>
      <div v-else-if="modalType === 'progress'">
        <p>报告生成中，正在汇总行业画像与热点主题。</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted">已完成 {{ progress }}%，即将生成图表。</p>
      </div>
      <div v-else-if="modalType === 'detail'">
        <p><strong>行业：</strong>{{ detail.industry }}</p>
        <p><strong>热点主题：</strong>{{ detail.topic }}</p>
        <p><strong>处置效率：</strong>{{ detail.days }} 天</p>
        <p><strong>摘要：</strong>{{ detail.summary }}</p>
      </div>
    </BaseModal>

    <BaseModal v-model="tipOpen" title="提示信息" @confirm="tipOpen = false">
      <p>{{ tipMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const keyword = ref("");
const modalOpen = ref(false);
const modalType = ref("");
const tipOpen = ref(false);
const tipMessage = ref("");
const progress = ref(81);
const detail = ref({});

const analyticsList = ref([
  { industry: "新能源", count: 120, risk: "22%", topic: "补贴政策", days: 3.1, status: "已生成", summary: "补贴政策调整引发资金压力。" },
  { industry: "高端制造", count: 98, risk: "18%", topic: "供应链", days: 3.4, status: "已生成", summary: "供应链波动需关注。" },
  { industry: "物流", count: 86, risk: "16%", topic: "舆情投诉", days: 2.9, status: "已生成", summary: "服务舆情增加。" },
  { industry: "半导体", count: 92, risk: "21%", topic: "合规审查", days: 3.6, status: "已生成", summary: "数据合规关注度提升。" },
  { industry: "医药", count: 74, risk: "19%", topic: "审批周期", days: 3.8, status: "已生成", summary: "审批周期延长。" },
  { industry: "文旅", count: 68, risk: "14%", topic: "现金流", days: 2.7, status: "已生成", summary: "回款慢影响运营。" },
  { industry: "通信", count: 82, risk: "17%", topic: "授信调整", days: 3.3, status: "已生成", summary: "信用授信收紧。" },
  { industry: "环保", count: 63, risk: "12%", topic: "合规许可", days: 2.5, status: "已生成", summary: "许可更新集中。" },
  { industry: "新材料", count: 77, risk: "15%", topic: "成本上涨", days: 3.0, status: "已生成", summary: "原材料价格波动。" },
  { industry: "软件服务", count: 101, risk: "13%", topic: "回款周期", days: 2.8, status: "已生成", summary: "项目回款延后。" },
  { industry: "食品加工", count: 58, risk: "20%", topic: "质量抽检", days: 3.2, status: "已生成", summary: "质量抽检频次增加。" },
  { industry: "智能制造", count: 89, risk: "16%", topic: "能耗成本", days: 3.5, status: "已生成", summary: "能耗成本上升。" },
  { industry: "建筑", count: 70, risk: "23%", topic: "资金链", days: 4.1, status: "已生成", summary: "工程款结算周期长。" },
  { industry: "零售", count: 97, risk: "14%", topic: "舆情波动", days: 2.6, status: "已生成", summary: "线上评价波动。" },
  { industry: "交通", count: 66, risk: "18%", topic: "运营调整", days: 3.4, status: "已生成", summary: "航线调整影响收益。" },
  { industry: "农业科技", count: 54, risk: "11%", topic: "气候风险", days: 2.9, status: "已生成", summary: "极端天气影响产量。" },
  { industry: "孵化服务", count: 61, risk: "15%", topic: "项目退出", days: 3.0, status: "已生成", summary: "孵化企业退出增加。" },
  { industry: "出行服务", count: 79, risk: "19%", topic: "安全合规", days: 3.7, status: "已生成", summary: "安全审核频次增加。" },
  { industry: "海工", count: 45, risk: "17%", topic: "设备交付", days: 3.6, status: "已生成", summary: "设备交付延迟。" },
  { industry: "供应链", count: 88, risk: "20%", topic: "信用风险", days: 3.3, status: "已生成", summary: "合作方信用波动。" }
]);

const filteredList = computed(() =>
  analyticsList.value.filter((item) =>
    [item.industry, item.topic].some((text) => text.includes(keyword.value))
  )
);

const modalTitle = computed(() => {
  const titles = {
    report: "一键生成报告",
    pdf: "导出 PDF",
    excel: "导出 Excel",
    template: "报告模板",
    share: "共享周/月报",
    progress: "生成进度",
    detail: "行业画像详情"
  };
  return titles[modalType.value] || "操作";
});

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const handleConfirm = () => {
  modalOpen.value = false;
  openTip("报告任务已提交，将在 5 分钟内完成。");
};

const openTip = (message) => {
  tipMessage.value = message;
  tipOpen.value = true;
};

const openDetail = (item) => {
  detail.value = item;
  openModal("detail");
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.search {
  display: flex;
  gap: 12px;
}

input {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 8px 12px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.chart {
  width: 100%;
  height: 120px;
}

.legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
  overflow: auto;
}

.table-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.link {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
  margin-right: 8px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #fff;
  border: 1px solid #cbd5f5;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

textarea {
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  padding: 8px 12px;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #fb7185, #f97316);
}

.muted {
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .search {
    width: 100%;
  }

  .search input {
    flex: 1;
  }
}
</style>
