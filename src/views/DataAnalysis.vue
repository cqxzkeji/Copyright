<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>数据分析与系统管理</h3>
        <p>统一存储运行数据与日志，支持性能评估、效率统计与权限管理。</p>
      </div>
      <div class="module-actions">
        <button class="secondary" type="button" @click="openModal('report')">生成报告</button>
        <button class="secondary" type="button" @click="openModal('template')">模板管理</button>
        <button class="primary" type="button" @click="openModal('user')">权限配置</button>
      </div>
    </div>
    <div class="summary-grid">
      <div class="card">
        <h4>本月运行时长</h4>
        <p class="metric">1,248 h</p>
        <span>效率提升 8%</span>
      </div>
      <div class="card">
        <h4>任务完成率</h4>
        <p class="metric">97.2%</p>
        <span>高优先级任务保持稳定</span>
      </div>
      <div class="card">
        <h4>系统用户</h4>
        <p class="metric">36 人</p>
        <span>权限组 5 类</span>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h4>效率统计图</h4>
        <button class="ghost" type="button" @click="openModal('notice')">分析提示</button>
      </div>
      <div class="chart">
        <div v-for="bar in chartData" :key="bar.label" class="bar">
          <span class="bar-label">{{ bar.label }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: bar.value + '%' }"></div>
          </div>
          <span class="bar-value">{{ bar.value }}%</span>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h4>任务与日志分析</h4>
        <button class="ghost" type="button" @click="openModal('export')">导出数据</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>记录编号</th>
            <th>任务类型</th>
            <th>执行次数</th>
            <th>平均耗时</th>
            <th>成功率</th>
            <th>最后更新</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.duration }}</td>
            <td>{{ item.success }}</td>
            <td>{{ item.updated }}</td>
            <td>
              <button class="table-button" type="button" @click="openRowModal(item)">查看详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="closeModal">
      <template v-if="activeModal === 'report'">
        <p>选择报告类型并设定时间范围。</p>
        <div class="modal-grid">
          <label>
            报告类型
            <select v-model="modalForm.report">
              <option value="performance">性能评估报告</option>
              <option value="efficiency">效率统计报告</option>
              <option value="safety">安全审计报告</option>
            </select>
          </label>
          <label>
            时间范围
            <input v-model="modalForm.range" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'template'">
        <p>管理参数模板与任务配置。</p>
        <div class="modal-grid">
          <label>
            模板名称
            <input v-model="modalForm.template" type="text" />
          </label>
          <label>
            版本备注
            <input v-model="modalForm.note" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'user'">
        <p>调整用户权限与角色配置。</p>
        <div class="modal-grid">
          <label>
            角色类型
            <select v-model="modalForm.role">
              <option value="admin">驱控管理员</option>
              <option value="planner">轨迹工程师</option>
              <option value="viewer">只读观察员</option>
            </select>
          </label>
          <label>
            权限范围
            <input v-model="modalForm.scope" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'export'">
        <p>选择导出格式并生成数据文件。</p>
        <div class="modal-grid">
          <label>
            文件格式
            <select v-model="modalForm.export">
              <option value="xlsx">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <label>
            文件命名
            <input v-model="modalForm.filename" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'notice'">
        <p>统计分析基于最近 90 天的任务运行数据。</p>
        <ul>
          <li>可通过模板管理统一参数与任务配置。</li>
          <li>性能报告支持导出到数据仓库。</li>
          <li>权限调整将即时同步到控制台。</li>
        </ul>
      </template>
      <template v-else-if="activeModal === 'row'">
        <p>查看记录 {{ selectedRecord?.id }} 的分析详情。</p>
        <div class="modal-grid">
          <label>
            标记等级
            <select v-model="modalForm.tag">
              <option value="normal">常规</option>
              <option value="focus">重点关注</option>
              <option value="archived">归档</option>
            </select>
          </label>
          <label>
            备注说明
            <input v-model="modalForm.comment" type="text" />
          </label>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const selectedRecord = ref(null);

const modalForm = reactive({
  report: 'performance',
  range: '2024-05-01 至 2024-07-31',
  template: '默认驱控模板',
  note: '适配多型号设备',
  role: 'admin',
  scope: '全站设备 + 日志',
  export: 'xlsx',
  filename: 'robot-arm-report',
  tag: 'focus',
  comment: ''
});

const chartData = [
  { label: '关节利用率', value: 86 },
  { label: '轨迹执行稳定度', value: 92 },
  { label: '报警响应效率', value: 78 },
  { label: '任务准时率', value: 95 },
  { label: '维护达标率', value: 88 }
];

const records = Array.from({ length: 22 }, (_, index) => ({
  id: `DA-${(index + 1).toString().padStart(3, '0')}`,
  type: ['搬运', '装配', '焊接', '检测'][index % 4],
  count: 120 + index * 3,
  duration: `${8 + index * 0.2} min`,
  success: `${96 - index * 0.1}%`,
  updated: `2024-07-${(index % 28 + 1).toString().padStart(2, '0')}`
}));

const modalTitle = computed(() => {
  const titles = {
    report: '生成分析报告',
    template: '参数模板管理',
    user: '权限配置',
    export: '数据导出',
    notice: '分析提示',
    row: '记录详情'
  };
  return titles[activeModal.value] || '';
});

const openModal = (type) => {
  activeModal.value = type;
};

const openRowModal = (record) => {
  selectedRecord.value = record;
  activeModal.value = 'row';
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header p {
  color: #64748b;
  margin-top: 6px;
}

.module-actions {
  display: flex;
  gap: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 8px;
}

.card .metric {
  font-size: 26px;
  font-weight: 700;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel h4 {
  font-size: 18px;
}

.chart {
  display: grid;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.bar-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
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

.table-button {
  border: none;
  background: #e0e7ff;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 12px;
}
</style>
