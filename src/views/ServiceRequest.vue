<template>
  <section>
    <div class="toolbar">
      <button class="btn primary" @click="openForm('新建服务请求')">新建请求</button>
      <button class="btn" @click="batchAssign">批量分配</button>
      <button class="btn" @click="showProgress = true">处理进度</button>
      <button class="btn" @click="openTip('请求列表已更新')">刷新</button>
    </div>

    <table>
      <thead><tr><th>编号</th><th>客户</th><th>需求类型</th><th>状态</th><th>负责人</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="item in requests" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.client }}</td><td>{{ item.type }}</td><td>{{ item.status }}</td><td>{{ item.owner }}</td>
          <td>
            <button class="btn small" @click="assign(item)">分配</button>
            <button class="btn small" @click="finish(item)">完成</button>
            <button class="btn small" @click="openTip(`已反馈给 ${item.client}`)">反馈</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog :show="showForm" :title="formTitle" @close="showForm = false">
      <div class="form-grid">
        <input v-model="form.client" placeholder="客户姓名" />
        <input v-model="form.type" placeholder="需求类型" />
        <input v-model="form.owner" placeholder="负责人" />
      </div>
      <template #footer>
        <button class="btn secondary" @click="showForm = false">取消</button>
        <button class="btn primary" @click="save">提交</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="showProgress" title="服务处理进度" @close="showProgress = false">
      <div class="progress"><div class="progress-inner" :style="{ width: progress + '%' }"></div></div>
      <p>当前综合处理进度：{{ progress }}%</p>
      <template #footer><button class="btn primary" @click="runProgress">模拟更新</button></template>
    </ModalDialog>

    <ModalDialog :show="showTip" title="提示" @close="showTip = false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const requests = ref(Array.from({ length: 24 }).map((_, i) => ({
  id: `SR-${1000 + i}`,
  client: `客户${i + 1}`,
  type: ['保洁', '维修', '月嫂', '陪诊'][i % 4],
  status: ['待处理', '处理中', '已完成'][i % 3],
  owner: ['王管家', '刘管家', '陈管家'][i % 3],
})));

const showForm = ref(false);
const formTitle = ref('');
const showTip = ref(false);
const showProgress = ref(false);
const tip = ref('');
const progress = ref(35);
const form = reactive({ client: '', type: '', owner: '' });

const openForm = (title) => { formTitle.value = title; Object.assign(form, { client: '', type: '', owner: '' }); showForm.value = true; };
const openTip = (text) => { tip.value = text; showTip.value = true; };
const save = () => {
  requests.value.unshift({ id: `SR-${Date.now()}`, client: form.client, type: form.type, owner: form.owner, status: '待处理' });
  showForm.value = false;
  openTip('服务请求创建成功');
};
const assign = (item) => { item.status = '处理中'; openTip(`${item.id} 已分配给 ${item.owner}`); };
const finish = (item) => { item.status = '已完成'; openTip(`${item.id} 已处理完成`); };
const batchAssign = () => openTip('已将待处理任务批量分配到值班管家');
const runProgress = () => { progress.value = Math.min(100, progress.value + 15); };
</script>
