<template>
  <div class="container">
    <section class="hero">
      <div class="flex-between">
        <div>
          <h2 style="margin: 0;">订单管理</h2>
          <p>监控全链路订单，处理售后与风控事件。</p>
        </div>
        <div class="action-bar">
          <button class="btn primary" @click="showDispatch = true">批量发货</button>
          <button class="btn" @click="showAfterSale = true">售后处理</button>
          <button class="btn ghost" @click="showNotify = true">消息提醒</button>
        </div>
      </div>
    </section>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">今日订单（示例 10 条以上）</h3>
        <span class="badge info dot">风控监控开启</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>商品</th>
            <th>金额</th>
            <th>物流</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.user }}</td>
            <td>{{ order.items }}</td>
            <td>¥{{ order.amount }}</td>
            <td>{{ order.logistics }}</td>
            <td><span :class="['badge', order.status === '已发货' ? 'success' : order.status === '待支付' ? 'warning' : 'info']">{{ order.status }}</span></td>
            <td>
              <div class="action-bar">
                <button class="btn primary" @click="openDetail(order)">详情</button>
                <button class="btn" @click="showProgress = true">催单</button>
                <button class="btn ghost" @click="showTag(order)">标记</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card stat-card">
        <h3 class="section-title">履约概览</h3>
        <ul class="list">
          <li><span>当日发货完成率</span><span class="badge success">93%</span></li>
          <li><span>冷链订单占比</span><span class="badge info">41%</span></li>
          <li><span>超时预警</span><span class="badge warning">5 单</span></li>
        </ul>
      </div>
      <div class="card stat-card">
        <h3 class="section-title">渠道分布</h3>
        <div class="list">
          <div class="list-item" v-for="c in channels" :key="c.name" style="align-items: center;">
            <div>
              <strong>{{ c.name }}</strong>
              <div class="chart-bar"><span :style="{ width: c.share + '%' }"></span></div>
            </div>
            <span class="badge info">{{ c.share }}%</span>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog v-model="showDispatch" title="批量发货" @confirm="showDispatch = false">
      <p>将对 12 个待发货订单执行批量出库，已同步仓库拣选。</p>
      <div class="progress-bar"><div class="fill" style="width: 60%"></div></div>
    </ModalDialog>

    <ModalDialog v-model="showAfterSale" title="售后处理" @confirm="showAfterSale = false">
      <div class="form-grid">
        <label><div class="label">售后类型</div><select class="input"><option>退货退款</option><option>仅退款</option><option>补寄</option></select></label>
        <label><div class="label">问题描述</div><input class="input" placeholder="描述物流破损、缺件等" /></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showNotify" title="消息提醒" @confirm="showNotify = false">
      <p>将通过企业微信推送订单异常与催单提醒。</p>
    </ModalDialog>

    <ModalDialog v-model="showDetail" title="订单详情" @confirm="showDetail = false">
      <p>订单 {{ current?.id }} 含 {{ current?.items }}，金额 ¥{{ current?.amount }}</p>
      <p style="color: var(--muted);">收货人：{{ current?.user }} | 物流：{{ current?.logistics }}</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="处理中">
      <div class="progress-bar"><div class="fill" style="width: 80%"></div></div>
      <p style="color: var(--muted);">已通知仓库与物流跟进</p>
    </ModalDialog>

    <ModalDialog v-model="showTagModal" title="标记订单" @confirm="showTagModal = false">
      <div class="form-grid">
        <label><div class="label">标签</div><input class="input" placeholder="高优先级/客服跟进" /></label>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const orders = ref([
  { id: 'O-1001', user: '陈女士', items: '赣南脐橙*1, 对虾*1', amount: 238, logistics: '冷链-京东', status: '已发货' },
  { id: 'O-1002', user: '李先生', items: '小黄姜*2', amount: 64, logistics: '百世', status: '已发货' },
  { id: 'O-1003', user: '王先生', items: '丹东草莓*1', amount: 129, logistics: '顺丰冷链', status: '待支付' },
  { id: 'O-1004', user: '周女士', items: '牛腩*1, 带鱼*2', amount: 314, logistics: '京东冷链', status: '待发货' },
  { id: 'O-1005', user: '刘先生', items: '黄小米*3', amount: 117, logistics: '中通', status: '待发货' },
  { id: 'O-1006', user: '唐先生', items: '苹果*2', amount: 138, logistics: '顺丰', status: '已发货' },
  { id: 'O-1007', user: '郑女士', items: '生态鸡蛋*1', amount: 49, logistics: '京东', status: '已发货' },
  { id: 'O-1008', user: '赵先生', items: '红枣*3', amount: 177, logistics: '极兔', status: '待发货' },
  { id: 'O-1009', user: '黄女士', items: '脐橙*2', amount: 98, logistics: '顺丰', status: '已发货' },
  { id: 'O-1010', user: '朱先生', items: '带鱼*3', amount: 174, logistics: '京东冷链', status: '待发货' },
  { id: 'O-1011', user: '宋女士', items: '对虾*1, 草莓*1', amount: 288, logistics: '顺丰冷链', status: '待支付' }
]);

const channels = [
  { name: '平台自营', share: 42 },
  { name: '社区团购', share: 28 },
  { name: '直播电商', share: 17 },
  { name: '批发渠道', share: 13 }
];

const showDispatch = ref(false);
const showAfterSale = ref(false);
const showNotify = ref(false);
const showDetail = ref(false);
const showProgress = ref(false);
const showTagModal = ref(false);
const current = ref(null);

const openDetail = (order) => {
  current.value = order;
  showDetail.value = true;
};

const showTag = (order) => {
  current.value = order;
  showTagModal.value = true;
};
</script>
