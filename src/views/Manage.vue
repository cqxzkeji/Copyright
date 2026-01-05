<template>
  <div>
    <div class="section-header">
      <div>
        <p class="eyebrow">功能四 · 内容管理与发布</p>
        <h2>非遗项目分类管理、内容更新与多终端同步发布。</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="openForm('新增分类')">新增分类</button>
        <button class="accent" @click="openProgress('多端同步', 58)">同步多端</button>
        <button class="ghost" @click="openInfo('发布策略', '已启用分时发布，移动端 10:00 上线，VR 端 10:30 上线。')">发布策略</button>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>分类与发布状态</h3>
        <div class="filters">
          <select v-model="filter.type">
            <option value="">全部类型</option>
            <option value="技艺">技艺</option>
            <option value="节庆">节庆</option>
            <option value="建筑">建筑</option>
            <option value="表演">表演</option>
          </select>
          <button class="ghost" @click="openInfo('筛选说明', '选择类型后仅保留对应非遗项目。')">筛选提示</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>分类名称</th>
              <th>类型</th>
              <th>项目数量</th>
              <th>展示终端</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCategories" :key="item.id">
              <td>{{ item.name }}</td>
              <td><span class="badge">{{ item.type }}</span></td>
              <td>{{ item.count }}</td>
              <td>{{ item.channels.join(' / ') }}</td>
              <td><span class="chip">{{ item.status }}</span></td>
              <td>
                <button class="ghost" @click="openInfo('发布记录', publishText(item))">发布记录</button>
                <button class="primary" @click="openProgress('更新进度', 40)">更新</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :show="modal.type === 'form'" :title="modal.title" width="520px" @close="closeModal">
      <div class="input-group">
        <input v-model="form.name" placeholder="分类名称，如：苗族节庆" />
        <select v-model="form.type">
          <option value="技艺">技艺</option>
          <option value="节庆">节庆</option>
          <option value="建筑">建筑</option>
          <option value="表演">表演</option>
        </select>
        <label class="checkbox">
          <input v-model="form.toVR" type="checkbox" /> 同步到 VR 端
        </label>
        <label class="checkbox">
          <input v-model="form.toMobile" type="checkbox" /> 同步到移动端
        </label>
      </div>
      <template #footer>
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="submitForm">保存</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'progress'" :title="modal.title" width="460px" @close="closeModal">
      <p>正在推送内容、刷新缓存并同步 CDN…</p>
      <progress :value="modal.progress" max="100"></progress>
      <p class="progress-text">{{ modal.progress }}% 完成</p>
      <template #footer>
        <button class="primary" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'info'" :title="modal.title" width="460px" @close="closeModal">
      <p>{{ modal.message }}</p>
      <template #footer>
        <button class="primary" @click="closeModal">好的</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const categories = reactive([
  { id: 1, name: '苗绣技艺', type: '技艺', count: 24, channels: ['VR', '移动端'], status: '已发布' },
  { id: 2, name: '木鼓舞', type: '表演', count: 12, channels: ['VR'], status: '待审核' },
  { id: 3, name: '傩戏面具', type: '表演', count: 8, channels: ['VR', '大屏'], status: '已发布' },
  { id: 4, name: '鼓楼建筑群', type: '建筑', count: 6, channels: ['VR', '移动端'], status: '已发布' },
  { id: 5, name: '龙舟竞渡', type: '节庆', count: 10, channels: ['移动端'], status: '更新中' },
  { id: 6, name: '木版年画', type: '技艺', count: 15, channels: ['VR', '移动端'], status: '已发布' },
  { id: 7, name: '黎锦织造', type: '技艺', count: 11, channels: ['VR', '大屏'], status: '待审核' },
  { id: 8, name: '藏戏面具', type: '表演', count: 9, channels: ['VR', '移动端'], status: '更新中' }
]);

const filter = reactive({ type: '' });
const modal = reactive({ type: '', title: '', message: '', progress: 0 });
const form = reactive({ name: '', type: '技艺', toVR: true, toMobile: true });

const filteredCategories = computed(() =>
  categories.filter((c) => !filter.type || c.type === filter.type)
);

const openForm = (title) => {
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title, start) => {
  modal.type = 'progress';
  modal.title = title;
  modal.progress = start;
  const timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 12);
    if (modal.progress >= 100) clearInterval(timer);
  }, 380);
};

const openInfo = (title, message) => {
  modal.type = 'info';
  modal.title = title;
  modal.message = message;
};

const submitForm = () => {
  categories.unshift({
    id: categories.length + 1,
    name: form.name || '新分类',
    type: form.type,
    count: 0,
    channels: [form.toVR ? 'VR' : null, form.toMobile ? '移动端' : null].filter(Boolean),
    status: '待审核'
  });
  closeModal();
  openProgress('保存并同步', 42);
};

const publishText = (item) => `${item.name} 已推送到：${item.channels.join('、')}，状态：${item.status}`;

const closeModal = () => {
  modal.type = '';
  modal.title = '';
  modal.message = '';
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ghost {
  background: #f1f5ff;
  color: #1f2a44;
  border: 1px solid var(--border);
}

.accent {
  background: linear-gradient(120deg, #ffb347, #ffd966);
  color: #5c3100;
}
</style>
