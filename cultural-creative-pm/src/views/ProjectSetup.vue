<template>
  <div class="module">
    <section class="card-grid">
      <div class="metric-card">
        <p>创意征集</p>
        <h2>38</h2>
        <span>本周新增 6 条</span>
      </div>
      <div class="metric-card">
        <p>立项评审</p>
        <h2>12</h2>
        <span>待评审 4 项</span>
      </div>
      <div class="metric-card">
        <p>预算草案</p>
        <h2>￥1,280,000</h2>
        <span>已提交 9 份</span>
      </div>
      <div class="metric-card">
        <p>风险提示</p>
        <h2>3</h2>
        <span>资源冲突 2 项</span>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>立项计划速览</h3>
          <p>围绕创意征集、预算与里程碑设定</p>
        </div>
        <div class="button-group">
          <button class="primary" @click="openModal('idea')">发起征集</button>
          <button class="outline" @click="openModal('review')">立项评审</button>
          <button class="outline" @click="openModal('budget')">预算草案</button>
          <button class="outline" @click="openModal('risk')">风险预判</button>
          <button class="ghost" @click="openModal('progress')">进度预览</button>
        </div>
      </div>
      <div class="chart-area">
        <div class="chart-card">
          <h4>创意来源分布</h4>
          <svg viewBox="0 0 320 160">
            <rect x="0" y="0" width="320" height="160" fill="#f5f7ff" rx="12" />
            <rect x="30" y="60" width="40" height="70" fill="#6366f1" rx="6" />
            <rect x="90" y="40" width="40" height="90" fill="#22c1c3" rx="6" />
            <rect x="150" y="30" width="40" height="100" fill="#f97316" rx="6" />
            <rect x="210" y="70" width="40" height="60" fill="#94a3b8" rx="6" />
            <rect x="270" y="50" width="40" height="80" fill="#10b981" rx="6" />
            <text x="24" y="148" font-size="10" fill="#6b7280">社区</text>
            <text x="82" y="148" font-size="10" fill="#6b7280">展会</text>
            <text x="142" y="148" font-size="10" fill="#6b7280">高校</text>
            <text x="204" y="148" font-size="10" fill="#6b7280">馆藏</text>
            <text x="262" y="148" font-size="10" fill="#6b7280">企业</text>
          </svg>
        </div>
        <div class="chart-card">
          <h4>项目章程关键点</h4>
          <ul class="list">
            <li>立项目标：城市文化 IP 延展</li>
            <li>范围说明：衍生品 + 展陈体验</li>
            <li>关键角色：策划、创意、制作、运营</li>
            <li>里程碑：立项/样机/首发/复盘</li>
            <li>资源预估：工时 960、人力 6 组</li>
          </ul>
          <button class="ghost" @click="openModal('info')">查看章程要点</button>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>立项申请清单</h3>
          <p>立项申请与评审状态实时同步</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>项目名称</th>
              <th>发起部门</th>
              <th>预算草案</th>
              <th>状态</th>
              <th>评审时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in projects" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.team }}</td>
              <td>{{ item.budget }}</td>
              <td><span :class="['status', item.statusClass]">{{ item.status }}</span></td>
              <td>{{ item.review }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" @close="closeModal" @confirm="closeModal">
    <template v-if="activeModal === 'idea'">
      <label class="modal-label">
        征集主题
        <input v-model="form.ideaTheme" placeholder="如：城市博物馆 IP 衍生" />
      </label>
      <label class="modal-label">
        提交截止
        <input v-model="form.ideaDeadline" type="date" />
      </label>
      <label class="modal-label">
        评选机制
        <select v-model="form.ideaRule">
          <option>线上初审 + 专家评审</option>
          <option>公开投票 + 评委复核</option>
          <option>分层评审</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'review'">
      <label class="modal-label">
        评审场次
        <input v-model="form.reviewSession" placeholder="请输入场次" />
      </label>
      <label class="modal-label">
        评审委员
        <input v-model="form.reviewers" placeholder="填写评审专家名单" />
      </label>
      <label class="modal-label">
        输出结论
        <textarea v-model="form.reviewNote" rows="3" placeholder="记录评审意见"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'budget'">
      <label class="modal-label">
        预算总额
        <input v-model="form.budgetTotal" placeholder="单位：元" />
      </label>
      <label class="modal-label">
        费用结构
        <input v-model="form.budgetStructure" placeholder="设计/制作/推广" />
      </label>
      <label class="modal-label">
        审批备注
        <textarea v-model="form.budgetNote" rows="3" placeholder="填写草案说明"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'risk'">
      <label class="modal-label">
        风险类型
        <select v-model="form.riskType">
          <option>资源冲突</option>
          <option>供应链延迟</option>
          <option>预算不足</option>
        </select>
      </label>
      <label class="modal-label">
        影响等级
        <select v-model="form.riskLevel">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
      <label class="modal-label">
        应对策略
        <textarea v-model="form.riskPlan" rows="3" placeholder="填写应对措施"></textarea>
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
      <p>章程重点已更新：目标清晰、范围聚焦、里程碑已锁定。</p>
      <p>建议新增跨部门协作流程与素材归档标准。</p>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalOpen = ref(false);
const activeModal = ref("idea");

const form = ref({
  ideaTheme: "非遗纹样城市礼盒",
  ideaDeadline: "",
  ideaRule: "线上初审 + 专家评审",
  reviewSession: "2024-05 评审会",
  reviewers: "馆长、品牌策划、市场专家",
  reviewNote: "",
  budgetTotal: "320000",
  budgetStructure: "设计 30% / 制作 50% / 推广 20%",
  budgetNote: "聚焦首批样机开发",
  riskType: "资源冲突",
  riskLevel: "中",
  riskPlan: "优先保障核心设计排期"
});

const progress = [
  { label: "创意征集", value: 68 },
  { label: "立项评审", value: 45 },
  { label: "预算草案", value: 58 },
  { label: "里程碑规划", value: 32 }
];

const projects = Array.from({ length: 20 }, (_, index) => {
  const id = `PS-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    name: `城市文化衍生项目 ${index + 1}`,
    team: ["策划中心", "品牌设计", "文博合作", "社区共创"][index % 4],
    budget: `￥${(18 + index) * 4},000`,
    status: ["待评审", "已通过", "修订中"][index % 3],
    statusClass: ["pending", "success", "warn"][index % 3],
    review: `2024-0${(index % 6) + 4}-1${index % 9}`
  };
});

const modalTitle = computed(() => {
  const map = {
    idea: "发起创意征集",
    review: "立项评审安排",
    budget: "预算草案提交",
    risk: "风险与资源预判",
    progress: "里程碑进度",
    info: "项目章程要点"
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

.chart-card h4 {
  margin: 0;
}

.list {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #4b5563;
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
