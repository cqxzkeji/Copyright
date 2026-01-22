<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>仿真验证</h3>
        <p>通过仿真结果直观展示应力、变形等关键指标。</p>
      </div>
      <div class="actions">
        <button @click="runSim">运行仿真</button>
        <button class="ghost" @click="openBoundary">导入边界条件</button>
        <button class="ghost" @click="openTip">查看提示</button>
      </div>
    </div>

    <div class="module-grid">
      <div class="card">
        <h4>仿真结果云图</h4>
        <svg viewBox="0 0 640 220" class="diagram" role="img" aria-label="仿真结果云图">
          <defs>
            <radialGradient id="sim" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffb86b" />
              <stop offset="60%" stop-color="#ffd36b" />
              <stop offset="100%" stop-color="#32c18c" />
            </radialGradient>
          </defs>
          <rect x="30" y="30" width="580" height="160" rx="24" fill="url(#sim)" opacity="0.25" />
          <path d="M90 160 L200 90 L310 130 L420 70 L540 120" stroke="#1b7cff" stroke-width="4" fill="none" />
          <circle cx="310" cy="130" r="8" fill="#ff6b6b" />
          <text x="330" y="134" font-size="13" fill="#1d2a3a">最大变形</text>
        </svg>
        <div class="metrics">
          <div>
            <span>最大变形</span>
            <strong>4.6 mm</strong>
          </div>
          <div>
            <span>最大应力</span>
            <strong>175 MPa</strong>
          </div>
          <div>
            <span>收敛步数</span>
            <strong>42</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>节点监测数据</h4>
        <table>
          <thead>
            <tr>
              <th>节点</th>
              <th>位置</th>
              <th>应力</th>
              <th>变形</th>
              <th>安全系数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="node in nodes" :key="node.id">
              <td>{{ node.id }}</td>
              <td>{{ node.position }}</td>
              <td>{{ node.stress }}</td>
              <td>{{ node.deformation }}</td>
              <td>{{ node.factor }}</td>
              <td>
                <button class="text" @click="openDetail(node)">详情</button>
                <button class="text" @click="openSnapshot(node)">快照</button>
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
        <form v-if="modal.type === 'form'" @submit.prevent="submitBoundary">
          <label>
            约束位置
            <input v-model="boundaryForm.position" required />
          </label>
          <label>
            载荷方向
            <input v-model="boundaryForm.direction" required />
          </label>
          <label>
            载荷大小
            <input v-model="boundaryForm.load" required />
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="closeModal">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
        <div v-if="modal.type === 'progress'" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
          <span>仿真进度 {{ modal.progress }}%</span>
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

const nodes = reactive([
  { id: "N-01", position: "主梁前端", stress: "160 MPa", deformation: "3.8 mm", factor: "2.1" },
  { id: "N-02", position: "主梁中部", stress: "172 MPa", deformation: "4.2 mm", factor: "1.9" },
  { id: "N-03", position: "主梁尾端", stress: "150 MPa", deformation: "3.5 mm", factor: "2.2" },
  { id: "N-04", position: "连接梁左", stress: "165 MPa", deformation: "4.0 mm", factor: "2.0" },
  { id: "N-05", position: "连接梁右", stress: "170 MPa", deformation: "4.1 mm", factor: "1.9" },
  { id: "N-06", position: "支撑臂 A", stress: "158 MPa", deformation: "3.7 mm", factor: "2.1" },
  { id: "N-07", position: "支撑臂 B", stress: "162 MPa", deformation: "3.9 mm", factor: "2.0" },
  { id: "N-08", position: "动力接口", stress: "175 MPa", deformation: "4.6 mm", factor: "1.8" },
  { id: "N-09", position: "底座左", stress: "148 MPa", deformation: "3.4 mm", factor: "2.3" },
  { id: "N-10", position: "底座右", stress: "150 MPa", deformation: "3.5 mm", factor: "2.2" },
  { id: "N-11", position: "焊缝 A", stress: "167 MPa", deformation: "4.0 mm", factor: "2.0" },
  { id: "N-12", position: "焊缝 B", stress: "169 MPa", deformation: "4.1 mm", factor: "1.9" },
  { id: "N-13", position: "侧板上", stress: "154 MPa", deformation: "3.6 mm", factor: "2.2" },
  { id: "N-14", position: "侧板下", stress: "156 MPa", deformation: "3.7 mm", factor: "2.1" },
  { id: "N-15", position: "连接板 A", stress: "166 MPa", deformation: "4.0 mm", factor: "2.0" },
  { id: "N-16", position: "连接板 B", stress: "168 MPa", deformation: "4.1 mm", factor: "1.9" },
  { id: "N-17", position: "螺栓孔 A", stress: "160 MPa", deformation: "3.8 mm", factor: "2.1" },
  { id: "N-18", position: "螺栓孔 B", stress: "162 MPa", deformation: "3.9 mm", factor: "2.0" },
  { id: "N-19", position: "防护板", stress: "145 MPa", deformation: "3.2 mm", factor: "2.4" },
  { id: "N-20", position: "减震垫", stress: "140 MPa", deformation: "3.0 mm", factor: "2.5" }
]);

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "info",
  progress: 0
});

const boundaryForm = reactive({
  position: "",
  direction: "",
  load: ""
});

const runSim = () => {
  modal.visible = true;
  modal.title = "运行仿真";
  modal.message = "正在计算网格与载荷响应。";
  modal.type = "progress";
  modal.progress = 0;
  const timer = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer);
      modal.title = "仿真完成";
      modal.message = "仿真数据已更新，可查看节点监测结果。";
      modal.type = "info";
      return;
    }
    modal.progress += 20;
  }, 200);
};

const openBoundary = () => {
  modal.visible = true;
  modal.title = "导入边界条件";
  modal.message = "补充载荷与约束信息以提高仿真精度。";
  modal.type = "form";
};

const openTip = () => {
  modal.visible = true;
  modal.title = "仿真提示";
  modal.message = "仿真前建议检查网格密度与边界条件是否完整。";
  modal.type = "info";
};

const openDetail = (node) => {
  modal.visible = true;
  modal.title = "节点详情";
  modal.message = `${node.id}（${node.position}）应力 ${node.stress}，变形 ${node.deformation}。`;
  modal.type = "info";
};

const openSnapshot = (node) => {
  modal.visible = true;
  modal.title = "仿真快照";
  modal.message = `已截取 ${node.position} 的云图快照，建议纳入报告输出。`;
  modal.type = "info";
};

const submitBoundary = () => {
  nodes.unshift({
    id: `N-${String(nodes.length + 1).padStart(2, "0")}`,
    position: boundaryForm.position,
    stress: "待计算",
    deformation: "待计算",
    factor: "待计算"
  });
  boundaryForm.position = "";
  boundaryForm.direction = "";
  boundaryForm.load = "";
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
