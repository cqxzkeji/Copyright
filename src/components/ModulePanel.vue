<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const formModalVisible = ref(false)
const progressModalVisible = ref(false)
const tipModalVisible = ref(false)
const activeAction = ref(null)
const actionResult = ref('')
const loading = ref(false)
const progressValue = ref(0)

const formState = reactive({
  name: '',
  level: 'high',
  desc: '',
  date: ''
})

const actionButtons = props.config.actions || []
const tableRows = props.config.tableRows || []
const chartData = props.config.chartData || []
const gallery = props.config.gallery || []

const openForm = (action) => {
  activeAction.value = action
  formState.name = ''
  formState.level = 'high'
  formState.desc = ''
  formState.date = ''
  formModalVisible.value = true
}

const submitForm = () => {
  actionResult.value = `已提交【${activeAction.value?.label}】操作，参数：${formState.name || '默认任务'}，优先级：${formState.level}`
  formModalVisible.value = false
  tipModalVisible.value = true
}

const startProgress = (action) => {
  activeAction.value = action
  progressValue.value = 0
  progressModalVisible.value = true
  loading.value = true
  const timer = setInterval(() => {
    progressValue.value += 10
    if (progressValue.value >= 100) {
      clearInterval(timer)
      loading.value = false
      actionResult.value = `【${action.label}】已执行完成，系统已生成分析结果。`
      setTimeout(() => {
        progressModalVisible.value = false
        tipModalVisible.value = true
      }, 400)
    }
  }, 150)
}

const openTip = (action) => {
  activeAction.value = action
  actionResult.value = action.tip
  tipModalVisible.value = true
}
</script>

<template>
  <div class="module-root">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card">
          <div class="toolbar">
            <el-tooltip
              v-for="action in actionButtons"
              :key="action.label"
              :content="action.tooltip"
              placement="top"
            >
              <el-button
                :type="action.type"
                @click="action.mode === 'form' ? openForm(action) : action.mode === 'progress' ? startProgress(action) : openTip(action)"
              >
                {{ action.label }}
              </el-button>
            </el-tooltip>
          </div>

          <el-table :data="tableRows" stripe style="width: 100%; margin-top: 14px">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="task" label="任务" min-width="180" />
            <el-table-column prop="owner" label="负责人" min-width="100" />
            <el-table-column prop="status" label="状态" min-width="110">
              <template #default="scope">
                <el-tag :type="scope.row.status === '完成' ? 'success' : scope.row.status === '进行中' ? 'warning' : 'info'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="进度" min-width="180">
              <template #default="scope">
                <el-progress :percentage="scope.row.progress" :status="scope.row.progress === 100 ? 'success' : undefined" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card">
          <div class="mini-title">资源趋势</div>
          <div v-for="item in chartData" :key="item.name" class="chart-item">
            <span>{{ item.name }}</span>
            <el-progress :percentage="item.value" :color="item.color" />
          </div>
          <div class="mini-title" style="margin-top: 16px">样例图像</div>
          <el-row :gutter="8">
            <el-col v-for="img in gallery" :key="img" :span="12">
              <img :src="img" alt="sample" class="gallery-img" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="formModalVisible" modal title="操作参数配置" width="500px">
      <el-form label-width="90px">
        <el-form-item label="任务名称">
          <el-input v-model="formState.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="formState.level" style="width: 100%">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行日期">
          <el-date-picker v-model="formState.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="formState.desc" type="textarea" :rows="3" placeholder="请输入说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formModalVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认执行</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="progressModalVisible" modal title="任务进度" width="460px" :close-on-click-modal="false">
      <p>当前执行：{{ activeAction?.label }}</p>
      <el-progress :percentage="progressValue" :indeterminate="loading" :duration="4" />
      <el-alert style="margin-top: 12px" type="info" :closable="false" show-icon title="系统正在分配资源并写入日志，请稍候。" />
    </el-dialog>

    <el-dialog v-model="tipModalVisible" modal title="系统提示" width="420px">
      <el-result icon="success" title="操作反馈" :sub-title="actionResult" />
      <template #footer>
        <el-button type="primary" @click="tipModalVisible = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.module-root {
  width: 100%;
}

.panel-card {
  border-radius: 12px;
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mini-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #334155;
}

.chart-item {
  margin-bottom: 8px;
}

.gallery-img {
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
}
</style>
