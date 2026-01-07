<template>
  <div class="section">
    <div class="section-title">报价与订单概览</div>
    <div class="card-grid">
      <div class="card">
        <h3>今日报价</h3>
        <p>{{ stats.quotes }} 份</p>
      </div>
      <div class="card">
        <h3>处理中订单</h3>
        <p>{{ stats.processing }} 单</p>
      </div>
      <div class="card">
        <h3>准时交付率</h3>
        <p>{{ stats.delivery }}%</p>
      </div>
      <div class="card">
        <h3>待发货</h3>
        <p>{{ stats.pending }} 单</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">报价趋势</div>
    <div class="chart">
      <div v-for="item in chart" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">订单操作</div>
    <div class="button-row">
      <button class="btn" type="button" @click="openModal('quote')">快速报价</button>
      <button class="btn secondary" type="button" @click="openModal('track')">状态跟踪</button>
      <button class="btn ghost" type="button" @click="openModal('delivery')">发货提醒</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">报价订单列表</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>产品规格</th>
            <th>报价金额</th>
            <th>交付日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.client }}</td>
            <td>{{ item.spec }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.delivery }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'quote'" title="快速报价" @close="activeModal = ''">
    <form>
      <div>
        <label>客户名称</label>
        <input type="text" placeholder="输入客户名称" />
      </div>
      <div>
        <label>产品规格</label>
        <input type="text" placeholder="例如 Q355B 40mm" />
      </div>
      <div>
        <label>预计吨位</label>
        <input type="number" placeholder="输入吨位" />
      </div>
      <div class="button-row">
        <button class="btn" type="button">生成报价单</button>
        <button class="btn ghost" type="button" @click="activeModal = ''">取消</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'track'" title="订单状态跟踪" @close="activeModal = ''">
    <p style="margin-top: 0;">正在加载订单物流与生产进度。</p>
    <div class="progress-bar">
      <span style="width: 58%;"></span>
    </div>
    <p style="margin: 12px 0 0; color: var(--muted);">当前完成 58%，预计 3 天交付。</p>
  </BaseModal>

  <BaseModal v-if="activeModal === 'delivery'" title="发货提醒" @close="activeModal = ''">
    <p style="margin-top: 0;">系统已向仓储与物流发送发货提醒。</p>
    <button class="btn" type="button" @click="activeModal = ''">确认</button>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = {
  quotes: 18,
  processing: 42,
  delivery: 93,
  pending: 9
};

const chart = [
  { label: '周一', value: 45 },
  { label: '周二', value: 62 },
  { label: '周三', value: 58 },
  { label: '周四', value: 72 },
  { label: '周五', value: 66 },
  { label: '周六', value: 52 }
];

const orders = [
  { id: 'QO-240801', client: '华北重工', spec: 'Q355B 40mm', amount: '¥ 1,280,000', delivery: '2024-09-05', status: '生产中' },
  { id: 'QO-240802', client: '三江能源', spec: '耐腐蚀钢管 60mm', amount: '¥ 920,000', delivery: '2024-09-08', status: '待确认' },
  { id: 'QO-240803', client: '远航船舶', spec: '低温钢板 50mm', amount: '¥ 1,560,000', delivery: '2024-09-10', status: '已签约' },
  { id: 'QO-240804', client: '凌峰风电', spec: 'Q460C 65mm', amount: '¥ 1,100,000', delivery: '2024-09-12', status: '生产中' },
  { id: 'QO-240805', client: '恒久矿业', spec: '耐磨板材 30mm', amount: '¥ 860,000', delivery: '2024-09-13', status: '待发货' },
  { id: 'QO-240806', client: '广诚设备', spec: '42CrMo 45mm', amount: '¥ 990,000', delivery: '2024-09-15', status: '生产中' },
  { id: 'QO-240807', client: '启盛桥梁', spec: '桥梁钢 60mm', amount: '¥ 1,480,000', delivery: '2024-09-18', status: '已签约' },
  { id: 'QO-240808', client: '鑫龙机械', spec: '耐疲劳钢 35mm', amount: '¥ 730,000', delivery: '2024-09-19', status: '待确认' },
  { id: 'QO-240809', client: '鼎顺轨交', spec: '轨道钢材 50mm', amount: '¥ 1,320,000', delivery: '2024-09-20', status: '生产中' },
  { id: 'QO-240810', client: '宏盛化工', spec: '耐腐蚀合金 25mm', amount: '¥ 780,000', delivery: '2024-09-21', status: '待发货' },
  { id: 'QO-240811', client: '瑞达电力', spec: '耐高温钢 55mm', amount: '¥ 1,050,000', delivery: '2024-09-22', status: '生产中' },
  { id: 'QO-240812', client: '海川海工', spec: '防腐钢板 45mm', amount: '¥ 1,410,000', delivery: '2024-09-23', status: '已签约' },
  { id: 'QO-240813', client: '山河重装', spec: '超厚板材 80mm', amount: '¥ 1,760,000', delivery: '2024-09-24', status: '待确认' },
  { id: 'QO-240814', client: '远东物流', spec: '集装箱钢板 28mm', amount: '¥ 620,000', delivery: '2024-09-25', status: '待发货' },
  { id: 'QO-240815', client: '中岳环保', spec: '耐磨钢板 40mm', amount: '¥ 820,000', delivery: '2024-09-26', status: '生产中' },
  { id: 'QO-240816', client: '安泰矿业', spec: '支护钢 50mm', amount: '¥ 1,120,000', delivery: '2024-09-27', status: '待确认' },
  { id: 'QO-240817', client: '星域智造', spec: '高精度钢材 30mm', amount: '¥ 940,000', delivery: '2024-09-28', status: '生产中' },
  { id: 'QO-240818', client: '蓝澜工程', spec: '桥梁加固钢 55mm', amount: '¥ 1,260,000', delivery: '2024-09-29', status: '已签约' },
  { id: 'QO-240819', client: '新航航空', spec: '特种合金 26mm', amount: '¥ 1,340,000', delivery: '2024-09-30', status: '待发货' },
  { id: 'QO-240820', client: '宏越工程', spec: '高韧性钢筋 32mm', amount: '¥ 690,000', delivery: '2024-10-01', status: '生产中' }
];

const activeModal = ref('');

const openModal = (name) => {
  activeModal.value = name;
};
</script>
