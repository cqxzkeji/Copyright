<template>
  <section class="module-panel">
    <div class="kpis">
      <article v-for="card in cards" :key="card.label" class="card">
        <p class="label">{{ card.label }}</p>
        <p class="value">{{ card.value }}</p>
      </article>
    </div>

    <div class="chart-and-actions">
      <div class="chart card">
        <svg viewBox="0 0 560 220" class="line-chart" role="img" aria-label="趋势图">
          <polyline
            :points="chartPoints"
            fill="none"
            stroke="#2d7ff9"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line x1="30" y1="180" x2="530" y2="180" stroke="#dbe8ff" stroke-width="2" />
          <line x1="30" y1="20" x2="30" y2="180" stroke="#dbe8ff" stroke-width="2" />
        </svg>
      </div>
      <div class="action-list card">
        <button
          v-for="action in actions"
          :key="action.key"
          class="btn"
          @click="openModal(action)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <div class="table-card card">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>主题</th>
            <th>地区</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.topic }}</td>
            <td>{{ row.region }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <header>
          <h3>{{ activeModal.label }}</h3>
          <button class="close" @click="closeModal">✕</button>
        </header>

        <form class="modal-form" @submit.prevent="submitModal">
          <label>
            名称
            <input v-model="form.name" required placeholder="请输入名称" />
          </label>
          <label>
            描述
            <textarea v-model="form.description" rows="3" placeholder="请输入描述" />
          </label>
          <label>
            优先级
            <select v-model="form.priority">
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </label>

          <div class="progress-wrapper">
            <div class="progress-title">流程进度</div>
            <div class="progress-bar"><span :style="{ width: `${progress}%` }"></span></div>
            <small>{{ progress }}%</small>
          </div>

          <footer>
            <button type="button" class="btn ghost" @click="showTip">提示信息</button>
            <button type="submit" class="btn">提交</button>
          </footer>
        </form>
      </div>
    </div>

    <div v-if="tipVisible" class="modal-backdrop" @click.self="tipVisible = false">
      <div class="modal tip-modal">
        <header>
          <h3>操作提示</h3>
          <button class="close" @click="tipVisible = false">✕</button>
        </header>
        <p>{{ tipMessage }}</p>
        <footer>
          <button class="btn" @click="tipVisible = false">知道了</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  cards: { type: Array, required: true },
  rows: { type: Array, required: true },
  actions: { type: Array, required: true },
  points: { type: Array, required: true },
})

const activeModal = ref(null)
const tipVisible = ref(false)
const tipMessage = ref('')
const progress = ref(0)
const form = reactive({ name: '', description: '', priority: '中' })

const chartPoints = computed(() =>
  props.points.map((value, index) => `${30 + index * 70},${180 - value}`).join(' '),
)

const openModal = (action) => {
  activeModal.value = action
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) clearInterval(timer)
  }, 120)
}

const closeModal = () => {
  activeModal.value = null
}

const showTip = () => {
  tipMessage.value = `请确认 ${activeModal.value?.label || '当前操作'} 的参数完整后再提交。`
  tipVisible.value = true
}

const submitModal = () => {
  tipMessage.value = `“${form.name || activeModal.value?.label}” 已提交，系统将继续处理。`
  tipVisible.value = true
  activeModal.value = null
  form.name = ''
  form.description = ''
  form.priority = '中'
}
</script>
