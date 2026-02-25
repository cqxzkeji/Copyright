<template>
  <div class="panel">
    <div class="stats">
      <el-card><div class="metric"><span>总播放量</span><b>126.8 万</b></div></el-card>
      <el-card><div class="metric"><span>日活用户</span><b>9,420</b></div></el-card>
      <el-card><div class="metric"><span>平均停留时长</span><b>3.5 min</b></div></el-card>
      <el-card><div class="metric"><span>互动率</span><b>18.6%</b></div></el-card>
    </div>

    <div class="toolbar">
      <el-button type="primary" @click="reportVisible = true">生成报表</el-button>
      <el-button @click="tipVisible = true">指标说明</el-button>
      <el-button type="success" @click="progressVisible = true">实时计算进度</el-button>
    </div>

    <el-image src="https://picsum.photos/seed/analytics/1200/280" fit="cover" class="banner" />

    <el-table :data="stats" stripe>
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="activeUsers" label="活跃用户" width="130" />
      <el-table-column prop="playCount" label="播放量" width="130" />
      <el-table-column prop="avgStay" label="平均停留时长" width="130" />
      <el-table-column prop="conversionRate" label="转化率" width="120" />
    </el-table>

    <el-dialog v-model="reportVisible" title="报表导出" width="430px" modal>
      <el-form :model="reportForm" label-width="90px">
        <el-form-item label="时间范围">
          <el-date-picker v-model="reportForm.range" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" />
        </el-form-item>
        <el-form-item label="报表类型">
          <el-select v-model="reportForm.type"><el-option label="播放分析" value="play" /><el-option label="用户分析" value="user" /></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportVisible = false">取消</el-button>
        <el-button type="primary" @click="exportReport">导出</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="progressVisible" title="计算进度" width="380px" modal>
      <el-progress :percentage="85" status="success" />
    </el-dialog>

    <el-dialog v-model="tipVisible" title="指标说明" width="360px" modal>
      <p>数据包含播放量、活跃度、停留时长、转化率，支持管理决策。</p>
      <template #footer><el-button type="primary" @click="tipVisible = false">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { activityStats } from '../data/mock'

const stats = ref(activityStats)
const reportVisible = ref(false)
const tipVisible = ref(false)
const progressVisible = ref(false)
const reportForm = reactive({ range: [], type: 'play' })

const exportReport = () => {
  reportVisible.value = false
  ElMessage.success('报表任务已提交，稍后可下载')
}
</script>

<style scoped>
.panel { background: #fff; border-radius: 14px; padding: 16px; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; }
.metric { display: flex; justify-content: space-between; align-items: center; color: #606266; }
.metric b { color: #303133; }
.banner { width: 100%; height: 200px; border-radius: 10px; margin: 10px 0 12px; }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
@media (max-width: 960px) { .stats { grid-template-columns: repeat(2, 1fr); } }
</style>
