<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>工况仿真与适配验证</h2>
        <p>模拟田间作业、泥泞路况与高速行驶等工况，验证防护效果。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('scenario')">配置工况</button>
        <button class="ghost" @click="openModal('run')">启动仿真</button>
        <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
      </div>
    </header>

    <div class="layout">
      <div class="panel">
        <h3>仿真场景预览</h3>
        <img :src="hero" alt="工况仿真示意" />
        <div class="scenario">
          <div>
            <span>当前场景</span>
            <strong>泥泞路况 · 高负载</strong>
          </div>
          <div>
            <span>速度区间</span>
            <strong>12-28 km/h</strong>
          </div>
          <div>
            <span>喷溅系数</span>
            <strong>0.82</strong>
          </div>
        </div>
        <button class="primary" @click="openModal('progress')">开始适配验证</button>
      </div>
      <div class="panel">
        <h3>仿真记录</h3>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>工况类型</th>
              <th>速度</th>
              <th>载荷</th>
              <th>防护评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in simulations" :key="item.code">
              <td>{{ item.code }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.speed }}</td>
              <td>{{ item.load }}</td>
              <td>{{ item.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal
      :show="activeModal === 'scenario'"
      title="配置工况"
      width="560px"
      :onClose="closeModal"
    >
      <form class="modal-form" @submit.prevent="submitScenario">
        <label>
          工况类型
          <select v-model="scenarioForm.type">
            <option>田间作业</option>
            <option>泥泞路况</option>
            <option>高速行驶</option>
          </select>
        </label>
        <div class="form-grid">
          <label>
            速度区间
            <input v-model="scenarioForm.speed" />
          </label>
          <label>
            载荷等级
            <select v-model="scenarioForm.load">
              <option>轻载</option>
              <option>中载</option>
              <option>高载</option>
            </select>
          </label>
          <label>
            泥水密度
            <input v-model="scenarioForm.mud" />
          </label>
          <label>
            喷溅系数
            <input v-model="scenarioForm.splash" />
          </label>
        </div>
        <button class="primary" type="submit">保存工况</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'run'"
      title="启动仿真"
      width="520px"
      :onClose="closeModal"
    >
      <p>将根据当前组合方案与工况配置生成仿真任务。</p>
      <form class="modal-form" @submit.prevent="openModal('progress')">
        <label>
          仿真时长
          <select>
            <option>30 分钟</option>
            <option>60 分钟</option>
            <option>90 分钟</option>
          </select>
        </label>
        <label>
          结果精度
          <select>
            <option>标准</option>
            <option>高精度</option>
          </select>
        </label>
        <button class="primary" type="submit">确认启动</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'tip'"
      title="按钮提示信息"
      width="420px"
      :onClose="closeModal"
    >
      <p>仿真完成后将自动生成适配验证报告与防护评分。</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">知道了</button>
      </template>
    </AppModal>

    <AppModal
      :show="activeModal === 'progress'"
      title="仿真进度"
      width="480px"
      :onClose="closeModal"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在计算挡泥板受力与喷溅轨迹。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">后台运行</button>
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

const scenarioForm = reactive({
  type: "泥泞路况",
  speed: "12-28 km/h",
  load: "高载",
  mud: "高",
  splash: "0.82",
});

const simulations = Array.from({ length: 20 }, (_, index) => ({
  code: `SIM-${index + 1}`,
  type: index % 3 === 0 ? "田间作业" : index % 3 === 1 ? "泥泞路况" : "高速行驶",
  speed: `${12 + index} km/h`,
  load: index % 2 === 0 ? "中载" : "高载",
  score: `${80 + (index % 10)}分`,
}));

const openModal = (name) => {
  activeModal.value = name;
  if (name === "progress") {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 16;
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(timer);
      }
    }, 220);
  }
};

const closeModal = () => {
  activeModal.value = "";
};

const submitScenario = () => {
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

.scenario {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 12px 0 18px;
}

.scenario span {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.scenario strong {
  font-size: 14px;
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
