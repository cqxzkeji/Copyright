<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>采摘计划与库存联动</h2>
        <p>根据预约订单自动生成采摘计划，联动实时库存，避免超采与滞销。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('plan')">生成采摘计划</button>
        <button class="ghost" @click="openModal('inventory')">同步库存</button>
        <button class="ghost" @click="openModal('dispatch')">调度采摘</button>
        <button class="ghost" @click="openModal('detail')">查看计划详情</button>
      </div>
    </header>

    <div class="summary-grid">
      <div class="summary-card">
        <h3>今日采摘计划</h3>
        <strong>28 批次</strong>
        <span>覆盖 12 个品类</span>
      </div>
      <div class="summary-card">
        <h3>实时库存</h3>
        <strong>18.2 吨</strong>
        <span>预警品类 3 个</span>
      </div>
      <div class="summary-card">
        <h3>采摘效率</h3>
        <strong>96%</strong>
        <span>按时完成率</span>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>计划编号</th>
            <th>品类</th>
            <th>采摘区域</th>
            <th>计划数量(kg)</th>
            <th>库存余量(kg)</th>
            <th>执行状态</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td>{{ plan.id }}</td>
            <td>{{ plan.category }}</td>
            <td>{{ plan.zone }}</td>
            <td>{{ plan.planAmount }}</td>
            <td>{{ plan.stock }}</td>
            <td><span class="tag">{{ plan.status }}</span></td>
            <td>{{ plan.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <div v-if="modalType === 'plan'">
        <p>系统将根据预约订单生成采摘计划，并更新库存占用量。</p>
        <div class="progress-block">
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>计划生成进度：{{ progress }}%</span>
        </div>
      </div>
      <div v-else-if="modalType === 'inventory'" class="form-grid">
        <label>
          库存批次
          <input v-model="form.batch" placeholder="如 2024-S05" />
        </label>
        <label>
          实际库存(kg)
          <input v-model="form.stock" type="number" placeholder="填写实际库存" />
        </label>
        <label>
          库存备注
          <textarea v-model="form.note" rows="3" placeholder="如采后冷链中转" />
        </label>
      </div>
      <div v-else-if="modalType === 'dispatch'" class="form-grid">
        <label>
          采摘小组
          <select v-model="form.team">
            <option value="一组">一组</option>
            <option value="二组">二组</option>
            <option value="三组">三组</option>
          </select>
        </label>
        <label>
          任务计划编号
          <input v-model="form.taskId" placeholder="请输入计划编号" />
        </label>
        <label>
          开始时间
          <input v-model="form.start" type="time" />
        </label>
      </div>
      <div v-else>
        <p>采摘计划详情显示订单占用、库存调整与人员排班信息。</p>
        <ul class="detail-list">
          <li>订单占用量：8120 kg</li>
          <li>库存预留：1930 kg</li>
          <li>调度人员：18 人</li>
          <li>运输车辆：4 辆</li>
        </ul>
      </div>
      <template #footer>
        <button class="ghost" @click="modalVisible = false">关闭</button>
        <button class="primary" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const plans = ref([
  { id: 'HP-24001', category: '草莓', zone: 'A1 温室', planAmount: 420, stock: 620, status: '执行中', owner: '李丹' },
  { id: 'HP-24002', category: '番茄', zone: 'B3 露地', planAmount: 510, stock: 700, status: '待开始', owner: '王涛' },
  { id: 'HP-24003', category: '黄瓜', zone: 'A2 温室', planAmount: 380, stock: 520, status: '执行中', owner: '赵敏' },
  { id: 'HP-24004', category: '葡萄', zone: 'C1 设施园', planAmount: 450, stock: 640, status: '待开始', owner: '刘洋' },
  { id: 'HP-24005', category: '西兰花', zone: 'B2 露地', planAmount: 330, stock: 480, status: '执行中', owner: '孙静' },
  { id: 'HP-24006', category: '辣椒', zone: 'A3 温室', planAmount: 290, stock: 410, status: '待开始', owner: '陈晓' },
  { id: 'HP-24007', category: '生菜', zone: 'B1 露地', planAmount: 260, stock: 350, status: '执行中', owner: '周凯' },
  { id: 'HP-24008', category: '玉米', zone: 'D1 露地', planAmount: 600, stock: 920, status: '待开始', owner: '朱红' },
  { id: 'HP-24009', category: '萝卜', zone: 'D2 露地', planAmount: 410, stock: 590, status: '执行中', owner: '吴凡' },
  { id: 'HP-24010', category: '南瓜', zone: 'C2 设施园', planAmount: 520, stock: 760, status: '待开始', owner: '高翔' },
  { id: 'HP-24011', category: '芹菜', zone: 'B4 露地', planAmount: 300, stock: 460, status: '执行中', owner: '郑燕' },
  { id: 'HP-24012', category: '茄子', zone: 'A4 温室', planAmount: 340, stock: 500, status: '待开始', owner: '胡磊' },
  { id: 'HP-24013', category: '豆角', zone: 'B5 露地', planAmount: 270, stock: 360, status: '执行中', owner: '杜娟' },
  { id: 'HP-24014', category: '菠菜', zone: 'A5 温室', planAmount: 230, stock: 310, status: '待开始', owner: '韩涛' },
  { id: 'HP-24015', category: '西红柿', zone: 'C3 设施园', planAmount: 480, stock: 620, status: '执行中', owner: '关宇' },
  { id: 'HP-24016', category: '香菇', zone: 'E1 菌房', planAmount: 210, stock: 280, status: '执行中', owner: '林雨' },
  { id: 'HP-24017', category: '蓝莓', zone: 'C4 设施园', planAmount: 260, stock: 340, status: '待开始', owner: '马宁' },
  { id: 'HP-24018', category: '梨', zone: 'F1 果园', planAmount: 620, stock: 880, status: '执行中', owner: '侯敏' },
  { id: 'HP-24019', category: '苹果', zone: 'F2 果园', planAmount: 700, stock: 980, status: '待开始', owner: '钱坤' },
  { id: 'HP-24020', category: '桃', zone: 'F3 果园', planAmount: 540, stock: 760, status: '执行中', owner: '何欣' }
]);

const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('plan');
const progress = ref(68);
const form = reactive({
  batch: '',
  stock: '',
  note: '',
  team: '一组',
  taskId: '',
  start: ''
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  const titles = {
    plan: '生成采摘计划',
    inventory: '同步库存',
    dispatch: '调度采摘',
    detail: '计划详情'
  };
  modalTitle.value = titles[type];
};

const submitModal = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.summary-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #f7fbf8;
  display: grid;
  gap: 6px;
}

.table-card {
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 14px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff4e5;
  color: #d27f1c;
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.progress-block {
  display: grid;
  gap: 8px;
}

.progress {
  height: 10px;
  background: #edf4ef;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
}

.detail-list {
  padding-left: 20px;
  display: grid;
  gap: 6px;
}

.primary {
  background: var(--primary);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
