<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h3>档案共享与导出</h3>
        <p>支持 PDF、Excel、离线包等多种导出方式。</p>
      </div>
      <div class="toolbar">
        <button class="primary" type="button" @click="openModal('share')">生成共享链接</button>
        <button class="secondary" type="button" @click="openModal('export')">导出报表</button>
        <button class="ghost" type="button" @click="openModal('offline')">离线包</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h4>导出格式占比</h4>
        <div class="bars">
          <div v-for="item in formats" :key="item.label" class="bar">
            <span>{{ item.label }}</span>
            <div class="track">
              <div class="fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>共享状态</h4>
        <ul class="summary">
          <li>有效共享链接：15 条</li>
          <li>待审批共享：4 条</li>
          <li>离线包下载：8 次</li>
        </ul>
        <button class="secondary" type="button" @click="openModal('approval')">审批共享</button>
      </div>
    </section>

    <section class="table-section">
      <div class="table-header">
        <h4>共享记录</h4>
        <button class="ghost" type="button" @click="openModal('schedule')">设置定时导出</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>记录编号</th>
            <th>档案名称</th>
            <th>格式</th>
            <th>共享范围</th>
            <th>有效期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shares" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.format }}</td>
            <td>{{ item.scope }}</td>
            <td>{{ item.expire }}</td>
            <td>
              <span class="status" :class="item.statusClass">{{ item.status }}</span>
            </td>
            <td>
              <button class="link" type="button" @click="openDetail(item)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="activeModal === 'share'" title="生成共享链接" @close="closeModal">
      <form class="form">
        <label>档案选择<select v-model="form.archive">
          <option v-for="item in shares" :key="item.id">{{ item.name }}</option>
        </select></label>
        <label>共享范围<select v-model="form.scope">
          <option>校内共享</option>
          <option>部门共享</option>
          <option>指定人员</option>
        </select></label>
        <label>有效期<select v-model="form.expire">
          <option>7天</option>
          <option>30天</option>
          <option>90天</option>
        </select></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('shareResult')">生成链接</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'shareResult'" title="共享链接已生成" @close="closeModal">
      <p>链接已生成并发送到 {{ form.scope }} 审核队列。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'export'" title="导出报表" @close="closeModal">
      <p>正在生成 {{ exportType }} 报表。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
      </div>
      <p class="hint">{{ exportProgress }}%</p>
      <template #footer>
        <button class="secondary" type="button" @click="switchExport">切换格式</button>
        <button class="primary" type="button" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'offline'" title="离线包制作" @close="closeModal">
      <form class="form">
        <label>数据范围<input v-model="form.range" placeholder="如：2024年第一季度" /></label>
        <label>压缩级别<select v-model="form.zip">
          <option>标准</option>
          <option>高压缩</option>
          <option>极速</option>
        </select></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('offlineResult')">开始打包</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'offlineResult'" title="离线包生成中" @close="closeModal">
      <p>离线包制作完成，预计 3 分钟内可下载。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'approval'" title="共享审批" @close="closeModal">
      <ul class="summary">
        <li>教学评估档案共享申请 2 条待审。</li>
        <li>外部共享申请 1 条需复核。</li>
        <li>院系共享申请 1 条待确认。</li>
      </ul>
    </BaseModal>

    <BaseModal :open="activeModal === 'schedule'" title="定时导出" @close="closeModal">
      <form class="form">
        <label>导出频率<select v-model="schedule.frequency">
          <option>每周</option>
          <option>每月</option>
          <option>每季度</option>
        </select></label>
        <label>通知邮箱<input v-model="schedule.email" placeholder="admin@school.edu" /></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('scheduleResult')">保存计划</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'scheduleResult'" title="定时导出已启用" @close="closeModal">
      <p>系统将按照 {{ schedule.frequency }} 自动导出并发送至 {{ schedule.email || '指定邮箱' }}。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'detail'" title="共享详情" @close="closeModal">
      <p>档案名称：{{ selected?.name }}</p>
      <p>共享范围：{{ selected?.scope }}</p>
      <p>状态：{{ selected?.status }}</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="openModal('share')">再次共享</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const exportProgress = ref(58);
const exportType = ref('PDF');
const selected = ref(null);

const form = reactive({
  archive: '',
  scope: '校内共享',
  expire: '7天',
  range: '',
  zip: '标准'
});

const schedule = reactive({
  frequency: '每周',
  email: ''
});

const formats = [
  { label: 'PDF', value: 46 },
  { label: 'Excel', value: 32 },
  { label: 'ZIP', value: 22 }
];

const shares = Array.from({ length: 23 }, (_, index) => {
  const status = index % 3 === 0 ? '待审批' : '已共享';
  return {
    id: `SH-${2024010 + index}`,
    name: `共享档案 ${index + 1}`,
    format: ['PDF', 'Excel', 'ZIP'][index % 3],
    scope: ['校内共享', '部门共享', '指定人员'][index % 3],
    expire: `${7 + (index % 5) * 7}天`,
    status,
    statusClass: status === '待审批' ? 'warning' : 'success'
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const switchExport = () => {
  const types = ['PDF', 'Excel', 'ZIP'];
  const nextIndex = (types.indexOf(exportType.value) + 1) % types.length;
  exportType.value = types[nextIndex];
  exportProgress.value = Math.min(100, exportProgress.value + 10);
};

const openDetail = (item) => {
  selected.value = item;
  activeModal.value = 'detail';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h3 {
  margin: 0;
  font-size: 18px;
}

.module-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.secondary,
.ghost {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
  color: #1e293b;
}

.ghost {
  background: #f1f5f9;
  color: #1e293b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.bars {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 60px 1fr 50px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}

.summary {
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #475569;
}

.table-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.status {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.success {
  background: #dcfce7;
  color: #166534;
}

.status.warning {
  background: #fef9c3;
  color: #a16207;
}

.link {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form input,
.form select,
.form textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.hint {
  font-size: 12px;
  color: #64748b;
}
</style>
