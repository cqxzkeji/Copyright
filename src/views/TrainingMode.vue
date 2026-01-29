<template>
  <div class="card-grid">
    <section class="card">
      <h2>交互训练模式</h2>
      <p>提供游戏化、定制化等多种训练模式，提升参与感。</p>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('start')">启动训练</button>
        <button class="secondary-button" type="button" @click="openModal('custom')">定制训练</button>
        <button class="secondary-button" type="button" @click="openModal('score')">评分规则</button>
        <button class="secondary-button" type="button" @click="openModal('tip')">训练提示</button>
      </div>
    </section>
    <section class="card">
      <h2>热门训练场景</h2>
      <p>可快速切换常用训练场景，系统自动加载设备参数。</p>
      <ul>
        <li v-for="scenario in scenarios" :key="scenario.name">
          {{ scenario.name }} - {{ scenario.duration }} 分钟 <span class="badge">{{ scenario.tag }}</span>
        </li>
      </ul>
    </section>
    <section class="card">
      <h2>训练进度预览</h2>
      <p>综合评估动作完成度与稳定性，实时调整训练节奏。</p>
      <div class="chart" style="margin-top: 12px;">
        <div
          v-for="(value, index) in progressBars"
          :key="index"
          class="chart-bar"
          :style="{ height: `${value}%` }"
        ></div>
      </div>
      <div class="form-grid" style="margin-top: 12px;">
        <label>
          训练强度
          <select v-model="settings.intensity">
            <option value="low">轻量</option>
            <option value="medium">中等</option>
            <option value="high">高强度</option>
          </select>
        </label>
        <label>
          目标完成率
          <input v-model="settings.goal" />
        </label>
      </div>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('save')">保存目标</button>
      </div>
    </section>
  </div>
  <BaseModal :open="modal.open" :title="modal.title" @close="closeModal" @confirm="confirmModal">
    <div v-if="modal.type === 'start'">
      <p>选择训练模式并确认学员信息，即可开始交互训练。</p>
      <div class="form-grid">
        <label>
          训练模式
          <select v-model="form.mode">
            <option value="game">游戏化训练</option>
            <option value="custom">定制化训练</option>
            <option value="rehab">康复引导</option>
          </select>
        </label>
        <label>
          学员分组
          <input v-model="form.group" placeholder="例如：A组" />
        </label>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track"><span style="width: 70%"></span></div>
        <small>资源加载进度 70%</small>
      </div>
    </div>
    <div v-else-if="modal.type === 'custom'">
      <p>定制训练内容，系统将自动生成互动任务。</p>
      <div class="form-grid">
        <label>
          训练主题
          <input v-model="form.theme" placeholder="如：上肢灵活度" />
        </label>
        <label>
          互动道具
          <select v-model="form.props">
            <option value="light">光点引导</option>
            <option value="virtual">虚拟障碍</option>
            <option value="music">节奏音乐</option>
          </select>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'score'">
      <p>设置动作评分规则，调整不同动作的权重。</p>
      <div class="form-grid">
        <label>
          准确度权重
          <input v-model="form.weightAccuracy" />
        </label>
        <label>
          稳定性权重
          <input v-model="form.weightStability" />
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'save'">
      <p>确认保存训练目标并同步到训练计划。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 82%"></span></div>
      <small>同步进度 82%</small>
    </div>
    <div v-else>
      <p>保持动作连贯与节奏一致，可提升训练评分。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 100%"></span></div>
      <small>训练提示已更新</small>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const scenarios = [
  { name: '活力节奏训练', duration: 20, tag: '游戏化' },
  { name: '上肢恢复训练', duration: 25, tag: '康复' },
  { name: '动作协调挑战', duration: 15, tag: '互动' },
  { name: '步态稳定训练', duration: 18, tag: '评估' }
]

const progressBars = [60, 78, 52, 90, 66, 84]

const settings = reactive({
  intensity: 'medium',
  goal: '完成率 85%'
})

const form = reactive({
  mode: 'game',
  group: 'A组',
  theme: '上肢灵活度',
  props: 'light',
  weightAccuracy: '60%',
  weightStability: '40%'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'start'
})

const openModal = (type) => {
  modal.open = true
  modal.type = type
  const titles = {
    start: '启动训练',
    custom: '定制训练',
    score: '评分规则',
    save: '保存训练目标',
    tip: '训练提示'
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
