<template>
  <div class="page">
    <section class="toolbar">
      <div class="actions">
        <button class="primary" @click="openModal('parse')">启动解析任务</button>
        <button class="ghost" @click="openModal('tag')">标签体系管理</button>
        <button class="ghost" @click="openModal('relation')">关系抽取配置</button>
        <button class="ghost" @click="openModal('export')">知识片段导出</button>
        <button class="ghost" @click="openModal('schedule')">任务调度</button>
      </div>
      <div class="search">
        <input v-model="keyword" placeholder="检索企业/实体/标签" />
        <button class="primary" @click="openTip('已定位 14 条相关知识片段。')">检索</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>实体识别准确率</h4>
        <strong>93.6%</strong>
        <p>企业 42% / 项目 27% / 风险点 31%</p>
      </div>
      <div class="card">
        <h4>今日解析任务</h4>
        <strong>64</strong>
        <p>已完成 58 / 运行中 6</p>
      </div>
      <div class="card">
        <h4>知识片段总量</h4>
        <strong>3,248</strong>
        <p>可检索主题 198 个</p>
      </div>
      <div class="card chart-card">
        <h4>实体类型分布</h4>
        <svg viewBox="0 0 240 140" class="chart">
          <circle cx="70" cy="70" r="40" fill="#93c5fd" />
          <circle cx="150" cy="70" r="40" fill="#fde68a" />
          <circle cx="120" cy="70" r="28" fill="#fda4af" />
        </svg>
        <div class="legend">
          <span>企业</span>
          <span>项目</span>
          <span>风险点</span>
        </div>
      </div>
    </section>

    <section class="table-card">
      <header>
        <h3>可检索知识片段</h3>
        <button class="ghost" @click="openModal('progress')">解析进度</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>片段编号</th>
            <th>实体</th>
            <th>关系</th>
            <th>标签</th>
            <th>风险点</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.entity }}</td>
            <td>{{ item.relation }}</td>
            <td>{{ item.tag }}</td>
            <td>{{ item.risk }}</td>
            <td>{{ item.time }}</td>
            <td>
              <button class="link" @click="openDetail(item)">详情</button>
              <button class="link" @click="openTip('已加入重点关注标签。')">关注</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-model="modalOpen" :title="modalTitle" size="large" @confirm="handleConfirm">
      <div v-if="modalType === 'parse'" class="form-grid">
        <label>解析范围 <input placeholder="近 7 天咨询数据" /></label>
        <label>分词词库 <input placeholder="咨询行业自定义词库" /></label>
        <label>实体识别模型 <input placeholder="BERT-Entity-v2" /></label>
        <label>输出格式
          <select>
            <option>结构化片段</option>
            <option>知识图谱节点</option>
          </select>
        </label>
        <label>优先级
          <select>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'tag'" class="form-grid">
        <label>标签名称 <input placeholder="供应链风险" /></label>
        <label>标签层级 <input placeholder="经营风险/供应链" /></label>
        <label>适用场景 <input placeholder="智能研判" /></label>
        <label>说明 <textarea rows="3" placeholder="定义与使用规则"></textarea></label>
      </div>
      <div v-else-if="modalType === 'relation'" class="form-grid">
        <label>关系类型 <input placeholder="供应-依赖" /></label>
        <label>抽取规则 <input placeholder="实体 + 动词 + 实体" /></label>
        <label>置信度阈值 <input type="number" min="0" max="1" step="0.01" value="0.75" /></label>
        <label>输出模板 <input placeholder="企业A依赖企业B" /></label>
      </div>
      <div v-else-if="modalType === 'export'" class="form-grid">
        <label>导出范围 <input placeholder="近 30 天" /></label>
        <label>格式
          <select>
            <option>Excel</option>
            <option>JSON</option>
            <option>CSV</option>
          </select>
        </label>
        <label>脱敏策略 <input placeholder="隐藏手机号/证件号" /></label>
        <label>接收邮箱 <input placeholder="report@enterprise.com" /></label>
      </div>
      <div v-else-if="modalType === 'schedule'" class="form-grid">
        <label>执行频率 <input placeholder="每天 08:00" /></label>
        <label>任务负责人 <input placeholder="知识工程组" /></label>
        <label>通知方式 <input placeholder="邮件 + 企业微信" /></label>
        <label>异常处理 <input placeholder="自动重试 2 次" /></label>
      </div>
      <div v-else-if="modalType === 'progress'">
        <p>文本解析任务正在运行中。</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted">已完成 {{ progress }}%，剩余 6 条咨询待处理。</p>
      </div>
      <div v-else-if="modalType === 'detail'">
        <p><strong>实体：</strong>{{ detail.entity }}</p>
        <p><strong>关系：</strong>{{ detail.relation }}</p>
        <p><strong>标签：</strong>{{ detail.tag }}</p>
        <p><strong>风险点：</strong>{{ detail.risk }}</p>
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
const progress = ref(74);
const detail = ref({});

const knowledgeList = ref([
  { id: "KN-001", entity: "宏远新能源", relation: "项目-投资", tag: "产业升级", risk: "补贴依赖", time: "2024-06-01", summary: "新能源项目资金依赖补贴。" },
  { id: "KN-002", entity: "凌云制造", relation: "企业-供应", tag: "供应链风险", risk: "交付延期", time: "2024-06-01", summary: "关键零部件延迟交付。" },
  { id: "KN-003", entity: "港湾物流", relation: "企业-舆情", tag: "舆情预警", risk: "投诉集中", time: "2024-06-02", summary: "客户投诉集中在时效。" },
  { id: "KN-004", entity: "智芯科技", relation: "企业-合规", tag: "合规审查", risk: "数据出境", time: "2024-06-02", summary: "涉及数据出境评估。" },
  { id: "KN-005", entity: "华林医药", relation: "项目-审批", tag: "审批风险", risk: "审批延期", time: "2024-06-03", summary: "新产品审批周期延长。" },
  { id: "KN-006", entity: "云海文旅", relation: "企业-现金流", tag: "经营风险", risk: "回款偏慢", time: "2024-06-03", summary: "旺季回款不及预期。" },
  { id: "KN-007", entity: "星链通信", relation: "企业-信用", tag: "信用评估", risk: "授信调整", time: "2024-06-04", summary: "授信额度下调。" },
  { id: "KN-008", entity: "海川环保", relation: "企业-合规", tag: "环保合规", risk: "许可更新", time: "2024-06-04", summary: "排污许可待更新。" },
  { id: "KN-009", entity: "瑞恒材料", relation: "企业-供应", tag: "供应链风险", risk: "成本上涨", time: "2024-06-05", summary: "上游原料涨价。" },
  { id: "KN-010", entity: "云栖软件", relation: "企业-经营", tag: "经营风险", risk: "回款延长", time: "2024-06-05", summary: "项目回款周期延长。" },
  { id: "KN-011", entity: "海润食品", relation: "企业-质量", tag: "质量风险", risk: "抽检异常", time: "2024-06-06", summary: "抽检样品存在异常。" },
  { id: "KN-012", entity: "智造云工厂", relation: "企业-成本", tag: "成本风险", risk: "能耗上涨", time: "2024-06-06", summary: "能耗成本上涨。" },
  { id: "KN-013", entity: "安泰建工", relation: "企业-资金", tag: "资金链", risk: "结算延迟", time: "2024-06-07", summary: "工程款结算延迟。" },
  { id: "KN-014", entity: "乐享零售", relation: "企业-舆情", tag: "舆情预警", risk: "评价波动", time: "2024-06-07", summary: "线上评价下降。" },
  { id: "KN-015", entity: "新航航空", relation: "企业-运营", tag: "运营风险", risk: "航线调整", time: "2024-06-08", summary: "航线缩减调整。" },
  { id: "KN-016", entity: "森源农科", relation: "企业-气候", tag: "气候风险", risk: "极端天气", time: "2024-06-08", summary: "极端天气影响产量。" },
  { id: "KN-017", entity: "光谷孵化器", relation: "项目-退出", tag: "项目管理", risk: "项目退出", time: "2024-06-09", summary: "两家孵化企业退出。" },
  { id: "KN-018", entity: "智行出行", relation: "企业-合规", tag: "合规审查", risk: "安全审核", time: "2024-06-09", summary: "安全规范审核进行中。" },
  { id: "KN-019", entity: "蓝海海工", relation: "企业-供应", tag: "供应链风险", risk: "设备交付", time: "2024-06-10", summary: "关键设备交付滞后。" },
  { id: "KN-020", entity: "优链供应", relation: "企业-信用", tag: "信用评估", risk: "合作方逾期", time: "2024-06-10", summary: "合作方逾期付款。" }
]);

const filteredList = computed(() =>
  knowledgeList.value.filter((item) =>
    [item.entity, item.tag, item.risk].some((text) => text.includes(keyword.value))
  )
);

const modalTitle = computed(() => {
  const titles = {
    parse: "启动文本解析任务",
    tag: "标签体系管理",
    relation: "关系抽取配置",
    export: "知识片段导出",
    schedule: "任务调度",
    progress: "解析进度",
    detail: "知识片段详情"
  };
  return titles[modalType.value] || "操作";
});

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const handleConfirm = () => {
  modalOpen.value = false;
  openTip("已提交解析配置，系统将更新知识片段。");
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
  display: flex;
  justify-content: space-between;
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
  background: linear-gradient(90deg, #fbbf24, #f97316);
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
