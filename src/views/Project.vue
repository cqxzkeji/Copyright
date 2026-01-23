<template>
  <div class="page">
    <section class="grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="card">
        <h3>楼宇建档</h3>
        <p>已建档楼宇 {{ stats.building }} 栋</p>
      </div>
      <div class="card">
        <h3>业态覆盖</h3>
        <p>覆盖业态 {{ stats.business }} 类</p>
      </div>
      <div class="card">
        <h3>参建单位</h3>
        <p>参建单位 {{ stats.partners }} 家</p>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>项目管理</h2>
          <p>楼宇、业态、参建单位统一建档，实时掌握基础数据。</p>
        </div>
        <div class="action-group">
          <button class="primary-btn" @click="openModal('create')">新建档案</button>
          <button class="secondary-btn" @click="openModal('import')">导入模板</button>
          <button class="secondary-btn" @click="openModal('tip')">提示信息</button>
        </div>
      </div>
      <div class="chart-area">
        <div class="bars">
          <div v-for="item in chart" :key="item.label" class="bar">
            <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <svg viewBox="0 0 220 120" class="mini-illustration" aria-hidden="true">
          <rect x="20" y="40" width="60" height="60" rx="8" fill="#bfdbfe" />
          <rect x="90" y="20" width="50" height="80" rx="8" fill="#c7d2fe" />
          <rect x="150" y="50" width="50" height="50" rx="8" fill="#bbf7d0" />
          <circle cx="40" cy="60" r="6" fill="#1d4ed8" />
          <circle cx="110" cy="40" r="6" fill="#1d4ed8" />
          <circle cx="170" cy="70" r="6" fill="#16a34a" />
        </svg>
      </div>
    </section>

    <section class="panel">
      <h3>项目档案列表</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>楼宇名称</th>
              <th>业态</th>
              <th>参建单位</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.business }}</td>
              <td>{{ row.partner }}</td>
              <td><span class="badge">{{ row.status }}</span></td>
              <td>
                <div class="action-group">
                  <button class="secondary-btn" @click="openModal('detail', row)">详情</button>
                  <button class="secondary-btn" @click="openModal('edit', row)">编辑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'create'">
        <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
          <label class="label">楼宇名称<input class="input" placeholder="输入楼宇名称" /></label>
          <label class="label">业态类型<select class="select"><option>商业综合体</option><option>办公</option><option>酒店</option></select></label>
          <label class="label">参建单位<input class="input" placeholder="施工/设计单位" /></label>
          <label class="label">预计完工<input class="input" type="date" /></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'import'">
        <p>已为楼宇建档模板准备导入，支持批量覆盖楼宇与参建单位。</p>
      </template>
      <template v-else-if="activeModal === 'detail'">
        <p>正在查看 {{ selected?.name }} 的详细建档信息，包含楼宇、业态与参建单位关系。</p>
      </template>
      <template v-else-if="activeModal === 'edit'">
        <p>编辑 {{ selected?.name }} 的档案，调整业态与参建单位信息。</p>
      </template>
      <template v-else>
        <p>项目管理统一建档后将同步到验收计划与协同模块。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = { building: 48, business: 12, partners: 27 };
const chart = [
  { label: '办公', value: 80 },
  { label: '商业', value: 65 },
  { label: '酒店', value: 50 },
  { label: '文化', value: 72 },
  { label: '配套', value: 58 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `PRJ-${1001 + index}`,
  name: `云顶商务中心 ${index + 1} 号楼`,
  business: ['办公', '商业', '酒店'][index % 3],
  partner: ['建工集团', '精造装饰', '城市设计院'][index % 3],
  status: ['建设中', '待验收', '已归档'][index % 3]
}));

const activeModal = ref('');
const selected = ref(null);

const modalTitle = computed(() => {
  const map = {
    create: '新建项目档案',
    import: '导入模板',
    detail: '档案详情',
    edit: '编辑档案',
    tip: '提示信息'
  };
  return map[activeModal.value] || '提示';
});

function openModal(type, row) {
  activeModal.value = type;
  selected.value = row || null;
}

function closeModal() {
  activeModal.value = '';
}

function confirmModal() {
  closeModal();
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  padding: 18px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.card h3 {
  font-size: 16px;
  margin-bottom: 6px;
}

.panel {
  background: #fff;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-area {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex: 1;
}

.bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 48px;
}

.bar-fill {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #60a5fa, #93c5fd);
  min-height: 30px;
}

.bar span {
  font-size: 12px;
  color: #64748b;
}

.mini-illustration {
  width: 180px;
}

.label {
  font-size: 13px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
