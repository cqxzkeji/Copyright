<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>商品管理与交易撮合</h3>
        <p>统一管理供销商品、价格与撮合进度，支持快速对接订单农业。</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openMatch">智能撮合</button>
        <button class="secondary-btn" @click="openEdit">录入商品</button>
        <button class="secondary-btn" @click="openTip">撮合提示</button>
      </div>
    </div>

    <div class="chart-row">
      <div
        v-for="item in weeklyVolumes"
        :key="item.day"
        class="chart-bar"
        :style="{ height: item.height + 'px' }"
      >
        <small>{{ item.day }}</small>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0;">商品清单</h4>
        <span style="color:#5c6c80;">共 {{ products.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>商品</th>
            <th>品类</th>
            <th>产地</th>
            <th>库存</th>
            <th>意向单</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.origin }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.intention }}</td>
            <td><span class="tag" :class="item.status === '在售' ? 'green' : 'orange'">{{ item.status }}</span></td>
            <td><button class="secondary-btn" @click="editItem(item)">调整价格</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showMatch" title="智能撮合执行" @close="showMatch = false">
      <p>正在匹配优质渠道与订单农业客户...</p>
      <div class="progress-bar" style="margin:12px 0;height:14px;"><span :style="{ width: matchProgress + '%' }"></span></div>
      <p style="margin:0;color:#6d7b8f;">{{ matchProgress }}% 已完成</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="secondary-btn" @click="showMatch = false">完成</button>
      </div>
    </BaseModal>

    <BaseModal :show="showEdit" title="商品录入/调整" @close="showEdit = false">
      <form class="form-grid" @submit.prevent="submitProduct">
        <label>商品名称<input v-model="form.name" required /></label>
        <label>品类<input v-model="form.type" required /></label>
        <label>产地<input v-model="form.origin" required /></label>
        <label>库存（吨）<input v-model="form.stock" type="number" required /></label>
        <label>意向单数<input v-model="form.intention" type="number" required /></label>
        <label>状态<select v-model="form.status"><option>在售</option><option>待售</option></select></label>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button type="button" class="secondary-btn" @click="showEdit = false">取消</button>
          <button class="primary-btn">保存</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showTip" title="撮合提示" @close="showTip = false">
      <p>优先撮合库存周转快、意向单较多的产品，提高成交率。</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="primary-btn" @click="showTip = false">明白</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const weeklyVolumes = [
  { day: '周一', height: 60 },
  { day: '周二', height: 90 },
  { day: '周三', height: 120 },
  { day: '周四', height: 140 },
  { day: '周五', height: 110 },
  { day: '周六', height: 80 },
  { day: '周日', height: 70 }
];

const products = reactive([
  { name: '早春蔬菜套餐', type: '蔬菜', origin: '南山镇', stock: 42, intention: 12, status: '在售' },
  { name: '富硒大米', type: '粮食', origin: '富硒村', stock: 80, intention: 20, status: '在售' },
  { name: '高山茶礼盒', type: '茶叶', origin: '云岭乡', stock: 36, intention: 16, status: '在售' },
  { name: '跑山土鸡', type: '禽类', origin: '清源村', stock: 65, intention: 10, status: '待售' },
  { name: '板栗南瓜', type: '蔬菜', origin: '石泉镇', stock: 50, intention: 15, status: '在售' },
  { name: '山地黑猪肉', type: '肉类', origin: '杉林乡', stock: 22, intention: 8, status: '在售' },
  { name: '花椒干货', type: '调味', origin: '椒乡镇', stock: 18, intention: 9, status: '在售' },
  { name: '蜂蜜礼盒', type: '蜂产品', origin: '蜂泉村', stock: 44, intention: 14, status: '在售' },
  { name: '羊肚菌干片', type: '菌菇', origin: '云岚乡', stock: 12, intention: 6, status: '在售' },
  { name: '黄牛冷鲜肉', type: '肉类', origin: '牧场镇', stock: 30, intention: 12, status: '待售' },
  { name: '小米辣', type: '蔬菜', origin: '辣源村', stock: 70, intention: 18, status: '在售' },
  { name: '脐橙礼袋', type: '水果', origin: '橙谷镇', stock: 90, intention: 26, status: '在售' },
  { name: '莲藕粉', type: '粮食', origin: '荷香乡', stock: 38, intention: 9, status: '待售' },
  { name: '黄花菜干', type: '干货', origin: '花山村', stock: 16, intention: 7, status: '在售' },
  { name: '竹荪', type: '菌菇', origin: '竹里镇', stock: 14, intention: 5, status: '在售' },
  { name: '藜麦', type: '粮食', origin: '高寒乡', stock: 25, intention: 11, status: '在售' },
  { name: '脆梨', type: '水果', origin: '雪峰村', stock: 60, intention: 19, status: '在售' },
  { name: '油茶籽油', type: '油料', origin: '油茶镇', stock: 28, intention: 13, status: '在售' },
  { name: '紫薯', type: '蔬菜', origin: '紫薯村', stock: 55, intention: 14, status: '在售' },
  { name: '马铃薯淀粉', type: '粮食', origin: '高原乡', stock: 46, intention: 10, status: '待售' }
]);

const showMatch = ref(false);
const showEdit = ref(false);
const showTip = ref(false);
const matchProgress = ref(0);
const form = reactive({ name: '', type: '', origin: '', stock: 0, intention: 0, status: '在售' });

const openMatch = () => {
  showMatch.value = true;
  matchProgress.value = 0;
  const timer = setInterval(() => {
    matchProgress.value += 25;
    if (matchProgress.value >= 100) {
      matchProgress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};

const openEdit = () => {
  form.name = '';
  form.type = '';
  form.origin = '';
  form.stock = 0;
  form.intention = 0;
  form.status = '在售';
  showEdit.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const submitProduct = () => {
  products.unshift({ ...form });
  showEdit.value = false;
};

const editItem = (item) => {
  Object.assign(form, item);
  showEdit.value = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8e4f4;
  background: #f9fbff;
}
</style>
