<template>
  <div class="page">
    <section class="toolbar">
      <div class="actions">
        <button class="primary" @click="openModal('create')">一键转工单</button>
        <button class="ghost" @click="openModal('assign')">工单分派</button>
        <button class="ghost" @click="openModal('material')">材料补充</button>
        <button class="ghost" @click="openModal('approve')">审批流设置</button>
        <button class="ghost" @click="openModal('sla')">SLA 统计</button>
      </div>
      <div class="search">
        <input v-model="keyword" placeholder="搜索工单/负责人" />
        <button class="primary" @click="openTip('已筛选 11 条待处理工单。')">筛选</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>待处理工单</h4>
        <strong>24</strong>
        <p>高优先级 6</p>
      </div>
      <div class="card">
        <h4>平均处理时长</h4>
        <strong>3.2 天</strong>
        <p>SLA 达标率 92%</p>
      </div>
      <div class="card">
        <h4>协同角色</h4>
        <strong>12</strong>
        <p>风险、法务、数据、业务</p>
      </div>
      <div class="card chart-card">
        <h4>工单状态分布</h4>
        <svg viewBox="0 0 220 140" class="chart">
          <rect x="20" y="60" width="40" height="60" fill="#c4b5fd" />
          <rect x="80" y="40" width="40" height="80" fill="#818cf8" />
          <rect x="140" y="30" width="40" height="90" fill="#38bdf8" />
        </svg>
        <div class="legend">
          <span>待分派</span>
          <span>处理中</span>
          <span>已完成</span>
        </div>
      </div>
    </section>

    <section class="table-card">
      <header>
        <h3>工单协同清单</h3>
        <button class="ghost" @click="openModal('progress')">流程进度</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>工单编号</th>
            <th>企业/项目</th>
            <th>负责人</th>
            <th>状态</th>
            <th>优先级</th>
            <th>当前节点</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.node }}</td>
            <td>{{ item.time }}</td>
            <td>
              <button class="link" @click="openDetail(item)">查看</button>
              <button class="link" @click="openTip('已更新工单协同记录。')">记录</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-model="modalOpen" :title="modalTitle" size="large" @confirm="handleConfirm">
      <div v-if="modalType === 'create'" class="form-grid">
        <label>研判结果 <input placeholder="高风险 - 合规" /></label>
        <label>工单类型
          <select>
            <option>专项跟进</option>
            <option>合规复核</option>
            <option>舆情处理</option>
          </select>
        </label>
        <label>协同角色 <input placeholder="风控 + 法务 + 业务" /></label>
        <label>期望完成时间 <input type="date" /></label>
        <label>说明 <textarea rows="3" placeholder="工单目标与要求"></textarea></label>
      </div>
      <div v-else-if="modalType === 'assign'" class="form-grid">
        <label>工单编号 <input placeholder="WF-2024-001" /></label>
        <label>分派对象 <input placeholder="张敏（合规）" /></label>
        <label>协同人员 <input placeholder="李浩 / 王倩" /></label>
        <label>通知方式 <input placeholder="短信 + 企业微信" /></label>
      </div>
      <div v-else-if="modalType === 'material'" class="form-grid">
        <label>材料名称 <input placeholder="审计报告" /></label>
        <label>上传文件 <input type="file" /></label>
        <label>补充说明 <textarea rows="3" placeholder="补充材料说明"></textarea></label>
        <label>关联工单 <input placeholder="WF-2024-006" /></label>
      </div>
      <div v-else-if="modalType === 'approve'" class="form-grid">
        <label>审批节点 <input placeholder="部门负责人" /></label>
        <label>审批人 <input placeholder="总经理" /></label>
        <label>限时要求 <input placeholder="48 小时内" /></label>
        <label>升级规则 <input placeholder="超时自动升级" /></label>
      </div>
      <div v-else-if="modalType === 'sla'">
        <p>本月 SLA 统计：平均响应 4 小时，平均完成 3.2 天。</p>
        <ul class="list">
          <li>按期完成：92%</li>
          <li>超时处理中：6%</li>
          <li>超时已完成：2%</li>
        </ul>
      </div>
      <div v-else-if="modalType === 'progress'">
        <p>工单流程正在推进中。</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="muted">已完成 {{ progress }}%，当前节点：审批归档。</p>
      </div>
      <div v-else-if="modalType === 'detail'">
        <p><strong>工单编号：</strong>{{ detail.id }}</p>
        <p><strong>当前状态：</strong>{{ detail.status }}</p>
        <p><strong>负责人：</strong>{{ detail.owner }}</p>
        <p><strong>协同记录：</strong>{{ detail.note }}</p>
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
const progress = ref(58);
const detail = ref({});

const workflowList = ref([
  { id: "WF-2024-001", name: "宏远新能源", owner: "李悦", status: "处理中", level: "高", node: "材料补充", time: "2024-06-04", note: "已补充财务数据" },
  { id: "WF-2024-002", name: "凌云制造", owner: "王倩", status: "待分派", level: "中", node: "分派", time: "2024-06-04", note: "等待分派" },
  { id: "WF-2024-003", name: "港湾物流", owner: "张敏", status: "处理中", level: "高", node: "风险研判", time: "2024-06-05", note: "舆情核验进行中" },
  { id: "WF-2024-004", name: "智芯科技", owner: "孙浩", status: "审批中", level: "高", node: "审批", time: "2024-06-05", note: "合规复核" },
  { id: "WF-2024-005", name: "华林医药", owner: "赵雨", status: "处理中", level: "中", node: "协同会商", time: "2024-06-06", note: "等待法务意见" },
  { id: "WF-2024-006", name: "云海文旅", owner: "刘畅", status: "处理中", level: "中", node: "材料补充", time: "2024-06-06", note: "补充现金流" },
  { id: "WF-2024-007", name: "星链通信", owner: "周晴", status: "待分派", level: "中", node: "分派", time: "2024-06-07", note: "等待接单" },
  { id: "WF-2024-008", name: "海川环保", owner: "李悦", status: "已完成", level: "低", node: "归档", time: "2024-06-07", note: "完成整改" },
  { id: "WF-2024-009", name: "瑞恒材料", owner: "王倩", status: "处理中", level: "中", node: "跟进", time: "2024-06-08", note: "供应商复核" },
  { id: "WF-2024-010", name: "云栖软件", owner: "张敏", status: "处理中", level: "中", node: "协同会商", time: "2024-06-08", note: "业务部门复核" },
  { id: "WF-2024-011", name: "海润食品", owner: "赵雨", status: "审批中", level: "高", node: "审批", time: "2024-06-09", note: "质量复核" },
  { id: "WF-2024-012", name: "智造云工厂", owner: "刘畅", status: "处理中", level: "中", node: "跟进", time: "2024-06-09", note: "成本优化" },
  { id: "WF-2024-013", name: "安泰建工", owner: "周晴", status: "处理中", level: "高", node: "材料补充", time: "2024-06-10", note: "补充合同" },
  { id: "WF-2024-014", name: "乐享零售", owner: "李悦", status: "待分派", level: "低", node: "分派", time: "2024-06-10", note: "等待分派" },
  { id: "WF-2024-015", name: "新航航空", owner: "王倩", status: "处理中", level: "中", node: "跟进", time: "2024-06-11", note: "航线评估" },
  { id: "WF-2024-016", name: "森源农科", owner: "张敏", status: "已完成", level: "低", node: "归档", time: "2024-06-11", note: "完成气候评估" },
  { id: "WF-2024-017", name: "光谷孵化器", owner: "赵雨", status: "处理中", level: "中", node: "协同会商", time: "2024-06-12", note: "孵化计划调整" },
  { id: "WF-2024-018", name: "智行出行", owner: "刘畅", status: "审批中", level: "高", node: "审批", time: "2024-06-12", note: "安全审查" },
  { id: "WF-2024-019", name: "蓝海海工", owner: "周晴", status: "处理中", level: "中", node: "跟进", time: "2024-06-13", note: "供应商协同" },
  { id: "WF-2024-020", name: "优链供应", owner: "李悦", status: "处理中", level: "中", node: "材料补充", time: "2024-06-13", note: "补充信用报告" }
]);

const filteredList = computed(() =>
  workflowList.value.filter((item) =>
    [item.id, item.owner, item.name].some((text) => text.includes(keyword.value))
  )
);

const modalTitle = computed(() => {
  const titles = {
    create: "一键转工单",
    assign: "工单分派",
    material: "材料补充",
    approve: "审批流设置",
    sla: "SLA 统计",
    progress: "流程进度",
    detail: "工单详情"
  };
  return titles[modalType.value] || "操作";
});

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const handleConfirm = () => {
  modalOpen.value = false;
  openTip("工单操作已提交，协同人员将收到通知。");
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

.list {
  padding-left: 18px;
  color: #475569;
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
  background: linear-gradient(90deg, #a855f7, #6366f1);
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
