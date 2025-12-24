<template>
  <div class="page">
    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>供应链商品池（20条+）</h3>
          <p class="muted-text">同步农户、合作社、品牌商库存，按产地批次管理</p>
        </div>
        <div class="table-actions">
          <button @click="openCreateModal">新增商品</button>
          <button @click="openSupplyModal">补货计划</button>
          <button @click="openSkuProgress">同步SKU</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>商品</th>
            <th>产地</th>
            <th>库存</th>
            <th>供货价</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.origin }}</td>
            <td>{{ item.stock }}</td>
            <td>¥{{ item.price }}</td>
            <td><span class="badge" :class="item.status === '在售' ? 'success' : 'warn'">{{ item.status }}</span></td>
            <td class="table-actions">
              <button @click="openAdjust(item)">调价</button>
              <button @click="openSupply(item)">补货</button>
              <button @click="openStop(item)">下架</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid">
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;">
          <div>
            <div style="font-weight:800;">供应保障率</div>
            <div class="muted-text">按SKU覆盖度</div>
          </div>
          <button @click="openForecast">生成预测</button>
        </div>
        <div style="font-size:32px;font-weight:800;">97.4%</div>
        <div class="progress-bar"><span style="width:85%"></span></div>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;">
          <div>
            <div style="font-weight:800;">品控稽核</div>
            <div class="muted-text">抽检批次</div>
          </div>
          <button @click="openQc">录入抽检</button>
        </div>
        <div class="bar-chart" style="height:120px;grid-template-columns:repeat(6,1fr);">
          <div v-for="(h, idx) in qualityBars" :key="idx" class="bar" :style="{ height: h + 'px' }"></div>
        </div>
      </div>
    </div>

    <Modal v-if="createModal" title="新增商品" @close="createModal = false">
      <form @submit.prevent="createModal = false" style="display:grid;gap:10px;">
        <input v-model="createForm.name" placeholder="商品名称" required />
        <input v-model="createForm.origin" placeholder="产地" required />
        <input v-model.number="createForm.price" type="number" min="0" step="0.1" placeholder="供货价" required />
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="createModal = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="supplyModal" title="补货计划" @close="supplyModal = false">
      <form @submit.prevent="supplyModal = false" style="display:grid;gap:10px;">
        <select v-model="supplyForm.target" required>
          <option disabled value="">选择商品</option>
          <option v-for="p in products" :key="p.name">{{ p.name }}</option>
        </select>
        <input v-model="supplyForm.quantity" type="number" min="1" placeholder="补货数量" required />
        <div class="progress-bar" style="height:14px;">
          <span :style="{ width: supplyProgress + '%' }"></span>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="supplyModal = false">关闭</button>
          <button type="button" @click="supplyProgress = Math.min(100, supplyProgress + 25)">推进 25%</button>
          <button type="submit">提交计划</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="skuProgressModal" title="SKU 同步" @close="skuProgressModal = false">
      <p>正在同步至各渠道，保持页面即可。</p>
      <div class="progress-bar" style="height:14px;margin:12px 0;">
        <span :style="{ width: skuProgress + '%' }"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="skuProgress = Math.min(100, skuProgress + 15)">推进 15%</button>
        <button @click="skuProgressModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="adjustModal" :title="activeProduct?.name + '调价'" @close="adjustModal = false">
      <form @submit.prevent="adjustModal = false" style="display:grid;gap:10px;">
        <input v-model="activeProduct.price" type="number" min="0" step="0.1" />
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="adjustModal = false">取消</button>
          <button type="submit">确认</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="stopModal" :title="'下架确认 - ' + activeProduct?.name" @close="stopModal = false">
      <p>下架后立即停止销售，是否继续？</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="stopModal = false">取消</button>
        <button @click="stopModal = false">确认下架</button>
      </div>
    </Modal>

    <Modal v-if="forecastModal" title="需求预测" @close="forecastModal = false">
      <p>根据近 30 天销量、天气和节假日预测生成，下发采购与仓储。</p>
      <div class="progress-bar" style="height:14px;margin:12px 0;">
        <span style="width:78%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="forecastModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="qcModal" title="录入抽检" @close="qcModal = false">
      <form @submit.prevent="qcModal = false" style="display:grid;gap:10px;">
        <input placeholder="批次号" required />
        <textarea rows="3" placeholder="抽检结果与整改要求" required></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="qcModal = false">取消</button>
          <button type="submit">保存记录</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const products = reactive([
  { name: '生态小黄姜', origin: '湖北恩施', stock: 3200, price: 6.8, status: '在售' },
  { name: '富硒大米', origin: '黑龙江五常', stock: 5600, price: 5.4, status: '在售' },
  { name: '高山绿茶', origin: '四川雅安', stock: 1900, price: 22.6, status: '在售' },
  { name: '散养土鸡蛋', origin: '湖南益阳', stock: 4200, price: 1.1, status: '在售' },
  { name: '脆甜黄桃', origin: '湖南桃源', stock: 2500, price: 7.6, status: '在售' },
  { name: '有机红薯', origin: '广西桂林', stock: 4600, price: 3.5, status: '在售' },
  { name: '稻香黑猪肉', origin: '江西上饶', stock: 900, price: 32.0, status: '在售' },
  { name: '香菇滑鸡', origin: '福建武夷', stock: 1800, price: 16.4, status: '在售' },
  { name: '现磨豆浆粉', origin: '安徽阜阳', stock: 3200, price: 4.6, status: '在售' },
  { name: '碳烤红薯片', origin: '山东烟台', stock: 2800, price: 5.2, status: '在售' },
  { name: '手工藕片', origin: '湖北洪湖', stock: 1500, price: 10.0, status: '在售' },
  { name: '香糯玉米', origin: '云南楚雄', stock: 3300, price: 3.2, status: '在售' },
  { name: '草本蜂蜜', origin: '贵州毕节', stock: 1200, price: 18.5, status: '在售' },
  { name: '山药粉条', origin: '河南焦作', stock: 2700, price: 6.3, status: '在售' },
  { name: '牛肝菌干货', origin: '云南普洱', stock: 600, price: 68.0, status: '在售' },
  { name: '高粱米', origin: '内蒙古通辽', stock: 3400, price: 4.1, status: '在售' },
  { name: '菌菇混搭包', origin: '贵州黔东', stock: 2900, price: 11.2, status: '在售' },
  { name: '竹笋脆片', origin: '浙江临安', stock: 2100, price: 9.0, status: '在售' },
  { name: '糍粑辣椒', origin: '湖南凤凰', stock: 2400, price: 6.8, status: '在售' },
  { name: '腊味合家礼盒', origin: '广东梅州', stock: 800, price: 76.0, status: '在售' },
  { name: '山楂糕', origin: '山东临沂', stock: 2600, price: 5.8, status: '在售' }
]);

const qualityBars = [80, 120, 90, 140, 100, 110];

const createModal = ref(false);
const supplyModal = ref(false);
const skuProgressModal = ref(false);
const adjustModal = ref(false);
const stopModal = ref(false);
const forecastModal = ref(false);
const qcModal = ref(false);

const createForm = reactive({ name: '', origin: '', price: 0 });
const supplyForm = reactive({ target: '', quantity: 0 });
const supplyProgress = ref(30);
const skuProgress = ref(35);
const activeProduct = ref(null);

const openCreateModal = () => { createModal.value = true; };
const openSupplyModal = () => { supplyModal.value = true; };
const openSkuProgress = () => { skuProgressModal.value = true; };
const openAdjust = (item) => { activeProduct.value = item; adjustModal.value = true; };
const openSupply = (item) => { activeProduct.value = item; supplyModal.value = true; supplyForm.target = item.name; };
const openStop = (item) => { activeProduct.value = item; stopModal.value = true; };
const openForecast = () => { forecastModal.value = true; };
const openQc = () => { qcModal.value = true; };
</script>
