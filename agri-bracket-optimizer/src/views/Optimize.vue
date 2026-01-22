<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>结构优化</h3>
        <p>在满足强度前提下，对重量、尺寸与材料进行优化设计。</p>
      </div>
      <div class="actions">
        <button @click="startOptimize">启动优化</button>
        <button class="ghost" @click="openMaterial">新增材料方案</button>
        <button class="ghost" @click="openTip">优化提示</button>
      </div>
    </div>

    <div class="module-grid">
      <div class="card">
        <h4>重量-刚度权衡曲线</h4>
        <svg viewBox="0 0 640 220" class="diagram" role="img" aria-label="重量刚度权衡图">
          <path d="M60 180 L200 120 L320 100 L440 80 L560 60" stroke="#1b7cff" stroke-width="4" fill="none" />
          <circle cx="320" cy="100" r="8" fill="#32c18c" />
          <text x="340" y="104" font-size="13" fill="#1d2a3a">推荐方案</text>
          <rect x="60" y="40" width="520" height="140" rx="16" fill="#f6f9ff" />
        </svg>
        <div class="metrics">
          <div>
            <span>目标减重</span>
            <strong>12%</strong>
          </div>
          <div>
            <span>刚度提升</span>
            <strong>8%</strong>
          </div>
          <div>
            <span>成本变化</span>
            <strong>-5%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>优化方案清单</h4>
        <table>
          <thead>
            <tr>
              <th>方案</th>
              <th>材料</th>
              <th>重量</th>
              <th>刚度</th>
              <th>成本</th>
              <th>推荐度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in plans" :key="plan.id">
              <td>{{ plan.name }}</td>
              <td>{{ plan.material }}</td>
              <td>{{ plan.weight }}</td>
              <td>{{ plan.stiffness }}</td>
              <td>{{ plan.cost }}</td>
              <td>{{ plan.rank }}</td>
              <td>
                <button class="text" @click="openDetail(plan)">详情</button>
                <button class="text" @click="openCompare(plan)">对比</button>
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
        <form v-if="modal.type === 'form'" @submit.prevent="submitMaterial">
          <label>
            材料名称
            <input v-model="materialForm.name" required />
          </label>
          <label>
            密度(kg/m³)
            <input v-model="materialForm.density" required />
          </label>
          <label>
            强度等级
            <input v-model="materialForm.grade" required />
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="closeModal">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
        <div v-if="modal.type === 'progress'" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
          <span>优化进度 {{ modal.progress }}%</span>
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

const plans = reactive([
  { id: 1, name: "方案 A", material: "Q355B", weight: "168 kg", stiffness: "+6%", cost: "￥12,400", rank: "高" },
  { id: 2, name: "方案 B", material: "Q420", weight: "160 kg", stiffness: "+8%", cost: "￥13,100", rank: "高" },
  { id: 3, name: "方案 C", material: "Q345B", weight: "172 kg", stiffness: "+5%", cost: "￥11,900", rank: "中" },
  { id: 4, name: "方案 D", material: "Q460", weight: "155 kg", stiffness: "+10%", cost: "￥13,800", rank: "高" },
  { id: 5, name: "方案 E", material: "Q355", weight: "169 kg", stiffness: "+6%", cost: "￥12,200", rank: "中" },
  { id: 6, name: "方案 F", material: "Q420", weight: "162 kg", stiffness: "+7%", cost: "￥12,900", rank: "高" },
  { id: 7, name: "方案 G", material: "Q355B", weight: "170 kg", stiffness: "+5%", cost: "￥12,100", rank: "中" },
  { id: 8, name: "方案 H", material: "Q460", weight: "154 kg", stiffness: "+11%", cost: "￥14,200", rank: "高" },
  { id: 9, name: "方案 I", material: "Q500", weight: "150 kg", stiffness: "+12%", cost: "￥15,000", rank: "高" },
  { id: 10, name: "方案 J", material: "Q355B", weight: "171 kg", stiffness: "+5%", cost: "￥12,300", rank: "中" },
  { id: 11, name: "方案 K", material: "Q420", weight: "158 kg", stiffness: "+8%", cost: "￥13,000", rank: "高" },
  { id: 12, name: "方案 L", material: "Q345B", weight: "174 kg", stiffness: "+4%", cost: "￥11,700", rank: "中" },
  { id: 13, name: "方案 M", material: "Q460", weight: "156 kg", stiffness: "+10%", cost: "￥13,900", rank: "高" },
  { id: 14, name: "方案 N", material: "Q355", weight: "169 kg", stiffness: "+6%", cost: "￥12,200", rank: "中" },
  { id: 15, name: "方案 O", material: "Q420", weight: "161 kg", stiffness: "+7%", cost: "￥12,800", rank: "高" },
  { id: 16, name: "方案 P", material: "Q460", weight: "153 kg", stiffness: "+11%", cost: "￥14,300", rank: "高" },
  { id: 17, name: "方案 Q", material: "Q355B", weight: "170 kg", stiffness: "+5%", cost: "￥12,100", rank: "中" },
  { id: 18, name: "方案 R", material: "Q500", weight: "149 kg", stiffness: "+12%", cost: "￥15,200", rank: "高" },
  { id: 19, name: "方案 S", material: "Q420", weight: "159 kg", stiffness: "+8%", cost: "￥13,100", rank: "高" },
  { id: 20, name: "方案 T", material: "Q355", weight: "168 kg", stiffness: "+6%", cost: "￥12,300", rank: "中" }
]);

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "info",
  progress: 0
});

const materialForm = reactive({
  name: "",
  density: "",
  grade: ""
});

const startOptimize = () => {
  modal.visible = true;
  modal.title = "启动结构优化";
  modal.message = "系统正在进行多目标优化计算。";
  modal.type = "progress";
  modal.progress = 0;
  const timer = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer);
      modal.title = "优化完成";
      modal.message = "推荐方案已生成，可在方案清单中查看。";
      modal.type = "info";
      return;
    }
    modal.progress += 20;
  }, 200);
};

const openMaterial = () => {
  modal.visible = true;
  modal.title = "新增材料方案";
  modal.message = "输入材料参数以加入优化库。";
  modal.type = "form";
};

const openTip = () => {
  modal.visible = true;
  modal.title = "优化提示";
  modal.message = "建议优先优化连接梁重量，并关注主梁强度裕度。";
  modal.type = "info";
};

const openDetail = (plan) => {
  modal.visible = true;
  modal.title = "方案详情";
  modal.message = `${plan.name} 使用 ${plan.material}，重量 ${plan.weight}，刚度变化 ${plan.stiffness}。`;
  modal.type = "info";
};

const openCompare = (plan) => {
  modal.visible = true;
  modal.title = "方案对比";
  modal.message = `${plan.name} 与基准方案相比，成本 ${plan.cost}，推荐度 ${plan.rank}。`;
  modal.type = "info";
};

const submitMaterial = () => {
  plans.unshift({
    id: plans.length + 1,
    name: materialForm.name,
    material: materialForm.name,
    weight: "待评估",
    stiffness: "待评估",
    cost: "待评估",
    rank: "待评估"
  });
  materialForm.name = "";
  materialForm.density = "";
  materialForm.grade = "";
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
