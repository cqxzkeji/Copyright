<template>
  <div class="card">
    <div class="section-header">
      <div>
        <p class="badge">仓储温控</p>
        <h3 style="margin:6px 0 0;">库存管理</h3>
      </div>
      <div class="tag-row">
        <button class="primary-btn" @click="showCheck = true">盘点库存</button>
        <button class="secondary-btn" @click="showProgress('生成补货单')">生成补货单</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="slot in coldChain" :key="slot.label">
        <div class="section-header">
          <div>
            <p class="badge" :style="slot.badgeStyle">{{ slot.label }}</p>
            <h4 style="margin:4px 0 0;">{{ slot.value }}</h4>
          </div>
          <span class="badge" style="background:#fef9c3;color:#92400e;">{{ slot.note }}</span>
        </div>
        <div class="chart-bar" style="margin-top:10px;">
          <span :style="{ width: slot.percent + '%', background: slot.color }"></span>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>仓库</th>
          <th>商品</th>
          <th>批次</th>
          <th>可售库存</th>
          <th>预警值</th>
          <th>到期日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="batch in batches" :key="batch.batchNo">
          <td>{{ batch.warehouse }}</td>
          <td>{{ batch.product }}</td>
          <td>{{ batch.batchNo }}</td>
          <td>{{ batch.stock }}</td>
          <td>{{ batch.threshold }}</td>
          <td>{{ batch.expire }}</td>
          <td class="tag-row">
            <button class="secondary-btn" @click="openTransfer(batch)">调拨</button>
            <button class="secondary-btn" @click="openFreeze(batch)">冻结</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showCheck" title="库存盘点">
    <form class="form-grid" @submit.prevent="submitCheck">
      <label>仓库<select v-model="checkForm.warehouse" required>
          <option value="">请选择</option>
          <option>华东冷链一号库</option>
          <option>华南干仓中心</option>
          <option>西南原产仓</option>
        </select></label>
      <label>盘点负责人<input v-model="checkForm.owner" required /></label>
      <label>盘点范围<select v-model="checkForm.scope"><option>整仓</option><option>批次</option><option>品类</option></select></label>
      <label>复核人<input v-model="checkForm.reviewer" /></label>
      <label style="grid-column:1/-1;">备注<textarea v-model="checkForm.remark" rows="2"></textarea></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showCheck=false">取消</button>
        <button class="primary-btn" type="submit">提交盘点</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showTransfer" title="仓库调拨">
    <p style="margin:0 0 12px;color:#475569;">将批次 {{ selected.batchNo }} 从 {{ selected.warehouse }} 调拨至其他仓。</p>
    <form class="form-grid" @submit.prevent="submitTransfer">
      <label>目标仓库<select v-model="selected.target" required>
          <option>华北集散中心</option>
          <option>西南原产仓</option>
          <option>华南干仓中心</option>
        </select></label>
      <label>调拨数量<input v-model.number="selected.qty" type="number" min="1" required /></label>
      <label style="grid-column:1/-1;">运输方式<select v-model="selected.mode"><option>冷链车</option><option>常温车</option><option>空运</option></select></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showTransfer=false">取消</button>
        <button class="primary-btn" type="submit">确认调拨</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showFreeze" title="冻结批次">
    <p style="margin:0 0 12px;color:#475569;">批次 {{ selected.batchNo }} 进入质量复核，期间将冻结可售库存。</p>
    <div class="progress-track">
      <div class="progress-thumb" style="width:48%;"></div>
    </div>
    <div class="tag-row" style="margin-top:12px;">
      <button class="secondary-btn" @click="showFreeze=false">取消</button>
      <button class="primary-btn" @click="showFreeze=false">确认冻结</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showProgressModal" :title="progressTitle">
    <p style="color:#475569;margin-top:0;">系统正在处理，请耐心等待。</p>
    <div class="progress-track" style="margin:10px 0 12px;">
      <div class="progress-thumb" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin:0;color:#16a34a;">当前进度：{{ progress }}%</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const batches = reactive([
  { warehouse: '华东冷链一号库', product: '赣南脐橙', batchNo: 'GN202401', stock: 180, threshold: 120, expire: '2024-12-20' },
  { warehouse: '华东冷链一号库', product: '冷鲜鸡胸肉', batchNo: 'JX202405', stock: 90, threshold: 80, expire: '2024-06-18' },
  { warehouse: '华南干仓中心', product: '东北大米', batchNo: 'DM202403', stock: 260, threshold: 200, expire: '2025-03-01' },
  { warehouse: '华南干仓中心', product: '五常稻花香', batchNo: 'DH202402', stock: 120, threshold: 90, expire: '2025-01-15' },
  { warehouse: '西南原产仓', product: '云南松茸干片', batchNo: 'SR202404', stock: 40, threshold: 25, expire: '2025-02-20' },
  { warehouse: '西南原产仓', product: '高山绿茶', batchNo: 'LT202401', stock: 150, threshold: 100, expire: '2025-05-10' },
  { warehouse: '华北集散中心', product: '生态黑猪肉', batchNo: 'HP202402', stock: 70, threshold: 60, expire: '2024-07-05' },
  { warehouse: '华北集散中心', product: '赣州脆枣', batchNo: 'CZ202404', stock: 110, threshold: 80, expire: '2024-12-02' },
  { warehouse: '华东冷链一号库', product: '散养土鸡蛋', batchNo: 'DJ202403', stock: 240, threshold: 200, expire: '2024-10-12' },
  { warehouse: '华南干仓中心', product: '有机西红柿', batchNo: 'XM202405', stock: 85, threshold: 60, expire: '2024-06-25' }
]);

const coldChain = [
  { label: '冷链库存', value: '620 件', percent: 72, color: '#22c55e', note: '温区 2-8℃', badgeStyle: { background: '#dcfce7', color: '#166534' } },
  { label: '干仓库存', value: '780 件', percent: 65, color: '#38bdf8', note: '湿度 55%', badgeStyle: { background: '#e0f2fe', color: '#0369a1' } },
  { label: '临期商品', value: '14 件', percent: 26, color: '#f97316', note: '需优先售卖', badgeStyle: { background: '#fff7ed', color: '#c2410c' } }
];

const showCheck = ref(false);
const showTransfer = ref(false);
const showFreeze = ref(false);
const showProgressModal = ref(false);
const progressTitle = ref('');
const progress = ref(40);
const selected = reactive({});

const checkForm = reactive({ warehouse: '', owner: '', scope: '整仓', reviewer: '', remark: '' });

const showProgress = (title) => {
  progressTitle.value = title;
  showProgressModal.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 18);
    if (progress.value >= 100) clearInterval(timer);
  }, 450);
};

const submitCheck = () => {
  showCheck.value = false;
  showProgress('盘点数据同步');
};

const openTransfer = (batch) => {
  Object.assign(selected, batch, { target: '华北集散中心', qty: 20, mode: '冷链车' });
  showTransfer.value = true;
};

const submitTransfer = () => {
  showTransfer.value = false;
  showProgress('调拨任务提交');
};

const openFreeze = (batch) => {
  Object.assign(selected, batch);
  showFreeze.value = true;
};
</script>
