<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>参数建模</h3>
        <p>录入支撑架尺寸、材料与载荷工况，形成基础设计模型。</p>
      </div>
      <div class="actions">
        <button @click="openForm">新增参数</button>
        <button class="ghost" @click="openImport">导入模板</button>
        <button class="ghost" @click="openTip">建模提示</button>
      </div>
    </div>

    <div class="module-grid">
      <div class="card">
        <h4>支撑架示意图</h4>
        <svg viewBox="0 0 640 220" class="diagram" role="img" aria-label="支撑架结构示意图">
          <rect x="30" y="40" width="180" height="120" rx="18" fill="#e8f2ff" />
          <rect x="250" y="60" width="160" height="90" rx="12" fill="#d8f0e6" />
          <rect x="440" y="30" width="170" height="150" rx="18" fill="#fef3da" />
          <path d="M120 40 L120 20 L520 20" stroke="#1b7cff" stroke-width="4" fill="none" />
          <path d="M120 160 L120 190 L520 190" stroke="#32c18c" stroke-width="4" fill="none" />
          <circle cx="520" cy="20" r="6" fill="#1b7cff" />
          <circle cx="520" cy="190" r="6" fill="#32c18c" />
          <text x="60" y="110" font-size="14" fill="#1d2a3a">主支撑架</text>
          <text x="270" y="110" font-size="14" fill="#1d2a3a">连接梁</text>
          <text x="455" y="120" font-size="14" fill="#1d2a3a">动力接口</text>
        </svg>
        <div class="metrics">
          <div>
            <span>当前材料</span>
            <strong>Q355B</strong>
          </div>
          <div>
            <span>载荷等级</span>
            <strong>III级</strong>
          </div>
          <div>
            <span>模型状态</span>
            <strong>待校核</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>参数列表</h4>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>参数名称</th>
              <th>数值</th>
              <th>单位</th>
              <th>工况</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in params" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ item.condition }}</td>
              <td>{{ item.status }}</td>
              <td>
                <button class="text" @click="openRow(item)">查看</button>
                <button class="text" @click="openEdit(item)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p v-if="modal.message">{{ modal.message }}</p>
        <form v-if="modal.type === 'form'" @submit.prevent="submitForm">
          <label>
            参数名称
            <input v-model="modalForm.name" required />
          </label>
          <label>
            数值
            <input v-model="modalForm.value" type="number" required />
          </label>
          <label>
            单位
            <input v-model="modalForm.unit" required />
          </label>
          <label>
            工况
            <input v-model="modalForm.condition" required />
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="closeModal">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
        <div v-if="modal.type === 'progress'" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
          <span>导入进度 {{ modal.progress }}%</span>
        </div>
        <div v-if="modal.type === 'info'" class="modal-actions">
          <button @click="closeModal">知道了</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue";

const params = reactive([
  { id: "P-01", name: "主梁长度", value: 1280, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-02", name: "主梁宽度", value: 320, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-03", name: "支撑臂厚度", value: 18, unit: "mm", condition: "提升工况", status: "已录入" },
  { id: "P-04", name: "连接板长度", value: 260, unit: "mm", condition: "冲击工况", status: "已录入" },
  { id: "P-05", name: "连接板厚度", value: 14, unit: "mm", condition: "冲击工况", status: "已录入" },
  { id: "P-06", name: "横梁间距", value: 460, unit: "mm", condition: "运输工况", status: "已录入" },
  { id: "P-07", name: "焊缝高度", value: 8, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-08", name: "焊缝长度", value: 180, unit: "mm", condition: "提升工况", status: "已录入" },
  { id: "P-09", name: "支撑点间距", value: 920, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-10", name: "吊装孔直径", value: 24, unit: "mm", condition: "提升工况", status: "已录入" },
  { id: "P-11", name: "轴承座间距", value: 380, unit: "mm", condition: "运输工况", status: "已录入" },
  { id: "P-12", name: "侧板高度", value: 210, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-13", name: "侧板厚度", value: 12, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-14", name: "减震垫厚度", value: 16, unit: "mm", condition: "冲击工况", status: "已录入" },
  { id: "P-15", name: "连接销直径", value: 28, unit: "mm", condition: "提升工况", status: "已录入" },
  { id: "P-16", name: "支撑臂长度", value: 540, unit: "mm", condition: "提升工况", status: "已录入" },
  { id: "P-17", name: "支撑臂宽度", value: 140, unit: "mm", condition: "提升工况", status: "已录入" },
  { id: "P-18", name: "动力接口高度", value: 260, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-19", name: "防护板厚度", value: 6, unit: "mm", condition: "运输工况", status: "已录入" },
  { id: "P-20", name: "底座宽度", value: 520, unit: "mm", condition: "额定工况", status: "已录入" },
  { id: "P-21", name: "底座长度", value: 660, unit: "mm", condition: "额定工况", status: "已录入" }
]);

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "info",
  progress: 0
});

const modalForm = reactive({
  name: "",
  value: "",
  unit: "",
  condition: ""
});

const openForm = () => {
  modal.visible = true;
  modal.title = "新增参数";
  modal.message = "请输入新的结构参数，保存后自动加入模型。";
  modal.type = "form";
};

const openImport = () => {
  modal.visible = true;
  modal.title = "导入参数模板";
  modal.message = "系统正在导入CAD模板数据。";
  modal.type = "progress";
  modal.progress = 0;
  const timer = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer);
      modal.message = "导入完成，已同步最新模板。";
      modal.type = "info";
      return;
    }
    modal.progress += 25;
  }, 200);
};

const openTip = () => {
  modal.visible = true;
  modal.title = "建模提示";
  modal.message = "建议优先录入主梁与连接梁关键尺寸，再补充焊缝与接口参数。";
  modal.type = "info";
};

const openRow = (item) => {
  modal.visible = true;
  modal.title = "参数详情";
  modal.message = `${item.name}：${item.value}${item.unit}，工况 ${item.condition}。`;
  modal.type = "info";
};

const openEdit = (item) => {
  modal.visible = true;
  modal.title = "编辑参数";
  modal.message = `正在编辑 ${item.name}，建议保持尺寸在工艺允许范围内。`;
  modal.type = "info";
};

const submitForm = () => {
  params.unshift({
    id: `P-${String(params.length + 1).padStart(2, "0")}`,
    name: modalForm.name,
    value: modalForm.value,
    unit: modalForm.unit,
    condition: modalForm.condition,
    status: "新增"
  });
  modalForm.name = "";
  modalForm.value = "";
  modalForm.unit = "";
  modalForm.condition = "";
  modal.visible = false;
};

const closeModal = () => {
  modal.visible = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 24px;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.module-header h3 {
  margin: 0 0 6px;
  font-size: 18px;
}

.module-header p {
  margin: 0;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

button.ghost {
  background: #f1f5ff;
  color: var(--primary);
}

button.text {
  background: transparent;
  color: var(--primary);
  padding: 0 8px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 16px;
}

.diagram {
  width: 100%;
  border-radius: 12px;
  background: #f6f9ff;
  padding: 10px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.metrics strong {
  display: block;
  color: var(--text);
  font-size: 16px;
  margin-top: 6px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

th {
  background: #f3f6ff;
  color: var(--muted);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 25, 40, 0.4);
  display: grid;
  place-items: center;
  z-index: 20;
  padding: 20px;
}

.modal {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  display: grid;
  gap: 14px;
}

.modal p {
  margin: 0;
  color: var(--muted);
}

form {
  display: grid;
  gap: 12px;
}

form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

form input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.progress {
  display: grid;
  gap: 8px;
}

.progress .bar {
  height: 8px;
  border-radius: 999px;
  background: var(--accent);
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
