<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>数据分析与优化决策</h2>
        <p>统计分析运行数据，为控制参数优化和效率提升提供依据。</p>
      </div>
      <div class="actions">
        <button class="primary" type="button" @click="openModal('summary')">数据汇总</button>
        <button class="ghost" type="button" @click="openModal('train')">模型训练</button>
        <button class="ghost" type="button" @click="openModal('optimize')">参数优化</button>
        <button class="ghost" type="button" @click="openModal('efficiency')">效率评估</button>
        <button class="ghost" type="button" @click="openModal('tip')">提示信息</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>效率贡献比例</h3>
        <svg class="chart" viewBox="0 0 160 160" aria-label="效率贡献">
          <circle cx="80" cy="80" r="60" fill="#e2e8f0" />
          <path d="M80 20 A60 60 0 0 1 136 104 L80 80 Z" fill="#60a5fa" />
          <path d="M136 104 A60 60 0 0 1 60 138 L80 80 Z" fill="#34d399" />
          <path d="M60 138 A60 60 0 0 1 80 20 L80 80 Z" fill="#fbbf24" />
          <circle cx="80" cy="80" r="36" fill="#ffffff" />
          <text x="80" y="85" text-anchor="middle" font-size="14" fill="#0f172a">92%</text>
        </svg>
        <div class="stat-row">
          <div>
            <span>节拍提升</span>
            <strong>+13%</strong>
          </div>
          <div>
            <span>能耗下降</span>
            <strong>-8%</strong>
          </div>
          <div>
            <span>优化建议</span>
            <strong>7 条</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>分析模型状态</h3>
        <ul class="status-list">
          <li v-for="model in models" :key="model.id">
            <span>{{ model.name }}</span>
            <span class="badge">{{ model.value }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>优化建议清单</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>建议编号</th>
              <th>来源</th>
              <th>目标参数</th>
              <th>预测提升</th>
              <th>风险等级</th>
              <th>执行状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in suggestions" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.source }}</td>
              <td>{{ item.param }}</td>
              <td>{{ item.gain }}</td>
              <td>{{ item.risk }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="activeModal = ''" @confirm="confirmModal">
      <template v-if="activeModal === 'summary'">
        <p>汇总运行数据并生成分析报表。</p>
        <div class="form-grid">
          <label>
            数据范围
            <select v-model="form.range">
              <option>近 24 小时</option>
              <option>近 7 天</option>
              <option>近 30 天</option>
            </select>
          </label>
          <label>
            输出格式
            <select v-model="form.format">
              <option>可视化看板</option>
              <option>PDF 报表</option>
              <option>数据包</option>
            </select>
          </label>
          <label>
            负责人
            <input v-model="form.owner" type="text" placeholder="数据分析组" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'train'">
        <p>启动模型训练并跟踪进度。</p>
        <div class="progress-box">
          <div class="progress-info">
            <span>训练进度</span>
            <strong>{{ progress }}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <label>
            训练策略
            <select v-model="form.strategy">
              <option>增量学习</option>
              <option>全量训练</option>
              <option>迁移学习</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'optimize'">
        <p>生成参数优化方案并预约实施。</p>
        <div class="form-grid">
          <label>
            优化目标
            <input v-model="form.target" type="text" placeholder="降低能耗" />
          </label>
          <label>
            优化窗口
            <input v-model="form.window" type="text" placeholder="周三 22:00" />
          </label>
          <label>
            预期提升(%)
            <input v-model="form.gain" type="number" min="0" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'efficiency'">
        <p>评估当前生产效率并生成建议。</p>
        <div class="form-grid">
          <label>
            评估线体
            <input v-model="form.line" type="text" placeholder="装配线-02" />
          </label>
          <label>
            KPI 权重
            <select v-model="form.weight">
              <option>均衡</option>
              <option>效率优先</option>
              <option>质量优先</option>
            </select>
          </label>
          <label>
            评估负责人
            <input v-model="form.reviewer" type="text" placeholder="工艺工程师" />
          </label>
        </div>
      </template>
      <template v-else>
        <p>提示：建议优先优化高能耗产线的参数曲线。</p>
        <div class="form-grid">
          <label>
            通知对象
            <select v-model="form.notice">
              <option>数据中心</option>
              <option>工艺团队</option>
              <option>全部人员</option>
            </select>
          </label>
          <label>
            备注
            <input v-model="form.note" type="text" placeholder="请输入提示备注" />
          </label>
        </div>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Modal from '../components/Modal.vue'

const activeModal = ref('')
const progress = ref(71)

const models = [
  { id: 1, name: '效率预测模型', value: '在线' },
  { id: 2, name: '能耗诊断模型', value: '更新中' },
  { id: 3, name: '故障预测模型', value: '稳定' },
  { id: 4, name: '参数推荐模型', value: '优化中' }
]

const suggestions = Array.from({ length: 24 }, (_, index) => ({
  id: `OPT-${800 + index}`,
  source: ['历史数据', '实时监控', '仿真分析'][index % 3],
  param: ['速度曲线', '关节阻尼', '能耗阈值'][index % 3],
  gain: `${6 + (index % 5)}%`,
  risk: ['低', '中', '高'][index % 3],
  status: index % 4 === 0 ? '待审核' : '已生成'
}))

const form = reactive({
  range: '近 7 天',
  format: '可视化看板',
  owner: '',
  strategy: '增量学习',
  target: '',
  window: '',
  gain: 8,
  line: '',
  weight: '均衡',
  reviewer: '',
  notice: '数据中心',
  note: ''
})

const modalTitle = computed(() => {
  const map = {
    summary: '数据汇总',
    train: '模型训练',
    optimize: '参数优化',
    efficiency: '效率评估',
    tip: '提示信息'
  }
  return map[activeModal.value] || '提示信息'
})

const openModal = (type) => {
  activeModal.value = type
}

const confirmModal = () => {
  activeModal.value = ''
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary,
.ghost {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(148, 163, 184, 0.25);
  display: grid;
  gap: 16px;
}

.chart {
  width: 100%;
  height: 160px;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.status-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.status-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fafc;
}

.badge {
  background: #fee2e2;
  color: #b91c1c;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-wrap {
  overflow-x: auto;
}

th,
td {
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

tbody tr:nth-child(even) {
  background: #f8fafc;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form-grid input,
.form-grid select {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress-box {
  display: grid;
  gap: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
}

.progress-bar {
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f97316);
}
</style>
