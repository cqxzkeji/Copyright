<template>
  <div class="grid results-layout">
    <div class="card summary">
      <div class="section-head">批次概览</div>
      <div class="summary-grid">
        <div class="summary-item" v-for="item in summaryCards" :key="item.title">
          <div class="muted text-sm">{{ item.title }}</div>
          <div class="summary-value">{{ item.value }}</div>
          <div class="muted text-xs">{{ item.desc }}</div>
        </div>
      </div>
      <div class="filters">
        <input
          v-model="filters.query"
          class="input"
          placeholder="搜索ID、类别或备注关键词"
          aria-label="搜索"
        />
        <select v-model="filters.status" class="input" aria-label="状态过滤">
          <option value="all">全部状态</option>
          <option value="pending">待复核</option>
          <option value="reviewed">已确认</option>
          <option value="flagged">需关注</option>
        </select>
        <button class="btn" @click="refresh">刷新</button>
      </div>
    </div>

    <div class="card">
      <div class="section-head">识别样本列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>类别</th>
            <th>置信度</th>
            <th>耗时(ms)</th>
            <th>状态</th>
            <th>复核人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredResults" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.label }}</td>
            <td>{{ item.score }}</td>
            <td>{{ item.time }}</td>
            <td>
              <span :class="['status-pill', item.status]">{{ statusText[item.status] }}</span>
            </td>
            <td>{{ item.reviewer || '—' }}</td>
            <td class="table-actions">
              <button class="btn compact" @click="openDetail(item)">详情</button>
              <button class="btn compact secondary" @click="openNote(item)">备注</button>
              <button class="btn compact" @click="markReviewed(item)">复核</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <button class="btn" @click="sortByScore">按置信度排序</button>
        <button class="btn secondary" @click="openExport">导出结果</button>
      </div>
    </div>

    <div class="card previews">
      <div class="section-head">快速对比</div>
      <div class="preview-box">
        <div class="preview original">原始图像</div>
        <div class="preview processed">识别输出</div>
      </div>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="showCompare = true">查看全屏对比</button>
        <button class="btn secondary" @click="flagCurrent">标记关注</button>
      </div>
      <div class="muted text-sm" style="margin-top: 0.5rem;">当前预览：{{ currentPreview }}</div>
    </div>
  </div>

  <ModalDialog v-model="showCompare" title="对比查看" confirm-text="关闭" @confirm="showCompare = false">
    <p>叠加查看以确认边界位置，支持放大。</p>
    <div class="preview-box">
      <div class="preview original">输入</div>
      <div class="preview processed">输出</div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showNote" title="备注与指派" confirm-text="提交" @confirm="submitNote">
    <div class="form-row">
      <label class="muted text-sm">样本</label>
      <div class="strong">{{ selectedItem?.id || '未选择' }}</div>
    </div>
    <textarea v-model="note" class="input" rows="3" placeholder="记录复核意见与处理建议"></textarea>
    <div class="form-row">
      <label class="muted text-sm" for="assignee">指派给</label>
      <select id="assignee" v-model="assignee" class="input">
        <option value="">未指派</option>
        <option>Dr. Li</option>
        <option>Dr. Chen</option>
        <option>QA 团队</option>
      </select>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showExport" title="导出结果" confirm-text="开始导出" @confirm="exportResult">
    <p>选择导出格式：</p>
    <div class="form-row">
      <label><input type="radio" value="csv" v-model="exportType" /> CSV</label>
      <label><input type="radio" value="json" v-model="exportType" /> JSON</label>
    </div>
    <div class="progress-bar" style="margin-top: 0.75rem;">
      <div class="fill" :style="{ width: exportProgress + '%' }"></div>
    </div>
    <small class="muted">导出进度：{{ exportProgress }}%</small>
  </ModalDialog>

  <ModalDialog v-model="showDetail" title="识别详情" confirm-text="关闭" @confirm="() => (showDetail = false)">
    <div v-if="selectedItem" class="detail-grid">
      <div>
        <div class="muted text-sm">样本编号</div>
        <div class="strong">{{ selectedItem.id }}</div>
      </div>
      <div>
        <div class="muted text-sm">预测类别</div>
        <div class="strong">{{ selectedItem.label }}</div>
      </div>
      <div>
        <div class="muted text-sm">置信度</div>
        <div class="strong">{{ selectedItem.score }}</div>
      </div>
      <div>
        <div class="muted text-sm">耗时</div>
        <div class="strong">{{ selectedItem.time }} ms</div>
      </div>
      <div>
        <div class="muted text-sm">状态</div>
        <div class="strong">{{ statusText[selectedItem.status] }}</div>
      </div>
      <div>
        <div class="muted text-sm">复核人</div>
        <div class="strong">{{ selectedItem.reviewer || '未指派' }}</div>
      </div>
      <div class="muted text-sm" style="grid-column: span 2;">备注</div>
      <div class="card" style="grid-column: span 2;">{{ selectedItem.note || '暂无备注' }}</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const statusText = {
  pending: '待复核',
  reviewed: '已确认',
  flagged: '需关注'
};

const results = ref([
  { id: 'A001', label: '肿瘤', score: 0.91, time: 32, status: 'pending', reviewer: '', note: '' },
  { id: 'A002', label: '正常', score: 0.78, time: 27, status: 'reviewed', reviewer: 'Dr. Li', note: '对比基线正常' },
  { id: 'A003', label: '炎症', score: 0.88, time: 30, status: 'pending', reviewer: '', note: '' },
  { id: 'A004', label: '肿瘤', score: 0.95, time: 29, status: 'flagged', reviewer: 'QA 团队', note: '边界需重新校验' },
  { id: 'A005', label: '出血', score: 0.73, time: 33, status: 'pending', reviewer: '', note: '' },
  { id: 'A006', label: '正常', score: 0.69, time: 25, status: 'reviewed', reviewer: 'Dr. Chen', note: '纹理一致' },
  { id: 'A007', label: '肿瘤', score: 0.83, time: 31, status: 'pending', reviewer: '', note: '' },
  { id: 'A008', label: '炎症', score: 0.8, time: 28, status: 'flagged', reviewer: '', note: '疑似伪影' },
  { id: 'A009', label: '正常', score: 0.76, time: 24, status: 'pending', reviewer: '', note: '' },
  { id: 'A010', label: '肿瘤', score: 0.9, time: 34, status: 'pending', reviewer: '', note: '' },
  { id: 'A011', label: '出血', score: 0.71, time: 26, status: 'reviewed', reviewer: 'Dr. Li', note: '已比对前次' }
]);

const filters = ref({ query: '', status: 'all' });
const showCompare = ref(false);
const showNote = ref(false);
const showExport = ref(false);
const showDetail = ref(false);
const exportType = ref('csv');
const exportProgress = ref(10);
const note = ref('');
const assignee = ref('');
const selectedItem = ref(null);
const previewQueue = ref(['A001', 'A004', 'A006', 'A010']);
const currentPreview = ref(previewQueue.value[0]);
let reviewTimer;

const summaryCards = computed(() => {
  const total = results.value.length;
  const pending = results.value.filter((r) => r.status === 'pending').length;
  const reviewed = results.value.filter((r) => r.status === 'reviewed').length;
  const flagged = results.value.filter((r) => r.status === 'flagged').length;
  return [
    { title: '总样本数', value: total, desc: '本批次已完成推理' },
    { title: '待复核', value: pending, desc: '等待人工确认' },
    { title: '已确认', value: reviewed, desc: '人工复核完成' },
    { title: '需关注', value: flagged, desc: '需重新评估' }
  ];
});

const filteredResults = computed(() =>
  results.value.filter((item) => {
    const matchText = `${item.id}${item.label}${item.note}${item.reviewer}`
      .toLowerCase()
      .includes(filters.value.query.toLowerCase());
    const matchStatus = filters.value.status === 'all' || item.status === filters.value.status;
    return matchText && matchStatus;
  })
);

const refresh = () => {
  // 模拟刷新
  exportProgress.value = 10;
  currentPreview.value = previewQueue.value[(previewQueue.value.indexOf(currentPreview.value) + 1) % previewQueue.value.length];
};

const sortByScore = () => {
  results.value = [...results.value].sort((a, b) => b.score - a.score);
};

const openNote = (item) => {
  selectedItem.value = item;
  note.value = item.note;
  assignee.value = item.reviewer;
  showNote.value = true;
};

const submitNote = () => {
  if (selectedItem.value) {
    selectedItem.value.note = note.value;
    selectedItem.value.reviewer = assignee.value;
  }
  note.value = '';
  assignee.value = '';
  showNote.value = false;
};

const openExport = () => {
  exportProgress.value = 10;
  showExport.value = true;
};

const exportResult = () => {
  exportProgress.value = Math.min(100, exportProgress.value + 30);
};

const openDetail = (item) => {
  selectedItem.value = item;
  showDetail.value = true;
};

const markReviewed = (item) => {
  selectedItem.value = item;
  exportProgress.value = 10;
  showDetail.value = true;
  if (reviewTimer) clearInterval(reviewTimer);
  reviewTimer = setInterval(() => {
    exportProgress.value = Math.min(100, exportProgress.value + 20);
    if (exportProgress.value >= 100) {
      clearInterval(reviewTimer);
      item.status = 'reviewed';
      item.reviewer = '自动复核';
    }
  }, 300);
};

const flagCurrent = () => {
  const target = results.value.find((r) => r.id === currentPreview.value);
  if (target) {
    target.status = 'flagged';
    selectedItem.value = target;
    showDetail.value = true;
  }
};

onUnmounted(() => {
  if (reviewTimer) clearInterval(reviewTimer);
});
</script>

<style scoped>
.results-layout {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.section-head {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.summary-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
}

.filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}

.table-actions {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.previews {
  min-height: 320px;
}

.preview-box {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.preview {
  background: #fff7ed;
  border: 1px dashed #fed7aa;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: #f97316;
  font-weight: 700;
}

.preview.processed {
  background: #ecfeff;
  color: #0ea5e9;
  border-color: #bae6fd;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.status-pill.pending {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fcd34d;
}

.status-pill.reviewed {
  background: #ecfdf3;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-pill.flagged {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.strong {
  font-weight: 700;
}
</style>
