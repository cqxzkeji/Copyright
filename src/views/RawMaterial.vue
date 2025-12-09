<template>
  <div class="card">
    <div class="header">
      <div>
        <div class="subtitle">原料选择与预处理模块</div>
        <h2 style="margin: 0;">矿物原料管理</h2>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn" @click="openAdd">添加原料</button>
        <button class="btn secondary" @click="openPretreat">查看预处理进度</button>
        <button class="btn secondary" @click="openNotice">安全提示</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 1rem;">
      <div class="card" v-for="metric in metrics" :key="metric.title" style="padding: 0.9rem;">
        <div class="subtitle">{{ metric.title }}</div>
        <div style="display: flex; align-items: center; gap: 0.35rem;">
          <h2 style="margin: 0;">{{ metric.value }}</h2>
          <span class="badge">{{ metric.tag }}</span>
        </div>
        <p style="color: #6f7b95; margin: 0.35rem 0 0;">{{ metric.desc }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>矿物名称</th>
          <th>粒径(μm)</th>
          <th>含磷量(mg/g)</th>
          <th>预处理方式</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in materials" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.size }}</td>
          <td>{{ item.pContent }}</td>
          <td>{{ item.method }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showAdd" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>新增原料</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>矿物名称</label>
          <input v-model="form.name" placeholder="例如：沸石" />
        </div>
        <div class="form-group">
          <label>粒径 (μm)</label>
          <input v-model.number="form.size" type="number" min="1" />
        </div>
        <div class="form-group">
          <label>预处理方式</label>
          <select v-model="form.method">
            <option value="酸洗">酸洗</option>
            <option value="碱煮">碱煮</option>
            <option value="焙烧">焙烧</option>
            <option value="等离子活化">等离子活化</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showAdd = false">取消</button>
        <button class="btn" @click="submitMaterial">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showPretreat" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>预处理进度</strong></div>
      <div class="modal-body">
        <p style="margin-top: 0;">当前批次：{{ activeBatch }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin: 0.5rem 0 0;">完成度：{{ progress.toFixed(0) }}%</p>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showPretreat = false">关闭</button>
        <button class="btn" @click="boostProgress">加速干燥</button>
      </div>
    </div>
  </div>

  <div v-if="showNotice" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>安全提示</strong></div>
      <div class="modal-body">
        <ul style="padding-left: 1.2rem; color: #4b5568; margin: 0;">
          <li>酸洗操作需开启通风并佩戴护目镜。</li>
          <li>焙烧炉升温速率不超过 5℃/min，防止矿物爆裂。</li>
          <li>含水率超过 10% 的样品须先烘干。</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="ackNotice">已知悉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

const metrics = [
  { title: '待评估原料', value: 12, tag: '批次', desc: '本周新增 3 批' },
  { title: '平均含磷量', value: '18.7 mg/g', tag: '平均', desc: '经 ICP-OES 复核' },
  { title: '预处理完成率', value: '82%', tag: '工序', desc: '酸洗-烘干-筛分' }
]

const materials = reactive([
  { name: '沸石', size: 120, pContent: 15.2, method: '酸洗', status: '烘干中' },
  { name: '凹凸棒石', size: 180, pContent: 12.3, method: '焙烧', status: '已筛分' },
  { name: '膨润土', size: 90, pContent: 14.8, method: '碱煮', status: '酸洗中' },
  { name: '海泡石', size: 150, pContent: 10.1, method: '酸洗', status: '烘干中' },
  { name: '水镁石', size: 110, pContent: 9.7, method: '焙烧', status: '静置冷却' },
  { name: '白云石', size: 130, pContent: 11.5, method: '等离子活化', status: '待筛分' },
  { name: '赤铁矿', size: 80, pContent: 20.4, method: '酸洗', status: '已筛分' },
  { name: '黄铁矿', size: 160, pContent: 21.1, method: '焙烧', status: '冷却中' },
  { name: '绿泥石', size: 140, pContent: 13.9, method: '碱煮', status: '烘干中' },
  { name: '伊利石', size: 100, pContent: 16.2, method: '酸洗', status: '待烘干' }
])

const showAdd = ref(false)
const showPretreat = ref(false)
const showNotice = ref(false)
const activeBatch = ref('RM-202404-08')
const progress = ref(56)
const timer = ref(null)

const form = reactive({ name: '', size: 80, method: '酸洗' })

const openAdd = () => {
  form.name = ''
  form.size = 80
  form.method = '酸洗'
  showAdd.value = true
}

const submitMaterial = () => {
  if (form.name) {
    materials.push({ name: form.name, size: form.size || 0, pContent: 0, method: form.method, status: '待检测' })
    showAdd.value = false
  }
}

const openPretreat = () => {
  showPretreat.value = true
}

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 10)
}

const openNotice = () => {
  showNotice.value = true
}

const ackNotice = () => {
  showNotice.value = false
}

onMounted(() => {
  timer.value = setInterval(() => {
    if (showPretreat.value) {
      progress.value = Math.min(100, progress.value + 2)
    }
  }, 1200)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>
