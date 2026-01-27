<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h3>仿真与模型关联</h3>
        <p>管理模态、频响与声学腔体模型，完成实测-仿真对标与校准闭环。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('import')">导入仿真模型</button>
        <button class="ghost" @click="openModal('compare')">对标计算</button>
        <button class="ghost" @click="openModal('guide')">参数说明</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>模型误差趋势</h4>
        <svg viewBox="0 0 240 100" class="line-chart">
          <polyline :points="trendPoints" fill="none" stroke="#22c55e" stroke-width="3" />
          <circle v-for="point in trendNodes" :key="point.x" :cx="point.x" :cy="point.y" r="3" fill="#16a34a" />
        </svg>
        <p class="hint">误差目标控制在 5% 以内。</p>
      </div>
      <div class="card">
        <h4>模型库概览</h4>
        <div class="library">
          <div>
            <p>模态模型</p>
            <strong>28</strong>
          </div>
          <div>
            <p>频响函数</p>
            <strong>46</strong>
          </div>
          <div>
            <p>声学腔体</p>
            <strong>15</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h4>对标记录</h4>
        <button class="ghost" @click="openModal('adjust')">参数敏感性</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>记录编号</th>
              <th>模型类型</th>
              <th>对标工况</th>
              <th>误差</th>
              <th>校准人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.model }}</td>
              <td>{{ row.condition }}</td>
              <td>{{ row.error }}</td>
              <td>{{ row.owner }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AppModal :visible="modalVisible" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'import'">
        <label>模型名称<input v-model="form.name" type="text" placeholder="输入模型名称" /></label>
        <label>模型类型<select v-model="form.type">
          <option>模态</option>
          <option>频响</option>
          <option>声学腔体</option>
        </select></label>
        <label>版本标签<input v-model="form.version" type="text" placeholder="例如：v2.1" /></label>
      </template>
      <template v-else-if="modalType === 'compare'">
        <p>正在执行实测-仿真对齐与误差评估。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>计算进度 {{ progress }}%</small>
      </template>
      <template v-else-if="modalType === 'adjust'">
        <label>敏感参数<select v-model="form.parameter">
          <option>阻尼系数</option>
          <option>材料密度</option>
          <option>边界约束</option>
        </select></label>
        <label>调整幅度<input v-model="form.delta" type="text" placeholder="±5%" /></label>
      </template>
      <template v-else>
        <p>建议优先校准阻尼与边界条件，以提升实测匹配度。</p>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalVisible = ref(false);
const modalType = ref("import");
const progress = ref(35);

const form = reactive({
  name: "",
  type: "模态",
  version: "",
  parameter: "阻尼系数",
  delta: ""
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `SIM-${2000 + index}`,
  model: ["模态", "频响", "声学腔体"][index % 3],
  condition: ["怠速", "加速", "120km/h", "粗糙路"][index % 4],
  error: `${(4 + (index % 6) * 0.6).toFixed(1)}%`,
  owner: ["刘工", "赵工", "周工", "韩工"][index % 4],
  status: ["已校准", "待验证", "优化中"][index % 3]
}));

const trendNodes = computed(() => {
  const values = [12, 16, 13, 10, 8, 7, 6, 5];
  return values.map((value, index) => ({
    x: 20 + index * 28,
    y: 90 - value * 5
  }));
});

const trendPoints = computed(() => trendNodes.value.map((node) => `${node.x},${node.y}`).join(" "));

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  if (type === "compare") {
    progress.value = 28;
    const timer = setInterval(() => {
      progress.value = Math.min(progress.value + 8, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 260);
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

const modalTitle = computed(() => {
  const titles = {
    import: "导入仿真模型",
    compare: "对标计算进度",
    adjust: "参数敏感性设置",
    guide: "参数说明"
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

.line-chart {
  width: 100%;
  height: 120px;
  margin-top: 12px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 8px;
}

.hint {
  margin: 8px 0 0;
  color: #64748b;
}

.library {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.library strong {
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
  background: #fef3c7;
  color: #92400e;
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
select {
  padding: 8px 10px;
  border: 1px solid #d6deea;
  border-radius: 8px;
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
