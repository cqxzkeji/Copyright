<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h3>档案数字化管理</h3>
        <p>扫描、转换、标注与归档流程实时可视化。</p>
      </div>
      <div class="toolbar">
        <button class="primary" type="button" @click="openModal('create')">新建扫描任务</button>
        <button class="secondary" type="button" @click="openModal('convert')">批量转换</button>
        <button class="ghost" type="button" @click="openModal('annotate')">OCR 标注</button>
        <button class="ghost" type="button" @click="openModal('save')">保存归档</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h4>扫描进度统计</h4>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="bar">
            <span class="label">{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <span class="value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>今日任务摘要</h4>
        <ul class="summary">
          <li>待扫描：12 份</li>
          <li>待转换：8 份</li>
          <li>待标注：6 份</li>
          <li>已归档：21 份</li>
        </ul>
        <button class="secondary" type="button" @click="openModal('report')">查看日报</button>
      </div>
    </section>

    <section class="table-section">
      <div class="table-header">
        <h4>扫描任务列表</h4>
        <button class="ghost" type="button" @click="openModal('filter')">筛选任务</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>档案名称</th>
            <th>格式</th>
            <th>扫描页数</th>
            <th>状态</th>
            <th>负责人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.format }}</td>
            <td>{{ task.pages }}</td>
            <td>
              <span class="status" :class="task.statusClass">{{ task.status }}</span>
            </td>
            <td>{{ task.owner }}</td>
            <td>
              <button class="link" type="button" @click="openDetail(task)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="activeModal === 'create'" title="新建扫描任务" @close="closeModal">
      <form class="form">
        <label>档案名称<input v-model="form.name" placeholder="如：2024 春季教学检查" /></label>
        <label>来源部门<input v-model="form.department" placeholder="如：教务处" /></label>
        <label>扫描格式
          <select v-model="form.format">
            <option>PDF</option>
            <option>TIFF</option>
            <option>JPEG</option>
          </select>
        </label>
        <label>扫描负责人<input v-model="form.owner" placeholder="输入负责人姓名" /></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="confirmCreate">提交任务</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'convert'" title="批量转换进度" @close="closeModal">
      <p>正在将 15 份扫描文件转换为可检索 PDF。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="hint">当前进度 {{ progress }}%</p>
      <template #footer>
        <button class="secondary" type="button" @click="simulateProgress">刷新进度</button>
        <button class="primary" type="button" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'annotate'" title="OCR 标注" @close="closeModal">
      <form class="form">
        <label>关键字标注<input v-model="form.keyword" placeholder="如：课程评估" /></label>
        <label>标注页码<input v-model="form.page" placeholder="如：5-12" /></label>
        <label>标注说明<textarea v-model="form.note" rows="3" placeholder="说明标注用途"></textarea></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('annotateResult')">保存标注</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'annotateResult'" title="标注完成" @close="closeModal">
      <p>已为档案添加标签“{{ form.keyword || '未命名' }}”，标注页码 {{ form.page || '未填写' }}。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'save'" title="归档确认" @close="closeModal">
      <p>将 {{ selectedTask?.name || '本批档案' }} 保存至“教学评估”库，归档后将生成唯一档案编号。</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('saved')">确认归档</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'saved'" title="归档完成" @close="closeModal">
      <p>归档完成，系统已同步到备份库并推送给相关审批人。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'report'" title="扫描日报" @close="closeModal">
      <ul class="summary">
        <li>新增扫描任务：9</li>
        <li>完成 OCR：14</li>
        <li>待人工校对：4</li>
        <li>异常文件：2</li>
      </ul>
    </BaseModal>

    <BaseModal :open="activeModal === 'filter'" title="筛选任务" @close="closeModal">
      <form class="form">
        <label>状态
          <select v-model="filter.status">
            <option>全部</option>
            <option>扫描中</option>
            <option>已完成</option>
            <option>待校对</option>
          </select>
        </label>
        <label>负责人<input v-model="filter.owner" placeholder="输入负责人姓名" /></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">应用筛选</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'detail'" title="任务详情" @close="closeModal">
      <p>档案名称：{{ selectedTask?.name }}</p>
      <p>扫描页数：{{ selectedTask?.pages }}</p>
      <p>当前状态：{{ selectedTask?.status }}</p>
      <p>负责人：{{ selectedTask?.owner }}</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="openModal('save')">继续归档</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const progress = ref(68);
const selectedTask = ref(null);

const form = reactive({
  name: '',
  department: '',
  format: 'PDF',
  owner: '',
  keyword: '',
  page: '',
  note: ''
});

const filter = reactive({
  status: '全部',
  owner: ''
});

const chartData = [
  { label: '扫描', value: 82 },
  { label: '转换', value: 68 },
  { label: '标注', value: 54 },
  { label: '归档', value: 73 }
];

const tasks = Array.from({ length: 24 }, (_, index) => {
  const statuses = [
    { label: '扫描中', class: 'info' },
    { label: '待校对', class: 'warning' },
    { label: '已完成', class: 'success' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: `SC-${2024001 + index}`,
    name: `教学档案批次 ${index + 1}`,
    format: ['PDF', 'TIFF', 'JPEG'][index % 3],
    pages: 20 + (index % 12),
    status: status.label,
    statusClass: status.class,
    owner: ['刘晨', '王珊', '赵宏'][index % 3]
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const openDetail = (task) => {
  selectedTask.value = task;
  activeModal.value = 'detail';
};

const simulateProgress = () => {
  progress.value = Math.min(100, progress.value + 8);
};

const confirmCreate = () => {
  openModal('report');
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
  flex-wrap: wrap;
  gap: 16px;
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

.chart {
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

.bar-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}

.summary {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #475569;
  display: grid;
  gap: 6px;
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

.status.info {
  background: #e0f2fe;
  color: #0369a1;
}

.status.warning {
  background: #fef9c3;
  color: #a16207;
}

.status.success {
  background: #dcfce7;
  color: #166534;
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
