<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <div class="muted small">批次检测</div>
          <h3 style="margin: 4px 0 0;">质量检测结果</h3>
        </div>
        <div class="toolbar">
          <button class="btn" @click="openModal('inspect')">新增检测</button>
          <button class="btn secondary" @click="openModal('correlate')">关联分析</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>磁导率</th>
            <th>损耗</th>
            <th>检测人</th>
            <th>结论</th>
            <th>关联工序</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in batches" :key="item.batch">
            <td>{{ item.batch }}</td>
            <td>{{ item.mu }}</td>
            <td>{{ item.loss }}</td>
            <td>{{ item.tester }}</td>
            <td><span :class="['badge', item.result === '合格' ? 'success' : 'danger']">{{ item.result }}</span></td>
            <td>{{ item.stage }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between">
        <div>
          <div class="muted small">质量关联</div>
          <h3 style="margin:4px 0 0;">工艺参数贡献度</h3>
        </div>
        <button class="btn" @click="openModal('optimize')">优化建议</button>
      </div>
      <div class="grid" style="gap: 10px; margin-top: 10px;">
        <div v-for="item in correlations" :key="item.name" class="card" style="background:#f8fafc;">
          <div class="flex-between">
            <div>{{ item.name }}</div>
            <div class="tag">{{ item.effect }}</div>
          </div>
          <div class="chart-row" v-for="metric in item.metrics" :key="metric.label">
            <div class="muted small">{{ metric.label }}</div>
            <div class="chart-bar" :style="{ width: metric.value + '%', background: metric.value > 70 ? 'linear-gradient(90deg,#34d399,#10b981)' : '#93c5fd' }"></div>
            <div style="text-align:right; font-weight:700;">{{ metric.value }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="modal" class="modal-backdrop">
    <div class="modal">
      <template v-if="modal === 'inspect'">
        <h3>新增检测数据</h3>
        <div class="grid grid-2" style="margin-top: 10px;">
          <div>
            <div class="label">批次号</div>
            <input class="input" v-model="form.batch" placeholder="如 MC2403-28" />
          </div>
          <div>
            <div class="label">磁导率</div>
            <input class="input" v-model="form.mu" />
          </div>
          <div>
            <div class="label">损耗(Pcv)</div>
            <input class="input" v-model="form.loss" />
          </div>
          <div>
            <div class="label">关联工序</div>
            <select class="select" v-model="form.stage">
              <option>烧结</option>
              <option>退火</option>
              <option>研磨</option>
            </select>
          </div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn" @click="confirm">提交检测</button>
        </div>
      </template>
      <template v-else-if="modal === 'correlate'">
        <h3>批次关联分析</h3>
        <p class="muted">将关联最近 5 个批次的温度、压力、烧结时间与磁性能。</p>
        <div class="progress-bar" style="margin: 12px 0;">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align:right;">
          <button class="btn secondary" @click="confirm">开始分析</button>
        </div>
      </template>
      <template v-else>
        <h3>优化建议</h3>
        <ul>
          <li>适当提高烧结保温时间 6min，提升磁导率稳定性。</li>
          <li>研磨段压力上限下调 0.05MPa，降低损耗波动。</li>
          <li>批次首件检测增加电流监测点，提前预警异常。</li>
        </ul>
        <div style="text-align:right;">
          <button class="btn" @click="confirm">关闭</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const modal = ref('')
const progress = ref(65)
const form = reactive({ batch: '', mu: '', loss: '', stage: '烧结' })

const batches = Array.from({ length: 12 }).map((_, idx) => ({
  batch: `MC2403-${(idx + 11).toString().padStart(2, '0')}`,
  mu: (2500 + idx * 8).toFixed(0),
  loss: (2.3 + idx * 0.03).toFixed(2),
  tester: ['张楠', '李琪', '周越'][idx % 3],
  result: idx % 5 === 0 ? '复检' : '合格',
  stage: ['烧结', '退火', '研磨'][idx % 3]
}))

const correlations = [
  {
    name: '烧结温度',
    effect: '中等正相关',
    metrics: [
      { label: '磁导率提升', value: 76 },
      { label: '损耗降低', value: 62 }
    ]
  },
  {
    name: '退火时间',
    effect: '强正相关',
    metrics: [
      { label: '一致性提升', value: 82 },
      { label: '缺陷减少', value: 74 }
    ]
  },
  {
    name: '研磨压力',
    effect: '弱相关',
    metrics: [
      { label: '良品率', value: 58 },
      { label: '磁性能稳定', value: 66 }
    ]
  }
]

const openModal = (type) => {
  modal.value = type
  progress.value = 55 + Math.round(Math.random() * 40)
}

const confirm = () => {
  progress.value = 100
  setTimeout(() => (modal.value = ''), 320)
}
</script>
