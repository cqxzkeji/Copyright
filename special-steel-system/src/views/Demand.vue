<template>
  <div class="page">
    <div class="header card">
      <div>
        <p class="section-title">客户需求采集中心</p>
        <p class="sub">结构化录入客户规格、性能与交付要求</p>
      </div>
      <div class="actions">
        <button class="action-btn" @click="openModal('collect')">新建需求</button>
        <button class="action-btn secondary" @click="openModal('validate')">校验完整性</button>
        <button class="action-btn secondary" @click="openModal('follow')">跟进提醒</button>
        <button class="action-btn secondary" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="card">
      <p class="section-title">需求看板</p>
      <div class="kpi-grid">
        <div v-for="kpi in kpis" :key="kpi.label" class="kpi">
          <strong>{{ kpi.value }}</strong>
          <span>{{ kpi.label }}</span>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="section-title">客户需求清单（{{ demands.length }} 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th>
            <th>钢种</th>
            <th>规格</th>
            <th>性能目标</th>
            <th>交付方式</th>
            <th>优先级</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in demands" :key="item.id">
            <td>{{ item.client }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.spec }}</td>
            <td>{{ item.target }}</td>
            <td>{{ item.delivery }}</td>
            <td><span class="badge" :class="item.levelClass">{{ item.level }}</span></td>
            <td>{{ item.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-model="modalVisible" :title="modalTitle" @confirm="modalVisible = false">
      <div v-if="modalType === 'collect'" class="form-grid">
        <label>
          客户名称
          <input class="input" placeholder="请输入客户名称" />
        </label>
        <label>
          规格范围
          <input class="input" placeholder="Φ60-120mm" />
        </label>
        <label>
          性能指标
          <input class="input" placeholder="冲击≥60J" />
        </label>
        <label>
          交期要求
          <input class="input" placeholder="2024-10-30" />
        </label>
        <label>
          应用场景
          <input class="input" placeholder="风电轴承" />
        </label>
      </div>
      <div v-else-if="modalType === 'validate'" class="modal-block">
        <p>系统正在对 24 条需求执行完整性校验。</p>
        <div class="progress-bar">
          <span :style="{ width: `${validationProgress}%` }"></span>
        </div>
        <p class="status">当前已校验 {{ validationProgress }}%</p>
      </div>
      <div v-else-if="modalType === 'follow'" class="modal-block">
        <p>请选择需要跟进的客户需求：</p>
        <div class="tag-list">
          <span v-for="tag in followTags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <label>
          跟进方式
          <select class="input">
            <option>电话确认</option>
            <option>拜访评审</option>
            <option>样品试制</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'tip'" class="modal-block">
        <p>提示：录入需求时建议同步客户应用场景与关键性能范围。</p>
        <ul>
          <li>高优先级需求将在匹配模块自动置顶。</li>
          <li>需求校验完成后可一键推送给销售。</li>
        </ul>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppModal from '../components/AppModal.vue';

const kpis = [
  { label: '今日新增需求', value: 12 },
  { label: '高优先级需求', value: 7 },
  { label: '待补充信息', value: 5 },
  { label: '已转匹配', value: '18/24' }
];

const demands = ref(
  Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    client: ['华东汽配', '北方重工', '海上风电', '精密轴承', '航空材料'][i % 5],
    grade: ['GCr15', '34CrNiMo6', 'H13', '1.2344', 'SUJ2'][i % 5],
    spec: `Φ${60 + i}*${120 + i}mm`,
    target: ['高疲劳', '耐磨', '高温', '低噪', '高韧性'][i % 5],
    delivery: i % 2 === 0 ? '定尺交付' : '热处理交付',
    level: i % 3 === 0 ? '高' : i % 3 === 1 ? '中' : '低',
    levelClass: i % 3 === 0 ? 'warn' : i % 3 === 1 ? 'success' : 'info',
    owner: ['王工', '李工', '周工', '张工'][i % 4]
  }))
);

const modalVisible = ref(false);
const modalType = ref('collect');
const modalTitle = ref('新建需求');
const validationProgress = ref(15);
const followTags = ['华东汽配-回访', '北方重工-补资料', '风电项目-样品确认'];

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value =
    type === 'collect'
      ? '新建需求'
      : type === 'validate'
        ? '完整性校验'
        : type === 'follow'
          ? '跟进提醒'
          : '操作提示';
  modalVisible.value = true;
};

watch(modalVisible, (visible) => {
  if (visible && modalType.value === 'validate') {
    validationProgress.value = 20;
    const timer = setInterval(() => {
      validationProgress.value += 20;
      if (validationProgress.value >= 100) {
        validationProgress.value = 100;
        clearInterval(timer);
      }
    }, 200);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7a99;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
}

.kpi {
  background: #f5f8ff;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi strong {
  font-size: 18px;
}

.kpi span {
  font-size: 12px;
  color: #6b7a99;
}

.modal-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  border: 1px dashed #aac2ff;
  background: #f0f5ff;
  color: #2f6df6;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
}

.status {
  color: #2f6df6;
}
</style>
