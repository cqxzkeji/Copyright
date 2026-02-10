<template>
  <section>
    <div class="toolbar">
      <button class="btn primary" @click="openForm">发起互动</button>
      <button class="btn" @click="openTip('自动回访任务已创建')">安排回访</button>
      <button class="btn" @click="showProgress = true">沟通进度</button>
    </div>

    <table>
      <thead><tr><th>ID</th><th>客户</th><th>渠道</th><th>主题</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="item in interactions" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.client }}</td><td>{{ item.channel }}</td><td>{{ item.topic }}</td><td>{{ item.status }}</td>
          <td>
            <button class="btn small" @click="reply(item)">回复</button>
            <button class="btn small" @click="closeItem(item)">关闭</button>
            <button class="btn small" @click="openTip(`已查看 ${item.client} 沟通记录`)">记录</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog :show="showForm" title="发起客户互动" @close="showForm = false">
      <div class="form-grid">
        <input v-model="form.client" placeholder="客户姓名" />
        <select v-model="form.channel"><option>电话</option><option>短信</option><option>邮件</option><option>在线聊天</option></select>
        <input v-model="form.topic" placeholder="沟通主题" />
      </div>
      <template #footer>
        <button class="btn secondary" @click="showForm = false">取消</button>
        <button class="btn primary" @click="submit">发送</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="showProgress" title="互动执行进度" @close="showProgress = false">
      <div class="progress"><div class="progress-inner" :style="{ width: progress + '%' }"></div></div>
      <p>多渠道消息送达率：{{ progress }}%</p>
      <template #footer><button class="btn primary" @click="progress = Math.min(100, progress + 12)">更新进度</button></template>
    </ModalDialog>

    <ModalDialog :show="showTip" title="提示" @close="showTip = false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const interactions = ref(Array.from({ length: 21 }).map((_, i) => ({
  id: `CI-${200 + i}`,
  client: `客户${i + 1}`,
  channel: ['电话', '短信', '邮件', '在线聊天'][i % 4],
  topic: ['服务回访', '问题跟进', '满意度调查', '活动通知'][i % 4],
  status: ['进行中', '待回复', '已完成'][i % 3],
})));

const showForm = ref(false);
const showTip = ref(false);
const showProgress = ref(false);
const tip = ref('');
const progress = ref(40);
const form = reactive({ client: '', channel: '电话', topic: '' });

const openTip = (text) => { tip.value = text; showTip.value = true; };
const openForm = () => { Object.assign(form, { client: '', channel: '电话', topic: '' }); showForm.value = true; };
const submit = () => {
  interactions.value.unshift({ id: `CI-${Date.now()}`, client: form.client, channel: form.channel, topic: form.topic, status: '进行中' });
  showForm.value = false;
  openTip('互动消息已发送');
};
const reply = (item) => { item.status = '进行中'; openTip(`已通过${item.channel}回复 ${item.client}`); };
const closeItem = (item) => { item.status = '已完成'; openTip(`${item.id} 互动已关闭`); };
</script>
