<template>
  <div class="page">
    <div class="grid overview" :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }">
      <div class="card overview-card">
        <h3>客户需求总览</h3>
        <p>已收集需求 24 条，重点法规 5 项。</p>
        <div class="overview-actions">
          <button class="primary" type="button" @click="openModal('create')">新增需求</button>
          <button class="ghost" type="button" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="card overview-card">
        <h3>法规符合度</h3>
        <p>当前法规满足率 85%，待确认 3 项。</p>
        <div class="progress-bar"><span :style="{ width: '85%' }"></span></div>
        <button class="ghost" type="button" @click="openModal('progress')">符合度详情</button>
      </div>
      <div class="card overview-card">
        <h3>标准体系图</h3>
        <img class="overview-image" src="/src/assets/seat-diagram.svg" alt="法规标准示意" />
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>需求与法规清单</h3>
          <p>记录客户需求、法规条款及工程指标。</p>
        </div>
        <div class="table-actions">
          <button class="ghost" type="button" @click="openModal('regulation')">新增法规</button>
          <button class="primary" type="button" @click="openModal('import')">导入指标</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>需求类型</th>
            <th>描述</th>
            <th>指标值</th>
            <th>来源</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in requirements" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.desc }}</td>
            <td>{{ item.metric }}</td>
            <td>{{ item.source }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'create'">
        <div class="input-group">
          <label>需求名称</label>
          <input v-model="form.title" placeholder="如：座椅舒适性提升" />
        </div>
        <div class="input-group">
          <label>指标值</label>
          <input v-model="form.metric" placeholder="如：压力分布均匀度 ≥ 90%" />
        </div>
        <div class="input-group">
          <label>优先级</label>
          <select v-model="form.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </div>
      </template>
      <template v-else-if="activeModal === 'regulation'">
        <div class="input-group">
          <label>法规标准</label>
          <input v-model="form.regulation" placeholder="如：ECE R17" />
        </div>
        <div class="input-group">
          <label>条款说明</label>
          <textarea v-model="form.regulationNote" rows="3" placeholder="填写法规条款与适用范围"></textarea>
        </div>
      </template>
      <template v-else-if="activeModal === 'import'">
        <div class="input-group">
          <label>导入来源</label>
          <select v-model="form.importSource">
            <option>客户规范文件</option>
            <option>法规数据库</option>
            <option>历史项目指标</option>
          </select>
        </div>
        <div class="input-group">
          <label>说明</label>
          <textarea v-model="form.importNote" rows="3" placeholder="填写导入说明"></textarea>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>法规符合度已达到 85%，剩余待确认条款涉及头枕冲击与儿童座椅固定点。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: '85%' }"></span>
        </div>
      </template>
      <template v-else-if="activeModal === 'tips'">
        <ul>
          <li>更新需求时请同步标记关联法规条款。</li>
          <li>导入指标后需完成技术负责人审核。</li>
          <li>法规符合度不足 80% 将触发风险提醒。</li>
        </ul>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const requirements = [
  { code: 'R-001', type: '舒适性', desc: '座垫压力分布均匀', metric: '≥90%', source: '客户', status: '已确认' },
  { code: 'R-002', type: '安全', desc: '座椅滑轨抗冲击', metric: '≥18kN', source: '法规', status: '已确认' },
  { code: 'R-003', type: 'NVH', desc: '座椅异响控制', metric: '≤30dB', source: '客户', status: '待验证' },
  { code: 'R-004', type: '舒适性', desc: '头枕包裹度', metric: '≥85%', source: '客户', status: '待验证' },
  { code: 'R-005', type: '安全', desc: '安全带锚点强度', metric: '≥14kN', source: '法规', status: '已确认' },
  { code: 'R-006', type: '法规', desc: 'ECE R17 靠背强度', metric: '合规', source: '法规', status: '已确认' },
  { code: 'R-007', type: '法规', desc: 'FMVSS 207/210', metric: '合规', source: '法规', status: '待验证' },
  { code: 'R-008', type: '舒适性', desc: '座垫泡沫硬度', metric: '55±5', source: '客户', status: '已确认' },
  { code: 'R-009', type: '材料', desc: '环保材料含量', metric: 'VOC ≤ 50', source: '法规', status: '已确认' },
  { code: 'R-010', type: '设计', desc: '座椅调节行程', metric: '≥120mm', source: '客户', status: '已确认' },
  { code: 'R-011', type: '法规', desc: 'GB 15083', metric: '合规', source: '法规', status: '已确认' },
  { code: 'R-012', type: '安全', desc: 'ISOFIX 固定点', metric: '≥7kN', source: '法规', status: '待验证' },
  { code: 'R-013', type: '舒适性', desc: '靠背角度范围', metric: '100°-135°', source: '客户', status: '已确认' },
  { code: 'R-014', type: '材料', desc: '皮革耐磨等级', metric: '≥5000次', source: '客户', status: '已确认' },
  { code: 'R-015', type: '安全', desc: '侧翼抗压强度', metric: '≥12kN', source: '法规', status: '待验证' },
  { code: 'R-016', type: 'NVH', desc: '静态异响测试', metric: '≤28dB', source: '客户', status: '已确认' },
  { code: 'R-017', type: '设计', desc: '腰托调节范围', metric: '≥20mm', source: '客户', status: '已确认' },
  { code: 'R-018', type: '法规', desc: 'ECE R14', metric: '合规', source: '法规', status: '待验证' },
  { code: 'R-019', type: '舒适性', desc: '座椅温控响应', metric: '≤3分钟', source: '客户', status: '已确认' },
  { code: 'R-020', type: '安全', desc: '靠背锁止强度', metric: '≥15kN', source: '法规', status: '已确认' },
];

const activeModal = ref('');
const form = reactive({
  title: '',
  metric: '',
  priority: '高',
  regulation: '',
  regulationNote: '',
  importSource: '客户规范文件',
  importNote: '',
});

const modalTitle = computed(() => {
  const map = {
    create: '新增需求',
    regulation: '新增法规',
    import: '导入指标',
    progress: '法规符合度',
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
