<template>
  <div class="panel">
    <div class="flex space-between" style="margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">验收检查与反馈</h2>
        <p class="page-sub">现场检查、缺陷记录与整改反馈闭环管理</p>
      </div>
      <div class="flex" style="gap: 10px">
        <button @click="openModal('检查签到', true)">现场签到</button>
        <button class="secondary" @click="showForm = true">记录检查</button>
      </div>
    </div>

    <div v-if="showForm" class="panel" style="margin-bottom: 16px">
      <h3 style="margin-top: 0">新增检查反馈</h3>
      <div class="card-grid">
        <div>
          <label>检查部位</label>
          <input v-model="form.area" placeholder="如 B3 泵房墙面" />
        </div>
        <div>
          <label>问题分类</label>
          <select v-model="form.type">
            <option>工艺偏差</option>
            <option>安全隐患</option>
            <option>资料缺失</option>
          </select>
        </div>
        <div>
          <label>整改责任人</label>
          <input v-model="form.owner" placeholder="施工/监理" />
        </div>
        <div>
          <label>整改时限</label>
          <input v-model="form.deadline" type="date" />
        </div>
      </div>
      <div style="margin-top: 10px">
        <label>问题描述</label>
        <textarea v-model="form.desc" rows="3" placeholder="描述现场缺陷及建议"></textarea>
      </div>
      <div class="flex space-between" style="margin-top: 12px">
        <button @click="submitFeedback">提交反馈</button>
        <button class="secondary" @click="showForm = false">取消</button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="item in inspections" :key="item.id" class="panel">
        <div class="flex space-between">
          <div>
            <p style="margin: 0; font-weight: 700">{{ item.area }}</p>
            <p class="page-sub">{{ item.type }} ｜ 责任人：{{ item.owner }}</p>
          </div>
          <span class="badge" :class="statusClass(item.status)">{{ item.status }}</span>
        </div>
        <p class="page-sub">截止：{{ item.deadline }}</p>
        <p>{{ item.desc }}</p>
        <div class="flex" style="gap: 8px">
          <button @click="openModal(`回执: ${item.area}`)">查看回执</button>
          <button class="secondary" @click="markResolved(item)">标记整改完成</button>
        </div>
      </div>
    </div>

    <ModalDialog
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :progress="progress"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const inspections = reactive([
  {
    id: 1,
    area: '裙楼大堂吊顶收口',
    type: '工艺偏差',
    owner: '周施工',
    deadline: '2024-05-21',
    desc: '收口线偏移 8mm，需重新校准吊杆水平。',
    status: '整改中',
  },
  {
    id: 2,
    area: 'B3 消防泵房地坪',
    type: '安全隐患',
    owner: '李施工',
    deadline: '2024-05-19',
    desc: '局部地坪未做防滑处理，整改后需复验。',
    status: '待复验',
  },
]);

const showForm = ref(false);
const form = reactive({ area: '', type: '工艺偏差', owner: '', deadline: '', desc: '' });
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const progress = ref(null);

const statusClass = (status) => {
  if (status === '整改中') return 'tag-orange';
  if (status === '已关闭') return 'tag-green';
  return 'tag-blue';
};

const openModal = (title, withProgress = false) => {
  modalTitle.value = title;
  modalMessage.value = '系统已记录操作并通知相关责任人。';
  progress.value = withProgress ? 0 : null;
  showModal.value = true;
  if (withProgress) {
    const timer = setInterval(() => {
      progress.value += 25;
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 250);
  }
};

const submitFeedback = () => {
  if (!form.area || !form.owner) {
    openModal('信息缺失');
    return;
  }
  inspections.unshift({
    id: Date.now(),
    ...form,
    status: '整改中',
  });
  Object.assign(form, { area: '', type: '工艺偏差', owner: '', deadline: '', desc: '' });
  openModal('反馈已提交');
};

const markResolved = (item) => {
  item.status = '已关闭';
  openModal('整改完成');
};
</script>
