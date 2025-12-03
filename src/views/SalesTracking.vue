<template>
  <div>
    <div class="header">
      <div>
        <h2>销售跟踪</h2>
        <p class="muted">监控销售线索与定制方案推进，锁定重点客户。</p>
      </div>
      <div class="action-row">
        <button class="primary-btn" @click="openFollow">登记回访</button>
        <button class="secondary-btn" @click="openReminder">发起提醒</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card" v-for="stage in stages" :key="stage.name">
        <div class="tag">{{ stage.name }}</div>
        <h3>{{ stage.count }} 家</h3>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: stage.ratio + '%' }"></div>
        </div>
        <p class="muted">{{ stage.note }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>客户</th>
          <th>需求钢号</th>
          <th>年需求</th>
          <th>阶段</th>
          <th>负责人</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in leads" :key="item.customer">
          <td>{{ item.customer }}</td>
          <td>{{ item.grade }}</td>
          <td>{{ item.volume }}</td>
          <td><span class="badge badge-blue">{{ item.stage }}</span></td>
          <td>{{ item.owner }}</td>
          <td>
            <button class="secondary-btn" @click="openDetail(item)">推进</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showFollow" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>登记回访</h3>
        <button class="secondary-btn" @click="showFollow = false">关闭</button>
      </div>
      <form class="form-grid" @submit.prevent="submitFollow">
        <label>客户<input v-model="followForm.customer" required /></label>
        <label>沟通纪要<textarea v-model="followForm.notes" required rows="3"></textarea></label>
      </form>
      <div class="modal-footer">
        <button class="primary-btn" @click="submitFollow">提交</button>
      </div>
    </div>
  </div>

  <div v-if="showReminder" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>发送提醒</h3>
        <button class="secondary-btn" @click="showReminder = false">关闭</button>
      </div>
      <p>将向团队群推送阶段更新，确保重点客户跟进不中断。</p>
      <div class="progress-bar"><div class="progress-fill" style="width: 100%"></div></div>
    </div>
  </div>

  <div v-if="showDetail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ activeLead.customer }} 跟进</h3>
        <button class="secondary-btn" @click="showDetail = false">关闭</button>
      </div>
      <p>需求钢号：{{ activeLead.grade }} | 年需求：{{ activeLead.volume }}</p>
      <div class="alert">当前阶段：{{ activeLead.stage }}，建议准备样品与交期计划。</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showFollow = ref(false)
const showReminder = ref(false)
const showDetail = ref(false)
const activeLead = ref({})
const followForm = ref({ customer: '', notes: '' })

const stages = [
  { name: '意向', count: 12, ratio: 45, note: '初步意向明确' },
  { name: '方案评估', count: 8, ratio: 60, note: '技术方案对齐中' },
  { name: '样品送检', count: 6, ratio: 80, note: '等待质检反馈' },
  { name: '签约', count: 4, ratio: 90, note: '商务条款谈判' }
]

const leads = [
  { customer: '华冶能源', grade: 'UTG-12CrMo', volume: '4万吨', stage: '方案评估', owner: '李扬' },
  { customer: '中铁装备', grade: 'UTG-30CrMnSi', volume: '2万吨', stage: '意向', owner: '张琪' },
  { customer: '西部石化', grade: 'UTG-15CrMo', volume: '1.8万吨', stage: '样品送检', owner: '王冠' },
  { customer: '南海造船', grade: 'UTG-40Cr', volume: '2.5万吨', stage: '方案评估', owner: '刘畅' },
  { customer: '华东重工', grade: 'UTG-5CrNiMo', volume: '1.2万吨', stage: '签约', owner: '赵雪' },
  { customer: '华晨模具', grade: 'UTG-9SiCr', volume: '0.8万吨', stage: '样品送检', owner: '李思' },
  { customer: '北方汽车', grade: 'UTG-20MnNi', volume: '3万吨', stage: '意向', owner: '陈伟' },
  { customer: '德信矿山', grade: 'UTG-50Mn2', volume: '1万吨', stage: '方案评估', owner: '宋安' },
  { customer: '星辰装备', grade: 'UTG-12CrNi3', volume: '1.6万吨', stage: '签约', owner: '侯捷' },
  { customer: '恒力钢构', grade: 'UTG-30Cr2Ni4', volume: '2万吨', stage: '意向', owner: '张磊' }
]

const openFollow = () => (showFollow.value = true)
const openReminder = () => (showReminder.value = true)
const openDetail = (item) => {
  activeLead.value = item
  showDetail.value = true
}
const submitFollow = () => {
  showFollow.value = false
  alert('回访已记录并同步至CRM。')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

h2 {
  margin: 0;
  color: #1e3a8a;
}

.muted {
  color: #6b7280;
  margin: 4px 0 0;
}

.action-row {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  gap: 10px;
}

textarea {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}
</style>
