<template>
  <div class="section-card">
    <div class="section-title">
      <h2>模型训练模块</h2>
      <span class="status-chip">GPU 排队</span>
    </div>
    <div class="toolbar" style="margin: 10px 0">
      <button @click="showConfig = true">配置训练</button>
      <button @click="showQueue = true">查看队列</button>
      <button @click="showCheckpoint = true">保存检查点</button>
    </div>
    <div class="card-grid">
      <div class="chart-panel">
        <div class="section-title">
          <h3>损失下降</h3>
          <span class="badge">最近 10 轮</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="item in loss"
            :key="item.epoch"
            class="chart-bar"
            :style="{ height: `${item.value * 12}px` }"
          ></div>
        </div>
        <div class="flex-row" style="justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--muted);">
          <span v-for="item in loss" :key="item.epoch">E{{ item.epoch }}</span>
        </div>
      </div>
      <div class="table-card">
        <div class="section-title">
          <h3>训练任务</h3>
          <span class="badge">10+项目</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>任务名</th>
              <th>数据集</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job.name">
              <td>{{ job.name }}</td>
              <td>{{ job.dataset }}</td>
              <td>{{ job.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDialog :open="showConfig" title="配置训练" :on-close="() => (showConfig = false)">
      <div class="label">批大小</div>
      <input class="input-field" v-model="config.batch" placeholder="例如 32" />
      <div class="label">学习率</div>
      <input class="input-field" v-model="config.lr" placeholder="例如 3e-4" />
      <div class="modal-actions">
        <button @click="applyConfig">开始训练</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showQueue" title="队列状态" :on-close="() => (showQueue = false)">
      <p>GPU 队列中还有 {{ queueLeft }} 个任务，预计等待 {{ waitTime }} 分钟。</p>
      <div class="modal-actions">
        <button @click="reduceQueue">刷新队列</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showCheckpoint" title="保存检查点" :on-close="() => (showCheckpoint = false)">
      <p>将当前模型权重保存至存储桶。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: `${checkpointProgress}%` }"></div>
      </div>
      <div class="modal-actions">
        <button @click="checkpointProgress = Math.min(100, checkpointProgress + 30)">写入中</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const loss = [
  { epoch: 1, value: 6.5 },
  { epoch: 2, value: 5.3 },
  { epoch: 3, value: 4.9 },
  { epoch: 4, value: 4.1 },
  { epoch: 5, value: 3.6 },
  { epoch: 6, value: 3.2 },
  { epoch: 7, value: 2.9 },
  { epoch: 8, value: 2.5 },
  { epoch: 9, value: 2.2 },
  { epoch: 10, value: 1.9 }
]

const jobs = [
  { name: '对话模型优化', dataset: 'chat-52k', status: '训练中' },
  { name: '文案写作提炼', dataset: 'copy-10k', status: '排队' },
  { name: 'FAQ 精简', dataset: 'faq-8k', status: '已完成' },
  { name: '多轮对话稳定性', dataset: 'multi-turn', status: '排队' },
  { name: '图文描述强化', dataset: 'image-caption', status: '训练中' },
  { name: '垂直行业小样本', dataset: 'finance-1k', status: '待启动' },
  { name: '客服总结', dataset: 'cs-log', status: '训练中' },
  { name: '安全对齐', dataset: 'safety', status: '已完成' },
  { name: 'SQL 生成', dataset: 'sql-5k', status: '待启动' },
  { name: '市场情报', dataset: 'market-7k', status: '排队' }
]

const config = reactive({ batch: '32', lr: '3e-4' })
const showConfig = ref(false)
const showQueue = ref(false)
const showCheckpoint = ref(false)
const queueLeft = ref(3)
const waitTime = ref(12)
const checkpointProgress = ref(40)

const applyConfig = () => {
  showConfig.value = false
  showQueue.value = true
  queueLeft.value = 2
}

const reduceQueue = () => {
  queueLeft.value = Math.max(0, queueLeft.value - 1)
  waitTime.value = Math.max(0, waitTime.value - 4)
}
</script>
