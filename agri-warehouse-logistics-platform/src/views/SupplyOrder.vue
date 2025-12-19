<template>
  <div class="page">
    <div class="grid two">
      <div class="card">
        <div class="section-title">供应计划节奏</div>
        <p>本周计划总量 825 吨，滚动补货覆盖 7 大区域。</p>
        <p style="margin-top: 8px; color: #6b7280;">核心客户协同完成率达 89%，重点订单稳定。</p>
      </div>
      <div class="card">
        <div class="section-title">订单履约完成率</div>
        <div class="chart-bars">
          <div v-for="bar in chartData" :key="bar.name" class="bar" :style="{ height: bar.value + '%' }">
            {{ bar.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">订单协同清单</div>
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>品类</th>
            <th>计划量(吨)</th>
            <th>交付日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.client }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.date }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-title">协同操作</div>
      <div class="grid three">
        <button class="primary-btn" @click="openForm">新增供应计划</button>
        <button class="ghost-btn" @click="openProgress">订单执行进度</button>
        <button class="ghost-btn" @click="openInfo">客户提示</button>
      </div>
    </div>

    <BaseModal v-if="showForm" title="新增供应计划" @close="showForm = false">
      <div class="input-group">
        <label>客户</label>
        <input v-model="form.client" placeholder="请输入客户名称" />
      </div>
      <div class="input-group">
        <label>品类</label>
        <input v-model="form.category" placeholder="如：有机蔬菜" />
      </div>
      <div class="input-group">
        <label>计划量(吨)</label>
        <input v-model="form.quantity" placeholder="请输入计划量" />
      </div>
      <div class="input-group">
        <label>交付周期</label>
        <select v-model="form.cycle">
          <option>3天内</option>
          <option>7天内</option>
          <option>15天内</option>
        </select>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showForm = false">取消</button>
        <button class="primary-btn" @click="submitForm">提交计划</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showProgress" title="订单执行进度" @close="showProgress = false">
      <p>今日共 14 单协同订单，已完成 9 单，履约率 64%。</p>
      <div class="progress-bar" style="margin-top: 12px;">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showProgress = false">关闭</button>
        <button class="primary-btn" @click="boostProgress">提升履约</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showInfo" title="客户提示" @close="showInfo = false">
      <p>华东生鲜超市已申请提前交付，请确认库存与排产。</p>
      <div class="actions">
        <button class="primary-btn" @click="showInfo = false">确认</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { name: '一月', value: 75 },
  { name: '二月', value: 82 },
  { name: '三月', value: 90 },
  { name: '四月', value: 78 },
  { name: '五月', value: 86 },
  { name: '六月', value: 92 }
];

const orders = [
  { id: 'PO-2401', client: '华东生鲜超市', category: '有机蔬菜', quantity: 40, date: '2024-06-18', status: '备货中' },
  { id: 'PO-2402', client: '北方粮油集团', category: '小麦', quantity: 120, date: '2024-06-20', status: '待确认' },
  { id: 'PO-2403', client: '南方食品公司', category: '荔枝', quantity: 30, date: '2024-06-21', status: '运输中' },
  { id: 'PO-2404', client: '中部冷链中心', category: '牛肉', quantity: 55, date: '2024-06-22', status: '备货中' },
  { id: 'PO-2405', client: '华南连锁商超', category: '芒果', quantity: 28, date: '2024-06-23', status: '已分配' },
  { id: 'PO-2406', client: '西北加工厂', category: '枸杞', quantity: 18, date: '2024-06-24', status: '已分配' },
  { id: 'PO-2407', client: '华东烘焙中心', category: '草莓', quantity: 22, date: '2024-06-25', status: '备货中' },
  { id: 'PO-2408', client: '东北米业集团', category: '稻米', quantity: 160, date: '2024-06-26', status: '待确认' },
  { id: 'PO-2409', client: '西南餐饮连锁', category: '蔬菜', quantity: 45, date: '2024-06-27', status: '运输中' },
  { id: 'PO-2410', client: '华中批发市场', category: '香蕉', quantity: 36, date: '2024-06-28', status: '备货中' },
  { id: 'PO-2411', client: '华北团餐中心', category: '大豆', quantity: 80, date: '2024-06-29', status: '已分配' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(64);

const form = reactive({
  client: '',
  category: '',
  quantity: '',
  cycle: '7天内'
});

const openForm = () => {
  showForm.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const openInfo = () => {
  showInfo.value = true;
};

const submitForm = () => {
  showForm.value = false;
};

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 12);
};
</script>
