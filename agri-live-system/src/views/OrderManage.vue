<template>
  <div class="card">
    <div class="section-header">
      <h3>订单管理</h3>
      <div class="btn-group">
        <button class="btn" type="button" @click="showForm = true">创建补发单</button>
        <button class="btn secondary" type="button" @click="showProgress = true">更新物流</button>
        <button class="btn warn" type="button" @click="showTip = true">异常提醒</button>
      </div>
    </div>
    <p class="section-desc">追踪订单履约、退款与售后。</p>
  </div>

  <div class="card">
    <h3>订单列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>用户</th>
          <th>商品</th>
          <th>数量</th>
          <th>金额</th>
          <th>配送</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user }}</td>
          <td>{{ order.product }}</td>
          <td>{{ order.count }}</td>
          <td>{{ order.amount }}</td>
          <td>{{ order.delivery }}</td>
          <td><span class="tag">{{ order.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h3>售后处理清单</h3>
    <table class="table">
      <thead>
        <tr>
          <th>工单号</th>
          <th>订单号</th>
          <th>问题类型</th>
          <th>负责人</th>
          <th>进度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.code">
          <td>{{ ticket.code }}</td>
          <td>{{ ticket.order }}</td>
          <td>{{ ticket.issue }}</td>
          <td>{{ ticket.owner }}</td>
          <td>{{ ticket.progress }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="创建补发单" @close="showForm = false">
    <div class="form-grid">
      <div class="form-item">
        <label>原订单号</label>
        <input placeholder="请输入订单号" />
      </div>
      <div class="form-item">
        <label>补发商品</label>
        <input placeholder="商品名称" />
      </div>
      <div class="form-item">
        <label>补发数量</label>
        <input type="number" placeholder="数量" />
      </div>
      <div class="form-item">
        <label>物流公司</label>
        <select>
          <option>顺丰</option>
          <option>中通</option>
          <option>韵达</option>
          <option>京东物流</option>
        </select>
      </div>
      <div class="form-item" style="grid-column: 1 / -1;">
        <label>备注</label>
        <textarea rows="3" placeholder="填写补发原因"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showForm = false">取消</button>
      <button class="btn" type="button" @click="showForm = false">提交补发</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="物流更新中" @close="showProgress = false">
    <p>正在拉取物流轨迹信息。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: '67%' }"></div>
    </div>
    <template #footer>
      <button class="btn" type="button" @click="showProgress = false">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showTip" title="异常订单提醒" @close="showTip = false">
    <p>发现 4 笔订单物流停滞超过 48 小时，请及时联系物流。</p>
    <template #footer>
      <button class="btn" type="button" @click="showTip = false">立即处理</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)

const orders = [
  { id: 'OD-55031', user: '张颖', product: '生态番茄礼盒', count: 2, amount: '¥ 98', delivery: '顺丰', status: '已发货' },
  { id: 'OD-55032', user: '李晴', product: '有机大米 5kg', count: 1, amount: '¥ 68', delivery: '中通', status: '已签收' },
  { id: 'OD-55033', user: '周达', product: '高山玉米', count: 4, amount: '¥ 48', delivery: '韵达', status: '配送中' },
  { id: 'OD-55034', user: '王露', product: '时令荔枝', count: 2, amount: '¥ 64', delivery: '顺丰', status: '已发货' },
  { id: 'OD-55035', user: '陈欣', product: '山泉蜂蜜', count: 1, amount: '¥ 58', delivery: '京东物流', status: '待发货' },
  { id: 'OD-55036', user: '胡飞', product: '原香鸡蛋 30枚', count: 1, amount: '¥ 36', delivery: '中通', status: '已签收' },
  { id: 'OD-55037', user: '杜静', product: '富硒红薯', count: 3, amount: '¥ 78', delivery: '韵达', status: '配送中' },
  { id: 'OD-55038', user: '孙琪', product: '冷链牛奶', count: 2, amount: '¥ 90', delivery: '顺丰', status: '已发货' },
  { id: 'OD-55039', user: '陆婷', product: '高原苹果', count: 2, amount: '¥ 104', delivery: '京东物流', status: '待发货' },
  { id: 'OD-55040', user: '谢航', product: '田园蔬菜包', count: 1, amount: '¥ 29', delivery: '中通', status: '已签收' },
  { id: 'OD-55041', user: '苏清', product: '五谷杂粮礼盒', count: 1, amount: '¥ 88', delivery: '顺丰', status: '配送中' }
]

const tickets = [
  { code: 'AF-9001', order: 'OD-55035', issue: '缺货补发', owner: '客服一组', progress: '处理中' },
  { code: 'AF-9002', order: 'OD-55033', issue: '物流延迟', owner: '客服二组', progress: '处理中' },
  { code: 'AF-9003', order: 'OD-55034', issue: '包装破损', owner: '客服一组', progress: '待补发' },
  { code: 'AF-9004', order: 'OD-55037', issue: '地址变更', owner: '客服三组', progress: '待联系' },
  { code: 'AF-9005', order: 'OD-55039', issue: '退款申请', owner: '客服二组', progress: '审核中' },
  { code: 'AF-9006', order: 'OD-55036', issue: '重复下单', owner: '客服一组', progress: '已关闭' },
  { code: 'AF-9007', order: 'OD-55031', issue: '少件反馈', owner: '客服三组', progress: '待补发' },
  { code: 'AF-9008', order: 'OD-55038', issue: '温控异常', owner: '客服二组', progress: '处理中' },
  { code: 'AF-9009', order: 'OD-55040', issue: '客户拒收', owner: '客服一组', progress: '待确认' },
  { code: 'AF-9010', order: 'OD-55041', issue: '延迟发货', owner: '客服三组', progress: '处理中' }
]
</script>

<style scoped>
.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-desc {
  color: #6b7280;
  margin: 12px 0 0;
}
</style>
