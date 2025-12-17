<template>
  <div class="container">
    <section class="hero">
      <div class="flex-between">
        <div>
          <h2 style="margin: 0;">库存与供应链</h2>
          <p>监控仓储库存、补货计划与供应商履约。</p>
        </div>
        <div class="action-bar">
          <button class="btn primary" @click="showPurchase = true">创建采购单</button>
          <button class="btn" @click="showTransfer = true">调拨</button>
          <button class="btn ghost" @click="showWarning = true">预警</button>
        </div>
      </div>
    </section>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">库存明细</h3>
        <span class="badge info dot">实时同步仓库 WMS</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>品名</th>
            <th>在库</th>
            <th>锁定</th>
            <th>周转天数</th>
            <th>供应商</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stocks" :key="item.sku">
            <td>{{ item.sku }}</td>
            <td>{{ item.name }}</td>
            <td><span class="badge success">{{ item.qty }}</span></td>
            <td>{{ item.locked }}</td>
            <td>{{ item.days }}</td>
            <td>{{ item.vendor }}</td>
            <td>
              <div class="action-bar">
                <button class="btn primary" @click="openPlan(item)">补货</button>
                <button class="btn" @click="showProgress = true">同步</button>
                <button class="btn ghost" @click="openTrace(item)">溯源</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card stat-card">
        <h3 class="section-title">补货计划</h3>
        <ul class="list">
          <li v-for="plan in plans" :key="plan.name"><span>{{ plan.name }}</span><span class="badge warning">{{ plan.qty }}</span></li>
        </ul>
      </div>
      <div class="card stat-card">
        <h3 class="section-title">供应商履约</h3>
        <div class="list">
          <div class="list-item" v-for="v in vendors" :key="v.name">
            <div>
              <strong>{{ v.name }}</strong>
              <small style="display: block; color: var(--muted);">{{ v.region }}</small>
              <div class="chart-bar"><span :style="{ width: v.score + '%' }"></span></div>
            </div>
            <span class="badge info">{{ v.score }}%</span>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog v-model="showPurchase" title="创建采购单" @confirm="showPurchase = false">
      <div class="form-grid">
        <label><div class="label">供应商</div><input class="input" placeholder="选择供应商" /></label>
        <label><div class="label">品名</div><input class="input" placeholder="赣南脐橙" /></label>
        <label><div class="label">数量</div><input class="input" placeholder="件" /></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showTransfer" title="仓间调拨" @confirm="showTransfer = false">
      <p>选择调拨仓库与数量，默认走冷链车辆。</p>
      <div class="progress-bar"><div class="fill" style="width: 55%"></div></div>
    </ModalDialog>

    <ModalDialog v-model="showWarning" title="库存预警" @confirm="showWarning = false">
      <p>低于安全库存的 SKU 将发送至钉钉群提醒。</p>
    </ModalDialog>

    <ModalDialog v-model="showPlan" title="补货计划" @confirm="showPlan = false">
      <p>SKU {{ current?.sku }} 将补货 {{ current?.name }}，补货量 200 件。</p>
    </ModalDialog>

    <ModalDialog v-model="showTrace" title="溯源信息" @confirm="showTrace = false">
      <p>{{ current?.name }} 来源：{{ current?.vendor }}，批次号 {{ current?.batch }}</p>
      <p style="color: var(--muted);">采收日期 {{ current?.harvest }}，质检结果合格</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="同步任务">
      <div class="progress-bar"><div class="fill" style="width: 65%"></div></div>
      <p style="color: var(--muted);">同步库存到各销售渠道</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stocks = ref([
  { sku: 'S-001', name: '赣南脐橙', qty: 420, locked: 30, days: 8, vendor: '赣州果业', batch: 'A23', harvest: '11-18' },
  { sku: 'S-002', name: '丹东草莓', qty: 180, locked: 20, days: 4, vendor: '丹东莓园', batch: 'B16', harvest: '11-20' },
  { sku: 'S-003', name: '对虾', qty: 90, locked: 10, days: 6, vendor: '湛江海产', batch: 'C09', harvest: '11-17' },
  { sku: 'S-004', name: '生态鸡蛋', qty: 520, locked: 40, days: 14, vendor: '崇明农场', batch: 'D03', harvest: '11-12' },
  { sku: 'S-005', name: '牛腩', qty: 150, locked: 15, days: 5, vendor: '呼伦牧场', batch: 'E11', harvest: '11-19' },
  { sku: 'S-006', name: '小黄姜', qty: 360, locked: 25, days: 12, vendor: '云南生鲜', batch: 'F07', harvest: '11-08' },
  { sku: 'S-007', name: '苹果', qty: 310, locked: 35, days: 10, vendor: '烟台果业', batch: 'G10', harvest: '11-10' },
  { sku: 'S-008', name: '带鱼', qty: 210, locked: 18, days: 7, vendor: '舟山渔场', batch: 'H13', harvest: '11-16' },
  { sku: 'S-009', name: '黄小米', qty: 440, locked: 22, days: 20, vendor: '东北农产', batch: 'I04', harvest: '11-01' },
  { sku: 'S-010', name: '红枣', qty: 260, locked: 12, days: 16, vendor: '若羌果园', batch: 'J02', harvest: '11-05' },
  { sku: 'S-011', name: '葡萄柚', qty: 190, locked: 8, days: 9, vendor: '福建果农', batch: 'K06', harvest: '11-14' }
]);

const plans = [
  { name: '赣南脐橙补货', qty: '200 箱' },
  { name: '丹东草莓锁定', qty: '80 箱' },
  { name: '冷链水产补货', qty: '120 件' },
  { name: '常温仓粮油补货', qty: '300 件' }
];

const vendors = [
  { name: '赣州果业', region: '江西赣州', score: 92 },
  { name: '丹东莓园', region: '辽宁丹东', score: 87 },
  { name: '湛江海产', region: '广东湛江', score: 83 },
  { name: '崇明农场', region: '上海崇明', score: 90 }
];

const showPurchase = ref(false);
const showTransfer = ref(false);
const showWarning = ref(false);
const showPlan = ref(false);
const showTrace = ref(false);
const showProgress = ref(false);
const current = ref(null);

const openPlan = (item) => {
  current.value = item;
  showPlan.value = true;
};

const openTrace = (item) => {
  current.value = item;
  showTrace.value = true;
};
</script>
