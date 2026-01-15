<template>
  <div class="module">
    <section class="card-grid">
      <div class="metric-card">
        <p>内容资产</p>
        <h2>214</h2>
        <span>本周新增 32</span>
      </div>
      <div class="metric-card">
        <p>版本迭代</p>
        <h2>48</h2>
        <span>待评审 5</span>
      </div>
      <div class="metric-card">
        <p>协作团队</p>
        <h2>9</h2>
        <span>跨团队沟通 18 次</span>
      </div>
      <div class="metric-card">
        <p>任务看板</p>
        <h2>72</h2>
        <span>验收中 12</span>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>内容生产协同</h3>
          <p>脚本、设计稿、视频等资产统一管理</p>
        </div>
        <div class="button-group">
          <button class="primary" @click="openModal('asset')">新增资产</button>
          <button class="outline" @click="openModal('review')">在线评审</button>
          <button class="outline" @click="openModal('task')">更新任务</button>
          <button class="outline" @click="openModal('chat')">沟通记录</button>
          <button class="ghost" @click="openModal('progress')">迭代进度</button>
        </div>
      </div>
      <div class="board">
        <div class="board-column">
          <h4>待办</h4>
          <div class="board-item" v-for="item in board.todo" :key="item">{{ item }}</div>
        </div>
        <div class="board-column">
          <h4>进行中</h4>
          <div class="board-item" v-for="item in board.doing" :key="item">{{ item }}</div>
        </div>
        <div class="board-column">
          <h4>验收</h4>
          <div class="board-item" v-for="item in board.review" :key="item">{{ item }}</div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>资产版本列表</h3>
          <p>支持多版本、在线评审批注与状态追踪</p>
        </div>
        <button class="ghost" @click="openModal('tips')">操作提示</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>资产名称</th>
              <th>类型</th>
              <th>负责人</th>
              <th>版本</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in assets" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.version }}</td>
              <td><span :class="['status', item.statusClass]">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" @close="closeModal" @confirm="closeModal">
    <template v-if="activeModal === 'asset'">
      <label class="modal-label">
        资产名称
        <input v-model="form.assetName" placeholder="如：城市礼盒外包装" />
      </label>
      <label class="modal-label">
        资产类型
        <select v-model="form.assetType">
          <option>设计稿</option>
          <option>脚本文案</option>
          <option>视频素材</option>
        </select>
      </label>
      <label class="modal-label">
        协作成员
        <input v-model="form.assetOwner" placeholder="负责人/协作者" />
      </label>
    </template>
    <template v-else-if="activeModal === 'review'">
      <label class="modal-label">
        评审批注
        <textarea v-model="form.reviewNote" rows="3" placeholder="填写评审批注"></textarea>
      </label>
      <label class="modal-label">
        评审结论
        <select v-model="form.reviewResult">
          <option>通过</option>
          <option>退回修改</option>
          <option>暂停</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'task'">
      <label class="modal-label">
        看板卡片
        <input v-model="form.taskName" placeholder="任务名称" />
      </label>
      <label class="modal-label">
        当前阶段
        <select v-model="form.taskStage">
          <option>待办</option>
          <option>进行中</option>
          <option>验收</option>
        </select>
      </label>
      <label class="modal-label">
        计划完成
        <input v-model="form.taskDeadline" type="date" />
      </label>
    </template>
    <template v-else-if="activeModal === 'chat'">
      <label class="modal-label">
        会议主题
        <input v-model="form.chatTopic" placeholder="跨团队协作会议" />
      </label>
      <label class="modal-label">
        关键记录
        <textarea v-model="form.chatNote" rows="3" placeholder="记录沟通结论"></textarea>
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
      <p>提示：双击资产可查看版本差异，评审批注将同步到沟通记录。</p>
      <p>建议在每次迭代后上传封面图，方便快速检索。</p>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalOpen = ref(false);
const activeModal = ref("asset");

const form = ref({
  assetName: "城市博物馆主视觉",
  assetType: "设计稿",
  assetOwner: "视觉组",
  reviewNote: "色彩需更符合馆藏风格",
  reviewResult: "退回修改",
  taskName: "礼盒开箱脚本",
  taskStage: "进行中",
  taskDeadline: "",
  chatTopic: "跨团队协作会议",
  chatNote: "确定视频剪辑节奏与配音风格"
});

const board = {
  todo: ["文案脚本 V1", "包装结构草图", "短视频脚本"],
  doing: ["主视觉设计", "展陈动线设计", "产品渲染"],
  review: ["视频剪辑 V2", "字体规范", "周边图案确认"]
};

const progress = [
  { label: "脚本输出", value: 74 },
  { label: "设计稿迭代", value: 58 },
  { label: "视频制作", value: 46 },
  { label: "评审批注", value: 69 }
];

const assets = Array.from({ length: 20 }, (_, index) => {
  const id = `AS-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    name: `创意资产 ${index + 1}`,
    type: ["脚本", "设计稿", "视频", "文案"][index % 4],
    owner: ["视觉组", "文案组", "视频组"][index % 3],
    version: `V${(index % 5) + 1}.0`,
    status: ["待评审", "进行中", "已归档"][index % 3],
    statusClass: ["pending", "warn", "success"][index % 3]
  };
});

const modalTitle = computed(() => {
  const map = {
    asset: "新增内容资产",
    review: "在线评审批注",
    task: "任务看板更新",
    chat: "跨团队沟通记录",
    progress: "版本迭代进度",
    tips: "操作提示"
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

.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.board-column {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.board-column h4 {
  margin: 0;
  font-size: 14px;
}

.board-item {
  background: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.06);
  font-size: 13px;
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
