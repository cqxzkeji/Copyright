<template>
  <div class="section-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div>
        <div class="card-title">售后评价</div>
        <div class="card-subtitle">处理退换货申请与用户反馈</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="primary" @click="openSurvey">回访调研</button>
        <button class="ghost" @click="openExport">导出评价</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>评价人</th>
          <th>订单号</th>
          <th>评分</th>
          <th>类型</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in feedbacks" :key="item.order">
          <td>{{ item.user }}</td>
          <td>{{ item.order }}</td>
          <td>{{ item.score }} 分</td>
          <td>{{ item.type }}</td>
          <td><span class="chip">{{ item.status }}</span></td>
          <td style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="ghost" @click="openReply(item)">回复</button>
            <button class="ghost" @click="openAudit(item)">售后审核</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modalType" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="ghost" @click="closeModal">✕</button>
      </div>
      <div v-if="modalType === 'reply'">
        <p>回复 {{ current.user }} 的评价</p>
        <textarea class="input" rows="3" v-model="current.reply"></textarea>
      </div>
      <div v-else-if="modalType === 'audit'">
        <p>审核订单 {{ current.order }} 的售后申请</p>
        <select v-model="current.status" class="input">
          <option>待处理</option>
          <option>通过</option>
          <option>驳回</option>
        </select>
      </div>
      <div v-else-if="modalType === 'survey'">
        <p>设置调研问卷发送批次</p>
        <input class="input" v-model.number="surveyCount" type="number" placeholder="计划发送数量" />
      </div>
      <div v-else-if="modalType === 'export'">
        <p>将导出所有售后评价并邮件通知客服组。</p>
      </div>
      <div class="modal-actions">
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="confirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const feedbacks = reactive([
  { user: '李欣', order: 'SO24061001', score: 5, type: '好评', status: '待处理' },
  { user: '张腾', order: 'SO24061002', score: 4, type: '补偿咨询', status: '待处理' },
  { user: '赵园', order: 'SO24061003', score: 3, type: '退货', status: '处理中' },
  { user: '吴明', order: 'SO24061004', score: 2, type: '换货', status: '待处理' },
  { user: '刘思', order: 'SO24061005', score: 5, type: '好评', status: '完成' },
  { user: '蒋立', order: 'SO24061006', score: 4, type: '补偿咨询', status: '处理中' },
  { user: '陈宇', order: 'SO24061007', score: 3, type: '退货', status: '待处理' },
  { user: '黄依', order: 'SO24061008', score: 4, type: '好评', status: '完成' },
  { user: '谢博', order: 'SO24061009', score: 2, type: '退货', status: '处理中' },
  { user: '唐倩', order: 'SO24061010', score: 5, type: '好评', status: '完成' },
  { user: '李云', order: 'SO24061011', score: 3, type: '补偿咨询', status: '待处理' }
])

const modalType = ref('')
const current = reactive({})
const surveyCount = ref(50)

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'reply':
      return '回复评价'
    case 'audit':
      return '售后审核'
    case 'survey':
      return '回访调研'
    case 'export':
      return '导出评价'
    default:
      return ''
  }
})

const openReply = (row) => {
  Object.assign(current, row, { reply: '' })
  modalType.value = 'reply'
}

const openAudit = (row) => {
  Object.assign(current, row)
  modalType.value = 'audit'
}

const openSurvey = () => {
  modalType.value = 'survey'
}

const openExport = () => {
  modalType.value = 'export'
}

const closeModal = () => {
  modalType.value = ''
}

const confirm = () => {
  closeModal()
}
</script>
