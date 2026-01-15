<template>
  <div class="module">
    <section class="card-grid">
      <div class="metric-card">
        <p>交付物</p>
        <h2>18</h2>
        <span>待验收 4</span>
      </div>
      <div class="metric-card">
        <p>合同归档</p>
        <h2>26</h2>
        <span>待补录 2</span>
      </div>
      <div class="metric-card">
        <p>渠道排期</p>
        <h2>11</h2>
        <span>本周投放 3 场</span>
      </div>
      <div class="metric-card">
        <p>运营回收</p>
        <h2>￥320,000</h2>
        <span>数据回传 88%</span>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>发布交付与渠道运营</h3>
          <p>交付物验收、授权材料归档、多渠道排期</p>
        </div>
        <div class="button-group">
          <button class="primary" @click="openModal('deliver')">交付验收</button>
          <button class="outline" @click="openModal('archive')">合同归档</button>
          <button class="outline" @click="openModal('plan')">发布计划</button>
          <button class="outline" @click="openModal('material')">物料投放</button>
          <button class="ghost" @click="openModal('progress')">运营进度</button>
        </div>
      </div>
      <div class="channel-grid">
        <div class="channel-card" v-for="channel in channels" :key="channel.name">
          <h4>{{ channel.name }}</h4>
          <p>{{ channel.desc }}</p>
          <div class="chip">排期 {{ channel.plan }}</div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>交付与运营清单</h3>
          <p>多渠道发布计划、排期与物料投放</p>
        </div>
        <button class="ghost" @click="openModal('tips')">按钮提示</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>交付物</th>
              <th>渠道</th>
              <th>排期</th>
              <th>负责人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in deliveries" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.channel }}</td>
              <td>{{ item.schedule }}</td>
              <td>{{ item.owner }}</td>
              <td><span :class="['status', item.statusClass]">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <Modal :open="modalOpen" :title="modalTitle" @close="closeModal" @confirm="closeModal">
    <template v-if="activeModal === 'deliver'">
      <label class="modal-label">
        交付物名称
        <input v-model="form.deliverName" placeholder="如：展览交互设备" />
      </label>
      <label class="modal-label">
        验收结论
        <select v-model="form.deliverResult">
          <option>通过</option>
          <option>退回整改</option>
        </select>
      </label>
      <label class="modal-label">
        备注
        <textarea v-model="form.deliverNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'archive'">
      <label class="modal-label">
        合同编号
        <input v-model="form.archiveId" placeholder="合同编号" />
      </label>
      <label class="modal-label">
        授权类型
        <select v-model="form.archiveType">
          <option>版权授权</option>
          <option>联名合作</option>
          <option>渠道合作</option>
        </select>
      </label>
      <label class="modal-label">
        归档说明
        <textarea v-model="form.archiveNote" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'plan'">
      <label class="modal-label">
        发布渠道
        <input v-model="form.planChannel" placeholder="如：线下展览" />
      </label>
      <label class="modal-label">
        排期时间
        <input v-model="form.planDate" type="date" />
      </label>
      <label class="modal-label">
        运营目标
        <textarea v-model="form.planGoal" rows="3"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'material'">
      <label class="modal-label">
        物料名称
        <input v-model="form.materialName" placeholder="海报/短视频/物料包" />
      </label>
      <label class="modal-label">
        投放渠道
        <input v-model="form.materialChannel" placeholder="电商/短视频" />
      </label>
      <label class="modal-label">
        投放说明
        <textarea v-model="form.materialNote" rows="3"></textarea>
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
      <p>提示：所有按钮均支持生成对应的交付/运营记录，并同步到归档。</p>
      <p>请确保物料投放前完成授权材料归档。</p>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalOpen = ref(false);
const activeModal = ref("deliver");

const form = ref({
  deliverName: "展览互动装置",
  deliverResult: "通过",
  deliverNote: "设备运行稳定",
  archiveId: "HT-2024-09",
  archiveType: "版权授权",
  archiveNote: "已上传扫描件",
  planChannel: "线下展览",
  planDate: "",
  planGoal: "提升到访体验",
  materialName: "品牌海报",
  materialChannel: "短视频",
  materialNote: "首发阶段投放"
});

const channels = [
  { name: "线下展览", desc: "主展厅与快闪展同步", plan: "6 场" },
  { name: "电商平台", desc: "IP 衍生品上架", plan: "3 期" },
  { name: "短视频", desc: "达人种草+官方发布", plan: "12 条" },
  { name: "城市活动", desc: "社区互动与主题市集", plan: "4 场" }
];

const progress = [
  { label: "交付物验收", value: 66 },
  { label: "合同归档", value: 54 },
  { label: "渠道排期", value: 78 },
  { label: "运营数据回收", value: 42 }
];

const deliveries = Array.from({ length: 20 }, (_, index) => {
  const id = `DL-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    name: `交付物 ${index + 1}`,
    channel: ["展览", "电商", "短视频", "线下活动"][index % 4],
    schedule: `2024-0${(index % 6) + 4}-2${index % 9}`,
    owner: ["陈翊", "唐思", "宋夏"][index % 3],
    status: ["准备中", "投放中", "已完成"][index % 3],
    statusClass: ["pending", "warn", "success"][index % 3]
  };
});

const modalTitle = computed(() => {
  const map = {
    deliver: "交付物验收",
    archive: "合同/授权归档",
    plan: "多渠道发布计划",
    material: "物料投放",
    progress: "运营进度",
    tips: "按钮提示"
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

.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.channel-card {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.channel-card h4 {
  margin: 0;
}

.channel-card p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.chip {
  background: #eef2ff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  width: fit-content;
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
