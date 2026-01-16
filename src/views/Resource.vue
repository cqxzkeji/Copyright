<template>
  <section class="card">
    <div class="card-header">
      <div>
        <div class="card-title">农业资源管理</div>
        <div style="color: var(--muted); font-size: 13px;">农机设备、农资库存统一管理与统计。</div>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="button-secondary" type="button" @click="showInventoryModal = true">库存盘点</button>
        <button class="button-secondary" type="button" @click="showMaintenanceModal = true">设备保养</button>
        <button class="button-secondary" type="button" @click="startTransfer">调拨进度</button>
        <button class="button-primary" type="button" @click="showAddModal = true">新增资源</button>
      </div>
    </div>
    <div class="grid-3">
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">设备总数</div>
        <div style="font-size: 26px; font-weight: 700;">54 台</div>
        <div style="color: var(--accent); font-size: 13px;">在线率 94%</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">库存物资</div>
        <div style="font-size: 26px; font-weight: 700;">128 项</div>
        <div style="color: var(--accent); font-size: 13px;">安全库存 92%</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">待保养</div>
        <div style="font-size: 26px; font-weight: 700;">6 台</div>
        <div style="color: #f97316; font-size: 13px;">优先处理 2 台</div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">资源利用概览</div>
      <span class="chip">设备使用率 / 库存周转率</span>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
      <svg viewBox="0 0 600 220" style="width: 100%; height: 220px;">
        <polyline
          fill="none"
          stroke="#2a7c4f"
          stroke-width="3"
          points="0,180 80,160 160,140 240,120 320,110 400,100 480,90 560,70"
        />
        <polyline
          fill="none"
          stroke="#1f8fdd"
          stroke-width="3"
          points="0,200 80,190 160,175 240,150 320,140 400,130 480,120 560,110"
        />
      </svg>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">设备使用率</div>
          <div style="font-size: 22px; font-weight: 700;">82%</div>
        </div>
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">库存周转率</div>
          <div style="font-size: 22px; font-weight: 700;">2.6 次/月</div>
        </div>
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">重点资源</div>
          <div style="font-size: 22px; font-weight: 700;">18 项</div>
        </div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">资源台账</div>
      <button class="button-ghost" type="button" @click="showTipModal = true">台账说明</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>资源编号</th>
          <th>类别</th>
          <th>名称</th>
          <th>库存/数量</th>
          <th>状态</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in resources" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.amount }}</td>
          <td><span class="chip">{{ item.status }}</span></td>
          <td>{{ item.owner }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal
    :open="showAddModal"
    title="新增资源"
    @close="showAddModal = false"
    @confirm="confirmAdd"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>资源名称</label>
        <input v-model="addForm.name" placeholder="例如：植保无人机" />
      </div>
      <div class="form-field">
        <label>类别</label>
        <select v-model="addForm.category">
          <option>农机设备</option>
          <option>农资库存</option>
          <option>能源设备</option>
        </select>
      </div>
      <div class="form-field">
        <label>数量</label>
        <input v-model="addForm.amount" placeholder="例如：2 台" />
      </div>
      <div class="form-field">
        <label>负责人</label>
        <input v-model="addForm.owner" placeholder="例如：赵工" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showInventoryModal"
    title="库存盘点"
    @close="showInventoryModal = false"
    @confirm="confirmInventory"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>盘点日期</label>
        <input v-model="inventoryForm.date" placeholder="例如：2024-03-20" />
      </div>
      <div class="form-field">
        <label>盘点范围</label>
        <input v-model="inventoryForm.range" placeholder="例如：全场" />
      </div>
      <div class="form-field">
        <label>负责人</label>
        <input v-model="inventoryForm.owner" placeholder="例如：陈工" />
      </div>
      <div class="form-field">
        <label>备注</label>
        <input v-model="inventoryForm.note" placeholder="盘点重点说明" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showMaintenanceModal"
    title="设备保养"
    @close="showMaintenanceModal = false"
    @confirm="confirmMaintenance"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>设备编号</label>
        <input v-model="maintenanceForm.id" placeholder="例如：M-020" />
      </div>
      <div class="form-field">
        <label>保养类型</label>
        <select v-model="maintenanceForm.type">
          <option>常规检查</option>
          <option>深度保养</option>
          <option>紧急维修</option>
        </select>
      </div>
      <div class="form-field">
        <label>预约时间</label>
        <input v-model="maintenanceForm.time" placeholder="例如：本周五 14:00" />
      </div>
      <div class="form-field">
        <label>负责人</label>
        <input v-model="maintenanceForm.owner" placeholder="例如：周工" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showTransferModal"
    title="资源调拨进度"
    @close="closeTransfer"
    @confirm="closeTransfer"
  >
    <p>正在调拨温室 A 区物资至南区仓库。</p>
    <div class="progress-bar">
      <span :style="{ width: transferProgress + '%' }"></span>
    </div>
    <div style="color: var(--muted); font-size: 13px;">{{ transferProgress }}% 已完成</div>
  </BaseModal>

  <BaseModal
    :open="showTipModal"
    title="台账说明"
    @close="showTipModal = false"
    @confirm="showTipModal = false"
  >
    <p style="color: var(--muted); line-height: 1.6;">
      台账展示当前设备与库存状态，状态为“待补充”表示库存低于安全阈值。
    </p>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const resources = Array.from({ length: 24 }, (_, index) => ({
  id: `R-${300 + index}`,
  category: index % 2 === 0 ? '农机设备' : '农资库存',
  name: index % 2 === 0 ? '智能喷灌机' : '生物肥料',
  amount: index % 2 === 0 ? `${2 + (index % 4)} 台` : `${30 + index} 袋`,
  status: index % 5 === 0 ? '待补充' : '正常',
  owner: ['赵工', '孙工', '刘工'][index % 3]
}));

const showAddModal = ref(false);
const showInventoryModal = ref(false);
const showMaintenanceModal = ref(false);
const showTransferModal = ref(false);
const showTipModal = ref(false);

const addForm = reactive({
  name: '',
  category: '农机设备',
  amount: '',
  owner: ''
});

const inventoryForm = reactive({
  date: '',
  range: '',
  owner: '',
  note: ''
});

const maintenanceForm = reactive({
  id: '',
  type: '常规检查',
  time: '',
  owner: ''
});

const transferProgress = ref(0);
let timer;

const startTransfer = () => {
  transferProgress.value = 0;
  showTransferModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (transferProgress.value < 100) {
      transferProgress.value += 15;
    } else {
      clearInterval(timer);
    }
  }, 260);
};

const closeTransfer = () => {
  showTransferModal.value = false;
  transferProgress.value = 100;
};

const confirmAdd = () => {
  showAddModal.value = false;
};

const confirmInventory = () => {
  showInventoryModal.value = false;
};

const confirmMaintenance = () => {
  showMaintenanceModal.value = false;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
