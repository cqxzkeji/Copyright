<template>
  <div class="module">
    <section class="card-grid">
      <div class="metric-card">
        <p>甘特进度</p>
        <h2>64%</h2>
        <span>下个里程碑 7 天后</span>
      </div>
      <div class="metric-card">
        <p>工时填报</p>
        <h2>782h</h2>
        <span>本周补录 12h</span>
      </div>
      <div class="metric-card">
        <p>预算执行</p>
        <h2>￥860,000</h2>
        <span>执行率 71%</span>
      </div>
      <div class="metric-card">
        <p>质量问题</p>
        <h2>5</h2>
        <span>待闭环 2 项</span>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>进度成本与质量管控</h3>
          <p>里程碑、成本归集、变更与缺陷闭环</p>
        </div>
        <div class="button-group">
          <button class="primary" @click="openModal('gantt')">甘特跟踪</button>
          <button class="outline" @click="openModal('timesheet')">工时填报</button>
          <button class="outline" @click="openModal('budget')">成本归集</button>
          <button class="outline" @click="openModal('quality')">质量检查</button>
          <button class="ghost" @click="openModal('change')">变更管理</button>
        </div>
      </div>
      <div class="chart-area">
        <div class="timeline">
          <h4>里程碑计划</h4>
          <div class="timeline-item" v-for="item in milestones" :key="item.name">
            <div class="dot"></div>
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.date }} · {{ item.owner }}</p>
            </div>
          </div>
        </div>
        <div class="quality-card">
          <h4>质量检查清单</h4>
          <ul>
            <li v-for="item in qualityList" :key="item">{{ item }}</li>
          </ul>
          <button class="ghost" @click="openModal('progress')">查看闭环进度</button>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>问题与缺陷闭环</h3>
          <p>范围/需求/排期变更全程记录</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>问题描述</th>
              <th>类型</th>
              <th>责任人</th>
              <th>状态</th>
              <th>关闭时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in issues" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.owner }}</td>
              <td><span :class="['status', item.statusClass]">{{ item.status }}</span></td>
              <td>{{ item.close }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" @close="closeModal" @confirm="closeModal">
    <template v-if="activeModal === 'gantt'">
      <label class="modal-label">
        里程碑节点
        <input v-model="form.ganttNode" placeholder="如：样机交付" />
      </label>
      <label class="modal-label">
        计划日期
        <input v-model="form.ganttDate" type="date" />
      </label>
      <label class="modal-label">
        负责团队
        <input v-model="form.ganttOwner" placeholder="填写负责人" />
      </label>
    </template>
    <template v-else-if="activeModal === 'timesheet'">
      <label class="modal-label">
        工时项目
        <input v-model="form.timesheetTask" placeholder="填写任务" />
      </label>
      <label class="modal-label">
        本周工时
        <input v-model="form.timesheetHours" placeholder="小时" />
      </label>
      <label class="modal-label">
        备注
        <textarea v-model="form.timesheetNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'budget'">
      <label class="modal-label">
        成本项
        <input v-model="form.costItem" placeholder="制作/采购/运营" />
      </label>
      <label class="modal-label">
        实际支出
        <input v-model="form.costValue" placeholder="单位：元" />
      </label>
      <label class="modal-label">
        归集说明
        <textarea v-model="form.costNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'quality'">
      <label class="modal-label">
        检查批次
        <input v-model="form.qualityBatch" placeholder="如：首样检" />
      </label>
      <label class="modal-label">
        发现问题
        <textarea v-model="form.qualityIssue" rows="3"></textarea>
      </label>
      <label class="modal-label">
        复检日期
        <input v-model="form.qualityDate" type="date" />
      </label>
    </template>
    <template v-else-if="activeModal === 'change'">
      <label class="modal-label">
        变更类型
        <select v-model="form.changeType">
          <option>范围</option>
          <option>需求</option>
          <option>排期</option>
        </select>
      </label>
      <label class="modal-label">
        变更说明
        <textarea v-model="form.changeNote" rows="3"></textarea>
      </label>
      <label class="modal-label">
        审批人
        <input v-model="form.changeOwner" placeholder="填写审批人" />
      </label>
    </template>
    <template v-else>
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
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalOpen = ref(false);
const activeModal = ref("gantt");

const form = ref({
  ganttNode: "样机交付",
  ganttDate: "",
  ganttOwner: "制作组",
  timesheetTask: "展陈设计沟通",
  timesheetHours: "12",
  timesheetNote: "跨部门协调",
  costItem: "样机制作",
  costValue: "120000",
  costNote: "含材料采购",
  qualityBatch: "首样检",
  qualityIssue: "色差偏高",
  qualityDate: "",
  changeType: "排期",
  changeNote: "展陈搭建延后 3 天",
  changeOwner: "项目总监"
});

const milestones = [
  { name: "立项批准", date: "2024-04-08", owner: "策划中心" },
  { name: "样机评审", date: "2024-05-10", owner: "设计组" },
  { name: "生产排期", date: "2024-06-02", owner: "制作组" },
  { name: "首发发布", date: "2024-06-20", owner: "运营组" }
];

const qualityList = [
  "材质与工艺符合标准",
  "色彩与品牌规范一致",
  "结构安全与耐用性",
  "包装运输测试",
  "售后说明与追溯编码"
];

const progress = [
  { label: "范围变更审批", value: 55 },
  { label: "缺陷整改", value: 42 },
  { label: "成本归集", value: 70 },
  { label: "里程碑验收", value: 61 }
];

const issues = Array.from({ length: 20 }, (_, index) => {
  const id = `QC-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    name: `质量问题 ${index + 1}（包装/材质/排期）`,
    type: ["范围", "质量", "排期"][index % 3],
    owner: ["李茜", "黄昱", "周奕"][index % 3],
    status: ["处理中", "已关闭", "待确认"][index % 3],
    statusClass: ["warn", "success", "pending"][index % 3],
    close: `2024-0${(index % 6) + 4}-2${index % 8}`
  };
});

const modalTitle = computed(() => {
  const map = {
    gantt: "甘特/里程碑跟踪",
    timesheet: "工时填报",
    budget: "预算执行与成本归集",
    quality: "质量检查清单",
    change: "变更管理",
    progress: "闭环进度"
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

.timeline {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.timeline-item p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #4f46e5;
  margin-top: 6px;
}

.quality-card {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.quality-card ul {
  padding-left: 16px;
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
