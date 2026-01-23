<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>验收计划</h2>
          <p>联合验收流程与资料清单管理，分阶段配置验收节点。</p>
        </div>
        <div class="action-group">
          <button class="primary-btn" @click="openModal('plan')">创建计划</button>
          <button class="secondary-btn" @click="openModal('docs')">资料清单</button>
          <button class="secondary-btn" @click="openModal('flow')">流程配置</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="stat">
          <h4>当前计划</h4>
          <p>18 个</p>
        </div>
        <div class="stat">
          <h4>进行中</h4>
          <p>6 个</p>
        </div>
        <div class="stat">
          <h4>待排期</h4>
          <p>4 个</p>
        </div>
        <div class="stat">
          <h4>资料缺口</h4>
          <p>9 项</p>
        </div>
      </div>
      <div class="timeline">
        <div v-for="stage in stages" :key="stage.name" class="timeline-item">
          <div class="timeline-dot" :style="{ background: stage.color }"></div>
          <div>
            <div class="timeline-title">{{ stage.name }}</div>
            <div class="timeline-desc">{{ stage.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <h3>验收计划列表</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>计划编号</th>
              <th>楼宇</th>
              <th>阶段</th>
              <th>资料清单</th>
              <th>负责人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.project }}</td>
              <td>{{ row.stage }}</td>
              <td>{{ row.docs }}</td>
              <td>{{ row.owner }}</td>
              <td>
                <div class="action-group">
                  <button class="secondary-btn" @click="openModal('detail', row)">详情</button>
                  <button class="secondary-btn" @click="openModal('remind', row)">提醒</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'plan'">
        <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
          <label class="label">计划名称<input class="input" placeholder="输入计划名称" /></label>
          <label class="label">楼宇<select class="select"><option>云顶商务中心</option><option>星河广场</option></select></label>
          <label class="label">开始日期<input class="input" type="date" /></label>
          <label class="label">结束日期<input class="input" type="date" /></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'docs'">
        <p>资料清单包含图纸、施工记录、设备清单、安全资料等 12 类文档。</p>
      </template>
      <template v-else-if="activeModal === 'flow'">
        <p>配置验收流程：部门会签、现场核查、资料复核、合规签字。</p>
      </template>
      <template v-else-if="activeModal === 'detail'">
        <p>{{ selected?.project }} 的计划处于 {{ selected?.stage }}，资料项 {{ selected?.docs }}。</p>
      </template>
      <template v-else>
        <p>已向 {{ selected?.owner }} 发送资料补齐提醒。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stages = [
  { name: '资料准备', desc: '整理图纸与记录资料', color: '#38bdf8' },
  { name: '部门会签', desc: '多部门线上会签确认', color: '#4ade80' },
  { name: '现场核查', desc: '按计划进行现场验收', color: '#facc15' },
  { name: '归档提交', desc: '生成验收报告并归档', color: '#a855f7' }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `PLN-${2001 + index}`,
  project: `星河中心 ${index + 1} 号楼`,
  stage: ['资料准备', '部门会签', '现场核查'][index % 3],
  docs: `${12 - (index % 4)} 项`,
  owner: ['张工', '李工', '王工'][index % 3]
}));

const activeModal = ref('');
const selected = ref(null);

const modalTitle = computed(() => {
  const map = {
    plan: '创建验收计划',
    docs: '资料清单说明',
    flow: '流程配置',
    detail: '计划详情',
    remind: '资料提醒'
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

.stat {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
}

.stat h4 {
  font-size: 13px;
  color: #64748b;
}

.stat p {
  font-size: 18px;
  font-weight: 600;
  margin-top: 6px;
}

.timeline {
  margin-top: 20px;
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 14px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.timeline-title {
  font-weight: 600;
}

.timeline-desc {
  font-size: 13px;
  color: #64748b;
}

.label {
  font-size: 13px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
