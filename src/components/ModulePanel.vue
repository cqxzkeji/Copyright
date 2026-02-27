<template>
  <section class="module-panel">
    <div class="toolbar">
      <el-button v-for="btn in buttons" :key="btn.key" type="primary" @click="openModal(btn)">
        {{ btn.label }}
      </el-button>
    </div>

    <div class="content-grid">
      <el-card shadow="hover" class="chart-card">
        <div ref="chartRef" class="chart"></div>
      </el-card>
      <el-card shadow="hover" class="table-card">
        <el-table :data="tableData" stripe border height="410">
          <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" min-width="120" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="formVisible" :title="activeButton.label + '表单'" width="520px" modal>
      <el-form :model="formData" label-width="98px">
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label">
          <el-input v-model="formData[field.prop]" :placeholder="`请输入${field.label}`" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认执行</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="progressVisible" title="任务执行进度" width="460px" modal>
      <el-progress :percentage="progress" :status="progress === 100 ? 'success' : ''" :stroke-width="16" />
      <template #footer>
        <el-button type="primary" @click="progressVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="tipVisible" title="操作提示" width="420px" modal>
      <p class="tip-text">{{ tipText }}</p>
      <template #footer>
        <el-button type="primary" @click="tipVisible = false">我知道了</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  buttons: Array,
  columns: Array,
  tableData: Array,
  chartOptions: Object,
  formFields: Array
})

const chartRef = ref()
const formVisible = ref(false)
const progressVisible = ref(false)
const tipVisible = ref(false)
const progress = ref(0)
const activeButton = ref({ label: '任务' })
const tipText = ref('')
const formData = reactive({})
let chartInstance
let timer

watch(
  () => props.formFields,
  fields => {
    fields.forEach(item => {
      formData[item.prop] = ''
    })
  },
  { immediate: true }
)

const openModal = btn => {
  activeButton.value = btn
  tipText.value = btn.tip
  if (btn.type === 'form') {
    formVisible.value = true
    return
  }
  if (btn.type === 'progress') {
    progressVisible.value = true
    startProgress()
    return
  }
  tipVisible.value = true
}

const submitForm = () => {
  formVisible.value = false
  tipText.value = `${activeButton.value.label}已提交，系统将自动同步数据。`
  tipVisible.value = true
  ElMessage.success('操作成功')
}

const startProgress = () => {
  progress.value = 0
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(timer)
      tipText.value = `${activeButton.value.label}已完成，请查看最新结果。`
      tipVisible.value = true
    }
  }, 180)
}

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.chartOptions)
  window.addEventListener('resize', () => chartInstance?.resize())
})

onBeforeUnmount(() => {
  clearInterval(timer)
  chartInstance?.dispose()
})
</script>

<style scoped>
.module-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 16px;
}
.chart-card,
.table-card {
  border-radius: 12px;
}
.chart {
  width: 100%;
  height: 410px;
}
.tip-text {
  line-height: 1.7;
  color: #4c596d;
}
@media (max-width: 1100px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
