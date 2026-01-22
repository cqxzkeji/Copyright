<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>设计结果管理与输出</h2>
        <p>支持版本管理、一键生成工程图与参数清单。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('version')">新建版本</button>
        <button class="ghost" @click="openModal('export')">生成工程图</button>
        <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
      </div>
    </header>

    <div class="layout">
      <div class="panel">
        <h3>成果预览</h3>
        <img :src="hero" alt="设计成果预览" />
        <ul class="list">
          <li>参数清单已同步到装配部门</li>
          <li>已完成 12 个版本迭代</li>
          <li>可导出 PDF/DWG/参数表</li>
        </ul>
        <button class="primary" @click="openModal('progress')">导出生产文件</button>
      </div>
      <div class="panel">
        <h3>版本列表</h3>
        <table>
          <thead>
            <tr>
              <th>版本</th>
              <th>创建人</th>
              <th>更新时间</th>
              <th>状态</th>
              <th>附件</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in versions" :key="item.version">
              <td>{{ item.version }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.file }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal
      :show="activeModal === 'version'"
      title="新建版本"
      width="560px"
      :onClose="closeModal"
    >
      <form class="modal-form" @submit.prevent="submitVersion">
        <label>
          版本号
          <input v-model="versionForm.code" required />
        </label>
        <div class="form-grid">
          <label>
            负责人
            <input v-model="versionForm.owner" />
          </label>
          <label>
            输出格式
            <select v-model="versionForm.format">
              <option>PDF + DWG</option>
              <option>STEP + BOM</option>
              <option>参数清单</option>
            </select>
          </label>
          <label>
            状态
            <select v-model="versionForm.status">
              <option>评审中</option>
              <option>已发布</option>
              <option>归档</option>
            </select>
          </label>
          <label>
            版本标签
            <input v-model="versionForm.tag" />
          </label>
        </div>
        <button class="primary" type="submit">保存版本</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'export'"
      title="生成工程图"
      width="520px"
      :onClose="closeModal"
    >
      <p>请选择导出内容与格式，系统将自动生成标准化设计文件。</p>
      <form class="modal-form" @submit.prevent="openModal('progress')">
        <label>
          导出内容
          <select>
            <option>工程图 + 参数清单</option>
            <option>装配图 + BOM</option>
            <option>评审报告</option>
          </select>
        </label>
        <label>
          文件格式
          <select>
            <option>PDF</option>
            <option>DWG</option>
            <option>PDF + DWG</option>
          </select>
        </label>
        <button class="primary" type="submit">开始生成</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'tip'"
      title="按钮提示信息"
      width="420px"
      :onClose="closeModal"
    >
      <p>设计结果支持版本追踪与一键复用，提高设计成果复用率。</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </AppModal>

    <AppModal
      :show="activeModal === 'progress'"
      title="输出进度"
      width="480px"
      :onClose="closeModal"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在生成工程图、参数清单与装配评审文件。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">完成后通知</button>
      </template>
    </AppModal>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";
import hero from "../assets/mudguard.svg";

const activeModal = ref("");
const progress = ref(0);

const versionForm = reactive({
  code: "V3.2",
  owner: "赵工",
  format: "PDF + DWG",
  status: "评审中",
  tag: "加强版",
});

const versions = Array.from({ length: 20 }, (_, index) => ({
  version: `V${3}.${index}`,
  owner: index % 2 === 0 ? "赵工" : "陈工",
  date: `2024-0${(index % 9) + 1}-15`,
  status: index % 3 === 0 ? "评审中" : index % 3 === 1 ? "已发布" : "归档",
  file: index % 2 === 0 ? "PDF" : "DWG",
}));

const openModal = (name) => {
  activeModal.value = name;
  if (name === "progress") {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 18;
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(timer);
      }
    }, 240);
  }
};

const closeModal = () => {
  activeModal.value = "";
};

const submitVersion = () => {
  activeModal.value = "tip";
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  margin-top: 6px;
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

.layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 18px;
}

.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
}

.panel h3 {
  margin-top: 0;
}

.list {
  padding-left: 18px;
  color: #475569;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  padding: 8px;
  text-align: left;
}

thead {
  background: #f8fafc;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
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

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
