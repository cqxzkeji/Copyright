<template>
  <section class="grid" style="gap: 18px">
    <div class="flex-between">
      <div>
        <p class="badge">推荐策略</p>
        <h3 style="margin: 4px 0">推荐系统实时看板</h3>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="secondary-btn" @click="openTuning">调整算法参数</button>
        <button class="primary-btn" @click="openGenerate">生成新推荐</button>
        <button class="secondary-btn" @click="openLog">查看日志</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">场景点击率</h4>
        <span class="tag">自动刷新</span>
      </div>
      <div class="chart-bars">
        <div v-for="item in ctrChart" :key="item.label" class="chart-bar">
          <div class="flex-between">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}%</strong>
          </div>
          <div class="bar" :style="{ width: item.value + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">实时推荐列表</h4>
        <span class="badge">Top 10</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>物品</th>
            <th>类型</th>
            <th>标签</th>
            <th>曝光</th>
            <th>点击</th>
            <th>CTR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in recommendations" :key="row.id">
            <td>{{ row.item }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.tags }}</td>
            <td>{{ row.impressions }}</td>
            <td>{{ row.clicks }}</td>
            <td>{{ row.ctr }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      v-if="showTuning"
      title="算法参数"
      badge="配置"
      description="微调召回、排序与探索比例"
      @close="showTuning = false"
    >
      <div class="form-row two-col">
        <div>
          <label class="label">召回权重</label>
          <input type="number" v-model.number="tuning.recall" min="0" max="1" step="0.1" />
        </div>
        <div>
          <label class="label">排序权重</label>
          <input type="number" v-model.number="tuning.rank" min="0" max="1" step="0.1" />
        </div>
        <div>
          <label class="label">探索比例(%)</label>
          <input type="number" v-model.number="tuning.explore" min="0" max="100" />
        </div>
        <div>
          <label class="label">冷启动策略</label>
          <select v-model="tuning.cold">
            <option>基于流行度</option>
            <option>基于画像</option>
            <option>混合策略</option>
          </select>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showTuning = false">取消</button>
        <button class="primary-btn" @click="saveTuning">保存参数</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showGenerate"
      title="生成新推荐批次"
      badge="任务"
      description="将根据最新埋点与模型配置生成推荐结果"
      @close="stopGenerate"
    >
      <div class="progress-bar" style="margin: 12px 0">
        <span :style="{ width: genProgress + '%' }"></span>
      </div>
      <p style="margin: 0">{{ genProgress < 100 ? '正在计算候选集…' : '生成完毕' }}</p>
      <div style="display: flex; justify-content: flex-end; margin-top: 14px">
        <button class="primary-btn" @click="stopGenerate">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showLog"
      title="推送日志"
      badge="记录"
      description="最近的推荐推送执行记录"
      @close="showLog = false"
    >
      <ul style="display: grid; gap: 8px; margin: 0">
        <li v-for="log in logs" :key="log.time" class="card" style="padding: 12px">
          <div class="flex-between">
            <strong>{{ log.scene }}</strong>
            <span class="tag">{{ log.status }}</span>
          </div>
          <small class="muted">{{ log.time }} · {{ log.detail }}</small>
        </li>
      </ul>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const ctrChart = [
  { label: '首页流行', value: 13.2 },
  { label: '猜你喜欢', value: 18.4 },
  { label: '主题专辑', value: 9.6 },
  { label: '长尾探索', value: 7.5 },
  { label: '冷启动', value: 5.1 },
  { label: '实时热点', value: 21.7 }
]

const recommendations = [
  { id: 1, item: '蓝牙耳机', type: '3C', tags: '降噪/新品', impressions: 9800, clicks: 1820, ctr: 18.6 },
  { id: 2, item: '速干跑鞋', type: '运动', tags: '轻量/热销', impressions: 8600, clicks: 1290, ctr: 15.0 },
  { id: 3, item: '机械键盘', type: '外设', tags: 'RGB/青轴', impressions: 7200, clicks: 1044, ctr: 14.5 },
  { id: 4, item: '芦荟面膜', type: '美护', tags: '舒缓/补水', impressions: 6500, clicks: 910, ctr: 14.0 },
  { id: 5, item: '意式咖啡豆', type: '食品', tags: '深烘/醇厚', impressions: 5900, clicks: 826, ctr: 14.0 },
  { id: 6, item: 'AI课程', type: '教育', tags: '在线/进阶', impressions: 5400, clicks: 945, ctr: 17.5 },
  { id: 7, item: '登山背包', type: '户外', tags: '防水/耐磨', impressions: 5100, clicks: 612, ctr: 12.0 },
  { id: 8, item: '空气炸锅', type: '家电', tags: '小巧/多功能', impressions: 4980, clicks: 774, ctr: 15.5 },
  { id: 9, item: '便携投影', type: '家电', tags: '1080P/便携', impressions: 4200, clicks: 566, ctr: 13.5 },
  { id: 10, item: '素食轻食', type: '餐饮', tags: '低卡/高蛋白', impressions: 3880, clicks: 620, ctr: 16.0 }
]

const logs = [
  { scene: '猜你喜欢', status: '成功', detail: '重排完成，投放至全站流量', time: '09:30' },
  { scene: '首页流行', status: '成功', detail: '更新28条热点内容', time: '09:20' },
  { scene: '长尾探索', status: '成功', detail: '补充新奇兴趣集', time: '09:10' },
  { scene: '冷启动', status: '告警', detail: '画像稀疏用户比例升高', time: '09:05' }
]

const showTuning = ref(false)
const showGenerate = ref(false)
const showLog = ref(false)
const tuning = reactive({ recall: 0.4, rank: 0.6, explore: 12, cold: '混合策略' })
const genProgress = ref(35)
let timer

const openTuning = () => (showTuning.value = true)
const saveTuning = () => {
  showTuning.value = false
}

const openGenerate = () => {
  showGenerate.value = true
  genProgress.value = 35
  timer = setInterval(() => {
    genProgress.value = Math.min(100, genProgress.value + 16)
    if (genProgress.value === 100) clearInterval(timer)
  }, 500)
}

const stopGenerate = () => {
  showGenerate.value = false
  clearInterval(timer)
}

const openLog = () => (showLog.value = true)
</script>
