<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openFlow">查看操作流程</button>
      <button @click="openTip('政策更新：AEO认证复核周期由12个月调整为9个月。')">政策提醒</button>
      <button @click="openTrain">开启培训任务</button>
    </div>

    <div class="card chart">
      <div v-for="item in policyHeat" :key="item.topic" class="bar-item">
        <span>{{ item.topic }}</span>
        <div class="bar-bg"><div class="bar" :style="{ width: item.heat + '%' }"></div></div>
        <b>{{ item.heat }}</b>
      </div>
    </div>

    <div class="card table">
      <table>
        <thead><tr><th>编号</th><th>事项</th><th>责任人</th><th>时效</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.id }}</td><td>{{ r.item }}</td><td>{{ r.owner }}</td><td>{{ r.sla }}</td><td>{{ r.status }}</td>
            <td><button class="small" @click="openTip(`${r.item} 当前状态：${r.status}`)">提示</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :visible="modal.visible" :title="modal.title" @close="modal.visible=false" @confirm="modal.visible=false">
      <form v-if="modal.type==='train'" class="form-grid">
        <label>培训主题<input v-model="form.topic" /></label>
        <label>完成期限<input v-model="form.deadline" type="date" /></label>
      </form>
      <div v-else-if="modal.type==='flow'">
        <ol>
          <li>确认业务类型与监管方式。</li>
          <li>准备单证并进行系统校验。</li>
          <li>提交申报并跟踪反馈。</li>
          <li>完成归档与整改闭环。</li>
        </ol>
      </div>
      <p v-else>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const form = reactive({ topic: '关税归类规范培训', deadline: '' });
const policyHeat = [
  { topic: '加工贸易核销', heat: 74 },
  { topic: '减免税政策', heat: 67 },
  { topic: '原产地规则', heat: 85 },
  { topic: '海关稽查重点', heat: 92 },
];

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `GD-${(i + 1).toString().padStart(3, '0')}`,
  item: ['报关前审核', '许可证核验', '归类复审', '后续稽核'][i % 4],
  owner: ['张敏', '李浩', '王琳', '赵峰'][i % 4],
  sla: `${(i % 5) + 1}天`,
  status: i % 2 ? '进行中' : '待执行',
}));

const modal = reactive({ visible: false, title: '', type: 'tip', message: '' });
const openFlow = () => Object.assign(modal, { visible: true, title: '合规流程指引', type: 'flow' });
const openTrain = () => Object.assign(modal, { visible: true, title: '培训任务配置', type: 'train' });
const openTip = (message) => Object.assign(modal, { visible: true, title: '政策提示', type: 'tip', message });
</script>

<style scoped>
@import './module.css';
</style>
