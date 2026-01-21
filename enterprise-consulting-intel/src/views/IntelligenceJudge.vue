<template>
  <div class="page">
    <section class="toolbar">
      <div class="actions">
        <button class="primary" @click="openModal('score')">一键研判</button>
        <button class="ghost" @click="openModal('threshold')">阈值预警</button>
        <button class="ghost" @click="openModal('rule')">规则配置</button>
        <button class="ghost" @click="openModal('similar')">相似案例对照</button>
        <button class="ghost" @click="openModal('export')">评分结果导出</button>
      </div>
      <div class="search">
        <input v-model="keyword" placeholder="搜索企业/风险维度" />
        <button class="primary" @click="openTip('已筛选 9 条高风险条目。')">筛选</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>综合风险均分</h4>
        <strong>71</strong>
        <p>合规 78 / 舆情 66 / 经营 72 / 信用 70 / 供应链 69</p>
      </div>
      <div class="card">
        <h4>高风险企业</h4>
        <strong>18</strong>
        <p>阈值 ≥ 80 分</p>
      </div>
      <div class="card">
        <h4>预警触发</h4>
        <strong>42</strong>
        <p>今日新增 12 条</p>
      </div>
      <div class="card chart-card">
        <h4>风险维度雷达</h4>
        <svg viewBox="0 0 200 160" class="chart">
          <polygon points="100,20 160,60 140,130 60,130 40,60" fill="#bfdbfe" />
          <polygon points="100,40 145,70 130,120 70,120 55,70" fill="#60a5fa" opacity="0.7" />
        </svg>
        <div class="legend">
          <span>合规</span>
          <span>舆情</span>
          <span>经营</span>
          <span>信用</span>
          <span>供应链</span>
        </div>
      </div>
    </section>

    <section class="table-card">
      <header>
        <h3>智能研判评分清单</h3>
        <button class="ghost" @click="openModal('progress')">研判进度</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>企业</th>
            <th>合规</th>
            <th>舆情</th>
            <th>经营</th>
            <th>信用</th>
            <th>供应链</th>
            <th>综合评分</th>
            <th>说明</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.compliance }}</td>
            <td>{{ item.opinion }}</td>
            <td>{{ item.operation }}</td>
            <td>{{ item.credit }}</td>
            <td>{{ item.supply }}</td>
            <td><strong>{{ item.total }}</strong></td>
            <td>{{ item.reason }}</td>
            <td>
              <button class="link" @click="openDetail(item)">原因</button>
              <button class="link" @click="openTip('已触发风险预警通知。')">预警</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-model="modalOpen" :title="modalTitle" size="large" @confirm="handleConfirm">
      <div v-if="modalType === 'score'" class="form-grid">
        <label>评分范围 <input placeholder="近 30 天咨询" /></label>
        <label>模型组合 <input placeholder="规则引擎 + 风险模型 V3" /></label>
        <label>阈值策略
          <select>
            <option>高风险 ≥ 80</option>
            <option>中风险 ≥ 65</option>
            <option>低风险 ≥ 50</option>
          </select>
        </label>
        <label>可解释输出 <input placeholder="开启" /></label>
      </div>
      <div v-else-if="modalType === 'threshold'" class="form-grid">
        <label>维度选择
          <select>
            <option>合规</option>
            <option>舆情</option>
            <option>经营</option>
            <option>信用</option>
            <option>供应链</option>
          </select>
        </label>
        <label>预警阈值 <input type="number" min="0" max="100" value="80" /></label>
        <label>通知对象 <input placeholder="风控负责人" /></label>
        <label>升级策略 <input placeholder="连续 2 次触发升级" /></label>
      </div>
      <div v-else-if="modalType === 'rule'" class="form-grid">
        <label>规则名称 <input placeholder="信用评分异常" /></label>
        <label>触发条件 <input placeholder="信用 &lt; 60 且 负面舆情 ≥ 3" /></label>
        <label>权重 <input type="number" value="0.2" /></label>
        <label>解释说明 <textarea rows="3" placeholder="输出原因模板"></textarea></label>
      </div>
      <div v-else-if="modalType === 'similar'" class="form-grid">
        <label>目标企业 <input placeholder="宏远新能源" /></label>
        <label>相似度阈值 <input type="number" min="0" max="1" step="0.01" value="0.82" /></label>
        <label>对照案例库 <input placeholder="历年风险案例库" /></label>
        <label>输出字段 <input placeholder="风险原因 + 处置结果" /></label>
      </div>
      <div v-else-if="modalType === 'export'" class="form-grid">
        <label>导出范围 <input placeholder="高风险企业" /></label>
        <label>输出格式
          <select>
            <option>Excel</option>
            <option>PDF</option>
            <option>CSV</option>
          </select>
        </label>
        <label>分享对象 <input placeholder="风险管理部" /></label>
        <label>水印说明 <input placeholder="内部研判" /></label>
      </div>
      <div v-else-if="modalType === 'progress'">
        <p>研判引擎正在计算综合评分。</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted">已完成 {{ progress }}%，正在处理信用维度。</p>
      </div>
      <div v-else-if="modalType === 'detail'">
        <p><strong>企业：</strong>{{ detail.name }}</p>
        <p><strong>综合评分：</strong>{{ detail.total }}</p>
        <p><strong>风险原因：</strong>{{ detail.reason }}</p>
        <p><strong>可解释输出：</strong>{{ detail.explain }}</p>
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
const progress = ref(63);
const detail = ref({});

const scoreList = ref([
  { name: "宏远新能源", compliance: 82, opinion: 68, operation: 74, credit: 70, supply: 66, total: 72, reason: "补贴依赖", explain: "补贴依赖导致经营波动风险提升。" },
  { name: "凌云制造", compliance: 76, opinion: 61, operation: 69, credit: 72, supply: 78, total: 71, reason: "供应链波动", explain: "供应链波动拉低整体评分。" },
  { name: "港湾物流", compliance: 74, opinion: 58, operation: 66, credit: 64, supply: 60, total: 64, reason: "舆情投诉", explain: "客户投诉影响舆情维度。" },
  { name: "智芯科技", compliance: 88, opinion: 70, operation: 75, credit: 69, supply: 72, total: 75, reason: "合规审查", explain: "数据出境审查提升合规风险。" },
  { name: "华林医药", compliance: 80, opinion: 65, operation: 68, credit: 67, supply: 70, total: 70, reason: "审批延期", explain: "新产品审批延期拖慢营收。" },
  { name: "云海文旅", compliance: 73, opinion: 62, operation: 69, credit: 66, supply: 65, total: 67, reason: "现金流压力", explain: "回款偏慢导致现金流压力。" },
  { name: "星链通信", compliance: 78, opinion: 60, operation: 71, credit: 62, supply: 67, total: 68, reason: "授信调整", explain: "授信调整使信用评分下降。" },
  { name: "海川环保", compliance: 86, opinion: 69, operation: 73, credit: 75, supply: 72, total: 75, reason: "许可更新", explain: "许可证更新影响合规维度。" },
  { name: "瑞恒材料", compliance: 79, opinion: 64, operation: 70, credit: 71, supply: 69, total: 70, reason: "成本上涨", explain: "原材料价格上涨拉升经营风险。" },
  { name: "云栖软件", compliance: 77, opinion: 63, operation: 68, credit: 65, supply: 66, total: 68, reason: "回款延长", explain: "回款周期延长导致经营风险。" },
  { name: "海润食品", compliance: 81, opinion: 66, operation: 72, credit: 70, supply: 68, total: 71, reason: "质量抽检", explain: "抽检异常带来品牌舆情压力。" },
  { name: "智造云工厂", compliance: 75, opinion: 61, operation: 67, credit: 66, supply: 64, total: 66, reason: "能耗上涨", explain: "能耗上涨推高成本。" },
  { name: "安泰建工", compliance: 72, opinion: 59, operation: 64, credit: 60, supply: 62, total: 63, reason: "资金链", explain: "工程款结算延迟。" },
  { name: "乐享零售", compliance: 74, opinion: 60, operation: 66, credit: 63, supply: 65, total: 65, reason: "舆情波动", explain: "评价波动影响舆情评分。" },
  { name: "新航航空", compliance: 77, opinion: 64, operation: 70, credit: 68, supply: 69, total: 70, reason: "航线调整", explain: "航线调整影响经营稳定性。" },
  { name: "森源农科", compliance: 83, opinion: 67, operation: 74, credit: 71, supply: 73, total: 74, reason: "气候风险", explain: "极端天气影响产能。" },
  { name: "光谷孵化器", compliance: 70, opinion: 58, operation: 63, credit: 61, supply: 60, total: 62, reason: "项目退出", explain: "项目退出导致孵化收益下降。" },
  { name: "智行出行", compliance: 82, opinion: 66, operation: 72, credit: 69, supply: 70, total: 72, reason: "安全审核", explain: "安全审核提高合规成本。" },
  { name: "蓝海海工", compliance: 78, opinion: 63, operation: 69, credit: 68, supply: 66, total: 69, reason: "设备交付", explain: "设备交付延期影响项目。" },
  { name: "优链供应", compliance: 76, opinion: 62, operation: 67, credit: 60, supply: 64, total: 66, reason: "合作方逾期", explain: "合作方逾期拉低信用评分。" }
]);

const filteredList = computed(() =>
  scoreList.value.filter((item) =>
    [item.name, item.reason].some((text) => text.includes(keyword.value))
  )
);

const modalTitle = computed(() => {
  const titles = {
    score: "一键研判",
    threshold: "阈值预警设置",
    rule: "规则配置",
    similar: "相似案例对照",
    export: "评分结果导出",
    progress: "研判进度",
    detail: "研判原因说明"
  };
  return titles[modalType.value] || "操作";
});

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const handleConfirm = () => {
  modalOpen.value = false;
  openTip("研判配置已保存，结果将同步到看板。");
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
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
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
  background: linear-gradient(90deg, #22c55e, #16a34a);
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
