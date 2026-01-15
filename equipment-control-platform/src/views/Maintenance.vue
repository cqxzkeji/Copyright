<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>运维管理</h2>
        <p>设备台账、巡检维护、故障上报与工单处理闭环管理。</p>
      </div>
      <div class="actions">
        <button @click="openModal('inspection')">发起巡检</button>
        <button @click="openModal('fault')">故障上报</button>
        <button @click="openModal('order')">新建工单</button>
      </div>
    </section>

    <div class="cards">
      <div class="card">
        <h3>台账统计</h3>
        <p>本周维护 28 次，完成率 92%。</p>
        <div class="progress">
          <div class="bar" :style="{ width: '92%' }"></div>
        </div>
      </div>
      <div class="card">
        <h3>巡检计划</h3>
        <ul>
          <li>机库保障区 - 每日 08:00</li>
          <li>海域巡防站 - 每日 14:00</li>
          <li>远程监控站 - 每周三</li>
        </ul>
      </div>
      <div class="card">
        <h3>工单进展</h3>
        <p>处理中 6 单，待验收 3 单。</p>
        <button class="ghost" @click="openModal('progress')">查看工单进度</button>
      </div>
    </div>

    <div class="table-card">
      <h3>运维工单列表</h3>
      <table>
        <thead>
          <tr>
            <th>工单编号</th>
            <th>设备</th>
            <th>问题类型</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.device }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      :open="modal.open"
      :title="modal.title"
      :confirm-text="modal.confirmText"
      @close="modal.open = false"
      @confirm="modal.open = false"
    >
      <div v-if="modal.type === 'inspection'">
        <p>创建巡检计划，系统将自动提醒。</p>
        <form class="form-grid">
          <label>巡检区域<select><option>机库保障区</option><option>海域巡防站</option><option>远程监控站</option></select></label>
          <label>巡检频次<select><option>每日</option><option>每周</option><option>每月</option></select></label>
          <label>负责人<select><option>运维组 A</option><option>运维组 B</option></select></label>
          <label>巡检时间<input type="datetime-local" /></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'fault'">
        <p>快速上报故障，启动维修流程。</p>
        <form class="form-grid">
          <label>设备编号<input placeholder="EC-018" /></label>
          <label>故障级别<select><option>紧急</option><option>一般</option></select></label>
          <label>问题描述<input placeholder="请输入故障现象" /></label>
          <label>影响范围<select><option>单台设备</option><option>场景链路</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'order'">
        <p>创建工单并分派处理人。</p>
        <form class="form-grid">
          <label>工单标题<input placeholder="如：雷达阵列校准" /></label>
          <label>处理人<select><option>李工程师</option><option>周工程师</option></select></label>
          <label>期望完成<input type="date" /></label>
          <label>优先级<select><option>高</option><option>中</option><option>低</option></select></label>
        </form>
      </div>
      <div v-else>
        <p>工单处理进度</p>
        <div class="progress">
          <div class="bar" :style="{ width: '58%' }"></div>
        </div>
        <p class="progress-text">已完成 58%，预计剩余 1.5 小时。</p>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const orders = [
  { id: 'WO-2024-01', device: 'EC-004', type: '链路抖动', owner: '李工', status: '处理中' },
  { id: 'WO-2024-02', device: 'EC-010', type: '温度异常', owner: '周工', status: '待验收' },
  { id: 'WO-2024-03', device: 'EC-016', type: '传感器校准', owner: '王工', status: '已完成' },
  { id: 'WO-2024-04', device: 'EC-021', type: '电池更换', owner: '赵工', status: '处理中' },
  { id: 'WO-2024-05', device: 'EC-028', type: '导航更新', owner: '孙工', status: '处理中' },
  { id: 'WO-2024-06', device: 'EC-033', type: '链路配置', owner: '胡工', status: '待验收' },
  { id: 'WO-2024-07', device: 'EC-041', type: '云台维修', owner: '郑工', status: '处理中' },
  { id: 'WO-2024-08', device: 'EC-052', type: '地图同步', owner: '刘工', status: '已完成' }
];

const modal = reactive({
  open: false,
  type: '',
  title: '',
  confirmText: ''
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  const titles = {
    inspection: '发起巡检',
    fault: '故障上报',
    order: '新建工单',
    progress: '工单进度'
  };
  modal.title = titles[type];
  modal.confirmText = type === 'progress' ? '' : '提交';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button,
.ghost {
  border: none;
  background: #eef3ff;
  color: #2f3c4a;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress {
  height: 10px;
  background: #e4ecfb;
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2fb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #5b6b82;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f3;
  background: #f7faff;
}

.progress-text {
  margin-top: 10px;
  color: #5b6b82;
}
</style>
