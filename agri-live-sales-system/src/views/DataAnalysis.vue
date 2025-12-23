<template>
  <MainLayout>
    <section class="grid-2">
      <div class="card">
        <div class="button-group" style="justify-content: space-between; align-items: center;">
          <div>
            <h3>营销数据分析</h3>
            <p>直播转化、复购与投放效果</p>
          </div>
          <button class="button secondary" @click="openModal('plan')">配置分析</button>
        </div>
        <div class="chart">
          <div v-for="row in conversions" :key="row.name" class="chart-row">
            <span style="width: 90px;">{{ row.name }}</span>
            <div class="chart-bar"><span :style="{ width: row.value + '%' }"></span></div>
            <strong>{{ row.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>观众画像</h3>
        <p>主力消费人群分布</p>
        <div class="chart">
          <div v-for="row in audience" :key="row.name" class="chart-row">
            <span style="width: 80px;">{{ row.name }}</span>
            <div class="chart-bar"><span :style="{ width: row.value + '%' }"></span></div>
            <strong>{{ row.value }}%</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="button-group" style="justify-content: space-between; align-items: center;">
        <div>
          <h3>投放效果明细</h3>
          <p>近 10 次营销投放数据</p>
        </div>
        <button class="button" @click="openModal('export')">导出数据</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>投放主题</th>
            <th>渠道</th>
            <th>曝光</th>
            <th>点击率</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in campaigns" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.channel }}</td>
            <td>{{ row.impression }}</td>
            <td>{{ row.ctr }}</td>
            <td>{{ row.roi }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </MainLayout>

  <ModalDialog
    v-if="activeModal === 'plan'"
    title="配置分析周期"
    confirm-text="应用配置"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="form-grid">
      <div>
        <label>时间范围</label>
        <select>
          <option>最近 7 天</option>
          <option>最近 30 天</option>
        </select>
      </div>
      <div>
        <label>指标组合</label>
        <select>
          <option>转化 + 复购 + ROI</option>
          <option>曝光 + 互动 + 引导加购</option>
        </select>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'export'"
    title="导出营销数据"
    confirm-text="开始导出"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>正在生成分析文件，请耐心等待。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 67%;"></span>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModalDialog from '../components/ModalDialog.vue'

const activeModal = ref('')

const conversions = [
  { name: '观看转化', value: 62 },
  { name: '下单转化', value: 48 },
  { name: '复购率', value: 35 },
  { name: '客单提升', value: 58 }
]

const audience = [
  { name: '18-24岁', value: 20 },
  { name: '25-34岁', value: 42 },
  { name: '35-44岁', value: 26 },
  { name: '45岁以上', value: 12 }
]

const campaigns = [
  { name: '产地直采周', channel: '抖音', impression: '120万', ctr: '6.4%', roi: '3.2' },
  { name: '山地水果节', channel: '快手', impression: '98万', ctr: '5.1%', roi: '2.8' },
  { name: '生态粮油专场', channel: '视频号', impression: '86万', ctr: '4.6%', roi: '3.5' },
  { name: '茶园溯源日', channel: '淘宝直播', impression: '110万', ctr: '5.8%', roi: '3.1' },
  { name: '高原牛羊肉', channel: '抖音', impression: '92万', ctr: '5.0%', roi: '2.9' },
  { name: '冷链水产节', channel: '快手', impression: '75万', ctr: '4.2%', roi: '2.6' },
  { name: '有机蔬菜日', channel: '视频号', impression: '68万', ctr: '3.9%', roi: '2.4' },
  { name: '家庭囤货季', channel: '淘宝直播', impression: '130万', ctr: '6.1%', roi: '3.6' },
  { name: '村播助农计划', channel: '抖音', impression: '102万', ctr: '5.4%', roi: '3.0' },
  { name: '节气养生专场', channel: '视频号', impression: '80万', ctr: '4.5%', roi: '2.7' }
]

const openModal = (type) => {
  activeModal.value = type
}
</script>
