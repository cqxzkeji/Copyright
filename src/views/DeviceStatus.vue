<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <div class="section-title">泵房运行时长</div>
      <div class="chart-bars">
        <div v-for="pump in pumps" :key="pump.name" class="chart-bar" :style="{ height: `${pump.hours / 2}%` }">
          <span>{{ pump.name }}</span>
        </div>
      </div>
      <div class="chip-bar">
        <span class="badge success">可用率 99%</span>
        <span class="badge info">智能切泵</span>
      </div>
    </div>
    <div class="card">
      <div class="section-title">设备维护动作</div>
      <div class="flex-row">
        <button class="btn outline" @click="showReset=true">远程复位</button>
        <button class="btn primary" @click="showWorkOrder=true">安排维护工单</button>
        <button class="btn danger" @click="showAlarm=true">查看告警</button>
      </div>
      <p class="muted">复位操作仅对选中设备生效，工单会自动关联巡检结果。</p>
    </div>
  </div>

  <div class="card">
    <div class="section-title">设备状态与故障诊断</div>
    <table class="table">
      <thead>
        <tr>
          <th>设备</th><th>所属站点</th><th>状态</th><th>振动(mm/s)</th><th>温度(°C)</th><th>建议</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in devices" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.site }}</td>
          <td><span class="badge" :class="item.status === '正常' ? 'success' : 'warning'">{{ item.status }}</span></td>
          <td>{{ item.vibration }}</td>
          <td>{{ item.temperature }}</td>
          <td>{{ item.suggestion }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showReset" title="远程复位">
    <form class="modal-form" @submit.prevent="submitReset">
      <label>选择设备</label>
      <select v-model="resetDevice" required>
        <option v-for="item in devices" :key="item.name" :value="item.name">{{ item.name }}</option>
      </select>
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showReset=false">取消</button>
        <button class="btn primary" type="submit">执行复位</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showWorkOrder" title="安排维护工单">
    <form class="modal-form" @submit.prevent="submitWorkOrder">
      <label>设备</label>
      <select v-model="workOrder.device" required>
        <option v-for="item in devices" :key="item.name" :value="item.name">{{ item.name }}</option>
      </select>
      <label>维护内容</label>
      <textarea v-model="workOrder.note" placeholder="检查轴承润滑、联轴器等" required></textarea>
      <label>计划时间</label>
      <input type="datetime-local" v-model="workOrder.time" required />
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showWorkOrder=false">取消</button>
        <button class="btn primary" type="submit">提交工单</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showAlarm" title="故障告警">
    <p>最近故障：备用泵2振动偏高，建议切换运行并安排轴承更换。</p>
    <div class="modal-actions"><button class="btn primary" @click="showAlarm=false">关闭</button></div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const pumps = reactive([
  { name: '主泵1', hours: 160 },
  { name: '主泵2', hours: 140 },
  { name: '备用泵1', hours: 90 },
  { name: '备用泵2', hours: 70 },
  { name: '提升泵', hours: 120 },
  { name: '污泥泵', hours: 80 },
  { name: '污水泵', hours: 95 },
  { name: '回用泵', hours: 85 },
  { name: '旁路泵', hours: 60 },
  { name: '消防泵', hours: 20 }
]);

const devices = reactive([
  { name: '主泵1', site: '商务区A', status: '正常', vibration: 3.2, temperature: 58, suggestion: '继续观察' },
  { name: '主泵2', site: '工业园B', status: '正常', vibration: 3.5, temperature: 60, suggestion: '保持当前策略' },
  { name: '备用泵1', site: '住区C', status: '预警', vibration: 5.1, temperature: 72, suggestion: '切换休息并检查轴承' },
  { name: '备用泵2', site: '医院D', status: '预警', vibration: 5.5, temperature: 74, suggestion: '安排更换轴承' },
  { name: '提升泵', site: '学校E', status: '正常', vibration: 3.0, temperature: 55, suggestion: '可安排润滑' },
  { name: '污泥泵', site: '会展中心F', status: '正常', vibration: 3.4, temperature: 59, suggestion: '继续运行' },
  { name: '污水泵', site: '公园G', status: '正常', vibration: 3.1, temperature: 56, suggestion: '正常' },
  { name: '回用泵', site: '物流H', status: '正常', vibration: 3.2, temperature: 55, suggestion: '保持巡检' },
  { name: '旁路泵', site: '酒店I', status: '正常', vibration: 2.8, temperature: 50, suggestion: '可轮换运行' },
  { name: '消防泵', site: '文创J', status: '正常', vibration: 2.0, temperature: 44, suggestion: '月度试运行' }
]);

const showReset = ref(false);
const showWorkOrder = ref(false);
const showAlarm = ref(false);
const resetDevice = ref('');
const workOrder = reactive({ device: '', note: '', time: '' });

const submitReset = () => {
  alert(`${resetDevice.value} 已发送复位指令`);
  showReset.value = false;
};

const submitWorkOrder = () => {
  alert(`工单已创建：${workOrder.device} - ${workOrder.note}`);
  showWorkOrder.value = false;
};
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-form textarea,
.modal-form input,
.modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f0;
  background: #f8fbff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
