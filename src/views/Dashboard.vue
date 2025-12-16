<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = reactive([
  { name: '本月收入', value: '¥ 1,280,000', trend: '+12.6%' },
  { name: '订单完成率', value: '94.3%', trend: '+2.1%' },
  { name: '客户留存', value: '87%', trend: '+1.7%' },
  { name: '异常警报', value: '4', trend: '低风险' }
]);

const chartData = reactive([
  { label: '华北', value: 82 },
  { label: '华东', value: 64 },
  { label: '华南', value: 72 },
  { label: '西南', value: 55 },
  { label: '东北', value: 49 },
  { label: '港澳台', value: 38 },
  { label: '海外A', value: 61 },
  { label: '海外B', value: 45 },
  { label: '直销', value: 69 },
  { label: '渠道', value: 58 }
]);

const noticeModal = ref(false);
const refreshModal = ref(false);
const progress = ref(0);
const noticeForm = reactive({ title: '', content: '', owner: '' });

const openRefresh = () => {
  progress.value = 0;
  refreshModal.value = true;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 400);
};

const notices = reactive([
  { title: '月度汇总', dept: '运营部', time: '09:20' },
  { title: '渠道优化', dept: '市场部', time: '10:10' },
  { title: '库存盘点', dept: '仓储部', time: '11:00' }
]);

const submitNotice = () => {
  notices.unshift({ title: noticeForm.title, dept: noticeForm.owner || '未分配', time: '刚刚' });
  noticeForm.title = '';
  noticeForm.content = '';
  noticeForm.owner = '';
  noticeModal.value = false;
};

const table = reactive([
  { id: 'SO-1001', client: '华星集团', amount: '¥320,000', status: '已完成' },
  { id: 'SO-1002', client: '南方科技', amount: '¥280,000', status: '执行中' },
  { id: 'SO-1003', client: '远洋物流', amount: '¥120,000', status: '延期' },
  { id: 'SO-1004', client: '华通能源', amount: '¥450,000', status: '已完成' },
  { id: 'SO-1005', client: '金辉医药', amount: '¥210,000', status: '执行中' },
  { id: 'SO-1006', client: '广源地产', amount: '¥360,000', status: '已完成' },
  { id: 'SO-1007', client: '宁远汽车', amount: '¥190,000', status: '执行中' },
  { id: 'SO-1008', client: '皓月服饰', amount: '¥170,000', status: '已完成' },
  { id: 'SO-1009', client: '星河电力', amount: '¥230,000', status: '延期' },
  { id: 'SO-1010', client: '京盛传媒', amount: '¥260,000', status: '执行中' }
]);
</script>

<template>
  <div>
    <div class="section-header">
      <h2>业务数据可视化仪表板</h2>
      <div class="button-row">
        <button @click="openRefresh">刷新数据</button>
        <button class="secondary" @click="noticeModal = true">新增公告</button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="metric in metrics" :key="metric.name" class="card">
        <h3>{{ metric.name }}</h3>
        <div class="value">{{ metric.value }}</div>
        <div class="tag">{{ metric.trend }}</div>
      </div>
    </div>

    <div class="section-header" style="margin-top: 18px">
      <h3>区域营收趋势</h3>
      <span class="badge">含10个分区</span>
    </div>
    <div class="bar-chart">
      <div v-for="item in chartData" :key="item.label" class="bar-item">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <strong>{{ item.label }}</strong>
          <span>{{ item.value }}%</span>
        </div>
        <div class="bar" :style="{ width: item.value + '%' }"></div>
      </div>
    </div>

    <div class="section-header" style="margin-top: 20px">
      <h3>订单明细</h3>
      <span class="badge">10条记录</span>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>金额</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.client }}</td>
            <td>{{ row.amount }}</td>
            <td>
              <span class="status" :class="{ success: row.status === '已完成', warning: row.status === '执行中', danger: row.status === '延期' }">
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog title="新增公告" :show="noticeModal" @close="noticeModal = false">
      <div class="form-grid">
        <label>
          标题
          <input v-model="noticeForm.title" placeholder="如：发布新品活动" />
        </label>
        <label>
          通知部门
          <input v-model="noticeForm.owner" placeholder="如：市场部" />
        </label>
        <label style="grid-column: span 2">
          内容
          <textarea v-model="noticeForm.content" rows="3" placeholder="简述公告内容"></textarea>
        </label>
      </div>
      <div class="button-row" style="margin-top: 12px">
        <button @click="submitNotice">提交</button>
        <button class="ghost" @click="noticeModal = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog title="刷新数据" :show="refreshModal" @close="refreshModal = false">
      <p>正在同步最新指标，请稍候...</p>
      <div class="progress" style="margin: 12px 0">
        <div class="progress-inner" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前进度：{{ progress }}%</p>
    </ModalDialog>
  </div>
</template>
