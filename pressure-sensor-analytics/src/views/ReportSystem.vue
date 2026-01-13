<template>
  <section class="module">
    <div class="cards">
      <div class="card">
        <h4>报表模板</h4>
        <p class="metric">{{ templateCount }} 份</p>
        <span>支持 Excel / PDF 导出</span>
      </div>
      <div class="card">
        <h4>统计分析</h4>
        <p class="metric">{{ reportCount }} 份</p>
        <span>本周生成</span>
      </div>
      <div class="card">
        <h4>权限与审计</h4>
        <p class="metric">{{ auditCount }} 条</p>
        <span>角色配置已同步</span>
      </div>
    </div>

    <div class="toolbar">
      <button type="button" @click="openModal('form', '新建模板')">新建模板</button>
      <button type="button" @click="openModal('progress', '导出报表')">导出报表</button>
      <button type="button" @click="openModal('form', '角色配置')">角色配置</button>
      <button type="button" @click="openModal('info', '数据备份')">数据备份</button>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h4>报表与审计记录</h4>
        <span>操作审计 / 字典配置 / 数据追溯</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>报表名称</th>
            <th>类型</th>
            <th>负责人</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reports" :key="item.id">
            <td>{{ item.time }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button type="button" class="icon" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'form'" class="modal-form" @submit.prevent="submitForm">
            <label>
              模板名称
              <input v-model="form.name" type="text" required />
            </label>
            <label>
              报表周期
              <select v-model="form.period">
                <option>日报</option>
                <option>周报</option>
                <option>月报</option>
              </select>
            </label>
            <label>
              导出格式
              <select v-model="form.format">
                <option>Excel</option>
                <option>PDF</option>
              </select>
            </label>
            <label>
              负责人
              <input v-model="form.owner" type="text" required />
            </label>
            <button type="submit" class="primary">保存模板</button>
          </form>
          <div v-else-if="modal.type === 'progress'">
            <p>正在生成报表并导出。</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="progress-tip">导出进度 {{ progress }}%</p>
          </div>
          <div v-else class="info-body">
            <p>最近备份时间：{{ lastBackup }}，包含 {{ reportCount }} 份报表。</p>
            <p>已生成备份校验摘要。</p>
            <button type="button" class="primary" @click="closeModal">查看备份</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";

const templateCount = 12;
const reportCount = 28;
const auditCount = 96;
const lastBackup = "2024-06-15 08:10";

const reports = ref(
  Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    time: `06-${String(index % 10 + 5).padStart(2, "0")} 1${index % 5}:20`,
    name: `压力监测报表-${index + 1}`,
    type: ["日报", "周报", "月报"][index % 3],
    owner: ["王工", "赵工", "李工"][index % 3],
    status: index % 4 === 0 ? "待导出" : "已归档",
    note: ["自动生成", "需复核", "已签批"][index % 3]
  }))
);

const modal = reactive({
  visible: false,
  type: "info",
  title: ""
});

const form = reactive({
  name: "趋势日报模板",
  period: "日报",
  format: "Excel",
  owner: "王工"
});

const progress = ref(0);
const timer = ref(null);

const openModal = (type, title) => {
  modal.visible = true;
  modal.type = type;
  modal.title = title;
  if (type === "progress") {
    progress.value = 0;
    timer.value = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer.value);
        timer.value = null;
      } else {
        progress.value += 12;
      }
    }, 140);
  }
};

const closeModal = () => {
  modal.visible = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const submitForm = () => {
  reports.value.unshift({
    id: reports.value.length + 1,
    time: "06-15 16:00",
    name: form.name,
    type: form.period,
    owner: form.owner,
    status: "待导出",
    note: `格式 ${form.format}`
  });
  closeModal();
};

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.metric {
  font-size: 22px;
  font-weight: 700;
  margin: 8px 0;
}

.card span {
  color: #64748b;
  font-size: 13px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.table-header span {
  color: #64748b;
  font-size: 13px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #38bdf8);
  transition: width 0.2s ease;
}

.progress-tip {
  font-size: 13px;
  color: #64748b;
}
</style>
