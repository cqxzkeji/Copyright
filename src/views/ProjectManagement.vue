<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openModal('create')">新建项目</button>
      <button class="ghost" @click="openModal('assign')">分配任务</button>
      <button class="ghost" @click="openModal('milestone')">里程碑更新</button>
      <button class="ghost" @click="openModal('progress')">进度快照</button>
    </div>

    <div class="panel">
      <header>
        <h3>项目生命周期管理</h3>
        <button class="ghost" @click="openModal('notice')">流程提示</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>项目编号</th>
            <th>项目名称</th>
            <th>阶段</th>
            <th>负责人</th>
            <th>交付日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in projects" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.phase }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.due }}</td>
            <td>
              <span class="status" :class="item.statusClass">{{ item.status }}</span>
            </td>
            <td>
              <button class="table-btn" @click="openRow(item)">任务详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="modalKey === 'create'" title="新建项目" @close="closeModal">
      <form class="modal-form">
        <label>
          项目名称
          <input v-model="createForm.name" type="text" placeholder="输入项目名称" />
        </label>
        <label>
          预计周期
          <select v-model="createForm.duration">
            <option>1-2 个月</option>
            <option>3-6 个月</option>
            <option>6-12 个月</option>
          </select>
        </label>
        <label>
          项目目标
          <textarea v-model="createForm.goal" rows="3" placeholder="描述项目目标"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">提交立项</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'assign'" title="任务分配" @close="closeModal">
      <form class="modal-form">
        <label>
          任务名称
          <input v-model="assignForm.task" type="text" placeholder="输入任务" />
        </label>
        <label>
          责任人
          <select v-model="assignForm.owner">
            <option>王立</option>
            <option>李娜</option>
            <option>赵峰</option>
            <option>孙琳</option>
          </select>
        </label>
        <label>
          截止日期
          <input v-model="assignForm.due" type="date" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">确认分配</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'milestone'" title="里程碑更新" @close="closeModal">
      <form class="modal-form">
        <label>
          里程碑名称
          <input v-model="milestoneForm.name" type="text" placeholder="输入里程碑" />
        </label>
        <label>
          完成比例
          <input v-model="milestoneForm.progress" type="number" min="0" max="100" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">更新里程碑</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'progress'" title="进度快照" @close="closeModal">
      <p>项目整体进度为 72%，关键任务按计划推进。</p>
      <div class="progress">
        <div class="progress-bar" style="width: 72%"></div>
      </div>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">已了解</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'notice'" title="流程提示" @close="closeModal">
      <ul class="tip-list">
        <li>需求调研完成后进入规划阶段。</li>
        <li>每周更新项目周报并同步风险。</li>
        <li>交付验收须完成文档归档。</li>
      </ul>
    </BaseModal>

    <BaseModal :open="modalKey === 'row'" title="任务详情" @close="closeModal">
      <div v-if="activeRow" class="detail">
        <p>项目名称：{{ activeRow.name }}</p>
        <p>当前阶段：{{ activeRow.phase }}</p>
        <p>负责人：{{ activeRow.owner }}</p>
        <p>预计交付：{{ activeRow.due }}</p>
        <p>状态说明：{{ activeRow.status }}</p>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modalKey = ref("");
const activeRow = ref(null);

const projects = Array.from({ length: 20 }, (_, index) => {
  const phases = ["立项", "规划", "执行", "收尾"];
  const statusOptions = ["正常", "关注", "延期"];
  const statusIndex = index % 3;
  return {
    id: `PM-${200 + index}`,
    name: `数字化升级 ${index + 1}`,
    phase: phases[index % phases.length],
    owner: ["王立", "李娜", "赵峰", "孙琳"][index % 4],
    due: `2024-${(index % 6) + 6}-15`,
    status: statusOptions[statusIndex],
    statusClass: statusIndex === 0 ? "ok" : statusIndex === 1 ? "warn" : "risk"
  };
});

const createForm = reactive({
  name: "",
  duration: "3-6 个月",
  goal: ""
});

const assignForm = reactive({
  task: "",
  owner: "王立",
  due: ""
});

const milestoneForm = reactive({
  name: "",
  progress: 50
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
}

.panel header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.ok {
  background: #dcfce7;
  color: #16a34a;
}

.status.warn {
  background: #fef9c3;
  color: #ca8a04;
}

.status.risk {
  background: #fee2e2;
  color: #dc2626;
}

.table-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: #e0ecff;
  color: #1d4ed8;
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
