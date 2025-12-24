<template>
  <div>
    <div class="flex" style="justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0;">供应管理</h3>
      <div class="flex" style="gap: 8px;">
        <button @click="openCreate">新建供应单</button>
        <button class="secondary" @click="openImport">批量入库</button>
      </div>
    </div>

    <div class="table-card">
      <h3>供应任务列表（20 条）</h3>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>合作方</th>
            <th>品类</th>
            <th>数量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in supplyList" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.partner }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.count }}</td>
            <td><span :class="['badge', row.status === '待入库' ? 'warning' : 'success']">{{ row.status }}</span></td>
            <td class="flex" style="gap: 6px;">
              <button class="secondary" @click="openConfirm(row, 'approve')">确认</button>
              <button class="accent" @click="openConfirm(row, 'reject')">退回</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showCreate" title="新建供应单">
      <form @submit.prevent="createOrder">
        <input v-model="form.partner" placeholder="合作方" required />
        <input v-model.number="form.count" type="number" min="1" placeholder="数量" required />
        <select v-model="form.category">
          <option value="农产品">农产品</option>
          <option value="加工品">加工品</option>
          <option value="日用">日用</option>
        </select>
        <div class="modal-footer">
          <button type="button" class="secondary" @click="showCreate = false">取消</button>
          <button type="submit">提交</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showImport" title="批量入库">
      <p>正在导入 Excel 供应计划...</p>
      <div class="progress-bar">
        <span :style="{ width: importProgress + '%' }"></span>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showConfirm" :title="confirmTitle">
      <p>{{ confirmMessage }}</p>
      <template #footer>
        <button class="secondary" @click="showConfirm = false">取消</button>
        <button @click="handleConfirm">确认操作</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const supplyList = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    id: `SUP-${idx + 1}`,
    partner: ['乡里合作社', '河湾农庄', '山谷供应链', '田野基地'][idx % 4],
    category: ['粮油', '果蔬', '禽蛋', '水产'][idx % 4],
    count: 80 + idx * 3,
    status: idx % 5 === 0 ? '待入库' : '已验收'
  }))
);

const showCreate = ref(false);
const showImport = ref(false);
const showConfirm = ref(false);
const confirmTitle = ref('处理供应单');
const confirmMessage = ref('');
const confirmTarget = ref(null);
const confirmAction = ref('');
const importProgress = ref(20);
const form = reactive({ partner: '', category: '农产品', count: 10 });

const openCreate = () => {
  showCreate.value = true;
};

const openImport = () => {
  showImport.value = true;
  importProgress.value = 20;
  const timer = setInterval(() => {
    if (importProgress.value >= 100) {
      clearInterval(timer);
      showImport.value = false;
    } else {
      importProgress.value += 25;
    }
  }, 400);
};

const openConfirm = (row, action) => {
  confirmTarget.value = row;
  confirmAction.value = action;
  confirmTitle.value = action === 'approve' ? '确认入库' : '退回供应';
  confirmMessage.value = `${row.partner} 的 ${row.category} 供应将被${action === 'approve' ? '确认入库' : '退回调整'}`;
  showConfirm.value = true;
};

const handleConfirm = () => {
  if (confirmTarget.value) {
    confirmTarget.value.status = confirmAction.value === 'approve' ? '已验收' : '待入库';
  }
  showConfirm.value = false;
};

const createOrder = () => {
  supplyList.value.unshift({
    id: `SUP-${supplyList.value.length + 1}`,
    partner: form.partner,
    category: form.category,
    count: form.count,
    status: '待入库'
  });
  showCreate.value = false;
  form.partner = '';
  form.category = '农产品';
  form.count = 10;
};
</script>
