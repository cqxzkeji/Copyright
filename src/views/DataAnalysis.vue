<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="showModel = true">创建模型</button>
      <button class="btn" @click="startProgress('训练模型中')">训练模型</button>
      <button class="btn" @click="showTip = true">按钮提示</button>
    </div>
    <div class="chart-card">
      <h3>趋势识别热度</h3>
      <div class="bar-chart"><div class="bar-item" v-for="item in chartData" :key="item.name"><span>{{ item.name }}</span><div class="bar"><i :style="{width:item.value+'%'}"></i></div><b>{{ item.value }}</b></div></div>
    </div>
    <table class="data-table">
      <thead><tr><th>模型ID</th><th>算法</th><th>准确率</th><th>召回率</th><th>更新时间</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.id"><td>{{row.id}}</td><td>{{row.alg}}</td><td>{{row.acc}}</td><td>{{row.rec}}</td><td>{{row.time}}</td></tr></tbody>
    </table>
    <ModalDialog v-model="showModel" title="模型参数配置" :show-confirm="true" @confirm="showModel=false"><div class="form-grid"><label>模型名称<input v-model="model.name"/></label><label>算法<select v-model="model.alg"><option>XGBoost</option><option>LSTM</option><option>RandomForest</option></select></label></div></ModalDialog>
    <ModalDialog v-model="showTip" title="按钮提示"><p>创建模型后可进行实时训练，系统自动输出趋势预测与模式识别评分。</p></ModalDialog>
    <ModalDialog v-model="showProgress" :title="progressText"><div class="progress-wrap"><div class="progress"><i :style="{ width: progress + '%' }"></i></div><p>{{ progress }}%</p></div></ModalDialog>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
const showModel=ref(false),showTip=ref(false),showProgress=ref(false),progress=ref(0),progressText=ref('执行中')
const model=reactive({name:'',alg:'XGBoost'})
const chartData=[{name:'销量预测',value:84},{name:'客户流失',value:71},{name:'库存预警',value:66},{name:'价格弹性',value:79}]
const rows=Array.from({length:20},(_,i)=>({id:`DA-${3001+i}`,alg:['XGBoost','LSTM','ARIMA'][i%3],acc:(0.81+i*0.005).toFixed(3),rec:(0.72+i*0.006).toFixed(3),time:`2026-01-${(i%28)+1}`}))
const startProgress=(t)=>{progressText.value=t;progress.value=0;showProgress.value=true;const timer=setInterval(()=>{progress.value+=20;if(progress.value>=100)clearInterval(timer)},280)}
</script>
