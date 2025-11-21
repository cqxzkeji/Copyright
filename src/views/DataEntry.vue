<template>
  <div class="module-grid">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>采集任务列表</h2>
          <p>监控到的实时传感器与巡检人员上报情况</p>
        </div>
        <div class="panel-actions">
          <button class="primary" @click="openCreate">新增采集记录</button>
          <button class="ghost" @click="simulateUpload">批量导入</button>
        </div>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <span>批次号</span>
          <span>作物</span>
          <span>采集人</span>
          <span>状态</span>
        </div>
        <div class="table-row" v-for="item in tasks" :key="item.batch">
          <span>{{ item.batch }}</span>
          <span>{{ item.crop }}</span>
          <span>{{ item.owner }}</span>
          <span :class="['tag', item.status]">{{ item.statusLabel }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>待提交数据包</h2>
          <p>采集完成的数据可统一校验后入库</p>
        </div>
        <button class="secondary" @click="reviewPackage">提交审核</button>
      </div>
      <ul class="package-list">
        <li v-for="pkg in packages" :key="pkg.id">
          <div>
            <strong>{{ pkg.name }}</strong>
            <p>{{ pkg.size }} · {{ pkg.time }}</p>
          </div>
          <button class="ghost" @click="openPreview(pkg)">预览</button>
        </li>
      </ul>
    </section>

    <ModalDialog
      :show="showCreate"
      title="新增采集记录"
      confirm-text="保存记录"
      @close="showCreate = false"
      @confirm="saveRecord"
    >
      <div class="form-grid">
        <label>批次号<input v-model="newRecord.batch" /></label>
        <label>作物种类<input v-model="newRecord.crop" /></label>
        <label>采集人<input v-model="newRecord.owner" /></label>
        <label>水分含量(%)<input v-model="newRecord.moisture" /></label>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="showUpload"
      title="批量导入"
      confirm-text="继续导入"
      @close="showUpload = false"
      @confirm="showUpload = false"
    >
      <p>正在解析 Excel 模板，预计还需 {{ uploadProgress }}% 完成。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="!!previewTarget"
      title="数据包内容"
      confirm-text="关闭"
      @close="previewTarget = null"
      @confirm="previewTarget = null"
    >
      <p>批次范围：{{ previewTarget?.range }}</p>
      <p>采集记录：{{ previewTarget?.records }} 条</p>
      <p>质检异常：{{ previewTarget?.alerts }}</p>
    </ModalDialog>

    <ModalDialog
      :show="showReview"
      title="提交审核"
      confirm-text="发起校验"
      @close="showReview = false"
      @confirm="showReview = false"
    >
      <p>已勾选 {{ packages.length }} 个数据包，将同步推送至质检中心。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const tasks = ref([
  { batch: 'HN2024030101', crop: '西兰花', owner: '赵勇', status: 'pending', statusLabel: '待校验' },
  { batch: 'HN2024030102', crop: '胡萝卜', owner: '王敏', status: 'success', statusLabel: '已入库' },
  { batch: 'HN2024030103', crop: '草莓', owner: '彭丽', status: 'warning', statusLabel: '需复检' }
]);

const packages = ref([
  { id: 1, name: '乐昌基地批次包', size: '34.2MB', time: '5 分钟前', range: 'LC2301-2308', records: 128, alerts: 2 },
  { id: 2, name: '湟源高原基地批次包', size: '12.6MB', time: '12 分钟前', range: 'QH1201-1203', records: 64, alerts: 0 }
]);

const showCreate = ref(false);
const showUpload = ref(false);
const showReview = ref(false);
const previewTarget = ref(null);
const uploadProgress = ref(10);
const newRecord = reactive({ batch: '', crop: '', owner: '', moisture: '' });

const openCreate = () => {
  showCreate.value = true;
};

const saveRecord = () => {
  if (!newRecord.batch) return;
  tasks.value.push({
    batch: newRecord.batch,
    crop: newRecord.crop,
    owner: newRecord.owner,
    status: 'pending',
    statusLabel: '待校验'
  });
  showCreate.value = false;
  newRecord.batch = '';
  newRecord.crop = '';
  newRecord.owner = '';
  newRecord.moisture = '';
};

const simulateUpload = () => {
  showUpload.value = true;
  uploadProgress.value = 10;
  const timer = setInterval(() => {
    if (uploadProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    uploadProgress.value += 20;
  }, 400);
};

const openPreview = (pkg) => {
  previewTarget.value = pkg;
};

const reviewPackage = () => {
  showReview.value = true;
};
</script>

<style scoped>
.module-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.panel {
  flex: 1 1 45%;
  background: #f9fafb;
  border-radius: 20px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

.table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #fff;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  align-items: center;
  font-size: 0.95rem;
}

.table-head {
  background: transparent;
  font-weight: 600;
}

.tag {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  text-align: center;
}

.tag.pending {
  background: #fef3c7;
  color: #92400e;
}

.tag.success {
  background: #dcfce7;
  color: #166534;
}

.tag.warning {
  background: #fee2e2;
  color: #b91c1c;
}

.package-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.package-list li {
  background: #fff;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.ghost {
  background: #ecfccb;
  color: #4d7c0f;
}

.secondary {
  background: #0ea5e9;
  color: #fff;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

@media (max-width: 1024px) {
  .panel {
    flex: 1 1 100%;
  }
}
</style>
