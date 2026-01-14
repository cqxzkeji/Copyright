<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>数据统计与系统管理</h2>
        <p>效率统计、报表生成与权限管理。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('report')">生成日报</button>
        <button class="ghost" @click="openModal('role')">新增权限角色</button>
        <button class="ghost" @click="openModal('backup')">系统备份</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>效率统计</h3>
        <div class="stat-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
        <div class="trend-chart">
          <div v-for="item in trend" :key="item.day" class="trend-column">
            <div class="column" :style="{ height: item.value + '%' }"></div>
            <span>{{ item.day }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>权限概览</h3>
        <div class="role-list">
          <div v-for="role in roles" :key="role.name" class="role-item">
            <div>
              <strong>{{ role.name }}</strong>
              <p>{{ role.desc }}</p>
            </div>
            <span class="tag">{{ role.users }} 人</span>
          </div>
        </div>
        <button class="primary" @click="openModal('audit')">权限审计</button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <h3>系统操作记录</h3>
        <button class="ghost" @click="openModal('export')">导出统计报表</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>记录编号</th>
              <th>操作人</th>
              <th>动作</th>
              <th>模块</th>
              <th>时间</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.user }}</td>
              <td>{{ row.action }}</td>
              <td>{{ row.module }}</td>
              <td>{{ row.time }}</td>
              <td>{{ row.result }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" :onClose="closeModal">
      <div v-if="modal.type === 'report'" class="form-grid">
        <label>
          报表类型
          <select v-model="form.reportType">
            <option>生产日报</option>
            <option>质量周报</option>
            <option>能耗月报</option>
          </select>
        </label>
        <label>
          统计时间
          <input v-model="form.range" type="text" />
        </label>
        <label>
          接收邮箱
          <input v-model="form.email" type="email" />
        </label>
      </div>
      <div v-else-if="modal.type === 'role'" class="form-grid">
        <label>
          角色名称
          <input v-model="form.role" type="text" />
        </label>
        <label>
          权限级别
          <select v-model="form.level">
            <option>高级</option>
            <option>标准</option>
            <option>只读</option>
          </select>
        </label>
        <label>
          适用模块
          <input v-model="form.scope" type="text" />
        </label>
      </div>
      <div v-else-if="modal.type === 'backup'" class="info-block">
        <p>系统正在进行全量备份，预计 3 分钟完成。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <div v-else-if="modal.type === 'audit'" class="info-block">
        <p>权限审计建议：</p>
        <ul>
          <li>2 名操作员权限超出当前岗位要求。</li>
          <li>建议启用双因素认证以提升安全等级。</li>
        </ul>
      </div>
      <div v-else class="info-block">
        <p>统计报表正在生成，包含效率、故障与能耗分析。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="confirmModal">确认执行</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';

const stats = [
  { label: '设备稼动率', value: '92.6%' },
  { label: '单位产出', value: '138 件/天' },
  { label: '平均节拍', value: '5.2 min' },
  { label: '能耗指标', value: '0.83 kWh/件' }
];

const trend = [
  { day: '周一', value: 68 },
  { day: '周二', value: 72 },
  { day: '周三', value: 80 },
  { day: '周四', value: 76 },
  { day: '周五', value: 84 },
  { day: '周六', value: 70 },
  { day: '周日', value: 62 }
];

const roles = [
  { name: '系统管理员', desc: '全局配置与权限维护', users: 2 },
  { name: '工艺工程师', desc: '工艺模板与任务审核', users: 6 },
  { name: '操作员', desc: '执行与日常监控', users: 18 }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `AD-${(index + 1).toString().padStart(3, '0')}`,
  user: index % 2 === 0 ? '王工' : '李工',
  action: index % 3 === 0 ? '导出报表' : '修改参数',
  module: ['设备配置', '任务规划', '过程控制', '在线监测'][index % 4],
  time: `2024-09-0${(index % 7) + 1} 1${index % 9}:30`,
  result: index % 4 === 0 ? '完成' : '已记录'
}));

const modal = ref({
  show: false,
  type: 'report',
  title: ''
});

const form = ref({
  reportType: '生产日报',
  range: '2024-09-01 至 2024-09-07',
  email: 'ops@cutpro.com',
  role: '工艺审批官',
  level: '高级',
  scope: '任务规划、过程控制'
});

const progress = ref(30);
const timer = ref(null);

const openModal = (type) => {
  modal.value.type = type;
  modal.value.show = true;
  modal.value.title =
    type === 'report'
      ? '生成日报'
      : type === 'role'
      ? '新增权限角色'
      : type === 'backup'
      ? '系统备份'
      : type === 'audit'
      ? '权限审计'
      : '导出统计报表';
  if (['backup', 'export'].includes(type)) {
    progress.value = 30;
    if (timer.value) clearInterval(timer.value);
    timer.value = setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
    }, 300);
  }
};

const closeModal = () => {
  modal.value.show = false;
  if (timer.value) clearInterval(timer.value);
};

const confirmModal = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.module-header p {
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary,
.ghost {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.primary {
  background: var(--primary);
  color: white;
}

.ghost {
  background: white;
  border: 1px solid var(--border);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: var(--card);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 16px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.stat-item {
  background: #f7f9ff;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 4px;
}

.stat-item span {
  color: var(--muted);
  font-size: 12px;
}

.trend-chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  gap: 12px;
  height: 160px;
}

.trend-column {
  display: grid;
  gap: 6px;
  justify-items: center;
  font-size: 12px;
  color: var(--muted);
}

.column {
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(180deg, #2f6bff, #9cc4ff);
}

.role-list {
  display: grid;
  gap: 12px;
}

.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f9ff;
  border-radius: 12px;
  padding: 10px 12px;
}

.role-item p {
  color: var(--muted);
  font-size: 13px;
}

.tag {
  background: #eef7ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-card {
  gap: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-wrap {
  overflow: auto;
}

th,
td {
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.form-grid input,
.form-grid select {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
}

.info-block {
  display: grid;
  gap: 12px;
}

.progress {
  background: #e7eefc;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #12b981);
  transition: width 0.3s ease;
}
</style>
