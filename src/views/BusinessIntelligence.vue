<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="showPlan = true">创建决策方案</button>
      <button class="btn" @click="startProgress('生成KPI预警报告')">生成预警</button>
      <button class="btn" @click="showTip = true">按钮提示</button>
    </div>
    <div class="chart-card">
      <h3>KPI 完成率</h3>
      <div class="bar-chart"><div class="bar-item" v-for="item in chart" :key="item.name"><span>{{item.name}}</span><div class="bar"><i :style="{width:item.value+'%'}"></i></div><b>{{item.value}}%</b></div></div>
    </div>
    <table class="data-table">
      <thead><tr><th>指标</th><th>当前值</th><th>目标值</th><th>趋势</th><th>建议动作</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.kpi"><td>{{row.kpi}}</td><td>{{row.current}}</td><td>{{row.target}}</td><td>{{row.trend}}</td><td>{{row.action}}</td></tr></tbody>
    </table>
    <ModalDialog v-model="showPlan" title="决策方案配置" :show-confirm="true" @confirm="showPlan=false"><div class="form-grid"><label>方案名称<input v-model="plan.name"/></label><label>优先级<select v-model="plan.level"><option>高</option><option>中</option><option>低</option></select></label></div></ModalDialog>
    <ModalDialog v-model="showTip" title="按钮提示"><p>根据 KPI 趋势自动生成预警，支持策略建议、成本优化和业务预测洞察。</p></ModalDialog>
    <ModalDialog v-model="showProgress" :title="progressText"><div class="progress-wrap"><div class="progress"><i :style="{ width: progress + '%' }"></i></div><p>{{ progress }}%</p></div></ModalDialog>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
const showPlan=ref(false),showTip=ref(false),showProgress=ref(false),progress=ref(0),progressText=ref('运行中')
const plan=reactive({name:'',level:'高'})
const chart=[{name:'营收增长',value:88},{name:'客户留存',value:81},{name:'库存周转',value:76},{name:'利润率',value:84}]
const rows=Array.from({length:20},(_,i)=>({kpi:`KPI-${i+1}`,current:100+i*8,target:150+i*8,trend:i%2===0?'上升':'平稳',action:['优化定价','提升转化','缩短回款'][i%3]}))
const startProgress=(t)=>{progressText.value=t;progress.value=0;showProgress.value=true;const timer=setInterval(()=>{progress.value+=20;if(progress.value>=100)clearInterval(timer)},260)}
</script>
