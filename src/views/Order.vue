<template>
  <div class="card">
    <div class="section-header">
      <div>
        <p class="badge">对账汇总</p>
        <h3 style="margin:6px 0 0;">订单与结算</h3>
      </div>
      <div class="tag-row">
        <button class="primary-btn" @click="showSettle = true">发起结算</button>
        <button class="secondary-btn" @click="showProgress('导出结算单')">导出结算</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <div class="section-header">
          <div>
            <p class="badge" :style="stat.badgeStyle">{{ stat.label }}</p>
            <h4 style="margin:4px 0 0;">{{ stat.value }}</h4>
          </div>
          <span style="color:#16a34a;font-weight:700;">{{ stat.trend }}</span>
        </div>
        <svg width="100%" height="48" viewBox="0 0 200 48" preserveAspectRatio="none">
          <polyline :points="stat.points" fill="none" :stroke="stat.color" stroke-width="3" stroke-linecap="round" />
          <circle v-for="(pt, idx) in stat.pointsArr" :key="idx" :cx="pt.x" :cy="pt.y" r="3" :fill="stat.color" />
        </svg>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>商户</th>
          <th>金额</th>
          <th>支付方式</th>
          <th>状态</th>
          <th>结算日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.merchant }}</td>
          <td>¥{{ order.amount.toFixed(2) }}</td>
          <td>{{ order.payment }}</td>
          <td>
            <span class="status-pill" :class="order.status === '已到账' ? 'status-success' : 'status-info'">{{ order.status }}</span>
          </td>
          <td>{{ order.settleDate }}</td>
          <td class="tag-row">
            <button class="secondary-btn" @click="openDetail(order)">明细</button>
            <button class="secondary-btn" @click="openInvoice(order)">开票</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showSettle" title="发起结算">
    <form class="form-grid" @submit.prevent="submitSettle">
      <label>商户<select v-model="settleForm.merchant" required>
          <option value="">请选择</option>
          <option>阳光农庄旗舰店</option>
          <option>田野供销合作社</option>
          <option>有机田园自营</option>
        </select></label>
      <label>结算周期<select v-model="settleForm.period"><option>周结</option><option>半月结</option><option>月结</option></select></label>
      <label>应结金额<input v-model.number="settleForm.amount" type="number" min="0" step="0.01" required /></label>
      <label>收款账户<input v-model="settleForm.account" placeholder="请输入收款账户" required /></label>
      <label style="grid-column:1/-1;">备注<textarea v-model="settleForm.remark" rows="2"></textarea></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showSettle=false">取消</button>
        <button class="primary-btn" type="submit">提交结算</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showDetail" title="订单明细">
    <p style="margin:0 0 12px;color:#475569;">订单 {{ selected.id }} 商品核销与物流轨迹。</p>
    <ul style="padding-left:20px;color:#475569;">
      <li>核销商品：{{ selected.items?.join('、') }}</li>
      <li>物流单号：{{ selected.shipId }}</li>
      <li>签收时间：{{ selected.finishAt }}</li>
    </ul>
    <div class="progress-track" style="margin-top:10px;">
      <div class="progress-thumb" style="width:65%;"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showInvoice" title="开票处理">
    <form class="form-grid" @submit.prevent="submitInvoice">
      <label>发票抬头<input v-model="invoiceForm.title" required /></label>
      <label>税号<input v-model="invoiceForm.tax" required /></label>
      <label>发票类型<select v-model="invoiceForm.type"><option>专票</option><option>普票</option></select></label>
      <label>发送邮箱<input v-model="invoiceForm.email" type="email" required /></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showInvoice=false">取消</button>
        <button class="primary-btn" type="submit">发送电子发票</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showProgressModal" :title="progressTitle">
    <p style="color:#475569;margin-top:0;">处理中，请稍候。</p>
    <div class="progress-track" style="margin:10px 0 12px;">
      <div class="progress-thumb" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin:0;color:#16a34a;">当前进度：{{ progress }}%</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const orders = reactive([
  { id: 'SO240501', merchant: '阳光农庄旗舰店', amount: 12890.6, payment: '微信', status: '待结算', settleDate: '2024-05-10', items: ['赣南脐橙', '东北大米'], shipId: 'YT123456', finishAt: '2024-05-02 12:30' },
  { id: 'SO240502', merchant: '田野供销合作社', amount: 8640.2, payment: '支付宝', status: '已到账', settleDate: '2024-05-05', items: ['五常稻花香', '散养土鸡蛋'], shipId: 'ZTO123456', finishAt: '2024-05-03 09:15' },
  { id: 'SO240503', merchant: '有机田园自营', amount: 6540.0, payment: '网银', status: '待结算', settleDate: '2024-05-12', items: ['冷鲜鸡胸肉', '高山绿茶'], shipId: 'SF345678', finishAt: '2024-05-04 18:00' },
  { id: 'SO240504', merchant: '乡味庄园', amount: 4860.8, payment: '微信', status: '已到账', settleDate: '2024-05-06', items: ['云南松茸干片'], shipId: 'YT222333', finishAt: '2024-05-03 11:20' },
  { id: 'SO240505', merchant: '田野供销合作社', amount: 9820.3, payment: '支付宝', status: '已到账', settleDate: '2024-05-07', items: ['赣州脆枣', '生态黑猪肉'], shipId: 'ZTO222333', finishAt: '2024-05-04 13:45' },
  { id: 'SO240506', merchant: '阳光农庄旗舰店', amount: 7450.0, payment: '微信', status: '待结算', settleDate: '2024-05-14', items: ['散养土鸡蛋', '东北大米'], shipId: 'SF999000', finishAt: '2024-05-06 10:00' },
  { id: 'SO240507', merchant: '有机田园自营', amount: 3560.5, payment: '支付宝', status: '已到账', settleDate: '2024-05-04', items: ['高山绿茶'], shipId: 'YT888555', finishAt: '2024-05-02 15:10' },
  { id: 'SO240508', merchant: '乡味庄园', amount: 4190.4, payment: '网银', status: '待结算', settleDate: '2024-05-16', items: ['冷鲜鸡胸肉', '赣南脐橙'], shipId: 'ZTO777111', finishAt: '2024-05-07 08:40' },
  { id: 'SO240509', merchant: '田野供销合作社', amount: 5120.9, payment: '微信', status: '已到账', settleDate: '2024-05-05', items: ['五常稻花香'], shipId: 'SF112233', finishAt: '2024-05-03 19:05' },
  { id: 'SO240510', merchant: '阳光农庄旗舰店', amount: 3180.2, payment: '支付宝', status: '待结算', settleDate: '2024-05-18', items: ['赣南脐橙'], shipId: 'YT445566', finishAt: '2024-05-08 16:20' }
]);

const stats = [
  { label: '待结算金额', value: '¥26,150', trend: '+8%', color: '#22c55e', points: '0,40 50,28 100,22 150,15 200,18', pointsArr: [{ x: 0, y: 40 }, { x: 50, y: 28 }, { x: 100, y: 22 }, { x: 150, y: 15 }, { x: 200, y: 18 }], badgeStyle: { background: '#dcfce7', color: '#166534' } },
  { label: '已到账金额', value: '¥18,740', trend: '+4%', color: '#38bdf8', points: '0,30 50,18 100,22 150,32 200,28', pointsArr: [{ x: 0, y: 30 }, { x: 50, y: 18 }, { x: 100, y: 22 }, { x: 150, y: 32 }, { x: 200, y: 28 }], badgeStyle: { background: '#e0f2fe', color: '#0369a1' } },
  { label: '退款率', value: '1.2%', trend: '-0.2%', color: '#f97316', points: '0,12 50,14 100,16 150,12 200,10', pointsArr: [{ x: 0, y: 12 }, { x: 50, y: 14 }, { x: 100, y: 16 }, { x: 150, y: 12 }, { x: 200, y: 10 }], badgeStyle: { background: '#fff7ed', color: '#c2410c' } }
];

const showSettle = ref(false);
const showDetail = ref(false);
const showInvoice = ref(false);
const showProgressModal = ref(false);
const progressTitle = ref('');
const progress = ref(30);
const selected = reactive({});

const settleForm = reactive({ merchant: '', period: '周结', amount: 0, account: '', remark: '' });
const invoiceForm = reactive({ title: '阳光农庄旗舰店', tax: '9134567890', type: '专票', email: 'finance@example.com' });

const showProgress = (title) => {
  progressTitle.value = title;
  showProgressModal.value = true;
  progress.value = 25;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) clearInterval(timer);
  }, 500);
};

const submitSettle = () => {
  showSettle.value = false;
  showProgress('提交结算申请');
};

const openDetail = (order) => {
  Object.assign(selected, order);
  showDetail.value = true;
};

const openInvoice = (order) => {
  Object.assign(selected, order, invoiceForm);
  showInvoice.value = true;
};

const submitInvoice = () => {
  showInvoice.value = false;
  showProgress('电子发票发送');
};
</script>
