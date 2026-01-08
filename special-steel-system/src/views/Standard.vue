<template>
  <div class="page">
    <div class="toolbar card">
      <div>
        <p class="section-title">优特钢标准动态维护</p>
        <p class="sub">支持版本更新、历史追溯与审批进度反馈</p>
      </div>
      <div class="actions">
        <button class="action-btn" @click="openModal('create')">新增标准</button>
        <button class="action-btn secondary" @click="openModal('publish')">版本发布</button>
        <button class="action-btn secondary" @click="openModal('trace')">历史追溯</button>
        <button class="action-btn secondary" @click="openModal('export')">导出报告</button>
        <button class="action-btn secondary" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <p class="section-title">标准版本活跃度</p>
        <div class="bar-chart">
          <div v-for="item in chartData" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="track">
              <div class="fill" :style="{ width: `${item.value}%` }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <p class="section-title">审批进度</p>
        <ul class="progress-list">
          <li v-for="step in approvals" :key="step.name">
            <div>
              <strong>{{ step.name }}</strong>
              <span>{{ step.owner }}</span>
            </div>
            <div class="progress-bar">
              <span :style="{ width: `${step.progress}%` }"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <p class="section-title">标准目录（共 {{ standards.length }} 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>标准编号</th>
            <th>钢种</th>
            <th>适用规格</th>
            <th>关键性能</th>
            <th>版本</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in standards" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.performance }}</td>
            <td>{{ item.version }}</td>
            <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
            <td>{{ item.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-model="modalVisible" :title="modalTitle" @confirm="handleConfirm">
      <div v-if="modalType === 'create'" class="form-grid">
        <label>
          标准名称
          <input class="input" placeholder="例如：GCr15精密轴承钢" />
        </label>
        <label>
          目标行业
          <input class="input" placeholder="汽车零部件" />
        </label>
        <label>
          规格范围
          <input class="input" placeholder="Φ30-120mm" />
        </label>
        <label>
          关键指标
          <input class="input" placeholder="抗拉≥900MPa" />
        </label>
      </div>
      <div v-else-if="modalType === 'publish'" class="modal-block">
        <p>发布新版本将同步销售策略与报价模型。</p>
        <div class="progress-bar">
          <span :style="{ width: `${publishProgress}%` }"></span>
        </div>
        <p class="status">标准发布进度：{{ publishProgress }}%</p>
      </div>
      <div v-else-if="modalType === 'trace'" class="modal-block">
        <p>请选择追溯范围：</p>
        <label class="field">
          <select class="input">
            <option>近12个月版本记录</option>
            <option>近24个月版本记录</option>
            <option>全部历史版本</option>
          </select>
        </label>
        <ul class="timeline">
          <li v-for="record in traceList" :key="record.time">
            <strong>{{ record.version }}</strong>
            <span>{{ record.time }} · {{ record.note }}</span>
          </li>
        </ul>
      </div>
      <div v-else-if="modalType === 'tip'" class="modal-block">
        <p>提示：版本发布后将同步销售报价模型，并触发订单匹配策略刷新。</p>
        <ul>
          <li>建议在发布前完成性能验证与客户确认。</li>
          <li>历史追溯支持按钢种、客户与时间维度检索。</li>
        </ul>
      </div>
      <div v-else class="modal-block">
        <p>系统将生成包含 {{ standards.length }} 条标准数据的分析报告。</p>
        <label>
          导出格式
          <select class="input">
            <option>PDF</option>
            <option>Excel</option>
            <option>报告包</option>
          </select>
        </label>
        <p class="status">预计生成时间：3分钟</p>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppModal from '../components/AppModal.vue';

const modalVisible = ref(false);
const modalType = ref('create');
const publishProgress = ref(10);

const standards = ref(
  Array.from({ length: 24 }, (_, i) => ({
    code: `STD-${2024}-${(i + 1).toString().padStart(2, '0')}`,
    grade: ['GCr15', 'Cr12MoV', 'H13', '42CrMo', '9CrSi'][i % 5],
    size: `${30 + i}~${120 + i}mm`,
    performance: ['高疲劳', '高耐磨', '高韧性', '耐热', '精密稳定'][i % 5],
    version: `V${(i % 4) + 1}.0`,
    status: i % 3 === 0 ? '审批中' : i % 3 === 1 ? '生效' : '待复核',
    statusClass: i % 3 === 0 ? 'warn' : i % 3 === 1 ? 'success' : 'info',
    updated: `2024-0${(i % 8) + 1}-${(i % 26) + 2}`
  }))
);

const chartData = [
  { name: '轴承钢', value: 92 },
  { name: '模具钢', value: 80 },
  { name: '合金结构钢', value: 65 },
  { name: '耐热钢', value: 58 },
  { name: '高温合金', value: 46 }
];

const approvals = [
  { name: '化学成分校核', owner: '标准室', progress: 80 },
  { name: '工艺路线评估', owner: '生产中心', progress: 65 },
  { name: '应用验证反馈', owner: '客户经理', progress: 40 }
];

const traceList = [
  { version: 'V3.0', time: '2024-06-12', note: '增加洁净度控制' },
  { version: 'V2.5', time: '2024-02-20', note: '更新热处理曲线' },
  { version: 'V2.0', time: '2023-11-02', note: '新增尺寸范围' }
];

const modalTitleMap = {
  create: '新增标准草案',
  publish: '版本发布进度',
  trace: '历史追溯',
  export: '导出标准报告',
  tip: '操作提示'
};

const modalTitle = ref(modalTitleMap.create);

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value = modalTitleMap[type];
  modalVisible.value = true;
};

watch(modalVisible, (visible) => {
  if (visible && modalType.value === 'publish') {
    publishProgress.value = 10;
    const timer = setInterval(() => {
      publishProgress.value += 15;
      if (publishProgress.value >= 100) {
        publishProgress.value = 100;
        clearInterval(timer);
      }
    }, 220);
  }
});

const handleConfirm = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sub {
  margin: 6px 0 0;
  color: #6b7a99;
  font-size: 13px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 80px 1fr 60px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.track {
  height: 10px;
  background: #edf1f7;
  border-radius: 999px;
}

.fill {
  height: 10px;
  background: linear-gradient(90deg, #2f6df6, #87a8ff);
  border-radius: 999px;
}

.progress-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-list li {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.progress-list span {
  color: #6b7a99;
  font-size: 12px;
}

.table-card {
  overflow: hidden;
}

.modal-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #4d5b7c;
}

.field {
  margin-top: 8px;
}

.status {
  color: #2f6df6;
}
</style>
