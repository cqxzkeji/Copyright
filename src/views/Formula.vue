<template>
  <el-card>
    <template #header>
      <div class="head">
        <el-form inline>
          <el-form-item label="养殖品种"><el-select v-model="kind" style="width:140px"><el-option label="肉鸡" value="肉鸡" /><el-option label="蛋鸡" value="蛋鸡" /><el-option label="生猪" value="生猪" /></el-select></el-form-item>
          <el-form-item label="生长阶段"><el-select v-model="stage" style="width:140px"><el-option label="幼龄" value="幼龄" /><el-option label="育成" value="育成" /><el-option label="出栏前" value="出栏前" /></el-select></el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="openProgress">智能生成配方</el-button>
          <el-button @click="showForm=true">人工微调</el-button>
          <el-button type="success" @click="openTip('配方已下发到生产模块')">下发生产</el-button>
        </div>
      </div>
    </template>
    <el-table :data="formulaData" border>
      <el-table-column prop="material" label="原料" />
      <el-table-column prop="ratio" label="配比(%)" />
      <el-table-column prop="effect" label="功能作用" />
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button size="small" @click="openTip(`已锁定 ${row.material} 用量`)">锁定</el-button>
          <el-button size="small" type="danger" @click="openTip(`已移除 ${row.material}`)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="showForm" title="人工微调配方" width="500" :close-on-click-modal="false">
    <el-form label-width="120px">
      <el-form-item label="目标蛋白"><el-slider v-model="protein" :max="26" :min="14" /></el-form-item>
      <el-form-item label="目标能量"><el-slider v-model="energy" :max="3500" :min="2500" /></el-form-item>
      <el-form-item label="无抗添加策略"><el-select v-model="strategy"><el-option label="益生菌+酶制剂" value="A" /><el-option label="植物提取物" value="B" /></el-select></el-form-item>
    </el-form>
    <template #footer><el-button @click="showForm=false">取消</el-button><el-button type="primary" @click="openTip('微调参数已生效')">应用</el-button></template>
  </el-dialog>
  <el-dialog v-model="showTip" title="提示" width="380" :close-on-click-modal="false"><p>{{tip}}</p><template #footer><el-button type="primary" @click="showTip=false">确定</el-button></template></el-dialog>
  <el-dialog v-model="showProgress" title="配方计算中" width="420" :close-on-click-modal="false"><el-progress :percentage="progress" /><template #footer><el-button type="primary" @click="showProgress=false">关闭</el-button></template></el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const kind = ref('肉鸡')
const stage = ref('育成')
const protein = ref(20)
const energy = ref(3000)
const strategy = ref('A')
const showForm = ref(false)
const showTip = ref(false)
const showProgress = ref(false)
const progress = ref(0)
const tip = ref('')

const formulaData = [
  { material: '玉米', ratio: 45, effect: '基础能量来源' },
  { material: '豆粕', ratio: 21, effect: '蛋白补充' },
  { material: '发酵豆粕', ratio: 6, effect: '改善肠道健康' },
  { material: '麦麸', ratio: 8, effect: '提高纤维结构' },
  { material: '鱼粉', ratio: 4, effect: '优质动物蛋白' },
  { material: '酵母培养物', ratio: 2, effect: '提升免疫力' }
]

const openTip = (t) => { tip.value = t; showTip.value = true; showForm.value = false }
const openProgress = async () => {
  showProgress.value = true
  progress.value = 0
  for (let i = 1; i <= 10; i += 1) {
    await new Promise((r) => setTimeout(r, 80))
    progress.value = i * 10
  }
}
</script>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
</style>
