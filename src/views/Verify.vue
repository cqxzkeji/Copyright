<template>
  <div class="page">
    <div class="grid overview" :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }">
      <div class="card overview-card">
        <h3>仿真任务</h3>
        <p>正在运行 6 项，已完成 18 项。</p>
        <div class="overview-actions">
          <button class="primary" type="button" @click="openModal('simulate')">启动仿真</button>
          <button class="ghost" type="button" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="card overview-card">
        <h3>试验完成度</h3>
        <p>关键试验完成度 64%，剩余冲击试验待排期。</p>
        <div class="progress-bar"><span :style="{ width: '64%' }"></span></div>
        <button class="ghost" type="button" @click="openModal('progress')">查看进度</button>
      </div>
      <div class="card overview-card">
        <h3>验证趋势图</h3>
        <img class="overview-image" src="/src/assets/seat-diagram.svg" alt="验证趋势" />
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>仿真与试验记录</h3>
          <p>记录仿真结果、试验结论与改进建议。</p>
        </div>
        <div class="table-actions">
          <button class="ghost" type="button" @click="openModal('test')">登记试验</button>
          <button class="primary" type="button" @click="openModal('report')">输出报告</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>类型</th>
            <th>工况</th>
            <th>结果</th>
            <th>负责人</th>
            <th>结论</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.code">
            <td>{{ record.code }}</td>
            <td>{{ record.type }}</td>
            <td>{{ record.case }}</td>
            <td>{{ record.result }}</td>
            <td>{{ record.owner }}</td>
            <td><span class="badge">{{ record.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'simulate'">
        <div class="input-group">
          <label>仿真场景</label>
          <input v-model="form.simulation" placeholder="如：正面冲击 30G" />
        </div>
        <div class="input-group">
          <label>模型版本</label>
          <input v-model="form.modelVersion" placeholder="如：SIM-24-09" />
        </div>
        <div class="input-group">
          <label>预计完成</label>
          <input v-model="form.simulationDate" type="date" />
        </div>
      </template>
      <template v-else-if="activeModal === 'test'">
        <div class="input-group">
          <label>试验名称</label>
          <input v-model="form.testName" placeholder="如：座椅强度耐久" />
        </div>
        <div class="input-group">
          <label>样件批次</label>
          <input v-model="form.batch" placeholder="如：T-2024-05" />
        </div>
        <div class="input-group">
          <label>试验结论</label>
          <textarea v-model="form.testNote" rows="3" placeholder="填写试验结果"></textarea>
        </div>
      </template>
      <template v-else-if="activeModal === 'report'">
        <p>报告将包含当前仿真与试验结果，自动同步到项目档案。</p>
        <div class="input-group">
          <label>报告版本</label>
          <input v-model="form.reportVersion" placeholder="如：VR-2024-09" />
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>试验完成度 64%，待安排的试验包括后排碰撞与滑轨疲劳。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: '64%' }"></span>
        </div>
      </template>
      <template v-else-if="activeModal === 'tips'">
        <ul>
          <li>仿真任务启动前确认模型版本与网格密度。</li>
          <li>试验登记需上传图片与传感器数据。</li>
          <li>输出报告后自动触发变更评审。</li>
        </ul>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const records = [
  { code: 'V-001', type: '仿真', case: '正面冲击30G', result: '位移 18mm', owner: '李欣', status: '通过' },
  { code: 'V-002', type: '试验', case: '靠背强度', result: '18.5kN', owner: '王凯', status: '通过' },
  { code: 'V-003', type: '仿真', case: '侧向碰撞', result: '位移 22mm', owner: '陈昕', status: '需优化' },
  { code: 'V-004', type: '试验', case: '滑轨耐久', result: '无失效', owner: '刘雅', status: '通过' },
  { code: 'V-005', type: '仿真', case: '座垫疲劳', result: '寿命 85%', owner: '周晨', status: '通过' },
  { code: 'V-006', type: '试验', case: '头枕冲击', result: '偏移 12mm', owner: '林涛', status: '需优化' },
  { code: 'V-007', type: '仿真', case: 'E-NCAP', result: '评分 4.5', owner: '孙悦', status: '通过' },
  { code: 'V-008', type: '试验', case: 'ISOFIX 强度', result: '7.6kN', owner: '郭明', status: '通过' },
  { code: 'V-009', type: '仿真', case: '腰托变形', result: '变形 4mm', owner: '许婷', status: '通过' },
  { code: 'V-010', type: '试验', case: '扶手耐久', result: '无异常', owner: '韩飞', status: '通过' },
  { code: 'V-011', type: '仿真', case: '滑轨冲击', result: '变形 8mm', owner: '郑鹏', status: '需优化' },
  { code: 'V-012', type: '试验', case: '座垫回弹', result: '92%', owner: '段慧', status: '通过' },
  { code: 'V-013', type: '仿真', case: '头枕疲劳', result: '寿命 88%', owner: '张森', status: '通过' },
  { code: 'V-014', type: '试验', case: '安全带导向', result: '无失效', owner: '孔娜', status: '通过' },
  { code: 'V-015', type: '仿真', case: '侧翼强度', result: '变形 6mm', owner: '沈越', status: '通过' },
  { code: 'V-016', type: '试验', case: '座椅震动', result: '舒适达标', owner: '蒋程', status: '通过' },
  { code: 'V-017', type: '仿真', case: '热管理', result: '温升 2℃', owner: '彭蕾', status: '通过' },
  { code: 'V-018', type: '试验', case: '通风测试', result: '风量 12m³', owner: '许平', status: '通过' },
  { code: 'V-019', type: '仿真', case: '座垫硬度', result: '55±3', owner: '宋琪', status: '通过' },
  { code: 'V-020', type: '试验', case: '靠背锁止', result: '15.2kN', owner: '何卓', status: '通过' },
];

const activeModal = ref('');
const form = reactive({
  simulation: '',
  modelVersion: '',
  simulationDate: '',
  testName: '',
  batch: '',
  testNote: '',
  reportVersion: '',
});

const modalTitle = computed(() => {
  const map = {
    simulate: '启动仿真',
    test: '登记试验',
    report: '输出报告',
    progress: '试验进度',
    tips: '提示信息',
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
