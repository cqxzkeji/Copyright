<template>
  <el-card>
    <template #header>
      <div class="head">
        <span>系统设置</span>
        <el-button type="primary" @click="saveDialog=true">保存配置</el-button>
      </div>
    </template>
    <el-form label-width="140px" style="max-width:700px">
      <el-form-item label="默认安全库存预警值"><el-input-number v-model="setting.stock" :min="1" /></el-form-item>
      <el-form-item label="成本波动预警阈值(%)"><el-input-number v-model="setting.cost" :min="1" :max="30" /></el-form-item>
      <el-form-item label="报表自动发送"><el-switch v-model="setting.autoReport" /></el-form-item>
      <el-form-item label="主题模式"><el-radio-group v-model="setting.theme"><el-radio label="亮色" value="light" /></el-radio-group></el-form-item>
    </el-form>
  </el-card>
  <el-dialog v-model="saveDialog" title="配置保存" width="380" :close-on-click-modal="false">
    <p>确认保存当前系统参数？</p>
    <template #footer><el-button @click="saveDialog=false">取消</el-button><el-button type="primary" @click="tipDialog=true; saveDialog=false">确认保存</el-button></template>
  </el-dialog>
  <el-dialog v-model="tipDialog" title="提示" width="340" :close-on-click-modal="false"><p>配置已生效。</p><template #footer><el-button type="primary" @click="tipDialog=false">确定</el-button></template></el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
const saveDialog = ref(false)
const tipDialog = ref(false)
const setting = reactive({ stock: 15, cost: 8, autoReport: true, theme: 'light' })
</script>

<style scoped>.head{display:flex;justify-content:space-between;align-items:center;}</style>
