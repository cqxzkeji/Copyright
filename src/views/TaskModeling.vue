<template>
  <div>
    <div class="section-header">
      <h3>作业任务建模与数据接入</h3>
      <div class="tag-row">
        <button class="btn" @click="showImport = true">导入船期/靠泊计划</button>
        <button class="btn secondary" @click="showValidation = true">异常校验结果</button>
        <button class="btn" @click="openPoolStrategy">任务池调度策略</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card">
        <div class="section-header">
          <strong>优先级分布</strong>
          <span>高优先共 {{ highPriority }} 条</span>
        </div>
        <div v-for="level in priorityChart" :key="level.label" style="margin-bottom: 8px;">
          <div class="section-header" style="margin: 0;">
            <span>{{ level.label }}</span>
            <span>{{ level.value }} 票</span>
          </div>
          <div class="progress-track">
            <div class="bar" :style="{ width: `${level.percent}%` }"></div>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-header">
          <strong>时间窗覆盖率</strong>
          <span>{{ windowCoverage }}%</span>
        </div>
        <div class="progress-track">
          <div class="bar" :style="{ width: `${windowCoverage}%` }"></div>
        </div>
        <p>装卸任务中，时间窗定义完整比例，保障调度约束。</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>船舶</th>
          <th>类型</th>
          <th>批次</th>
          <th>舱位</th>
          <th>时间窗</th>
          <th>优先级</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.vessel }}</td>
          <td>{{ task.kind }}</td>
          <td>{{ task.batch }}</td>
          <td>{{ task.bay }}</td>
          <td>{{ task.window }}</td>
          <td>{{ task.priority }}</td>
          <td><span :class="['badge', task.statusClass]">{{ task.status }}</span></td>
        </tr>
      </tbody>
    </table>

    <BaseModal v-model="showImport" title="导入船期/靠泊计划">
      <p>请选择来源：TOS 推送、EDI、CSV 模板。</p>
      <div class="form-grid">
        <div class="input-group">
          <label>来源</label>
          <select v-model="importForm.source">
            <option>EDI</option>
            <option>TOS 接口</option>
            <option>CSV 文件</option>
          </select>
        </div>
        <div class="input-group">
          <label>计划日期</label>
          <input v-model="importForm.date" type="date" />
        </div>
        <div class="input-group">
          <label>是否拆解舱位</label>
          <select v-model="importForm.split">
            <option value="是">是</option>
            <option value="否">否</option>
          </select>
        </div>
      </div>
      <div class="section-header" style="margin-top: 12px;">
        <span>导入后自动校验泊位、潮窗、桥吊能力与舱位平衡。</span>
        <button class="btn" @click="confirmImport">确认导入</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showValidation" title="异常数据校验结果">
      <ul>
        <li>舱位 B18 缺失冷藏电源信息，建议标记冷藏类型。</li>
        <li>批次 TK-08 超出堆场可用面积 12 TEU，将触发分流。</li>
        <li>AGV 轨迹与场桥 RTG-12 冲突，已生成避让线路。</li>
      </ul>
    </BaseModal>

    <ProgressModal v-model="showPool" :message="progressMessage" />
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ProgressModal from '../components/ProgressModal.vue';

const tasks = [
  { id: 'T-1001', vessel: '东方01', kind: '卸船', batch: 'B01', bay: '12', window: '02:00-04:00', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1002', vessel: '东方01', kind: '装船', batch: 'B01', bay: '14', window: '03:00-05:00', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1003', vessel: '东方02', kind: '卸船', batch: 'B02', bay: '16', window: '04:00-06:00', priority: '中', status: '就绪', statusClass: 'success' },
  { id: 'T-1004', vessel: '东方02', kind: '装船', batch: 'B03', bay: '10', window: '05:00-07:00', priority: '中', status: '锁定', statusClass: 'warning' },
  { id: 'T-1005', vessel: '宁海', kind: '卸船', batch: 'B02', bay: '18', window: '06:00-08:00', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1006', vessel: '宁海', kind: '装船', batch: 'B04', bay: '22', window: '06:30-08:30', priority: '低', status: '排队', statusClass: 'warning' },
  { id: 'T-1007', vessel: '海星', kind: '卸船', batch: 'B05', bay: '08', window: '07:00-09:00', priority: '中', status: '就绪', statusClass: 'success' },
  { id: 'T-1008', vessel: '海星', kind: '装船', batch: 'B05', bay: '06', window: '07:30-09:30', priority: '低', status: '排队', statusClass: 'warning' },
  { id: 'T-1009', vessel: '星河', kind: '卸船', batch: 'B06', bay: '20', window: '08:00-10:00', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1010', vessel: '星河', kind: '装船', batch: 'B06', bay: '24', window: '08:30-10:30', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1011', vessel: '东盛', kind: '卸船', batch: 'B07', bay: '02', window: '09:00-11:00', priority: '中', status: '就绪', statusClass: 'success' },
  { id: 'T-1012', vessel: '东盛', kind: '装船', batch: 'B07', bay: '04', window: '09:30-11:30', priority: '高', status: '锁定', statusClass: 'warning' },
  { id: 'T-1013', vessel: '远航', kind: '卸船', batch: 'B08', bay: '26', window: '10:00-12:00', priority: '低', status: '排队', statusClass: 'warning' },
  { id: 'T-1014', vessel: '远航', kind: '装船', batch: 'B08', bay: '28', window: '10:30-12:30', priority: '中', status: '就绪', statusClass: 'success' },
  { id: 'T-1015', vessel: '绿洲', kind: '卸船', batch: 'B09', bay: '30', window: '11:00-13:00', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1016', vessel: '绿洲', kind: '装船', batch: 'B09', bay: '32', window: '11:30-13:30', priority: '中', status: '就绪', statusClass: 'success' },
  { id: 'T-1017', vessel: '晨曦', kind: '卸船', batch: 'B10', bay: '34', window: '12:00-14:00', priority: '低', status: '排队', statusClass: 'warning' },
  { id: 'T-1018', vessel: '晨曦', kind: '装船', batch: 'B10', bay: '36', window: '12:30-14:30', priority: '低', status: '排队', statusClass: 'warning' },
  { id: 'T-1019', vessel: '晨曦', kind: '卸船', batch: 'B11', bay: '38', window: '13:00-15:00', priority: '高', status: '就绪', statusClass: 'success' },
  { id: 'T-1020', vessel: '晨曦', kind: '装船', batch: 'B11', bay: '40', window: '13:30-15:30', priority: '中', status: '就绪', statusClass: 'success' },
  { id: 'T-1021', vessel: '晨曦', kind: '装船', batch: 'B12', bay: '42', window: '14:00-16:00', priority: '高', status: '就绪', statusClass: 'success' }
];

const showImport = ref(false);
const showValidation = ref(false);
const showPool = ref(false);
const progressMessage = ref('');

const importForm = reactive({
  source: 'EDI',
  date: '',
  split: '是'
});

const highPriority = computed(() => tasks.filter((t) => t.priority === '高').length);
const priorityChart = computed(() => {
  const total = tasks.length;
  const groups = ['高', '中', '低'].map((level) => {
    const value = tasks.filter((t) => t.priority === level).length;
    return { label: `${level} 优先`, value, percent: Math.round((value / total) * 100) };
  });
  return groups;
});
const windowCoverage = 92;

const confirmImport = () => {
  showImport.value = false;
  progressMessage.value = '船期/靠泊计划导入中，正在拆解舱位与生成任务池...';
  showPool.value = true;
};

const openPoolStrategy = () => {
  progressMessage.value = '正在根据优先级和时间窗生成任务池调度策略与分流方案...';
  showPool.value = true;
};
</script>
