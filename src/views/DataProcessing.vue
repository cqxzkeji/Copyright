<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="showRule = true">新增清洗规则</button>
      <button class="btn" @click="startProgress('执行批量清洗任务')">执行清洗</button>
      <button class="btn" @click="showTip = true">按钮提示</button>
    </div>
    <div class="chart-card">
      <h3>数据质量评分</h3>
      <div class="line-points"><span v-for="(v,i) in lineData" :key="i" :style="{height: (30+v)+'px'}"></span></div>
    </div>
    <table class="data-table">
      <thead><tr><th>批次</th><th>去重记录</th><th>补全记录</th><th>错误修正</th><th>质量分</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.batch"><td>{{ row.batch }}</td><td>{{ row.dedup }}</td><td>{{ row.fill }}</td><td>{{ row.fix }}</td><td>{{ row.score }}</td></tr></tbody>
    </table>
    <ModalDialog v-model="showRule" title="清洗规则配置" :show-confirm="true" @confirm="showRule=false">
      <div class="form-grid"><label>规则名称<input v-model="rule.name" /></label><label>缺失值策略<select v-model="rule.strategy"><option>均值填充</option><option>中位数填充</option><option>删除记录</option></select></label></div>
    </ModalDialog>
    <ModalDialog v-model="showTip" title="按钮提示"><p>清洗规则支持去重、补全、纠错，执行清洗将生成可追踪批次结果。</p></ModalDialog>
    <ModalDialog v-model="showProgress" :title="progressText"><div class="progress-wrap"><div class="progress"><i :style="{ width: progress + '%' }"></i></div><p>{{ progress }}%</p></div></ModalDialog>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
const showRule=ref(false),showTip=ref(false),showProgress=ref(false),progress=ref(0),progressText=ref('处理中')
const rule = reactive({name:'',strategy:'均值填充'})
const lineData=[45,52,61,66,72,80,76,85]
const rows=Array.from({length:20},(_,i)=>({batch:`DP-${2001+i}`,dedup:40+i,fill:18+i,fix:6+(i%5),score:88+(i%10)}))
const startProgress=(t)=>{progressText.value=t;progress.value=0;showProgress.value=true;const timer=setInterval(()=>{progress.value+=25;if(progress.value>=100)clearInterval(timer)},240)}
</script>
