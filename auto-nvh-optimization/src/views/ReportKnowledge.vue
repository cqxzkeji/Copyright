<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h3>报告与知识库</h3>
        <p>标准化输出项目报告，沉淀典型问题与整改经验，支持权限审计。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('report')">一键生成报告</button>
        <button class="ghost" @click="openModal('export')">导出进度</button>
        <button class="ghost" @click="openModal('policy')">权限提示</button>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <h4>报告产出趋势</h4>
        <svg viewBox="0 0 240 100" class="line-chart">
          <polyline :points="reportPoints" fill="none" stroke="#3b82f6" stroke-width="3" />
          <circle v-for="point in reportNodes" :key="point.x" :cx="point.x" :cy="point.y" r="3" fill="#2563eb" />
        </svg>
        <p class="hint">本月已生成 32 份标准化报告。</p>
      </div>
      <div class="card">
        <h4>知识库概览</h4>
        <div class="metrics">
          <div>
            <p>典型问题</p>
            <strong>86</strong>
          </div>
          <div>
            <p>整改措施</p>
            <strong>124</strong>
          </div>
          <div>
            <p>平台复用</p>
            <strong>18</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h4>知识条目</h4>
        <button class="ghost" @click="openModal('audit')">查看审计</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>条目编号</th>
              <th>问题类型</th>
              <th>整改措施</th>
              <th>适用平台</th>
              <th>更新时间</th>
              <th>权限等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.issue }}</td>
              <td>{{ row.action }}</td>
              <td>{{ row.platform }}</td>
              <td>{{ row.date }}</td>
              <td><span class="tag">{{ row.level }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AppModal :visible="modalVisible" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'report'">
        <label>选择项目<select v-model="form.project">
          <option v-for="row in tableRows" :key="row.id">{{ row.platform }}</option>
        </select></label>
        <label>输出格式<select v-model="form.format">
          <option>PDF</option>
          <option>PPT</option>
          <option>在线链接</option>
        </select></label>
        <label>包含内容<select v-model="form.section">
          <option>图表 + 结论</option>
          <option>对标 + 方案清单</option>
          <option>全量章节</option>
        </select></label>
      </template>
      <template v-else-if="modalType === 'export'">
        <p>正在打包报告与知识库附件。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>导出进度 {{ progress }}%</small>
      </template>
      <template v-else-if="modalType === 'audit'">
        <label>审计说明<textarea v-model="form.note" rows="3" placeholder="记录权限访问审批信息"></textarea></label>
      </template>
      <template v-else>
        <p>权限等级分为基础、受限、机密，访问记录将写入审计日志。</p>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalVisible = ref(false);
const modalType = ref("report");
const progress = ref(38);

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `KB-${700 + index}`,
  issue: ["发动机啸叫", "路噪偏高", "共振峰值", "风噪泄漏"][index % 4],
  action: ["升级隔音层", "优化胎噪材料", "调整支架", "补强密封"][index % 4],
  platform: ["A平台", "B平台", "新能源", "豪华型"][index % 4],
  date: `2024-0${(index % 8) + 1}-2${index % 9}`,
  level: ["基础", "受限", "机密"][index % 3]
}));

const reportNodes = computed(() => {
  const values = [10, 16, 14, 22, 18, 24, 28, 32];
  return values.map((value, index) => ({
    x: 20 + index * 28,
    y: 90 - value * 2
  }));
});

const reportPoints = computed(() => reportNodes.value.map((node) => `${node.x},${node.y}`).join(" "));

const form = reactive({
  project: "A平台",
  format: "PDF",
  section: "图表 + 结论",
  note: ""
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  if (type === "export") {
    progress.value = 30;
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
    report: "生成项目报告",
    export: "导出进度",
    audit: "审计记录",
    policy: "权限提示"
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
  background: #fee2e2;
  color: #b91c1c;
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
