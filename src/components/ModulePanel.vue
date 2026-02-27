<template>
  <section class="module">
    <div class="top-grid">
      <SimpleChart :title="chartTitle" :data="chartData" />
      <div class="image-card">
        <img :src="image" alt="module visual" />
      </div>
    </div>

    <div class="toolbar">
      <button class="btn" @click="openCreate">新增</button>
      <button class="btn" @click="openEdit">编辑</button>
      <button class="btn" @click="showNotice = true">按钮提示</button>
      <button class="btn" @click="showProgress = true">查看进度</button>
      <button class="btn" @click="exportData">导出</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td><input type="radio" name="selected" :value="row.id" v-model="selectedId" /></td>
            <td v-for="col in columns" :key="`${row.id}-${col.key}`">{{ row[col.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showForm" :title="formMode === 'create' ? '新增记录' : '编辑记录'">
      <form class="form-grid" @submit.prevent="saveForm">
        <label v-for="field in formFields" :key="field.key">
          <span>{{ field.label }}</span>
          <input v-model="form[field.key]" :placeholder="`请输入${field.label}`" required />
        </label>
        <button class="btn" type="submit">保存</button>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="流程进度">
      <div class="progress-list">
        <div v-for="step in progress" :key="step.label" class="progress-row">
          <span>{{ step.label }}</span>
          <div class="progress-track"><div class="progress-fill" :style="{ width: `${step.value}%` }"></div></div>
          <b>{{ step.value }}%</b>
        </div>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showNotice" title="按钮提示信息">
      <p>{{ noticeText }}</p>
    </ModalDialog>

    <ModalDialog v-model="showExport" title="导出结果">
      <p>{{ exportMessage }}</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import SimpleChart from './SimpleChart.vue'

const props = defineProps({
  columns: Array,
  modelValue: Array,
  chartTitle: String,
  chartData: Array,
  image: String,
  formFields: Array,
  progress: Array,
  noticeText: String
})

const emit = defineEmits(['update:modelValue'])
const rows = computed(() => props.modelValue)
const selectedId = ref(null)
const showForm = ref(false)
const showProgress = ref(false)
const showNotice = ref(false)
const showExport = ref(false)
const exportMessage = ref('')
const formMode = ref('create')
const form = reactive({})

const openCreate = () => {
  formMode.value = 'create'
  props.formFields.forEach((f) => (form[f.key] = ''))
  showForm.value = true
}

const openEdit = () => {
  const target = rows.value.find((r) => r.id === selectedId.value)
  if (!target) {
    showNotice.value = true
    return
  }
  formMode.value = 'edit'
  props.formFields.forEach((f) => (form[f.key] = target[f.key]))
  showForm.value = true
}

const saveForm = () => {
  const next = [...rows.value]
  if (formMode.value === 'create') {
    next.unshift({ id: Date.now(), ...form })
  } else {
    const idx = next.findIndex((item) => item.id === selectedId.value)
    if (idx >= 0) next[idx] = { ...next[idx], ...form }
  }
  emit('update:modelValue', next)
  showForm.value = false
}

const exportData = () => {
  exportMessage.value = `导出成功，共 ${rows.value.length} 条记录。`
  showExport.value = true
}
</script>
