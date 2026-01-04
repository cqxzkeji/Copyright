<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>资金与资源投入监控</h2>
        <p>监测财政资金、社会资本、土地与公共资产投入使用情况。</p>
      </div>
      <div class="actions">
        <button @click="openModal('pay')">新增拨付</button>
        <button class="ghost" @click="openModal('allocation')">资源调配</button>
        <button class="ghost" @click="openModal('roi')">投入产出分析</button>
      </div>
    </div>

    <div class="charts">
      <div class="chart-card">
        <h3>年度资金执行率</h3>
        <div class="bar-stack" v-for="item in fundExecution" :key="item.name">
          <div class="label">{{ item.name }}</div>
          <div class="bar"><span :style="{ width: item.rate + '%' }"></span></div>
          <div class="value">{{ item.paid }} / {{ item.total }} 亿元</div>
        </div>
      </div>
      <div class="chart-card">
        <h3>土地与公共资产投入</h3>
        <div class="dot-line" v-for="asset in assets" :key="asset.name">
          <div class="dot" :style="{ background: asset.color }"></div>
          <div class="asset-info">
            <div class="title">{{ asset.name }}</div>
            <div class="desc">投入 {{ asset.amount }} · 利用率 {{ asset.utilization }}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>资金来源</th>
            <th>项目</th>
            <th>计划投入(万元)</th>
            <th>已执行(万元)</th>
            <th>执行率</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in fundRows" :key="row.project">
            <td>{{ row.source }}</td>
            <td>{{ row.project }}</td>
            <td>{{ row.plan }}</td>
            <td>{{ row.paid }}</td>
            <td>{{ row.rate }}%</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="desc">{{ modal.desc }}</p>

        <div v-if="modal.type === 'pay'" class="form-grid">
          <label>资金来源<input v-model="form.source" placeholder="财政/社资" /></label>
          <label>项目名称<input v-model="form.project" placeholder="如：公共服务中心" /></label>
          <label>拨付金额（万元）<input v-model="form.amount" type="number" /></label>
          <label>用途说明<input v-model="form.note" placeholder="资金用途" /></label>
        </div>

        <div v-else-if="modal.type === 'allocation'" class="info-list">
          <p>• 土地资源：优先保障示范街景及TOD枢纽。</p>
          <p>• 公共资产：社区卫生中心配套设备已到货 70%。</p>
          <p>• 施工资源：夜间施工班组已增设两支。</p>
        </div>

        <div v-else class="progress-box">
          <div class="bar large"><span :style="{ width: '68%' }"></span></div>
          <p>当前投入产出比 1:1.35，预计运营后提升至 1:1.6。</p>
        </div>

        <div class="actions-row">
          <button class="ghost" @click="modal.visible = false">取消</button>
          <button @click="submitModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const fundExecution = [
  { name: '财政资金', rate: 78, paid: 12.5, total: 16.0 },
  { name: '社会资本', rate: 64, paid: 9.1, total: 14.2 },
  { name: '专项债', rate: 58, paid: 7.6, total: 13.1 },
  { name: '政策性贷款', rate: 46, paid: 5.4, total: 11.7 }
];

const assets = [
  { name: '土地出让（公顷）', amount: '36.4', utilization: 82, color: '#34d399' },
  { name: '公共资产盘活（亿元）', amount: '8.6', utilization: 65, color: '#3b82f6' },
  { name: '闲置厂房改造（万㎡）', amount: '12.3', utilization: 74, color: '#f59e0b' },
  { name: '基础设施共建（公里）', amount: '28.5', utilization: 69, color: '#8b5cf6' }
];

const fundRows = ref([
  { source: '财政资金', project: '征收补偿', plan: 12000, paid: 9800, rate: 82, note: '第二批拨付中' },
  { source: '财政资金', project: '安置房建设', plan: 18500, paid: 13500, rate: 73, note: '主体施工' },
  { source: '财政资金', project: '公共空间提升', plan: 6200, paid: 2800, rate: 45, note: '示范段推进' },
  { source: '社会资本', project: 'TOD综合体', plan: 21000, paid: 12600, rate: 60, note: '资本金落实' },
  { source: '社会资本', project: '产业加速器', plan: 13000, paid: 7800, rate: 60, note: '首期装修' },
  { source: '专项债', project: '市政道路', plan: 9800, paid: 5200, rate: 53, note: '路基施工' },
  { source: '专项债', project: '综合管廊', plan: 8600, paid: 4700, rate: 55, note: '机电采购' },
  { source: '政策性贷款', project: '学校建设', plan: 15000, paid: 6900, rate: 46, note: '主体封顶' },
  { source: '政策性贷款', project: '社区卫生中心', plan: 5400, paid: 2300, rate: 43, note: '图审完成' },
  { source: '财政资金', project: '慢行系统', plan: 3200, paid: 1700, rate: 53, note: '样板段施工' },
  { source: '社会资本', project: '街区运营', plan: 4200, paid: 1800, rate: 43, note: '运营团队进场' },
  { source: '专项债', project: '生态停车', plan: 2600, paid: 900, rate: 35, note: '场平进行中' },
  { source: '财政资金', project: '口袋公园', plan: 1800, paid: 700, rate: 39, note: '植物采购' },
  { source: '社会资本', project: '综合能源站', plan: 5600, paid: 2100, rate: 38, note: '设备到场' },
  { source: '财政资金', project: '文化保护', plan: 2400, paid: 1600, rate: 67, note: '修缮设计' },
  { source: '专项债', project: '智慧城市平台', plan: 4800, paid: 2000, rate: 42, note: '平台搭建' }
]);

const modal = reactive({ visible: false, type: 'pay', title: '', desc: '' });
const form = reactive({ source: '', project: '', amount: '', note: '' });

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  if (type === 'pay') {
    modal.title = '新增拨付';
    modal.desc = '录入新增资金拨付，实时刷新执行率。';
  } else if (type === 'allocation') {
    modal.title = '资源调配';
    modal.desc = '查看土地、公共资产与施工资源的调配建议。';
  } else {
    modal.title = '投入产出分析';
    modal.desc = '测算投入产出比，评估资金配置效率。';
  }
};

const submitModal = () => {
  modal.visible = false;
  if (modal.type === 'pay' && form.project) {
    fundRows.value.unshift({
      source: form.source || '新增来源',
      project: form.project,
      plan: form.amount || 0,
      paid: form.amount || 0,
      rate: 100,
      note: form.note || '已拨付'
    });
    form.source = form.project = form.amount = form.note = '';
  }
};
</script>

<style scoped>
.module { display: flex; flex-direction: column; gap: 14px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; }
.actions { display: flex; gap: 10px; }
button { padding: 10px 14px; border: none; border-radius: 10px; background: linear-gradient(90deg, #22d3ee, #3b82f6); color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 12px 30px rgba(59,130,246,0.25); }
button.ghost { background: #e5edff; color: #3157c3; box-shadow: none; }

.charts { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 12px; }
.chart-card { background: #f8fbff; border: 1px solid #e5edff; border-radius: 12px; padding: 12px; }
.bar-stack { margin-bottom: 10px; }
.bar-stack .label { font-weight: 600; }
.bar-stack .bar { background: #e5edff; height: 10px; border-radius: 10px; overflow: hidden; margin: 6px 0; }
.bar-stack .bar span { display: block; height: 100%; background: linear-gradient(90deg,#34d399,#3b82f6); }
.bar-stack .value { color: #4b5563; font-size: 13px; }

.dot-line { display: flex; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5edff; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.asset-info .title { font-weight: 600; }
.asset-info .desc { color: #6b7280; font-size: 13px; }

.table-wrapper { border: 1px solid #e5edff; border-radius: 12px; overflow: auto; }
table { width: 100%; min-width: 780px; border-collapse: collapse; }
th, td { padding: 10px 12px; border-bottom: 1px solid #edf2fb; text-align: left; }
th { background: #f3f7ff; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.32); display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 18px; border-radius: 12px; width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.desc { color: #6b7280; margin: 6px 0 12px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 10px; }
.form-grid label { display: flex; flex-direction: column; gap: 6px; color: #4b5563; font-size: 13px; }
.form-grid input { padding: 10px; border-radius: 10px; border: 1px solid #d8e2f2; }
.info-list { background: #f5f7ff; border: 1px dashed #c7d2fe; border-radius: 10px; padding: 12px; color: #4b5563; }
.progress-box .bar.large { background: #e5edff; height: 14px; border-radius: 10px; overflow: hidden; }
.progress-box .bar.large span { display: block; height: 100%; background: linear-gradient(90deg,#38bdf8,#6366f1); }
.actions-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; }
</style>
