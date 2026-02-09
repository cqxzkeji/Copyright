<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="showReport = true">生成报表</button>
      <button class="btn" @click="startProgress('刷新实时仪表盘')">刷新仪表盘</button>
      <button class="btn" @click="showTip = true">按钮提示</button>
    </div>
    <div class="chart-card">
      <h3>仪表盘组件使用率</h3>
      <div class="line-points"><span v-for="(v,i) in points" :key="i" :style="{height:(25+v)+'px'}"></span></div>
    </div>
    <table class="data-table">
      <thead><tr><th>报表编号</th><th>类型</th><th>更新频率</th><th>订阅人数</th><th>状态</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.id"><td>{{row.id}}</td><td>{{row.type}}</td><td>{{row.freq}}</td><td>{{row.sub}}</td><td>{{row.status}}</td></tr></tbody>
    </table>
    <ModalDialog v-model="showReport" title="报表配置" :show-confirm="true" @confirm="showReport=false"><div class="form-grid"><label>报表名称<input v-model="report.name"/></label><label>可视化类型<select v-model="report.kind"><option>折线图</option><option>柱状图</option><option>组合图</option></select></label></div></ModalDialog>
    <ModalDialog v-model="showTip" title="按钮提示"><p>支持自定义报表模板、交互式钻取分析和实时可视化刷新。</p></ModalDialog>
    <ModalDialog v-model="showProgress" :title="progressText"><div class="progress-wrap"><div class="progress"><i :style="{ width: progress + '%' }"></i></div><p>{{ progress }}%</p></div></ModalDialog>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
const showReport=ref(false),showTip=ref(false),showProgress=ref(false),progress=ref(0),progressText=ref('处理中')
const report=reactive({name:'',kind:'折线图'})
const points=[55,61,67,59,75,83,78,86,90]
const rows=Array.from({length:20},(_,i)=>({id:`DV-${4001+i}`,type:['运营看板','销售看板','供应链看板'][i%3],freq:['实时','每小时','每日'][i%3],sub:30+i*2,status:i%2===0?'启用':'草稿'}))
const startProgress=(t)=>{progressText.value=t;progress.value=0;showProgress.value=true;const timer=setInterval(()=>{progress.value+=25;if(progress.value>=100)clearInterval(timer)},220)}
</script>
