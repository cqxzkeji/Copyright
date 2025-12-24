<template>
  <div>
    <div class="flex" style="justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0;">商品与库存</h3>
      <div class="flex" style="gap: 8px;">
        <button @click="openNewProduct">新建商品</button>
        <button class="secondary" @click="openReplan">库存补货</button>
      </div>
    </div>

    <div class="table-card">
      <h3>库存列表（20 条）</h3>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>名称</th>
            <th>可用库存</th>
            <th>安全库存</th>
            <th>周转天数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.sku">
            <td>{{ item.sku }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.safe }}</td>
            <td>{{ item.turnover }} 天</td>
            <td class="flex" style="gap: 6px;">
              <button class="secondary" @click="openAdjust(item)">调整</button>
              <button class="accent" @click="openFreeze(item)">冻结</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showNew" title="新建商品">
      <form @submit.prevent="createProduct">
        <input v-model="productForm.name" placeholder="名称" required />
        <input v-model="productForm.sku" placeholder="SKU" required />
        <input v-model.number="productForm.stock" type="number" min="0" placeholder="初始库存" required />
        <div class="modal-footer">
          <button type="button" class="secondary" @click="showNew = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showAdjust" title="库存调整">
      <p>对 {{ activeProduct?.name }} 进行库存调整</p>
      <input v-model.number="adjustQty" type="number" placeholder="调整数量" />
      <template #footer>
        <button class="secondary" @click="showAdjust = false">取消</button>
        <button @click="applyAdjust">确认</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showFreeze" title="库存冻结">
      <p>将 {{ activeProduct?.name }} 库存冻结用于大额采购。</p>
      <div class="progress-bar">
        <span :style="{ width: freezeProgress + '%' }"></span>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showReplan" title="补货计划">
      <p>已生成智能补货计划，建议补货 {{ recommended }} 件。</p>
      <template #footer>
        <button class="secondary" @click="showReplan = false">稍后执行</button>
        <button @click="confirmReplan">立即执行</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const products = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    sku: `SKU-${1000 + idx}`,
    name: ['红薯粉条', '生态稻米', '土鸡蛋', '蜂蜜', '黄牛肉'][idx % 5] + ` ${idx + 1}`,
    stock: 120 - idx * 3,
    safe: 40 + (idx % 4) * 10,
    turnover: 7 + (idx % 5)
  }))
);

const showNew = ref(false);
const showAdjust = ref(false);
const showFreeze = ref(false);
const showReplan = ref(false);
const freezeProgress = ref(20);
const activeProduct = ref(null);
const adjustQty = ref(0);
const recommended = ref(260);
const productForm = reactive({ name: '', sku: '', stock: 30 });

const openNewProduct = () => {
  showNew.value = true;
};

const openAdjust = (item) => {
  activeProduct.value = item;
  adjustQty.value = 0;
  showAdjust.value = true;
};

const openFreeze = (item) => {
  activeProduct.value = item;
  showFreeze.value = true;
  freezeProgress.value = 10;
  const timer = setInterval(() => {
    if (freezeProgress.value >= 100) {
      clearInterval(timer);
      showFreeze.value = false;
    } else {
      freezeProgress.value += 22;
    }
  }, 350);
};

const openReplan = () => {
  showReplan.value = true;
};

const applyAdjust = () => {
  if (activeProduct.value) {
    activeProduct.value.stock += adjustQty.value;
  }
  showAdjust.value = false;
};

const confirmReplan = () => {
  products.value.forEach((p) => {
    p.stock += Math.round(recommended.value / products.value.length);
  });
  showReplan.value = false;
};

const createProduct = () => {
  products.value.unshift({
    sku: productForm.sku,
    name: productForm.name,
    stock: productForm.stock,
    safe: 60,
    turnover: 6
  });
  showNew.value = false;
  productForm.name = '';
  productForm.sku = '';
  productForm.stock = 30;
};
</script>
