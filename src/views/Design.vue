<template>
  <div class="page">
    <div class="grid overview" :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }">
      <div class="card overview-card">
        <h3>结构参数配置</h3>
        <p>已配置 18 组关键参数，涉及座垫、靠背与滑轨。</p>
        <div class="overview-actions">
          <button class="primary" type="button" @click="openModal('parameter')">更新参数</button>
          <button class="ghost" type="button" @click="openModal('tips')">配置提示</button>
        </div>
      </div>
      <div class="card overview-card">
        <h3>BOM 配置完成度</h3>
        <p>共 128 项零件，完成度 78%。</p>
        <div class="progress-bar"><span :style="{ width: '78%' }"></span></div>
        <button class="ghost" type="button" @click="openModal('progress')">查看进度</button>
      </div>
      <div class="card overview-card">
        <h3>结构示意图</h3>
        <img class="overview-image" src="/src/assets/seat-diagram.svg" alt="结构示意" />
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>结构参数与BOM清单</h3>
          <p>包含结构尺寸、材料及供应商信息。</p>
        </div>
        <div class="table-actions">
          <button class="ghost" type="button" @click="openModal('component')">新增零件</button>
          <button class="primary" type="button" @click="openModal('bom')">生成BOM</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>零件编号</th>
            <th>部件名称</th>
            <th>材料</th>
            <th>关键尺寸</th>
            <th>供应商</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in components" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.vendor }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'parameter'">
        <div class="input-group">
          <label>参数名称</label>
          <input v-model="form.parameter" placeholder="如：座垫厚度" />
        </div>
        <div class="input-group">
          <label>目标值</label>
          <input v-model="form.value" placeholder="如：120mm" />
        </div>
        <div class="input-group">
          <label>影响范围</label>
          <select v-model="form.scope">
            <option>座垫</option>
            <option>靠背</option>
            <option>滑轨</option>
          </select>
        </div>
      </template>
      <template v-else-if="activeModal === 'component'">
        <div class="input-group">
          <label>零件名称</label>
          <input v-model="form.component" placeholder="如：调角器总成" />
        </div>
        <div class="input-group">
          <label>材料</label>
          <input v-model="form.material" placeholder="如：高强钢" />
        </div>
        <div class="input-group">
          <label>供应商</label>
          <input v-model="form.vendor" placeholder="如：华北座椅" />
        </div>
      </template>
      <template v-else-if="activeModal === 'bom'">
        <p>已生成最新BOM版本，将同步到供应链平台。</p>
        <div class="input-group">
          <label>版本号</label>
          <input v-model="form.version" placeholder="如：BOM-2024-09" />
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>当前BOM完成度 78%，待确认件集中在座椅加热与通风系统。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: '78%' }"></span>
        </div>
      </template>
      <template v-else-if="activeModal === 'tips'">
        <ul>
          <li>更新参数时需同步仿真参数组。</li>
          <li>BOM生成后自动触发版本归档流程。</li>
          <li>新增零件需填写供应商交期。</li>
        </ul>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const components = [
  { code: 'D-001', name: '座垫骨架', material: '高强钢', size: '520mm', vendor: '华北座椅', status: '已确认' },
  { code: 'D-002', name: '靠背骨架', material: '高强钢', size: '480mm', vendor: '华北座椅', status: '已确认' },
  { code: 'D-003', name: '滑轨组件', material: '合金钢', size: '360mm', vendor: '京泰', status: '已确认' },
  { code: 'D-004', name: '调角器', material: '合金钢', size: '120mm', vendor: '江苏利合', status: '待确认' },
  { code: 'D-005', name: '头枕支架', material: '铝合金', size: '160mm', vendor: '益达', status: '已确认' },
  { code: 'D-006', name: '泡沫座垫', material: 'PU泡沫', size: '520mm', vendor: '北方泡棉', status: '已确认' },
  { code: 'D-007', name: '泡沫靠背', material: 'PU泡沫', size: '480mm', vendor: '北方泡棉', status: '已确认' },
  { code: 'D-008', name: '座椅面套', material: '环保皮革', size: '整套', vendor: '宏远', status: '待确认' },
  { code: 'D-009', name: '腰托机构', material: 'ABS', size: '220mm', vendor: '奥瑞', status: '已确认' },
  { code: 'D-010', name: '侧翼支架', material: '高强钢', size: '240mm', vendor: '华北座椅', status: '已确认' },
  { code: 'D-011', name: '头枕泡沫', material: 'PU泡沫', size: '180mm', vendor: '北方泡棉', status: '已确认' },
  { code: 'D-012', name: '电动调节器', material: '电机总成', size: '280mm', vendor: '宁德', status: '待确认' },
  { code: 'D-013', name: '加热垫', material: '碳纤维', size: '460mm', vendor: '南通', status: '已确认' },
  { code: 'D-014', name: '通风模块', material: '风机组件', size: '120mm', vendor: '拓新', status: '待确认' },
  { code: 'D-015', name: '安全带导向', material: '高强钢', size: '80mm', vendor: '京泰', status: '已确认' },
  { code: 'D-016', name: '座垫托板', material: '复合材料', size: '520mm', vendor: '协诚', status: '已确认' },
  { code: 'D-017', name: '头枕锁止', material: '合金钢', size: '140mm', vendor: '江苏利合', status: '已确认' },
  { code: 'D-018', name: '扶手组件', material: 'ABS', size: '260mm', vendor: '奥瑞', status: '待确认' },
  { code: 'D-019', name: '饰板', material: 'ABS', size: '240mm', vendor: '宏远', status: '已确认' },
  { code: 'D-020', name: '线束总成', material: '铜线', size: '1.2m', vendor: '宁德', status: '已确认' },
];

const activeModal = ref('');
const form = reactive({
  parameter: '',
  value: '',
  scope: '座垫',
  component: '',
  material: '',
  vendor: '',
  version: '',
});

const modalTitle = computed(() => {
  const map = {
    parameter: '更新参数',
    component: '新增零件',
    bom: '生成BOM',
    progress: 'BOM进度',
    tips: '配置提示',
  };
  return map[activeModal.value] || '弹窗';
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const confirmModal = () => {
  closeModal();
};
</script>

<style scoped>
.overview {
  margin-bottom: 20px;
}

.overview-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overview-actions {
  display: flex;
  gap: 10px;
}

.overview-image {
  width: 100%;
  border-radius: 14px;
}

.table-card {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: linear-gradient(90deg, #38bdf8, #4f46e5);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.ghost {
  background: #e2e8f0;
  color: #334155;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
