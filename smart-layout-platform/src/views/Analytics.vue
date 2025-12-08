<template>
  <div class="module">
    <div class="flex-between">
      <div>
        <p class="eyebrow">数据分析</p>
        <h3>传播效果与互动洞察</h3>
      </div>
      <div class="top-actions">
        <button class="secondary-btn" @click="showExplain = true">指标释义</button>
        <button class="primary-btn" @click="showTrend = true">趋势对比</button>
        <button class="primary-btn" @click="showForecast = true">预测结果</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 1rem;">
      <div class="card">
        <p class="eyebrow">渠道表现</p>
        <table class="table">
          <thead>
            <tr>
              <th>渠道</th>
              <th>曝光</th>
              <th>互动率</th>
              <th>转化</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in channels" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.impression }}w</td>
              <td>{{ item.engagement }}%</td>
              <td>{{ item.conversion }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <p class="eyebrow">素材表现</p>
        <table class="table">
          <thead>
            <tr>
              <th>素材</th>
              <th>曝光</th>
              <th>收藏</th>
              <th>分享</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in assets" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.impression }}w</td>
              <td>{{ item.saves }}</td>
              <td>{{ item.shares }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showExplain" title="指标释义">
      <ul>
        <li>曝光：内容被看到的次数，单位万。</li>
        <li>互动率：互动占曝光比例。</li>
        <li>转化：引导用户到达目标页面的比例。</li>
      </ul>
    </BaseModal>

    <BaseModal v-model="showTrend" title="趋势对比">
      <p>过去 7 天曝光环比 +18%，互动率环比 +6%，转化率环比 +4%。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showTrend = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showForecast" title="预测结果">
      <p>基于近期表现，预计下周曝光可达 520w，互动率稳定在 8.6%。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showForecast = false">收到</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const channels = reactive([
  { name: '微博', impression: 120, engagement: 6.4, conversion: 3.1 },
  { name: '小红书', impression: 88, engagement: 7.2, conversion: 3.4 },
  { name: '视频号', impression: 76, engagement: 5.8, conversion: 2.9 },
  { name: '抖音', impression: 134, engagement: 8.1, conversion: 3.8 },
  { name: 'B 站', impression: 64, engagement: 6.7, conversion: 3.0 }
]);

const assets = reactive([
  { name: '春日主视觉', impression: 48, saves: 1260, shares: 820 },
  { name: '品牌短片', impression: 65, saves: 980, shares: 1100 },
  { name: '产品长图', impression: 52, saves: 860, shares: 640 },
  { name: '节日海报', impression: 44, saves: 720, shares: 580 },
  { name: '直播脚本', impression: 40, saves: 610, shares: 430 }
]);

const showExplain = ref(false);
const showTrend = ref(false);
const showForecast = ref(false);
</script>

<style scoped>
.top-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

table {
  margin-top: 0.5rem;
}
</style>
