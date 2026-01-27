<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h3>NVH分析与诊断</h3>
        <p>支持 FFT、STFT、阶次跟踪、贡献量与TPA分析，自动定位激励源。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('analysis')">创建分析任务</button>
        <button class="ghost" @click="openModal('run')">运行诊断</button>
        <button class="ghost" @click="openModal('rules')">规则说明</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>频谱分布</h4>
        <div class="spectrum">
          <div v-for="bar in spectrum" :key="bar.index" class="spectrum-bar">
            <div class="spectrum-fill" :style="{ height: bar.value + '%' }"></div>
          </div>
        </div>
        <div class="axis">
          <span>50Hz</span><span>500Hz</span><span>1kHz</span>
        </div>
      </div>
      <div class="card">
        <h4>声品质指标</h4>
        <div class="metrics">
          <div>
            <p>响度</p>
            <strong>18.4 sone</strong>
          </div>
          <div>
            <p>锐度</p>
            <strong>1.8 acum</strong>
          </div>
          <div>
            <p>粗糙度</p>
            <strong>0.52 asper</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h4>诊断结果列表</h4>
        <button class="ghost" @click="openModal('share')">生成结论</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>问题编号</th>
              <th>频段</th>
              <th>主激励源</th>
              <th>传播路径</th>
              <th>相干度</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.band }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.path }}</td>
              <td>{{ row.coherence }}</td>
              <td><span class="tag">{{ row.suggestion }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AppModal :visible="modalVisible" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'analysis'">
        <label>选择批次<select v-model="form.batch">
          <option v-for="row in tableRows" :key="row.id">{{ row.id }}</option>
        </select></label>
        <label>分析方法<select v-model="form.method">
          <option>FFT+瀑布图</option>
          <option>阶次跟踪</option>
          <option>TPA+相干分析</option>
        </select></label>
        <label>诊断策略<select v-model="form.strategy">
          <option>规则库优先</option>
          <option>数据驱动</option>
          <option>专家协同</option>
        </select></label>
      </template>
      <template v-else-if="modalType === 'run'">
        <p>系统正在执行全频段诊断与问题库匹配。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>诊断进度 {{ progress }}%</small>
      </template>
      <template v-else-if="modalType === 'share'">
        <label>结论标题<input v-model="form.summary" type="text" placeholder="输入诊断结论标题" /></label>
        <label>结论说明<textarea v-model="form.note" rows="3" placeholder="请输入主要激励源与传播路径"></textarea></label>
      </template>
      <template v-else>
        <p>规则库包含典型发动机激励、结构共振与风噪特征的诊断条件。</p>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalVisible = ref(false);
const modalType = ref("analysis");
const progress = ref(32);

const spectrum = Array.from({ length: 18 }, (_, index) => ({
  index,
  value: 20 + (index % 6) * 12
}));

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `NVH-${100 + index}`,
  band: `${50 + index * 20}-${80 + index * 20} Hz`,
  source: ["发动机燃烧", "传动轴", "胎噪", "空调压缩机"][index % 4],
  path: ["副车架", "悬置", "防火墙", "车门"][index % 4],
  coherence: `${(0.65 + (index % 5) * 0.05).toFixed(2)}`,
  suggestion: ["优化悬置", "加强隔音", "调整转速", "结构加固"][index % 4]
}));

const form = reactive({
  batch: "",
  method: "FFT+瀑布图",
  strategy: "规则库优先",
  summary: "",
  note: ""
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  if (type === "run") {
    progress.value = 28;
    const timer = setInterval(() => {
      progress.value = Math.min(progress.value + 9, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 250);
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

const modalTitle = computed(() => {
  const titles = {
    analysis: "创建分析任务",
    run: "诊断进度",
    share: "生成诊断结论",
    rules: "规则说明"
  };
  return titles[modalType.value] || "提示";
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
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
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #d6deea;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.spectrum {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  align-items: end;
  gap: 4px;
  margin-top: 16px;
  height: 120px;
}

.spectrum-bar {
  background: #eff6ff;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
}

.spectrum-fill {
  width: 100%;
  background: linear-gradient(180deg, #2563eb, #60a5fa);
  border-radius: 6px 6px 0 0;
}

.axis {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 12px;
  margin-top: 8px;
}

.metrics {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.metrics strong {
  font-size: 20px;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-scroll {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f7;
}

.tag {
  background: #dcfce7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select,
textarea {
  padding: 8px 10px;
  border: 1px solid #d6deea;
  border-radius: 8px;
  font-family: inherit;
}

.progress {
  background: #edf2f8;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #22c55e);
}
</style>
