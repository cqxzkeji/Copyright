<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h3>项目/车型/工况管理</h3>
        <p>统一管理项目、车辆、工况与测点信息，支持批量上传与版本追溯。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新建项目</button>
        <button class="ghost" @click="openModal('import')">批量导入</button>
        <button class="ghost" @click="openModal('tips')">流程提示</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>项目状态分布</h4>
        <div class="chart">
          <div v-for="item in statusSummary" :key="item.label" class="bar">
            <span>{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%'}"></div>
            </div>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>元数据覆盖率</h4>
        <div class="metric">
          <div>
            <p>车型覆盖</p>
            <strong>92%</strong>
          </div>
          <div>
            <p>工况覆盖</p>
            <strong>87%</strong>
          </div>
          <div>
            <p>测点完整度</p>
            <strong>95%</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h4>项目台账</h4>
        <div>
          <button class="ghost" @click="openModal('assign')">更新负责人</button>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>项目编号</th>
              <th>车型</th>
              <th>工况</th>
              <th>版本</th>
              <th>负责人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.model }}</td>
              <td>{{ row.condition }}</td>
              <td>{{ row.version }}</td>
              <td>{{ row.owner }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AppModal :visible="modalVisible" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'create'">
        <label>项目名称<input v-model="form.name" type="text" placeholder="例如：A平台NVH优化" /></label>
        <label>车型平台<select v-model="form.model">
          <option>轿车平台</option>
          <option>SUV平台</option>
          <option>新能源平台</option>
        </select></label>
        <label>工况类别<select v-model="form.condition">
          <option>怠速</option>
          <option>匀速</option>
          <option>加速</option>
          <option>路试综合</option>
        </select></label>
      </template>
      <template v-else-if="modalType === 'import'">
        <p>批量导入元数据与测点配置，系统将执行格式校验。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>正在校验 {{ progress }}%</small>
      </template>
      <template v-else-if="modalType === 'assign'">
        <label>选择项目<select v-model="form.target">
          <option v-for="row in tableRows" :key="row.id">{{ row.id }} - {{ row.model }}</option>
        </select></label>
        <label>负责人<input v-model="form.owner" type="text" placeholder="输入姓名" /></label>
      </template>
      <template v-else>
        <p>请先建立项目，再导入工况与测点，最后绑定试验计划并触发版本记录。</p>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalVisible = ref(false);
const modalType = ref("create");
const progress = ref(46);

const form = reactive({
  name: "",
  model: "轿车平台",
  condition: "怠速",
  target: "",
  owner: ""
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `PRJ-${2024 + index}`,
  model: ["A-Sedan", "B-SUV", "E-EV"][index % 3],
  condition: ["怠速", "匀速", "加速", "路试综合"][index % 4],
  version: `v${1 + (index % 4)}.${index % 9}`,
  owner: ["李工", "王工", "周工", "陈工"][index % 4],
  status: ["进行中", "待验证", "已归档"][index % 3]
}));

const statusSummary = computed(() => [
  { label: "进行中", count: 12, value: 68 },
  { label: "待验证", count: 5, value: 45 },
  { label: "已归档", count: 3, value: 30 }
]);

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  if (type === "import") {
    progress.value = 36;
    const timer = setInterval(() => {
      progress.value = Math.min(progress.value + 8, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 300);
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

const modalTitle = computed(() => {
  const titles = {
    create: "新建项目",
    import: "批量导入进度",
    assign: "更新负责人",
    tips: "流程提示"
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

.chart {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.bar {
  display: grid;
  grid-template-columns: 80px 1fr 40px;
  gap: 12px;
  align-items: center;
}

.bar-track {
  background: #edf2f8;
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}

.metric {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.metric strong {
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
  background: #e0f2fe;
  color: #0369a1;
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
