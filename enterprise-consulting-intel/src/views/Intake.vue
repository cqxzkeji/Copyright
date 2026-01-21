<template>
  <div class="page">
    <section class="toolbar">
      <div class="actions">
        <button class="primary" @click="openModal('create')">新增咨询</button>
        <button class="ghost" @click="openModal('import')">批量导入</button>
        <button class="ghost" @click="openModal('api')">API 接入</button>
        <button class="ghost" @click="openModal('mapping')">字段映射</button>
        <button class="ghost" @click="openModal('dedupe')">去重合并</button>
        <button class="ghost" @click="openModal('source')">来源可信度</button>
      </div>
      <div class="search">
        <input v-model="keyword" placeholder="搜索企业/项目/标签" />
        <button class="primary" @click="openTip('已筛选匹配咨询条目。')">查询</button>
      </div>
    </section>

    <section class="summary-grid">
      <div class="summary-card">
        <h4>今日新增咨询</h4>
        <strong>128</strong>
        <p>表单 62 / 批量 43 / API 23</p>
      </div>
      <div class="summary-card">
        <h4>待去重条目</h4>
        <strong>32</strong>
        <p>命中相似度 &gt; 0.82</p>
      </div>
      <div class="summary-card">
        <h4>来源可信度均值</h4>
        <strong>86%</strong>
        <p>政府渠道与行业协会贡献最大</p>
      </div>
      <div class="summary-chart">
        <h4>渠道接入占比</h4>
        <svg viewBox="0 0 200 120" class="chart">
          <rect x="10" y="40" width="30" height="70" fill="#60a5fa" />
          <rect x="55" y="30" width="30" height="80" fill="#38bdf8" />
          <rect x="100" y="55" width="30" height="55" fill="#a5b4fc" />
          <rect x="145" y="20" width="30" height="90" fill="#fca5a5" />
        </svg>
        <div class="legend">
          <span>表单</span>
          <span>批量</span>
          <span>API</span>
          <span>外部共享</span>
        </div>
      </div>
    </section>

    <section class="table-card">
      <header>
        <h3>统一咨询数据池</h3>
        <button class="ghost" @click="openModal('progress')">同步进度</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>企业/项目</th>
            <th>来源</th>
            <th>行业</th>
            <th>风险线索</th>
            <th>可信度</th>
            <th>录入时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.source }}</td>
            <td>{{ item.industry }}</td>
            <td>{{ item.risk }}</td>
            <td>{{ item.score }}%</td>
            <td>{{ item.time }}</td>
            <td>
              <button class="link" @click="openDetail(item)">查看</button>
              <button class="link" @click="openTip('已标记来源可信度。')">标记</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-model="modalOpen" :title="modalTitle" size="large" @confirm="handleConfirm">
      <div v-if="modalType === 'create'" class="form-grid">
        <label>企业/项目 <input v-model="form.name" placeholder="输入名称" /></label>
        <label>来源渠道 <input v-model="form.source" placeholder="表单/批量/API" /></label>
        <label>行业类别 <input v-model="form.industry" placeholder="高端制造" /></label>
        <label>风险线索 <input v-model="form.risk" placeholder="如财务异常" /></label>
        <label>可信度评分 <input v-model="form.score" type="number" min="0" max="100" /></label>
        <label>备注 <textarea v-model="form.note" rows="3" placeholder="补充说明"></textarea></label>
      </div>
      <div v-else-if="modalType === 'import'" class="form-grid">
        <label>批量文件 <input type="file" /></label>
        <label>模板选择
          <select>
            <option>标准咨询模板</option>
            <option>园区专项模板</option>
            <option>外部数据模板</option>
          </select>
        </label>
        <label>导入策略
          <select>
            <option>追加导入</option>
            <option>覆盖更新</option>
          </select>
        </label>
        <label>去重规则 <input placeholder="相似度 ≥ 0.8" /></label>
      </div>
      <div v-else-if="modalType === 'api'" class="form-grid">
        <label>API 地址 <input placeholder="https://api.company.com/intake" /></label>
        <label>Token <input placeholder="输入访问令牌" /></label>
        <label>同步频率
          <select>
            <option>每 10 分钟</option>
            <option>每 30 分钟</option>
            <option>每天 2 次</option>
          </select>
        </label>
        <label>字段映射方案 <input placeholder="默认映射方案 A" /></label>
      </div>
      <div v-else-if="modalType === 'mapping'" class="form-grid">
        <label>原字段 <input placeholder="project_name" /></label>
        <label>目标字段 <input placeholder="企业/项目" /></label>
        <label>类型 <input placeholder="字符串" /></label>
        <label>校验规则 <input placeholder="必填 + 长度 30" /></label>
      </div>
      <div v-else-if="modalType === 'dedupe'" class="form-grid">
        <label>相似度阈值 <input type="number" min="0" max="1" step="0.01" value="0.82" /></label>
        <label>合并策略
          <select>
            <option>保留最新</option>
            <option>合并字段</option>
            <option>保留来源最高</option>
          </select>
        </label>
        <label>预览命中数 <input value="32" disabled /></label>
        <label>人工复核 <input placeholder="分派给数据运营组" /></label>
      </div>
      <div v-else-if="modalType === 'source'" class="form-grid">
        <label>来源类型 <input placeholder="政府渠道" /></label>
        <label>可信度基准 <input placeholder="90%" /></label>
        <label>历史命中率 <input placeholder="86%" /></label>
        <label>更新说明 <textarea rows="3" placeholder="调整依据"></textarea></label>
      </div>
      <div v-else-if="modalType === 'progress'">
        <p>正在同步外部渠道数据，预计 2 分钟完成。</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted">已完成 {{ progress }}%，当前批次：园区咨询平台。</p>
      </div>
      <div v-else-if="modalType === 'detail'">
        <p><strong>咨询编号：</strong>{{ detail.id }}</p>
        <p><strong>企业/项目：</strong>{{ detail.name }}</p>
        <p><strong>来源：</strong>{{ detail.source }}</p>
        <p><strong>风险线索：</strong>{{ detail.risk }}</p>
        <p><strong>补充说明：</strong>{{ detail.note }}</p>
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
const progress = ref(68);
const detail = ref({});
const form = ref({
  name: "",
  source: "",
  industry: "",
  risk: "",
  score: 80,
  note: ""
});

const intakeList = ref([
  {
    id: "IN-2024-001",
    name: "宏远新能源项目",
    source: "政府平台",
    industry: "新能源",
    risk: "补贴依赖",
    score: 92,
    time: "2024-06-01",
    note: "申请设备补贴延迟"
  },
  { id: "IN-2024-002", name: "凌云制造集团", source: "行业协会", industry: "高端制造", risk: "供应链波动", score: 88, time: "2024-06-02", note: "关键零部件延期" },
  { id: "IN-2024-003", name: "港湾物流中心", source: "园区表单", industry: "物流", risk: "舆情风险", score: 73, time: "2024-06-02", note: "客户投诉集中" },
  { id: "IN-2024-004", name: "智芯科技", source: "API 接入", industry: "半导体", risk: "合规审查", score: 85, time: "2024-06-03", note: "数据出境评估" },
  { id: "IN-2024-005", name: "华林医药", source: "批量导入", industry: "医药", risk: "经营波动", score: 79, time: "2024-06-03", note: "新产品审批延期" },
  { id: "IN-2024-006", name: "云海文旅", source: "政府平台", industry: "文旅", risk: "现金流", score: 81, time: "2024-06-04", note: "旺季回款偏慢" },
  { id: "IN-2024-007", name: "星链通信", source: "园区表单", industry: "通信", risk: "信用风险", score: 76, time: "2024-06-04", note: "外部授信调整" },
  { id: "IN-2024-008", name: "海川环保", source: "行业协会", industry: "环保", risk: "合规审查", score: 90, time: "2024-06-05", note: "排污许可更新" },
  { id: "IN-2024-009", name: "瑞恒材料", source: "API 接入", industry: "新材料", risk: "供应链波动", score: 84, time: "2024-06-05", note: "上游涨价" },
  { id: "IN-2024-010", name: "云栖软件", source: "批量导入", industry: "软件服务", risk: "经营波动", score: 78, time: "2024-06-06", note: "项目回款周期延长" },
  { id: "IN-2024-011", name: "海润食品", source: "政府平台", industry: "食品加工", risk: "质量风险", score: 82, time: "2024-06-06", note: "抽检异常" },
  { id: "IN-2024-012", name: "智造云工厂", source: "园区表单", industry: "智能制造", risk: "成本上升", score: 75, time: "2024-06-07", note: "能耗成本上涨" },
  { id: "IN-2024-013", name: "安泰建工", source: "行业协会", industry: "建筑", risk: "资金链", score: 70, time: "2024-06-07", note: "工程款结算延迟" },
  { id: "IN-2024-014", name: "乐享零售", source: "API 接入", industry: "零售", risk: "舆情风险", score: 77, time: "2024-06-08", note: "线上评价波动" },
  { id: "IN-2024-015", name: "新航航空", source: "批量导入", industry: "交通", risk: "运营风险", score: 83, time: "2024-06-08", note: "航线调整" },
  { id: "IN-2024-016", name: "森源农科", source: "政府平台", industry: "农业科技", risk: "气候风险", score: 86, time: "2024-06-09", note: "极端天气预警" },
  { id: "IN-2024-017", name: "光谷孵化器", source: "园区表单", industry: "孵化服务", risk: "项目退出", score: 69, time: "2024-06-09", note: "两家企业退出" },
  { id: "IN-2024-018", name: "智行出行", source: "行业协会", industry: "出行服务", risk: "合规审查", score: 88, time: "2024-06-10", note: "安全规范审核" },
  { id: "IN-2024-019", name: "蓝海海工", source: "API 接入", industry: "海工", risk: "供应链波动", score: 80, time: "2024-06-10", note: "关键设备交付" },
  { id: "IN-2024-020", name: "优链供应", source: "批量导入", industry: "供应链", risk: "信用风险", score: 74, time: "2024-06-11", note: "合作方逾期" }
]);

const filteredList = computed(() =>
  intakeList.value.filter((item) =>
    [item.name, item.source, item.industry, item.risk].some((text) =>
      text.includes(keyword.value)
    )
  )
);

const modalTitle = computed(() => {
  const titles = {
    create: "新增咨询信息",
    import: "批量导入咨询数据",
    api: "API 接入配置",
    mapping: "字段映射设置",
    dedupe: "去重合并策略",
    source: "来源可信度标注",
    progress: "同步进度",
    detail: "咨询详情"
  };
  return titles[modalType.value] || "操作";
});

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const handleConfirm = () => {
  modalOpen.value = false;
  openTip("操作已提交，请关注处理结果。");
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
  gap: 16px;
  justify-content: space-between;
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.summary-card,
.summary-chart {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.summary-card strong {
  font-size: 24px;
}

.chart {
  width: 100%;
  height: 120px;
}

.legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  background: linear-gradient(90deg, #38bdf8, #2563eb);
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
