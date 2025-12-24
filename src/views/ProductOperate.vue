<template>
  <div class="grid">
    <ChartPanel
      title="商品动销曲线"
      subtitle="近7日成交"
      :labels="productChart.labels"
      :values="productChart.values"
    />
    <div class="card">
      <div class="section-title">
        <h3>商品与内容</h3>
        <div class="actions">
          <button class="btn" @click="showPublish = true">发布商品</button>
          <button class="btn secondary" @click="startBatch">批量上架</button>
          <button class="btn ghost" @click="showGuide = true">内容指引</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>商品名</th>
              <th>类目</th>
              <th>价格</th>
              <th>库存</th>
              <th class="hide-mobile">内容评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>¥{{ item.price }}</td>
              <td>{{ item.stock }}</td>
              <td class="hide-mobile">{{ item.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BaseModal v-model="showPublish" title="发布商品">
    <div class="form-grid">
      <label>商品名称<input v-model="form.name" placeholder="如：脆甜苹果礼盒" /></label>
      <label>类目
        <select v-model="form.category">
          <option>水果</option>
          <option>粮油</option>
          <option>茶饮</option>
          <option>特产</option>
        </select>
      </label>
      <label>定价<input v-model="form.price" type="number" placeholder="99" /></label>
      <label>库存<input v-model="form.stock" type="number" placeholder="500" /></label>
      <label class="full-width">亮点文案
        <textarea v-model="form.description" rows="3" placeholder="填写卖点、产地溯源"></textarea>
      </label>
    </div>
    <template #actions>
      <button class="btn ghost" @click="showPublish = false">取消</button>
      <button class="btn" @click="publish">立即发布</button>
    </template>
  </BaseModal>

  <BaseModal v-model="showGuide" title="素材与规格指引">
    <div class="toast">建议上传1:1和16:9两套素材，标题突出产区与农户故事，保证一键分发到主流渠道。</div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="批量上架中">
    <p>正在推送10个商品到多渠道货架。</p>
    <div class="progress-bar"><div class="progress-bar__fill" :style="{ width: progress + '%' }"></div></div>
    <p>{{ progress }}% 已完成</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ChartPanel from '../components/ChartPanel.vue';

const showPublish = ref(false);
const showGuide = ref(false);
const showProgress = ref(false);
const progress = ref(0);

const productChart = {
  labels: ['一', '二', '三', '四', '五', '六', '日'],
  values: [45, 72, 68, 80, 76, 90, 95]
};

const products = ref([
  { name: '安吉白茶礼盒', category: '茶饮', price: 168, stock: 320, score: 9.3 },
  { name: '稻花香大米10kg', category: '粮油', price: 129, stock: 480, score: 9.1 },
  { name: '黄桃罐头12瓶', category: '特产', price: 88, stock: 260, score: 8.8 },
  { name: '脆甜富士苹果', category: '水果', price: 69, stock: 600, score: 9.0 },
  { name: '丹参片中药材', category: '特产', price: 59, stock: 530, score: 8.7 },
  { name: '乡村散养土鸡蛋', category: '特产', price: 45, stock: 1200, score: 9.4 },
  { name: '蒲江猕猴桃6斤', category: '水果', price: 79, stock: 410, score: 9.2 },
  { name: '石柱榨菜礼包', category: '特产', price: 55, stock: 390, score: 8.6 },
  { name: '龙井新茶100g', category: '茶饮', price: 138, stock: 270, score: 9.5 },
  { name: '手工菜籽油5L', category: '粮油', price: 99, stock: 340, score: 8.9 }
]);

const form = reactive({ name: '', category: '水果', price: 0, stock: 0, description: '' });

const publish = () => {
  if (!form.name) return;
  products.value.unshift({ ...form, score: 9.0 });
  showPublish.value = false;
};

const startBatch = () => {
  progress.value = 0;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 700);
    }
  }, 400);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
