<template>
  <div class="card-grid">
    <section class="card">
      <h2>动作识别概览</h2>
      <p>模型识别准确率 {{ overview.accuracy }}%，实时响应延迟 {{ overview.latency }}ms。</p>
      <div class="chart" style="margin-top: 12px;">
        <div
          v-for="(value, index) in recognitionScores"
          :key="index"
          class="chart-bar"
          :style="{ height: `${value}%` }"
        ></div>
      </div>
      <div class="button-group" style="margin-top: 16px;">
        <button class="primary-button" type="button" @click="openModal('feedback')">发送反馈</button>
        <button class="secondary-button" type="button" @click="openModal('optimize')">优化模型</button>
        <button class="secondary-button" type="button" @click="openModal('scenario')">配置场景</button>
        <button class="secondary-button" type="button" @click="openModal('tip')">识别提示</button>
      </div>
    </section>
    <section class="card">
      <h2>动作类型分布</h2>
      <p>系统支持多种互动动作类型，实时标注识别结果。</p>
      <ul>
        <li v-for="action in actions" :key="action.name">
          {{ action.name }} - {{ action.count }} 次 <span class="badge">{{ action.status }}</span>
        </li>
      </ul>
    </section>
    <section class="card">
      <h2>即时反馈策略</h2>
      <p>自定义反馈方式，提升动作纠正效率。</p>
      <div class="form-grid" style="margin-top: 12px;">
        <label>
          反馈模式
          <select v-model="feedback.mode">
            <option value="visual">视觉提示</option>
            <option value="audio">语音提示</option>
            <option value="haptic">震动反馈</option>
          </select>
        </label>
        <label>
          纠正阈值
          <input v-model="feedback.threshold" />
        </label>
        <label>
          反馈频率
          <input v-model="feedback.frequency" />
        </label>
      </div>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('save')">保存策略</button>
      </div>
    </section>
  </div>
  <BaseModal :open="modal.open" :title="modal.title" @close="closeModal" @confirm="confirmModal">
    <div v-if="modal.type === 'feedback'">
      <p>为最新动作识别结果生成反馈，支持多渠道提示。</p>
      <div class="form-grid">
        <label>
          反馈对象
          <input v-model="modalForm.target" placeholder="请输入学员姓名" />
        </label>
        <label>
          反馈内容
          <textarea v-model="modalForm.message" rows="3" placeholder="请输入反馈建议"></textarea>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'optimize'">
      <p>选择需要优化的动作模型，系统将生成训练计划。</p>
      <div class="form-grid">
        <label>
          模型版本
          <select v-model="modalForm.model">
            <option value="v3.2">识别模型 v3.2</option>
            <option value="v3.1">识别模型 v3.1</option>
            <option value="v2.9">识别模型 v2.9</option>
          </select>
        </label>
        <label>
          优化目标
          <input v-model="modalForm.goal" placeholder="如：提升右手动作识别" />
        </label>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track"><span style="width: 55%"></span></div>
        <small>当前优化进度 55%</small>
      </div>
    </div>
    <div v-else-if="modal.type === 'scenario'">
      <p>配置识别场景参数以适配不同训练环境。</p>
      <div class="form-grid">
        <label>
          场景类型
          <select v-model="modalForm.scene">
            <option value="indoor">室内实验室</option>
            <option value="rehab">康复训练区</option>
            <option value="gym">运动训练馆</option>
          </select>
        </label>
        <label>
          光照级别
          <input v-model="modalForm.light" />
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'save'">
      <p>确认保存新的反馈策略并同步到当前训练任务。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 80%"></span></div>
      <small>同步进度 80%</small>
    </div>
    <div v-else>
      <p>维持标准姿态动作，可显著提升识别准确率。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 100%"></span></div>
      <small>提示已更新</small>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const overview = {
  accuracy: 94.8,
  latency: 38
}

const recognitionScores = [70, 82, 90, 95, 88, 92, 76]

const actions = [
  { name: '手势控制', count: 128, status: '稳定' },
  { name: '上肢伸展', count: 96, status: '稳定' },
  { name: '下蹲训练', count: 74, status: '关注' },
  { name: '躯干扭转', count: 65, status: '稳定' },
  { name: '步态评估', count: 52, status: '提升中' }
]

const feedback = reactive({
  mode: 'visual',
  threshold: '偏差 12%',
  frequency: '每 15 秒'
})

const modalForm = reactive({
  target: '李欣',
  message: '保持手臂平行并放慢动作节奏。',
  model: 'v3.2',
  goal: '提升下肢动作识别',
  scene: 'indoor',
  light: '标准白光'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'feedback'
})

const openModal = (type) => {
  modal.open = true
  modal.type = type
  const titles = {
    feedback: '发送动作反馈',
    optimize: '模型优化计划',
    scenario: '场景配置',
    save: '保存反馈策略',
    tip: '识别提示'
  }
  modal.title = titles[type] || '提示'
}

const closeModal = () => {
  modal.open = false
}

const confirmModal = () => {
  modal.open = false
}
</script>
