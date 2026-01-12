<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openModal('identify')">风险识别</button>
      <button class="ghost" @click="openModal('strategy')">应对策略</button>
      <button class="ghost" @click="openModal('monitor')">监控更新</button>
      <button class="ghost" @click="openModal('guide')">风险指引</button>
    </div>

    <div class="panel">
      <header>
        <h3>风险清单</h3>
        <button class="ghost" @click="openModal('report')">生成报告</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>风险事件</th>
            <th>影响范围</th>
            <th>责任人</th>
            <th>等级</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in risks" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.scope }}</td>
            <td>{{ item.owner }}</td>
            <td>
              <span class="level" :class="item.levelClass">{{ item.level }}</span>
            </td>
            <td>{{ item.status }}</td>
            <td>
              <button class="table-btn" @click="openRow(item)">查看措施</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="panel grid">
      <div>
        <h3>风险等级分布</h3>
        <div class="chart">
          <div v-for="item in distribution" :key="item.label" class="bar-row">
            <span>{{ item.label }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div>
        <h3>应对执行进度</h3>
        <div class="progress">
          <div class="progress-bar" style="width: 64%"></div>
        </div>
        <p class="hint">已完成 64%，仍有 8 项需跟进。</p>
        <button class="ghost" @click="openModal('progress')">查看详情</button>
      </div>
    </div>

    <BaseModal :open="modalKey === 'identify'" title="风险识别" @close="closeModal">
      <form class="modal-form">
        <label>
          风险事件
          <input v-model="identifyForm.name" type="text" placeholder="输入风险事件" />
        </label>
        <label>
          影响范围
          <input v-model="identifyForm.scope" type="text" placeholder="输入影响范围" />
        </label>
        <label>
          等级
          <select v-model="identifyForm.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">提交识别</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'strategy'" title="应对策略" @close="closeModal">
      <form class="modal-form">
        <label>
          策略名称
          <input v-model="strategyForm.name" type="text" placeholder="输入策略" />
        </label>
        <label>
          负责人
          <input v-model="strategyForm.owner" type="text" placeholder="输入负责人" />
        </label>
        <label>
          说明
          <textarea v-model="strategyForm.detail" rows="3"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">保存策略</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'monitor'" title="监控更新" @close="closeModal">
      <p>监控已同步到最新风险指标，已自动更新 12 项记录。</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'guide'" title="风险指引" @close="closeModal">
      <ul class="tip-list">
        <li>重大风险需 24 小时内更新措施。</li>
        <li>每周风险例会复盘与调整。</li>
        <li>跨部门风险由项目经理牵头。</li>
      </ul>
    </BaseModal>

    <BaseModal :open="modalKey === 'report'" title="风险报告" @close="closeModal">
      <p>报告将包括风险清单、等级分布、策略执行情况。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">生成报告</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'progress'" title="执行进度" @close="closeModal">
      <p>策略执行已完成 64%，需要重点跟进风险 3 项。</p>
    </BaseModal>

    <BaseModal :open="modalKey === 'row'" title="措施详情" @close="closeModal">
      <div v-if="activeRow" class="detail">
        <p>风险事件：{{ activeRow.name }}</p>
        <p>影响范围：{{ activeRow.scope }}</p>
        <p>责任人：{{ activeRow.owner }}</p>
        <p>当前策略：{{ activeRow.strategy }}</p>
        <p>状态：{{ activeRow.status }}</p>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modalKey = ref("");
const activeRow = ref(null);

const risks = Array.from({ length: 20 }, (_, index) => {
  const levelOptions = ["高", "中", "低"];
  const level = levelOptions[index % 3];
  return {
    id: `RK-${80 + index}`,
    name: `风险事件 ${index + 1}`,
    scope: ["交付", "预算", "合规", "质量"][index % 4],
    owner: ["王立", "李娜", "赵峰", "孙琳"][index % 4],
    level,
    levelClass: level === "高" ? "high" : level === "中" ? "mid" : "low",
    status: index % 3 === 0 ? "处理中" : "待确认",
    strategy: level === "高" ? "加强监控" : "按计划缓解"
  };
});

const distribution = [
  { label: "高", value: 32 },
  { label: "中", value: 46 },
  { label: "低", value: 22 }
];

const identifyForm = reactive({
  name: "",
  scope: "",
  level: "中"
});

const strategyForm = reactive({
  name: "",
  owner: "",
  detail: ""
});

const openModal = (key) => {
  modalKey.value = key;
};

const closeModal = () => {
  modalKey.value = "";
  activeRow.value = null;
};

const openRow = (row) => {
  activeRow.value = row;
  modalKey.value = "row";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  padding: 10px 18px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
}

.ghost {
  padding: 10px 18px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #334155;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  overflow-x: auto;
  display: grid;
  gap: 16px;
}

.panel header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.panel th,
.panel td {
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.level {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.level.high {
  background: #fee2e2;
  color: #dc2626;
}

.level.mid {
  background: #fef9c3;
  color: #ca8a04;
}

.level.low {
  background: #dcfce7;
  color: #16a34a;
}

.table-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: #e0ecff;
  color: #1d4ed8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.chart {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 40px 1fr 50px;
  gap: 12px;
  align-items: center;
}

.bar {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.hint {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 12px;
}

.modal-form {
  display: grid;
  gap: 14px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.tip-list {
  display: grid;
  gap: 10px;
  color: #475569;
  font-size: 14px;
  padding-left: 16px;
}

.detail {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 14px;
}
</style>
