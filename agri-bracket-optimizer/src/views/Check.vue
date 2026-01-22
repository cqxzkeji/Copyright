<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>强度校核</h3>
        <p>进行强度、刚度与稳定性分析，判断是否满足使用要求。</p>
      </div>
      <div class="actions">
        <button @click="startCheck">启动校核</button>
        <button class="ghost" @click="openPlan">新增校核工况</button>
        <button class="ghost" @click="openTip">风险提示</button>
      </div>
    </div>

    <div class="module-grid">
      <div class="card">
        <h4>校核分布图</h4>
        <svg viewBox="0 0 640 220" class="diagram" role="img" aria-label="强度校核云图">
          <defs>
            <linearGradient id="stress" x1="0" x2="1">
              <stop offset="0%" stop-color="#32c18c" />
              <stop offset="50%" stop-color="#ffd36b" />
              <stop offset="100%" stop-color="#ff6b6b" />
            </linearGradient>
          </defs>
          <rect x="30" y="40" width="560" height="140" rx="24" fill="url(#stress)" opacity="0.2" />
          <path d="M80 150 L200 80 L320 120 L450 70 L560 130" stroke="#1b7cff" stroke-width="4" fill="none" />
          <circle cx="200" cy="80" r="8" fill="#ff6b6b" />
          <circle cx="450" cy="70" r="8" fill="#ffd36b" />
          <text x="60" y="70" font-size="14" fill="#1d2a3a">最大应力区</text>
        </svg>
        <div class="metrics">
          <div>
            <span>最大应力</span>
            <strong>162 MPa</strong>
          </div>
          <div>
            <span>最大位移</span>
            <strong>3.4 mm</strong>
          </div>
          <div>
            <span>稳定系数</span>
            <strong>2.1</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>校核结果表</h4>
        <table>
          <thead>
            <tr>
              <th>工况</th>
              <th>最大应力</th>
              <th>挠度</th>
              <th>稳定系数</th>
              <th>结论</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in checks" :key="row.id">
              <td>{{ row.case }}</td>
              <td>{{ row.stress }}</td>
              <td>{{ row.deflection }}</td>
              <td>{{ row.stability }}</td>
              <td>{{ row.result }}</td>
              <td>
                <button class="text" @click="openDetail(row)">详情</button>
                <button class="text" @click="openSuggest(row)">建议</button>
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
        <form v-if="modal.type === 'form'" @submit.prevent="submitPlan">
          <label>
            工况名称
            <input v-model="planForm.case" required />
          </label>
          <label>
            载荷方向
            <input v-model="planForm.direction" required />
          </label>
          <label>
            安全系数目标
            <input v-model="planForm.target" required />
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="closeModal">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
        <div v-if="modal.type === 'progress'" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
          <span>校核进度 {{ modal.progress }}%</span>
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

const checks = reactive([
  { id: 1, case: "额定工况", stress: "162 MPa", deflection: "3.4 mm", stability: "2.1", result: "满足" },
  { id: 2, case: "提升工况", stress: "148 MPa", deflection: "2.9 mm", stability: "2.3", result: "满足" },
  { id: 3, case: "冲击工况", stress: "178 MPa", deflection: "4.1 mm", stability: "1.9", result: "注意" },
  { id: 4, case: "运输工况", stress: "132 MPa", deflection: "2.4 mm", stability: "2.6", result: "满足" },
  { id: 5, case: "紧急制动", stress: "185 MPa", deflection: "4.5 mm", stability: "1.8", result: "注意" },
  { id: 6, case: "坡地作业", stress: "150 MPa", deflection: "3.2 mm", stability: "2.2", result: "满足" },
  { id: 7, case: "高速行驶", stress: "140 MPa", deflection: "2.7 mm", stability: "2.4", result: "满足" },
  { id: 8, case: "泥泞工况", stress: "158 MPa", deflection: "3.6 mm", stability: "2.0", result: "满足" },
  { id: 9, case: "侧向载荷", stress: "170 MPa", deflection: "3.9 mm", stability: "2.0", result: "满足" },
  { id: 10, case: "吊装工况", stress: "176 MPa", deflection: "4.2 mm", stability: "1.9", result: "注意" },
  { id: 11, case: "动态冲击", stress: "182 MPa", deflection: "4.4 mm", stability: "1.8", result: "注意" },
  { id: 12, case: "横向扭矩", stress: "144 MPa", deflection: "2.8 mm", stability: "2.3", result: "满足" },
  { id: 13, case: "重载工况", stress: "168 MPa", deflection: "3.8 mm", stability: "2.0", result: "满足" },
  { id: 14, case: "低温工况", stress: "155 MPa", deflection: "3.3 mm", stability: "2.1", result: "满足" },
  { id: 15, case: "高温工况", stress: "160 MPa", deflection: "3.5 mm", stability: "2.0", result: "满足" },
  { id: 16, case: "疲劳循环", stress: "172 MPa", deflection: "3.9 mm", stability: "1.9", result: "注意" },
  { id: 17, case: "快速转弯", stress: "146 MPa", deflection: "3.0 mm", stability: "2.2", result: "满足" },
  { id: 18, case: "高速颠簸", stress: "174 MPa", deflection: "4.0 mm", stability: "1.9", result: "注意" },
  { id: 19, case: "满载上坡", stress: "159 MPa", deflection: "3.6 mm", stability: "2.0", result: "满足" },
  { id: 20, case: "制动冲击", stress: "177 MPa", deflection: "4.2 mm", stability: "1.9", result: "注意" }
]);

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "info",
  progress: 0
});

const planForm = reactive({
  case: "",
  direction: "",
  target: ""
});

const startCheck = () => {
  modal.visible = true;
  modal.title = "启动强度校核";
  modal.message = "系统正在执行有限元分析与稳定性评估。";
  modal.type = "progress";
  modal.progress = 0;
  const timer = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer);
      modal.title = "校核完成";
      modal.message = "关键工况已校核完成，可查看结果与优化建议。";
      modal.type = "info";
      return;
    }
    modal.progress += 20;
  }, 200);
};

const openPlan = () => {
  modal.visible = true;
  modal.title = "新增校核工况";
  modal.message = "补充工况后，将自动加入校核排程。";
  modal.type = "form";
};

const openTip = () => {
  modal.visible = true;
  modal.title = "风险提示";
  modal.message = "冲击工况与疲劳循环为高风险项，建议在优化模块中降低应力集中。";
  modal.type = "info";
};

const openDetail = (row) => {
  modal.visible = true;
  modal.title = "校核详情";
  modal.message = `${row.case}：最大应力 ${row.stress}，挠度 ${row.deflection}。`;
  modal.type = "info";
};

const openSuggest = (row) => {
  modal.visible = true;
  modal.title = "优化建议";
  modal.message = `针对 ${row.case}，建议优化连接梁厚度或采用高强钢以提升安全裕度。`;
  modal.type = "info";
};

const submitPlan = () => {
  checks.unshift({
    id: checks.length + 1,
    case: planForm.case,
    stress: "待分析",
    deflection: "待分析",
    stability: planForm.target,
    result: "排程"
  });
  planForm.case = "";
  planForm.direction = "";
  planForm.target = "";
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
