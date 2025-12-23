<template>
  <MainLayout>
    <section class="card">
      <div class="button-group" style="justify-content: space-between; align-items: center;">
        <div>
          <h3>订单与结算管理</h3>
          <p>跟踪订单履约、退款与结算信息</p>
        </div>
        <div class="button-group">
          <button class="button" @click="openModal('settle')">发起结算</button>
          <button class="button secondary" @click="openModal('refund')">退款处理</button>
          <button class="button ghost" @click="openModal('tip')">通知商家</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>订单编号</th>
            <th>购买人</th>
            <th>金额</th>
            <th>支付方式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.buyer }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.pay }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="grid-2">
      <div class="card">
        <h3>结算进度</h3>
        <p>本周结算任务完成度</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span style="width: 74%;"></span>
        </div>
      </div>
      <div class="card">
        <h3>退款原因分布</h3>
        <div class="chart">
          <div v-for="reason in refundReasons" :key="reason.name" class="chart-row">
            <span style="width: 80px;">{{ reason.name }}</span>
            <div class="chart-bar"><span :style="{ width: reason.value + '%' }"></span></div>
            <strong>{{ reason.value }}%</strong>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>

  <ModalDialog
    v-if="activeModal === 'settle'"
    title="发起结算"
    confirm-text="提交结算"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="form-grid">
      <div>
        <label>结算周期</label>
        <select>
          <option>本周</option>
          <option>本月</option>
        </select>
      </div>
      <div>
        <label>结算账户</label>
        <input placeholder="选择账户" />
      </div>
      <div>
        <label>备注</label>
        <textarea rows="3" placeholder="补充结算说明"></textarea>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'refund'"
    title="退款处理"
    confirm-text="确认退款"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>选择需要优先处理的退款订单。</p>
    <div class="form-grid">
      <div>
        <label>订单编号</label>
        <input placeholder="请输入订单号" />
      </div>
      <div>
        <label>退款原因</label>
        <select>
          <option>物流延迟</option>
          <option>质量问题</option>
          <option>客户主动取消</option>
        </select>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="通知商家"
    confirm-text="发送通知"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>系统将向供应商发送结算提醒与运营提示。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 50%;"></span>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModalDialog from '../components/ModalDialog.vue'

const activeModal = ref('')

const orders = [
  { id: 'O-240501', buyer: '张琳', amount: '¥ 2,680', pay: '微信支付', status: '待发货' },
  { id: 'O-240502', buyer: '王超', amount: '¥ 1,420', pay: '支付宝', status: '已完成' },
  { id: 'O-240503', buyer: '陈雅', amount: '¥ 980', pay: '银行卡', status: '退款中' },
  { id: 'O-240504', buyer: '刘楠', amount: '¥ 3,240', pay: '微信支付', status: '配送中' },
  { id: 'O-240505', buyer: '孙岩', amount: '¥ 760', pay: '支付宝', status: '待发货' },
  { id: 'O-240506', buyer: '周洁', amount: '¥ 1,180', pay: '微信支付', status: '已完成' },
  { id: 'O-240507', buyer: '何伟', amount: '¥ 520', pay: '支付宝', status: '退款中' },
  { id: 'O-240508', buyer: '蒋慧', amount: '¥ 1,960', pay: '银行卡', status: '配送中' },
  { id: 'O-240509', buyer: '朱敏', amount: '¥ 2,450', pay: '微信支付', status: '已完成' },
  { id: 'O-240510', buyer: '赵亮', amount: '¥ 1,360', pay: '支付宝', status: '待发货' }
]

const refundReasons = [
  { name: '物流延迟', value: 38 },
  { name: '质量问题', value: 25 },
  { name: '客户取消', value: 20 },
  { name: '其他', value: 17 }
]

const openModal = (type) => {
  activeModal.value = type
}
</script>
