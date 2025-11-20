<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h2>日报录入</h2>
        <p>快速记录今日进展，系统自动同步审批与统计模块。</p>
      </div>
      <button class="primary" @click="openGuide">录入指引</button>
    </header>

    <div class="layout">
      <form class="entry-form" @submit.prevent="submit">
        <label>
          今日重点任务
          <textarea v-model="form.tasks" rows="4" required placeholder="填写任务内容" />
        </label>
        <label>
          完成情况
          <textarea v-model="form.progress" rows="4" required placeholder="填写达成比例、难点等" />
        </label>
        <label>
          明日计划
          <textarea v-model="form.plan" rows="3" placeholder="可预填明日目标" />
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.needSupport" /> 需要支持
        </label>
        <button type="submit" class="primary">提交日报</button>
      </form>

      <section class="tips">
        <h3>系统智能提示</h3>
        <ul>
          <li>引用前日日报仅需 1 秒，一键复制粘贴。</li>
          <li>录入后自动推送至对应审批人，实时提醒。</li>
          <li>支持富文本粘贴，保留格式与截图。</li>
        </ul>
        <button class="outline" @click="openPreview">预览生成效果</button>
      </section>
    </div>

    <ModalDialog :show="showGuide" title="填写指引" @close="showGuide = false">
      <p>1. 聚焦产出，用数据和里程碑描述结果。</p>
      <p>2. 对延期事项说明原因和影响，便于审批快速判断。</p>
      <p>3. 明日计划按照优先级排序，勾选需要支持的事项。</p>
    </ModalDialog>

    <ModalDialog :show="showPreview" title="日报预览" @close="showPreview = false">
      <p>重点任务：{{ form.tasks || '未填写' }}</p>
      <p>完成情况：{{ form.progress || '未填写' }}</p>
      <p>明日计划：{{ form.plan || '未填写' }}</p>
    </ModalDialog>

    <ModalDialog :show="submitted" title="提交成功" @close="submitted = false">
      <p>日报已同步至审批模块，审批节点将收到即时提醒。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const form = reactive({
  tasks: '',
  progress: '',
  plan: '',
  needSupport: false
})

const showGuide = ref(false)
const showPreview = ref(false)
const submitted = ref(false)

const openGuide = () => (showGuide.value = true)
const openPreview = () => (showPreview.value = true)

const submit = () => {
  submitted.value = true
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(15, 22, 58, 0.08);
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.entry-form {
  flex: 2;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #4a5775;
}

textarea {
  border-radius: 12px;
  border: 1px solid #d5dceb;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.tips {
  flex: 1;
  min-width: 260px;
  background: #f8fbff;
  border-radius: 16px;
  padding: 20px;
}

.tips ul {
  padding-left: 20px;
  color: #5a6787;
  line-height: 1.8;
}

.primary,
.outline {
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #306bff, #58c8ff);
  color: #fff;
}

.outline {
  background: transparent;
  color: #1f6feb;
  border: 1px solid #b5d4ff;
}
</style>
