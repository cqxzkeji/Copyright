<template>
  <div class="card">
    <div class="section-header">
      <h3>数据分析</h3>
      <div class="btn-group">
        <button class="btn" type="button" @click="showForm = true">生成报表</button>
        <button class="btn secondary" type="button" @click="showProgress = true">刷新数据</button>
        <button class="btn warn" type="button" @click="showTip = true">解读提示</button>
      </div>
    </div>
    <p class="section-desc">分析直播转化、商品表现与用户画像。</p>
  </div>

  <div class="card">
    <h3>销售趋势与客群分布</h3>
    <div class="analysis-grid">
      <div class="chart-card">
        <p class="chart-title">近十场直播成交额</p>
        <svg viewBox="0 0 320 160" class="chart">
          <rect
            v-for="(value, index) in barData"
            :key="index"
            :x="index * 30 + 10"
            :y="160 - value"
            width="18"
            :height="value"
            fill="#3b82f6"
            rx="4"
          />
        </svg>
      </div>
      <div class="chart-card">
        <p class="chart-title">客群来源占比</p>
        <div class="donut">
          <div class="donut-core">72%</div>
        </div>
        <div class="legend">
          <span><i class="dot" style="background:#16a34a"></i>社群私域</span>
          <span><i class="dot" style="background:#3b82f6"></i>平台推荐</span>
          <span><i class="dot" style="background:#f97316"></i>搜索流量</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>商品表现排行</h3>
    <table class="table">
      <thead>
        <tr>
          <th>商品</th>
          <th>曝光量</th>
          <th>点击率</th>
          <th>成交额</th>
          <th>退货率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in performance" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.views }}</td>
          <td>{{ item.ctr }}</td>
          <td>{{ item.sales }}</td>
          <td>{{ item.refund }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="生成数据报表" @close="showForm = false">
    <div class="form-grid">
      <div class="form-item">
        <label>报表类型</label>
        <select>
          <option>直播转化分析</option>
          <option>商品表现分析</option>
          <option>用户画像分析</option>
        </select>
      </div>
      <div class="form-item">
        <label>时间范围</label>
        <select>
          <option>近7天</option>
          <option>近30天</option>
          <option>近90天</option>
        </select>
      </div>
      <div class="form-item">
        <label>导出格式</label>
        <select>
          <option>PDF</option>
          <option>Excel</option>
          <option>PPT</option>
        </select>
      </div>
      <div class="form-item" style="grid-column: 1 / -1;">
        <label>备注</label>
        <textarea rows="3" placeholder="填写报告说明"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showForm = false">取消</button>
      <button class="btn" type="button" @click="showForm = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="数据刷新" @close="showProgress = false">
    <p>正在更新直播间数据与BI指标。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: '81%' }"></div>
    </div>
    <template #footer>
      <button class="btn" type="button" @click="showProgress = false">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showTip" title="分析提示" @close="showTip = false">
    <p>果蔬类商品转化率明显提升，建议增加晚场投放资源。</p>
    <template #footer>
      <button class="btn" type="button" @click="showTip = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)

const barData = [80, 110, 95, 140, 120, 100, 150, 130, 160, 125]

const performance = [
  { name: '生态番茄礼盒', views: '58,000', ctr: '6.2%', sales: '¥ 82,000', refund: '1.2%' },
  { name: '高原苹果', views: '52,400', ctr: '5.8%', sales: '¥ 76,500', refund: '0.9%' },
  { name: '有机大米 5kg', views: '48,300', ctr: '6.5%', sales: '¥ 72,800', refund: '1.1%' },
  { name: '冷链牛奶', views: '46,700', ctr: '5.3%', sales: '¥ 69,200', refund: '0.8%' },
  { name: '富硒红薯', views: '44,100', ctr: '6.0%', sales: '¥ 63,900', refund: '1.4%' },
  { name: '时令荔枝', views: '42,800', ctr: '5.6%', sales: '¥ 61,200', refund: '1.6%' },
  { name: '原香鸡蛋 30枚', views: '40,500', ctr: '5.1%', sales: '¥ 58,300', refund: '0.7%' },
  { name: '田园蔬菜包', views: '38,900', ctr: '6.8%', sales: '¥ 54,800', refund: '1.3%' },
  { name: '山泉蜂蜜', views: '36,700', ctr: '4.9%', sales: '¥ 49,600', refund: '0.9%' },
  { name: '五谷杂粮礼盒', views: '34,200', ctr: '4.6%', sales: '¥ 46,500', refund: '1.0%' }
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

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.chart-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-title {
  margin: 0;
  font-weight: 600;
  color: #374151;
}

.chart {
  width: 100%;
  height: 160px;
}

.donut {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#16a34a 0 72%, #3b82f6 72% 90%, #f97316 90% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.donut-core {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #16a34a;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
</style>
