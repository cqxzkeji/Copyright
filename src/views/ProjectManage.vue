<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title">项目概览</div>
      <div class="overview">
        <div>
          <div class="overview-value">12</div>
          <div class="overview-label">单位工程</div>
        </div>
        <div>
          <div class="overview-value">68</div>
          <div class="overview-label">分部工程</div>
        </div>
        <div>
          <div class="overview-value">245</div>
          <div class="overview-label">分项工程</div>
        </div>
      </div>
      <div class="overview-actions">
        <button class="btn" @click="openModal('新建项目档案', 'create')">新建项目</button>
        <button class="btn secondary" @click="openModal('批量导入项目', 'import')">批量导入</button>
        <button class="btn light" @click="openModal('项目档案归档进度', 'progress')">进度详情</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">项目影像</div>
      <div class="image-grid">
        <img
          src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80"
          alt="项目施工现场"
        />
        <img
          src="https://images.unsplash.com/photo-1503387837-b154d5074bd2?auto=format&fit=crop&w=900&q=80"
          alt="智慧工地"
        />
      </div>
      <div class="hint">图片用于展示单位工程现场巡检影像。</div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <div class="section-title">验收项目清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>项目编号</th>
          <th>单位工程</th>
          <th>施工单位</th>
          <th>监理单位</th>
          <th>验收批次</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.code">
          <td>{{ project.code }}</td>
          <td>{{ project.name }}</td>
          <td>{{ project.contractor }}</td>
          <td>{{ project.supervisor }}</td>
          <td>{{ project.batch }}</td>
          <td><span class="badge">{{ project.status }}</span></td>
          <td class="actions">
            <button class="btn light" @click="openModal('编辑项目档案', 'edit', project)">编辑</button>
            <button class="btn" @click="openModal('查看验收批次', 'batch', project)">批次</button>
            <button class="btn secondary" @click="openModal('导出验收清单', 'export', project)">导出</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <AppModal :open="modalOpen" :title="modalTitle" @close="modalOpen = false" @confirm="handleConfirm">
    <template v-if="modalType === 'progress'">
      <div class="notice">当前项目资料归档完成率为 72%，预计 3 天内完成归档。</div>
      <div class="progress-track">
        <div class="progress-value" style="width: 72%"></div>
      </div>
    </template>
    <template v-else-if="modalType === 'export'">
      <div class="notice">导出 {{ activeProject?.name }} 的验收清单，格式选择：</div>
      <div class="form-row">
        <label><input type="radio" checked /> PDF</label>
        <label><input type="radio" /> Excel</label>
      </div>
    </template>
    <template v-else>
      <div class="form-grid">
        <label>
          项目名称
          <input :value="activeProject?.name || ''" placeholder="请输入单位工程名称" />
        </label>
        <label>
          验收批次
          <input :value="activeProject?.batch || ''" placeholder="例如：2024-08" />
        </label>
        <label>
          施工单位
          <input :value="activeProject?.contractor || ''" placeholder="施工单位" />
        </label>
        <label>
          监理单位
          <input :value="activeProject?.supervisor || ''" placeholder="监理单位" />
        </label>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalOpen = ref(false);
const modalTitle = ref("");
const modalType = ref("create");
const activeProject = ref(null);

const projects = Array.from({ length: 20 }, (_, index) => ({
  code: `XM-${String(index + 1).padStart(3, "0")}`,
  name: `智慧综合体 ${index + 1} 号楼`,
  contractor: "中建一局",
  supervisor: "华南监理公司",
  batch: `2024-${String((index % 6) + 1).padStart(2, "0")}`,
  status: index % 3 === 0 ? "资料待补充" : "资料齐全"
}));

const openModal = (title, type, project = null) => {
  modalTitle.value = title;
  modalType.value = type;
  activeProject.value = project;
  modalOpen.value = true;
};

const handleConfirm = () => {
  modalOpen.value = false;
};
</script>

<style scoped>
.overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.overview-value {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
}

.overview-label {
  font-size: 12px;
  color: #94a3b8;
}

.overview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.image-grid img {
  width: 100%;
  border-radius: 12px;
  height: 160px;
  object-fit: cover;
}

.hint {
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 18px;
  align-items: center;
}
</style>
