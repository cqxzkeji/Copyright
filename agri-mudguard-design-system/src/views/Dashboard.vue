<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>系统概览</h2>
        <p>聚合挡泥板组合设计流程，快速进入各功能模块。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('project')">新建设计项目</button>
        <button class="ghost" @click="openModal('sync')">数据同步</button>
        <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>今日任务</h3>
        <p class="metric">6 项</p>
        <p class="desc">待完成组合方案配置与仿真验证。</p>
      </div>
      <div class="card">
        <h3>材料库</h3>
        <p class="metric">18 类</p>
        <p class="desc">包含工程塑料、橡胶与复合材料。</p>
      </div>
      <div class="card">
        <h3>工况模型</h3>
        <p class="metric">12 套</p>
        <p class="desc">覆盖田间、泥泞、高速等场景。</p>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <h3>平台示意图</h3>
        <img :src="hero" alt="系统示意图" />
        <p class="note">可在此快速进入参数化建模与组合装配功能。</p>
      </div>
      <div class="panel">
        <h3>近期设计记录</h3>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>挡泥板类型</th>
              <th>材料</th>
              <th>负责人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.material }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal
      :show="activeModal === 'project'"
      title="新建设计项目"
      width="520px"
      :onClose="closeModal"
    >
      <form class="modal-form" @submit.prevent="submitProject">
        <label>
          项目名称
          <input v-model="projectForm.name" placeholder="例如：中型农机挡泥板" required />
        </label>
        <label>
          计划周期
          <select v-model="projectForm.period">
            <option>2 周</option>
            <option>4 周</option>
            <option>8 周</option>
          </select>
        </label>
        <label>
          备注说明
          <textarea v-model="projectForm.note" rows="3" placeholder="输入项目目标与需求"></textarea>
        </label>
        <button class="primary" type="submit">确认创建</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'sync'"
      title="数据同步进度"
      width="480px"
      :onClose="closeModal"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在同步材料库、组合方案与仿真工况数据。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
      </template>
    </AppModal>

    <AppModal
      :show="activeModal === 'tip'"
      title="按钮提示信息"
      width="420px"
      :onClose="closeModal"
    >
      <p>所有按钮均通过弹窗反馈操作结果，支持表单提交与进度展示。</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">知道了</button>
      </template>
    </AppModal>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import AppModal from "../components/AppModal.vue";
import hero from "../assets/mudguard.svg";

const activeModal = ref("");
const progress = ref(0);
const projectForm = reactive({
  name: "",
  period: "4 周",
  note: "",
});

const records = Array.from({ length: 20 }, (_, index) => ({
  id: `MD-${100 + index}`,
  type: index % 2 === 0 ? "前轮挡泥板" : "后轮挡泥板",
  material: index % 3 === 0 ? "TPU复合" : "PA6工程塑料",
  owner: index % 2 === 0 ? "李工" : "王工",
  status: index % 3 === 0 ? "仿真中" : "已归档",
}));

const openModal = (name) => {
  activeModal.value = name;
  if (name === "sync") {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 12;
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(timer);
      }
    }, 260);
  }
};

const closeModal = () => {
  activeModal.value = "";
};

const submitProject = () => {
  activeModal.value = "tip";
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: #f1f5f9;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e5e7eb;
}

.metric {
  font-size: 24px;
  font-weight: 700;
  margin: 10px 0 6px;
}

.desc {
  color: #64748b;
  margin: 0;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 18px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 18px;
}

.panel h3 {
  margin-top: 0;
}

.note {
  margin-top: 12px;
  color: #6b7280;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f8fafc;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.progress {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

@media (max-width: 1000px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
