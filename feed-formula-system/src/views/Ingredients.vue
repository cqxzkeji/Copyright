<template>
  <section class="card">
    <header class="section-header">
      <div>
        <p class="subtitle">原料与营养管理</p>
        <h3>原料库（20+ 条记录）</h3>
      </div>
      <div class="button-row">
        <button class="btn" @click="openAdd">新增原料</button>
        <button class="btn" @click="openPrice">批量调整价格</button>
        <button class="btn secondary" @click="openImport">导入最新检测表</button>
      </div>
    </header>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div class="card stat">
        <p class="label">均衡蛋白</p>
        <div class="hero-number">{{ proteinAverage }}%</div>
        <div class="progress-bar"><span :style="{ width: proteinAverage + '%' }"></span></div>
      </div>
      <div class="card stat">
        <p class="label">库存安全</p>
        <div class="hero-number">{{ safeRate }}%</div>
        <div class="progress-bar"><span :style="{ width: safeRate + '%' }"></span></div>
      </div>
      <div class="card stat">
        <p class="label">均价</p>
        <div class="hero-number">¥{{ priceAverage }}</div>
        <p class="muted">根据最近 20 个批次折算</p>
      </div>
    </div>

    <table class="table-grid">
      <thead>
        <tr>
          <th>名称</th>
          <th>蛋白%</th>
          <th>脂肪%</th>
          <th>粗纤维%</th>
          <th>成本(元/吨)</th>
          <th>库存(吨)</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in ingredients" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.protein }}</td>
          <td>{{ row.fat }}</td>
          <td>{{ row.fiber }}</td>
          <td>¥{{ row.price }}</td>
          <td>{{ row.stock }}</td>
          <td>
            <span class="tag" :style="{ background: row.stock > 40 ? '#dcfce7' : '#fef3c7', color: row.stock > 40 ? '#15803d' : '#92400e' }">
              {{ row.stock > 40 ? '库存充足' : '需补货' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <div v-if="modal.open" class="modal-mask">
    <div class="modal-card">
      <h3>{{ modal.title }}</h3>
      <p class="muted" style="margin: 0.3rem 0 0.8rem">{{ modal.message }}</p>
      <div v-if="modal.type === 'add'" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <label>名称<input v-model="form.name" placeholder="鱼粉" /></label>
        <label>蛋白%<input v-model.number="form.protein" type="number" /></label>
        <label>脂肪%<input v-model.number="form.fat" type="number" /></label>
        <label>粗纤维%<input v-model.number="form.fiber" type="number" /></label>
        <label>成本<input v-model.number="form.price" type="number" /></label>
      </div>
      <div v-else-if="modal.type === 'price'">
        <label>涨跌幅%<input v-model.number="form.adjust" type="number" placeholder="例如 -2 或 3" /></label>
        <div class="alert-info">将对全部原料价格应用线性调整。</div>
      </div>
      <div v-else-if="modal.type === 'import'">
        <p>正在导入检测表，进度实时刷新。</p>
        <div class="progress-bar"><span :style="{ width: form.progress + '%' }"></span></div>
      </div>
      <div class="modal-actions">
        <button class="secondary" @click="modal.open = false">取消</button>
        <button @click="confirmModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const ingredients = reactive([
  { name: '鱼粉', protein: 60, fat: 8, fiber: 1.5, price: 9800, stock: 52 },
  { name: '豆粕', protein: 45, fat: 2.5, fiber: 3.8, price: 3800, stock: 80 },
  { name: '菜粕', protein: 38, fat: 2.2, fiber: 13, price: 2600, stock: 35 },
  { name: '棉粕', protein: 42, fat: 1.2, fiber: 16, price: 2400, stock: 28 },
  { name: 'DDGS', protein: 28, fat: 9, fiber: 8, price: 2100, stock: 44 },
  { name: '鱼油', protein: 0, fat: 99, fiber: 0, price: 13200, stock: 18 },
  { name: '豆油', protein: 0, fat: 99, fiber: 0, price: 10200, stock: 20 },
  { name: '磷酸氢钙', protein: 0, fat: 0, fiber: 0, price: 4800, stock: 33 },
  { name: '石粉', protein: 0, fat: 0, fiber: 0, price: 520, stock: 60 },
  { name: '赖氨酸', protein: 0, fat: 0, fiber: 0, price: 12500, stock: 12 },
  { name: '蛋氨酸', protein: 0, fat: 0, fiber: 0, price: 15800, stock: 15 },
  { name: '氯化胆碱', protein: 0, fat: 0, fiber: 0, price: 8600, stock: 22 },
  { name: '维生素预混料A', protein: 0, fat: 0, fiber: 0, price: 11800, stock: 19 },
  { name: '维生素预混料B', protein: 0, fat: 0, fiber: 0, price: 10200, stock: 21 },
  { name: '微量元素包', protein: 0, fat: 0, fiber: 0, price: 5900, stock: 37 },
  { name: '玉米', protein: 8.5, fat: 3.5, fiber: 2.2, price: 2300, stock: 120 },
  { name: '小麦', protein: 11, fat: 2, fiber: 2.9, price: 2400, stock: 96 },
  { name: '高粱', protein: 9, fat: 2.5, fiber: 2.7, price: 2250, stock: 72 },
  { name: '米糠', protein: 13, fat: 13, fiber: 7, price: 2050, stock: 41 },
  { name: '酵母粉', protein: 46, fat: 1.5, fiber: 1.5, price: 5200, stock: 26 },
  { name: '膨化大豆', protein: 44, fat: 19, fiber: 3, price: 4200, stock: 48 }
]);

const modal = reactive({ open: false, title: '', message: '', type: '' });
const form = reactive({ name: '', protein: 0, fat: 0, fiber: 0, price: 0, adjust: 0, progress: 30 });
let timer = null;

const proteinAverage = computed(() => Math.round(ingredients.reduce((s, i) => s + i.protein, 0) / ingredients.length));
const priceAverage = computed(() => Math.round(ingredients.reduce((s, i) => s + i.price, 0) / ingredients.length));
const safeRate = computed(() => Math.round((ingredients.filter(i => i.stock > 30).length / ingredients.length) * 100));

const openAdd = () => {
  modal.open = true;
  modal.title = '新增原料';
  modal.message = '填写基础营养参数后将加入原料库并用于求解。';
  modal.type = 'add';
};

const openPrice = () => {
  modal.open = true;
  modal.title = '批量调整价格';
  modal.message = '按百分比更新所有原料成本，用于快速响应行情。';
  modal.type = 'price';
};

const openImport = () => {
  modal.open = true;
  modal.title = '导入检测表';
  modal.message = '实时校准营养数值，当前进度如下：';
  modal.type = 'import';
  form.progress = 30;
  clearInterval(timer);
  timer = setInterval(() => {
    if (form.progress >= 100) {
      clearInterval(timer);
    } else {
      form.progress += 10;
    }
  }, 400);
};

const confirmModal = () => {
  if (modal.type === 'add' && form.name) {
    ingredients.unshift({
      name: form.name,
      protein: form.protein,
      fat: form.fat,
      fiber: form.fiber,
      price: form.price,
      stock: 30
    });
  }
  if (modal.type === 'price') {
    ingredients.forEach(item => {
      item.price = Math.round(item.price * (1 + form.adjust / 100));
    });
  }
  modal.open = false;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.button-row {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.label {
  margin: 0;
  color: #475569;
}

.muted {
  color: #6b7280;
}

.stat {
  min-height: 140px;
}
</style>
