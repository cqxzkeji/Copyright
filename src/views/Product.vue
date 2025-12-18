<template>
  <div class="card">
    <div class="section-header">
      <div>
        <p class="badge">商品库</p>
        <h3 style="margin:6px 0 0;">商品管理</h3>
      </div>
      <div class="tag-row">
        <button class="primary-btn" @click="showCreate = true">新增商品</button>
        <button class="secondary-btn" @click="showProgress('导出上架商品')">批量导出</button>
      </div>
    </div>
    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <div class="section-header">
          <div>
            <p class="badge" :style="metric.badgeStyle">{{ metric.label }}</p>
            <h4 style="margin:4px 0 0;">{{ metric.value }}</h4>
          </div>
          <span style="color:#16a34a;font-weight:700;">{{ metric.trend }}</span>
        </div>
        <div class="chart-bar" style="margin-top:10px;">
          <span :style="{ width: metric.percent + '%', background: metric.color }"></span>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>商品名</th>
          <th>类目</th>
          <th>售价</th>
          <th>库存</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>¥{{ item.price.toFixed(2) }}</td>
          <td>{{ item.stock }}</td>
          <td>
            <span class="status-pill" :class="item.status === '在售' ? 'status-success' : 'status-warning'">
              <span style="width:8px;height:8px;border-radius:50%;background:currentColor;"></span>
              {{ item.status }}
            </span>
          </td>
          <td class="tag-row">
            <button class="secondary-btn" @click="openEdit(item)">调整</button>
            <button class="secondary-btn" @click="openAlert(item)">下架提醒</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showCreate" title="新增商品">
    <form class="form-grid" @submit.prevent="submitCreate">
      <label>商品名称<input v-model="form.name" required /></label>
      <label>类目<select v-model="form.category" required>
          <option value="">请选择</option>
          <option>新鲜果蔬</option>
          <option>粮油干货</option>
          <option>肉禽蛋品</option>
          <option>地方特产</option>
        </select></label>
      <label>售价<input v-model.number="form.price" type="number" min="0" step="0.01" required /></label>
      <label>库存<input v-model.number="form.stock" type="number" min="0" required /></label>
      <label>包装规格<input v-model="form.spec" placeholder="如：500g/袋" /></label>
      <label>温控要求<input v-model="form.temp" placeholder="常温/冷链" /></label>
      <label>上架渠道<select v-model="form.channel">
          <option>线上商城</option>
          <option>社群团购</option>
          <option>批发直销</option>
        </select></label>
      <label>溯源编号<input v-model="form.trace" placeholder="SC123456" /></label>
      <label style="grid-column:1/-1;">特色卖点<textarea v-model="form.highlights" rows="2"></textarea></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showCreate=false">取消</button>
        <button class="primary-btn" type="submit">提交上架</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showEdit" title="调整商品信息">
    <form class="form-grid" @submit.prevent="submitEdit">
      <label>商品名称<input v-model="selected.name" required /></label>
      <label>售价<input v-model.number="selected.price" type="number" min="0" step="0.01" required /></label>
      <label>库存<input v-model.number="selected.stock" type="number" min="0" required /></label>
      <label>促销标记<select v-model="selected.flag"><option>新品</option><option>热卖</option><option>平销</option></select></label>
      <label style="grid-column:1/-1;">备注<textarea v-model="selected.note" rows="2"></textarea></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showEdit=false">取消</button>
        <button class="primary-btn" type="submit">保存调整</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showAlert" title="下架提醒">
    <p style="margin:0 0 12px;color:#475569;">{{ selected.name }} 将进入下架流程，需确认清仓与标记停售。</p>
    <div class="progress-track">
      <div class="progress-thumb" style="width:72%;"></div>
    </div>
    <div class="tag-row" style="margin-top:12px;">
      <button class="secondary-btn" @click="showAlert=false">取消</button>
      <button class="primary-btn" @click="showAlert=false">确认提醒买家</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showProgressModal" :title="progressTitle">
    <p style="color:#475569;margin-top:0;">正在执行，请勿关闭窗口。</p>
    <div class="progress-track" style="margin:10px 0 12px;">
      <div class="progress-thumb" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin:0;color:#16a34a;">当前进度：{{ progress }}%</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const products = reactive([
  { id: 1, name: '赣南脐橙', category: '新鲜果蔬', price: 12.8, stock: 320, status: '在售', flag: '热卖' },
  { id: 2, name: '有机西红柿', category: '新鲜果蔬', price: 8.6, stock: 180, status: '在售', flag: '新品' },
  { id: 3, name: '东北大米', category: '粮油干货', price: 68, stock: 520, status: '在售', flag: '平销' },
  { id: 4, name: '冷鲜鸡胸肉', category: '肉禽蛋品', price: 29.9, stock: 210, status: '在售', flag: '热卖' },
  { id: 5, name: '五常稻花香', category: '粮油干货', price: 128, stock: 140, status: '在售', flag: '热卖' },
  { id: 6, name: '散养土鸡蛋', category: '肉禽蛋品', price: 18, stock: 420, status: '在售', flag: '平销' },
  { id: 7, name: '云南松茸干片', category: '地方特产', price: 198, stock: 55, status: '在售', flag: '新品' },
  { id: 8, name: '赣州脆枣', category: '地方特产', price: 45, stock: 160, status: '在售', flag: '平销' },
  { id: 9, name: '生态黑猪肉', category: '肉禽蛋品', price: 58, stock: 95, status: '在售', flag: '热卖' },
  { id: 10, name: '高山绿茶', category: '地方特产', price: 76, stock: 260, status: '在售', flag: '新品' }
]);

const metrics = [
  { label: '上新商品', value: '18 件', trend: '+12%', percent: 68, color: '#22c55e', badgeStyle: { background: '#dcfce7', color: '#166534' } },
  { label: '促销中', value: '26 件', trend: '+5%', percent: 54, color: '#38bdf8', badgeStyle: { background: '#e0f2fe', color: '#0369a1' } },
  { label: '库存预警', value: '4 件', trend: '-2%', percent: 22, color: '#f97316', badgeStyle: { background: '#fff7ed', color: '#c2410c' } },
  { label: '溯源覆盖', value: '92%', trend: '+3%', percent: 92, color: '#a855f7', badgeStyle: { background: '#f3e8ff', color: '#6b21a8' } }
];

const showCreate = ref(false);
const showEdit = ref(false);
const showAlert = ref(false);
const showProgressModal = ref(false);
const progressTitle = ref('');
const progress = ref(35);
const selected = reactive({});

const form = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  spec: '',
  temp: '',
  channel: '线上商城',
  trace: '',
  highlights: ''
});

const showProgress = (title) => {
  progressTitle.value = title;
  showProgressModal.value = true;
  progress.value = 15;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) clearInterval(timer);
  }, 500);
};

const submitCreate = () => {
  products.push({ id: Date.now(), name: form.name, category: form.category, price: form.price, stock: form.stock, status: '在售', flag: '新品' });
  showCreate.value = false;
  showProgress('正在上架新商品');
};

const openEdit = (item) => {
  Object.assign(selected, item);
  showEdit.value = true;
};

const submitEdit = () => {
  showEdit.value = false;
  showProgress('更新商品信息');
};

const openAlert = (item) => {
  Object.assign(selected, item);
  showAlert.value = true;
};
</script>
