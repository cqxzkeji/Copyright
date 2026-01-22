<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>材料与结构性能分析</h2>
        <p>内置工程塑料、橡胶与复合材料库，支持强度与耐冲击分析。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('material')">新增材料</button>
        <button class="ghost" @click="openModal('analysis')">启动性能分析</button>
        <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h3>冲击吸能</h3>
        <p class="metric">87%</p>
        <p class="desc">复合材料优化后提升 12%。</p>
      </div>
      <div class="card">
        <h3>耐泥水侵蚀</h3>
        <p class="metric">A级</p>
        <p class="desc">涂层方案提升抗腐蚀能力。</p>
      </div>
      <div class="card">
        <h3>结构安全系数</h3>
        <p class="metric">1.68</p>
        <p class="desc">满足高速工况安全要求。</p>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <h3>材料库概览</h3>
        <img :src="hero" alt="材料分析示意" />
        <ul class="list">
          <li>复合材料推荐：碳纤维增强尼龙</li>
          <li>密度范围：0.9 ~ 1.4 g/cm³</li>
          <li>温度适应：-20°C ~ 80°C</li>
        </ul>
      </div>
      <div class="panel">
        <h3>材料参数表</h3>
        <table>
          <thead>
            <tr>
              <th>材料编号</th>
              <th>类型</th>
              <th>密度(g/cm³)</th>
              <th>冲击强度(kJ/m²)</th>
              <th>耐侵蚀等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in materials" :key="item.code">
              <td>{{ item.code }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.density }}</td>
              <td>{{ item.impact }}</td>
              <td>{{ item.grade }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal
      :show="activeModal === 'material'"
      title="新增材料"
      width="560px"
      :onClose="closeModal"
    >
      <form class="modal-form" @submit.prevent="submitMaterial">
        <label>
          材料名称
          <input v-model="materialForm.name" required />
        </label>
        <div class="form-grid">
          <label>
            密度(g/cm³)
            <input v-model="materialForm.density" type="number" step="0.01" />
          </label>
          <label>
            冲击强度(kJ/m²)
            <input v-model="materialForm.impact" type="number" />
          </label>
          <label>
            耐侵蚀等级
            <select v-model="materialForm.grade">
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </label>
          <label>
            温度范围
            <input v-model="materialForm.temp" />
          </label>
        </div>
        <button class="primary" type="submit">保存材料</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'analysis'"
      title="性能分析进度"
      width="480px"
      :onClose="closeModal"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在模拟结构强度、冲击与耐泥水侵蚀性能。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">查看后台</button>
      </template>
    </AppModal>

    <AppModal
      :show="activeModal === 'tip'"
      title="按钮提示信息"
      width="420px"
      :onClose="closeModal"
    >
      <p>材料分析结果可导出到设计结果管理模块生成标准化报告。</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">确认</button>
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

const materialForm = reactive({
  name: "碳纤维增强尼龙",
  density: 1.18,
  impact: 48,
  grade: "A",
  temp: "-20 ~ 80°C",
});

const materials = Array.from({ length: 20 }, (_, index) => ({
  code: `MT-${200 + index}`,
  type: index % 3 === 0 ? "工程塑料" : index % 3 === 1 ? "橡胶" : "复合材料",
  density: (0.9 + (index % 5) * 0.1).toFixed(2),
  impact: 35 + index * 2,
  grade: index % 2 === 0 ? "A" : "B",
}));

const openModal = (name) => {
  activeModal.value = name;
  if (name === "analysis") {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 13;
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(timer);
      }
    }, 250);
  }
};

const closeModal = () => {
  activeModal.value = "";
};

const submitMaterial = () => {
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

.cards {
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
