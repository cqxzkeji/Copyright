<template>
  <section>
    <div class="toolbar">
      <button class="btn primary" @click="openForm('新增客户')">新增客户</button>
      <button class="btn" @click="openTag">标签管理</button>
      <button class="btn" @click="showProgress = true">数据校验</button>
      <button class="btn" @click="openTip('已刷新客户数据')">刷新</button>
    </div>

    <table>
      <thead><tr><th>ID</th><th>姓名</th><th>等级</th><th>标签</th><th>电话</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="item in clients" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.level }}</td><td>{{ item.tag }}</td><td>{{ item.phone }}</td>
          <td>
            <button class="btn small" @click="openForm('编辑客户', item)">编辑</button>
            <button class="btn small" @click="openTip(`已查看 ${item.name} 详情`)">查看</button>
            <button class="btn small danger" @click="remove(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog :show="showForm" :title="formTitle" @close="showForm = false">
      <div class="form-grid">
        <input v-model="editData.name" placeholder="客户姓名" />
        <input v-model="editData.phone" placeholder="联系电话" />
        <input v-model="editData.level" placeholder="客户等级" />
        <input v-model="editData.tag" placeholder="客户标签" />
      </div>
      <template #footer>
        <button class="btn secondary" @click="showForm = false">取消</button>
        <button class="btn primary" @click="save">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="showTag" title="标签分类管理" @close="showTag = false">
      <p>当前标签：VIP、重点关怀、新签约、售后跟进、潜在客户。</p>
      <p>可按服务类型、地区、满意度进行扩展标签。</p>
    </ModalDialog>

    <ModalDialog :show="showProgress" title="客户数据校验进度" @close="showProgress = false">
      <div class="progress"><div class="progress-inner" :style="{ width: progress + '%' }"></div></div>
      <p>{{ progress }}% - 正在检查客户档案完整性...</p>
      <template #footer><button class="btn primary" @click="simulateProgress">开始校验</button></template>
    </ModalDialog>

    <ModalDialog :show="showTip" title="系统提示" @close="showTip = false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const clients = ref(Array.from({ length: 22 }).map((_, i) => ({
  id: i + 1,
  name: `客户${i + 1}`,
  level: ['A', 'B', 'C'][i % 3],
  tag: ['VIP', '重点关怀', '潜在客户', '新签约'][i % 4],
  phone: `1380000${String(100 + i)}`,
})));

const showForm = ref(false);
const showTip = ref(false);
const showTag = ref(false);
const showProgress = ref(false);
const formTitle = ref('');
const tip = ref('');
const progress = ref(0);
const editData = reactive({ id: null, name: '', phone: '', level: '', tag: '' });

const openForm = (title, row) => {
  formTitle.value = title;
  Object.assign(editData, row || { id: null, name: '', phone: '', level: '', tag: '' });
  showForm.value = true;
};
const openTip = (text) => { tip.value = text; showTip.value = true; };
const openTag = () => { showTag.value = true; };
const save = () => {
  if (editData.id) {
    const idx = clients.value.findIndex((v) => v.id === editData.id);
    if (idx > -1) clients.value[idx] = { ...editData };
  } else {
    clients.value.unshift({ ...editData, id: Date.now() });
  }
  showForm.value = false;
  openTip('客户信息保存成功');
};
const remove = (id) => { clients.value = clients.value.filter((c) => c.id !== id); openTip('客户已删除'); };

const simulateProgress = () => {
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(timer);
      openTip('数据校验完成，客户信息完整率98%');
    }
  }, 120);
};
</script>
