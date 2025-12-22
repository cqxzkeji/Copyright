<template>
  <div class="card">
    <div class="section-header">
      <h3>直播与商品管理</h3>
      <div class="btn-group">
        <button class="btn" type="button" @click="showForm = true">新增商品</button>
        <button class="btn secondary" type="button" @click="showProgress = true">同步库存</button>
        <button class="btn warn" type="button" @click="showTip = true">直播提醒</button>
      </div>
    </div>
    <p class="section-desc">管理直播间排期、商品库存与上架状态。</p>
  </div>

  <div class="card">
    <h3>直播排期列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>场次</th>
          <th>主题</th>
          <th>主推商品</th>
          <th>主播</th>
          <th>预计销售</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.id">
          <td>{{ plan.id }}</td>
          <td>{{ plan.topic }}</td>
          <td>{{ plan.product }}</td>
          <td>{{ plan.anchor }}</td>
          <td>{{ plan.target }}</td>
          <td><span class="tag">{{ plan.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h3>商品上架清单</h3>
    <table class="table">
      <thead>
        <tr>
          <th>商品编号</th>
          <th>名称</th>
          <th>库存</th>
          <th>价格</th>
          <th>售卖区域</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.area }}</td>
          <td><span class="tag">{{ item.state }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新增直播商品" @close="showForm = false">
    <div class="form-grid">
      <div class="form-item">
        <label>商品名称</label>
        <input placeholder="例如：生态番茄礼盒" />
      </div>
      <div class="form-item">
        <label>所属分类</label>
        <select>
          <option>蔬菜水果</option>
          <option>粮油米面</option>
          <option>生鲜肉禽</option>
          <option>特产礼盒</option>
        </select>
      </div>
      <div class="form-item">
        <label>库存数量</label>
        <input type="number" placeholder="输入库存" />
      </div>
      <div class="form-item">
        <label>售卖价格</label>
        <input type="number" placeholder="输入价格" />
      </div>
      <div class="form-item" style="grid-column: 1 / -1;">
        <label>卖点说明</label>
        <textarea rows="3" placeholder="填写卖点亮点"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showForm = false">取消</button>
      <button class="btn" type="button" @click="showForm = false">确认上架</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="库存同步" @close="showProgress = false">
    <p>正在同步直播间库存与供应链仓储系统。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: '62%' }"></div>
    </div>
    <template #footer>
      <button class="btn" type="button" @click="showProgress = false">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showTip" title="直播提醒" @close="showTip = false">
    <p>晚间直播需提前 30 分钟开启暖场，记得准备预热视频。</p>
    <template #footer>
      <button class="btn" type="button" @click="showTip = false">收到</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)

const plans = [
  { id: 'L-01', topic: '果园直采晚场', product: '高原苹果', anchor: '林晓雨', target: '¥ 45,000', status: '准备中' },
  { id: 'L-02', topic: '粮油健康专场', product: '有机大米', anchor: '赵子涵', target: '¥ 38,000', status: '预热中' },
  { id: 'L-03', topic: '山货下午茶', product: '山泉蜂蜜', anchor: '周雪', target: '¥ 22,000', status: '准备中' },
  { id: 'L-04', topic: '直播助农节', product: '富硒红薯', anchor: '何乐乐', target: '¥ 30,000', status: '直播中' },
  { id: 'L-05', topic: '冷链鲜奶日', product: '冷链牛奶', anchor: '陈果', target: '¥ 27,000', status: '待开播' },
  { id: 'L-06', topic: '早安果蔬场', product: '田园蔬菜包', anchor: '李沐', target: '¥ 18,000', status: '准备中' },
  { id: 'L-07', topic: '农家蛋品专场', product: '原香鸡蛋', anchor: '林晓雨', target: '¥ 24,000', status: '预热中' },
  { id: 'L-08', topic: '轻食沙拉夜场', product: '生态番茄礼盒', anchor: '赵子涵', target: '¥ 26,000', status: '待开播' },
  { id: 'L-09', topic: '时令荔枝节', product: '时令荔枝', anchor: '周雪', target: '¥ 33,000', status: '准备中' },
  { id: 'L-10', topic: '五谷养生课', product: '五谷杂粮礼盒', anchor: '何乐乐', target: '¥ 29,000', status: '预热中' }
]

const products = [
  { code: 'P-1001', name: '生态番茄礼盒', stock: '1,200', price: '¥ 49', area: '华东/华南', state: '上架中' },
  { code: 'P-1002', name: '有机大米 5kg', stock: '860', price: '¥ 68', area: '全国', state: '上架中' },
  { code: 'P-1003', name: '高山玉米', stock: '520', price: '¥ 12', area: '华北', state: '补货中' },
  { code: 'P-1004', name: '时令荔枝', stock: '640', price: '¥ 32', area: '华南', state: '上架中' },
  { code: 'P-1005', name: '山泉蜂蜜', stock: '320', price: '¥ 58', area: '西南', state: '上架中' },
  { code: 'P-1006', name: '原香鸡蛋 30枚', stock: '980', price: '¥ 36', area: '华东', state: '补货中' },
  { code: 'P-1007', name: '富硒红薯', stock: '740', price: '¥ 26', area: '华中', state: '上架中' },
  { code: 'P-1008', name: '冷链牛奶', stock: '410', price: '¥ 45', area: '华东', state: '上架中' },
  { code: 'P-1009', name: '高原苹果', stock: '900', price: '¥ 52', area: '西北', state: '上架中' },
  { code: 'P-1010', name: '田园蔬菜包', stock: '1,050', price: '¥ 29', area: '华中', state: '上架中' },
  { code: 'P-1011', name: '五谷杂粮礼盒', stock: '380', price: '¥ 88', area: '全国', state: '上架中' }
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
