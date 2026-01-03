<template>
  <section class="card">
    <header class="section-header">
      <div>
        <p class="subtitle">结果应用与导出</p>
        <h3>配方发布与生产落地</h3>
      </div>
      <div class="button-row">
        <button class="btn" @click="openPublish">发布配方</button>
        <button class="btn" @click="openPush">推送生产线</button>
        <button class="btn secondary" @click="openExport">导出报表</button>
      </div>
    </header>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card stat">
        <p class="label">已发布</p>
        <div class="hero-number">{{ released }} 份</div>
        <p class="muted">包含最新算法结果</p>
      </div>
      <div class="card stat">
        <p class="label">生产同步</p>
        <div class="hero-number">{{ synced }} 条</div>
        <div class="progress-bar"><span :style="{ width: syncRate + '%' }"></span></div>
      </div>
      <div class="card stat">
        <p class="label">近期导出</p>
        <div class="hero-number">{{ exports }} 份</div>
        <p class="muted">含 CSV 与 PDF 报表</p>
      </div>
    </div>

    <table class="table-grid">
      <thead>
        <tr>
          <th>批次</th>
          <th>配方名称</th>
          <th>目标产量</th>
          <th>发布人</th>
          <th>状态</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in schedules" :key="item.batch">
          <td>{{ item.batch }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.volume }} 吨</td>
          <td>{{ item.owner }}</td>
          <td>
            <span class="tag" :style="{ background: item.status === '同步完成' ? '#dcfce7' : '#e0f2fe', color: item.status === '同步完成' ? '#166534' : '#075985' }">
              {{ item.status }}
            </span>
          </td>
          <td>{{ item.note }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <div v-if="modal.open" class="modal-mask">
    <div class="modal-card">
      <h3>{{ modal.title }}</h3>
      <p class="muted">{{ modal.message }}</p>
      <div v-if="modal.type === 'publish'" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <label>配方名称<input v-model="form.name" placeholder="高蛋白育肥料" /></label>
        <label>生产批次<input v-model="form.batch" placeholder="2024Q3-01" /></label>
        <label>预计产量(吨)<input v-model.number="form.volume" type="number" /></label>
      </div>
      <div v-else-if="modal.type === 'push'">
        <p>推送到生产线，包含物料比例与质量阈值。</p>
        <div class="alert-info">同步完成后将通知车间质控。</div>
      </div>
      <div v-else-if="modal.type === 'export'">
        <p>选择导出格式</p>
        <label><input type="checkbox" v-model="form.exportPDF" /> PDF 报表</label>
        <label><input type="checkbox" v-model="form.exportCSV" /> CSV 明细</label>
      </div>
      <div class="modal-actions">
        <button class="secondary" @click="modal.open = false">取消</button>
        <button @click="confirmModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const schedules = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    batch: `B-${2024 + Math.floor(i / 4)}-${(i % 4) + 1}`,
    name: `养殖配方-${i + 1}`,
    volume: 120 + i * 5,
    owner: ['周工', '李工', '王工', '陈工'][i % 4],
    status: i % 3 === 0 ? '同步完成' : '待下发',
    note: i % 3 === 0 ? '已锁定比例' : '等待排产时间'
  }))
);

const modal = reactive({ open: false, title: '', message: '', type: '' });
const form = reactive({ name: '', batch: '', volume: 100, exportPDF: true, exportCSV: true });

const released = computed(() => schedules.filter(s => s.status === '同步完成').length);
const synced = computed(() => schedules.filter(s => s.status === '同步完成').length * 3);
const syncRate = computed(() => Math.min(100, Math.round((released.value / schedules.length) * 100)));
const exports = computed(() => schedules.length - 3);

const openPublish = () => {
  modal.open = true;
  modal.title = '发布配方';
  modal.message = '填写配方名称与批次，发布后可推送生产。';
  modal.type = 'publish';
};

const openPush = () => {
  modal.open = true;
  modal.title = '推送生产线';
  modal.message = '同步到生产设备，确保比例一致。';
  modal.type = 'push';
};

const openExport = () => {
  modal.open = true;
  modal.title = '导出报表';
  modal.message = '选择需要导出的报表格式。';
  modal.type = 'export';
};

const confirmModal = () => {
  if (modal.type === 'publish' && form.name) {
    schedules.unshift({
      batch: form.batch || 'B-2024-NEW',
      name: form.name,
      volume: form.volume,
      owner: 'demo_admin',
      status: '待下发',
      note: '新发布'
    });
  }
  modal.open = false;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.button-row {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.label {
  margin: 0;
  color: #475569;
}

.muted {
  color: #6b7280;
}
</style>
