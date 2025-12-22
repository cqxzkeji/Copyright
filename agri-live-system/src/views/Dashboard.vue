<template>
  <div class="card">
    <div class="dashboard-grid">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <p>{{ metric.label }}</p>
        <h3>{{ metric.value }}</h3>
        <span class="tag">{{ metric.change }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-header">
      <h3>实时成交趋势</h3>
      <div class="btn-group">
        <button class="btn" type="button" @click="showForm = true">新增直播计划</button>
        <button class="btn secondary" type="button" @click="showProgress = true">加载排期</button>
        <button class="btn warn" type="button" @click="showTip = true">提醒公告</button>
      </div>
    </div>
    <div class="chart-wrap">
      <svg viewBox="0 0 480 160" class="chart">
        <polyline
          :points="trendPoints"
          fill="none"
          stroke="#22c55e"
          stroke-width="4"
        />
        <polyline
          :points="trendShadow"
          fill="rgba(34, 197, 94, 0.15)"
          stroke="none"
        />
      </svg>
      <div class="chart-notes">
        <div>
          <strong>直播场次：</strong> {{ summary.sessions }} 场
        </div>
        <div>
          <strong>直播间停留时长：</strong> {{ summary.duration }} 分钟
        </div>
        <div>
          <strong>转化率：</strong> {{ summary.rate }}
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>最新直播订单</h3>
    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>商品</th>
          <th>主播</th>
          <th>金额</th>
          <th>状态</th>
          <th>下单时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.product }}</td>
          <td>{{ item.anchor }}</td>
          <td>{{ item.amount }}</td>
          <td><span class="tag">{{ item.status }}</span></td>
          <td>{{ item.time }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新增直播计划" @close="showForm = false">
    <div class="form-grid">
      <div class="form-item">
        <label>直播主题</label>
        <input placeholder="填写直播主题" />
      </div>
      <div class="form-item">
        <label>主推商品</label>
        <input placeholder="选择商品" />
      </div>
      <div class="form-item">
        <label>计划日期</label>
        <input type="date" />
      </div>
      <div class="form-item">
        <label>负责人</label>
        <input placeholder="运营负责人" />
      </div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showForm = false">取消</button>
      <button class="btn" type="button" @click="showForm = false">提交计划</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="排期加载中" @close="showProgress = false">
    <p>正在同步今日直播排期与商品库存。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: '78%' }"></div>
    </div>
    <template #footer>
      <button class="btn" type="button" @click="showProgress = false">我知道了</button>
    </template>
  </BaseModal>

  <BaseModal :show="showTip" title="运营提醒" @close="showTip = false">
    <p>今日高峰时段为 19:30-21:00，请提前准备货品和脚本。</p>
    <template #footer>
      <button class="btn" type="button" @click="showTip = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)

const metrics = [
  { label: '今日成交额', value: '¥ 218,430', change: '+12.4%' },
  { label: '在线观众', value: '38,210', change: '+6.8%' },
  { label: '客单价', value: '¥ 126.5', change: '+3.1%' },
  { label: '新增粉丝', value: '4,380', change: '+8.9%' }
]

const trend = [20, 30, 45, 38, 50, 70, 60, 78, 90, 84]
const trendPoints = computed(() =>
  trend
    .map((value, index) => `${index * 50},${160 - value * 1.4}`)
    .join(' ')
)
const trendShadow = computed(() =>
  `0,160 ${trendPoints.value} 450,160`
)

const summary = {
  sessions: 12,
  duration: 420,
  rate: '6.8%'
}

const orders = [
  { id: 'AL2024061501', product: '生态番茄礼盒', anchor: '林晓雨', amount: '¥ 298', status: '已发货', time: '09:20' },
  { id: 'AL2024061502', product: '有机大米 5kg', anchor: '赵子涵', amount: '¥ 168', status: '已付款', time: '09:35' },
  { id: 'AL2024061503', product: '高山玉米', anchor: '何乐乐', amount: '¥ 86', status: '待发货', time: '09:42' },
  { id: 'AL2024061504', product: '时令荔枝', anchor: '李沐', amount: '¥ 320', status: '已发货', time: '09:58' },
  { id: 'AL2024061505', product: '山泉蜂蜜', anchor: '周雪', amount: '¥ 156', status: '已付款', time: '10:10' },
  { id: 'AL2024061506', product: '原香鸡蛋 30枚', anchor: '陈果', amount: '¥ 92', status: '待发货', time: '10:22' },
  { id: 'AL2024061507', product: '富硒红薯', anchor: '何乐乐', amount: '¥ 118', status: '已发货', time: '10:38' },
  { id: 'AL2024061508', product: '冷链牛奶', anchor: '林晓雨', amount: '¥ 210', status: '已付款', time: '10:50' },
  { id: 'AL2024061509', product: '高原苹果', anchor: '赵子涵', amount: '¥ 188', status: '已发货', time: '11:05' },
  { id: 'AL2024061510', product: '田园蔬菜包', anchor: '李沐', amount: '¥ 76', status: '待发货', time: '11:18' },
  { id: 'AL2024061511', product: '五谷杂粮礼盒', anchor: '周雪', amount: '¥ 268', status: '已付款', time: '11:30' }
]
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.metric {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric h3 {
  margin: 0;
  font-size: 22px;
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.chart-wrap {
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(220px, 1.5fr) minmax(180px, 1fr);
  gap: 16px;
  align-items: center;
}

.chart {
  width: 100%;
  height: 160px;
}

.chart-notes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
}
</style>
