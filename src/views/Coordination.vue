<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>部门协同</h2>
          <p>多部门会签、合规校验与协同提醒，保障流程合规。</p>
        </div>
        <div class="action-group">
          <button class="primary-btn" @click="openModal('sign')">发起会签</button>
          <button class="secondary-btn" @click="openModal('check')">合规校验</button>
          <button class="secondary-btn" @click="openModal('notify')">部门提醒</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="card">
          <h4>待会签部门</h4>
          <p>规划、消防、环保</p>
        </div>
        <div class="card">
          <h4>合规率</h4>
          <p>92%</p>
        </div>
        <div class="card">
          <h4>超时会签</h4>
          <p>2 项</p>
        </div>
      </div>
    </section>

    <section class="panel">
      <h3>部门会签记录</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>部门</th>
              <th>会签事项</th>
              <th>状态</th>
              <th>负责人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.dept }}</td>
              <td>{{ row.topic }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.owner }}</td>
              <td>
                <div class="action-group">
                  <button class="secondary-btn" @click="openModal('detail', row)">详情</button>
                  <button class="secondary-btn" @click="openModal('urge', row)">催办</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'sign'">
        <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
          <label class="label">会签主题<input class="input" placeholder="输入主题" /></label>
          <label class="label">相关部门<select class="select"><option>规划</option><option>消防</option><option>环保</option></select></label>
          <label class="label">截止日期<input class="input" type="date" /></label>
          <label class="label">备注<textarea class="textarea" rows="3" placeholder="输入备注"></textarea></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'check'">
        <p>合规校验已启动，系统正在核查 14 项法规清单。</p>
      </template>
      <template v-else-if="activeModal === 'notify'">
        <p>已向相关部门发送协同提醒，包含待会签事项与资料清单。</p>
      </template>
      <template v-else-if="activeModal === 'detail'">
        <p>{{ selected?.dept }} 会签事项为 “{{ selected?.topic }}”，当前状态 {{ selected?.status }}。</p>
      </template>
      <template v-else>
        <p>已向 {{ selected?.owner }} 发送催办通知。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `COS-${4001 + index}`,
  dept: ['规划', '消防', '环保'][index % 3],
  topic: ['竣工资料审核', '安全设施确认', '环保排放核查'][index % 3],
  status: ['待会签', '会签中', '已通过'][index % 3],
  owner: ['刘主任', '孙主任', '韩主任'][index % 3]
}));

const activeModal = ref('');
const selected = ref(null);

const modalTitle = computed(() => {
  const map = {
    sign: '发起会签',
    check: '合规校验',
    notify: '部门提醒',
    detail: '会签详情',
    urge: '催办提醒'
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

.card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
}

.label {
  font-size: 13px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
