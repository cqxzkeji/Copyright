<template>
  <section>
    <div class="card-grid">
      <div class="card" v-for="item in stats" :key="item.label">
        <h3>{{ item.label }}</h3>
        <div class="value">{{ item.value }}</div>
        <p>{{ item.note }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>销售趋势与设备激活</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openModal('趋势分析')">趋势分析</button>
          <button class="btn secondary" type="button" @click="openModal('刷新数据')">刷新数据</button>
          <button class="btn ghost" type="button" @click="openModal('导出报告')">导出报告</button>
        </div>
      </div>
      <svg class="chart" viewBox="0 0 600 200" preserveAspectRatio="none">
        <polyline
          points="0,140 80,120 160,130 240,90 320,110 400,70 480,100 600,60"
          fill="none"
          stroke="#2454ff"
          stroke-width="4"
        />
        <polyline
          points="0,160 80,150 160,140 240,130 320,120 400,110 480,90 600,80"
          fill="none"
          stroke="#7ad7ff"
          stroke-width="4"
        />
      </svg>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>最新订单处理列表</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openModal('批量派单')">批量派单</button>
          <button class="btn secondary" type="button" @click="openModal('自动派送策略')">自动派送策略</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>订单编号</th>
              <th>客户</th>
              <th>设备组合</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.bundle }}</td>
              <td>{{ order.amount }}</td>
              <td>
                <span :class="['status', order.statusClass]">{{ order.status }}</span>
              </td>
              <td>
                <div class="button-group">
                  <button class="btn secondary" type="button" @click="openModal('查看订单')">查看</button>
                  <button class="btn" type="button" @click="openModal('更新状态')">更新</button>
                  <button class="btn ghost" type="button" @click="openModal('跟进记录')">跟进</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">关闭</button>
        <button class="btn" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import Modal from '../components/Modal.vue';

const stats = [
  { label: '本月销售额', value: '¥2,458,000', note: '同比 +18%' },
  { label: '新增客户', value: '1,248', note: '高意向客户 36%' },
  { label: '设备激活率', value: '92.6%', note: '目标 90%' },
  { label: '在途订单', value: '286', note: '预计 24h 内到达' }
];

const orders = Array.from({ length: 20 }, (_, index) => ({
  id: `SO-2024-${String(index + 1).padStart(3, '0')}`,
  customer: `城市体验店${index + 1}`,
  bundle: ['门锁+网关', '灯光套装', '安防套装'][index % 3],
  amount: `¥${(12000 + index * 420).toLocaleString()}`,
  status: ['待确认', '配货中', '已发货'][index % 3],
  statusClass: ['warning', '', ''][index % 3]
}));

const modal = reactive({
  show: false,
  title: '',
  message: '',
  showProgress: false,
  progress: 68
});

const openModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `正在执行「${action}」操作，请确认涉及的订单与资源配置。`;
  modal.showProgress = action === '刷新数据' || action === '趋势分析';
  modal.progress = action === '趋势分析' ? 45 : 78;
};

const closeModal = () => {
  modal.show = false;
};
</script>
