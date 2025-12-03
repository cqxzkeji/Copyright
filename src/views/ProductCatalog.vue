<template>
  <div class="grid" style="gap:16px;">
    <div class="section-header">
      <div>
        <h3 class="section-title">产品目录</h3>
        <p style="margin:0;color:var(--muted);">常规优特钢规格、库存状态与定价</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="primary" @click="openAdd">新增规格</button>
        <button class="ghost" @click="openBundle">生成推荐组合</button>
      </div>
    </div>

    <div class="responsive-two">
      <div class="card">
        <h4 class="section-title" style="margin-bottom:8px;">库存预警</h4>
        <p style="color:var(--muted); margin-top:0;">实时监测低库存规格，提醒采购补货</p>
        <ul style="padding-left:16px; margin:0; color:var(--text);">
          <li v-for="alert in lowStocks" :key="alert.name" style="margin-bottom:6px;">
            {{ alert.name }} · 库存 {{ alert.stock }} 吨 · 安全线 {{ alert.safe }} 吨
          </li>
        </ul>
      </div>
      <div class="card">
        <h4 class="section-title" style="margin-bottom:8px;">热销图谱</h4>
        <BarChart :data="chartData" />
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h4 class="section-title">规格列表</h4>
        <button class="ghost" @click="clearFilter">清除筛选</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="table">
          <thead>
            <tr>
              <th>牌号</th>
              <th>规格</th>
              <th>库存(吨)</th>
              <th>单价(万元/吨)</th>
              <th>热度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredProducts" :key="item.grade + item.size">
              <td>{{ item.grade }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.price }}</td>
              <td><span class="tag" :class="item.heatTag">{{ item.heat }}</span></td>
              <td style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="ghost" @click="showDetail(item)">详情</button>
                <button class="primary" @click="showQuote(item)">生成报价</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog :open="showAdd" title="新增规格" @close="showAdd = false">
      <div class="form-row">
        <div>
          <label>牌号</label>
          <input v-model="addForm.grade" placeholder="如：30CrNiMo" />
        </div>
        <div>
          <label>规格</label>
          <input v-model="addForm.size" placeholder="φ210mm" />
        </div>
        <div>
          <label>库存(吨)</label>
          <input v-model.number="addForm.stock" type="number" />
        </div>
        <div>
          <label>单价(万元/吨)</label>
          <input v-model.number="addForm.price" type="number" step="0.01" />
        </div>
      </div>
      <button class="primary" @click="addProduct">添加到目录</button>
    </ModalDialog>

    <ModalDialog :open="showBundle" title="推荐组合" @close="showBundle = false">
      <p style="margin:0 0 8px;">根据当前订单自动组合常规规格，生成补货建议。</p>
      <div class="progress"><div class="bar" :style="{ width: bundleProgress + '%' }"></div></div>
      <ul style="padding-left:16px;">
        <li v-for="item in bundleResult" :key="item">{{ item }}</li>
      </ul>
    </ModalDialog>

    <ModalDialog :open="!!current" :title="current?.grade + ' · ' + current?.size" @close="current = null">
      <p style="margin:0 0 8px;">库存：{{ current?.stock }} 吨 · 单价：{{ current?.price }} 万元/吨</p>
      <p style="margin:0 0 8px;">应用领域：{{ current?.usage }}</p>
      <p style="margin:0; color:var(--muted);">建议库存安全线：{{ current?.safe }} 吨</p>
    </ModalDialog>

    <ModalDialog :open="quoteOpen" title="批量生成报价" @close="quoteOpen = false">
      <p style="margin:0 0 10px;">正在为所选规格生成阶梯报价表</p>
      <div class="progress"><div class="bar" :style="{ width: quoteProgress + '%' }"></div></div>
      <p style="color:var(--muted); margin-top:8px;">完成后自动发送给客户</p>
    </ModalDialog>

    <ModalDialog :open="infoOpen" title="提示" @close="infoOpen = false">
      <p style="margin:0;">{{ infoText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import BarChart from '../components/BarChart.vue';

const products = ref([
  { grade: '30CrNiMo', size: 'φ210mm', stock: 36, price: 2.3, heat: '高', heatTag: 'success', usage: '风电主轴', safe: 30 },
  { grade: '18Cr2Ni4WA', size: 'φ180mm', stock: 25, price: 2.8, heat: '高', heatTag: 'success', usage: '重型齿轮', safe: 20 },
  { grade: '20CrMnTi', size: 'φ120mm', stock: 42, price: 1.8, heat: '中', heatTag: 'info', usage: '工程机械轴类', safe: 35 },
  { grade: '42CrMo', size: 'φ260mm', stock: 18, price: 2.0, heat: '高', heatTag: 'success', usage: '油气设备法兰', safe: 15 },
  { grade: 'GCr15', size: 'φ90mm', stock: 52, price: 1.6, heat: '中', heatTag: 'info', usage: '轴承钢球', safe: 40 },
  { grade: '5CrNiMo', size: 'φ150mm', stock: 12, price: 2.5, heat: '高', heatTag: 'warning', usage: '模具钢', safe: 20 },
  { grade: '7CrSiMnMoV', size: 'φ110mm', stock: 30, price: 2.1, heat: '中', heatTag: 'info', usage: '破碎锤', safe: 26 },
  { grade: '9Cr2Mo', size: 'φ130mm', stock: 22, price: 2.0, heat: '中', heatTag: 'info', usage: '轧辊', safe: 20 },
  { grade: 'Cr12MoV', size: 'φ100mm', stock: 38, price: 2.2, heat: '中', heatTag: 'info', usage: '冷作模具', safe: 32 },
  { grade: 'H13', size: 'φ90mm', stock: 16, price: 3.1, heat: '高', heatTag: 'success', usage: '热作模具', safe: 18 },
  { grade: 'S136', size: 'φ80mm', stock: 14, price: 3.5, heat: '中', heatTag: 'warning', usage: '塑胶模具', safe: 16 }
]);

const lowStocks = [
  { name: '5CrNiMo φ150mm', stock: 12, safe: 20 },
  { name: 'H13 φ90mm', stock: 16, safe: 18 },
  { name: 'S136 φ80mm', stock: 14, safe: 16 }
];

const chartData = products.value.slice(0, 6).map((p, idx) => ({
  label: p.grade,
  value: p.stock,
  color: idx % 2 === 0 ? '#2563eb' : '#0ea5e9'
}));

const filterTag = ref('');
const showAdd = ref(false);
const addForm = reactive({ grade: '', size: '', stock: 0, price: 0 });
const showBundle = ref(false);
const bundleProgress = ref(0);
const bundleResult = ref([]);
const current = ref(null);
const quoteOpen = ref(false);
const quoteProgress = ref(0);
const infoOpen = ref(false);
const infoText = ref('');

const filteredProducts = computed(() => {
  if (!filterTag.value) return products.value;
  return products.value.filter((p) => p.heat === filterTag.value);
});

const openAdd = () => { showAdd.value = true; };
const openBundle = () => {
  bundleResult.value = [];
  bundleProgress.value = 0;
  showBundle.value = true;
  const timer = setInterval(() => {
    bundleProgress.value += 25;
    if (bundleProgress.value >= 100) {
      bundleResult.value = products.value.slice(0, 4).map((p) => `${p.grade} ${p.size} · 建议补货 ${(p.safe - p.stock).toFixed(0)} 吨`);
      clearInterval(timer);
    }
  }, 300);
};

const addProduct = () => {
  products.value.push({
    grade: addForm.grade,
    size: addForm.size,
    stock: addForm.stock,
    price: addForm.price,
    heat: '中',
    heatTag: 'info',
    usage: '待配置',
    safe: Math.max(addForm.stock, 10)
  });
  Object.assign(addForm, { grade: '', size: '', stock: 0, price: 0 });
  showAdd.value = false;
};

const showDetail = (item) => {
  current.value = item;
};

const showQuote = (item) => {
  quoteOpen.value = true;
  quoteProgress.value = 0;
  const timer = setInterval(() => {
    quoteProgress.value += 35;
    if (quoteProgress.value >= 100) {
      clearInterval(timer);
    }
  }, 260);
};

const clearFilter = () => {
  filterTag.value = '';
  infoText.value = '已清除热度筛选';
  infoOpen.value = true;
};
</script>
