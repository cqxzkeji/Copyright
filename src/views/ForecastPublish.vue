<template>
  <div class="grid" style="grid-template-columns: 1.1fr 1fr;">
    <div class="card">
      <div class="flex-between">
        <div class="section-title">观测对比评估</div>
        <span class="badge">站点</span>
      </div>
      <p class="muted">对比观测与模拟结果，计算误差与相关系数。</p>
      <table class="table">
        <thead>
          <tr>
            <th>站点</th><th>观测</th><th>模拟</th><th>偏差</th><th>相关系数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stations" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.obs }}</td>
            <td>{{ item.model }}</td>
            <td :class="item.bias > 0 ? 'tag-warning' : 'tag-success'" style="border-radius: 20px; padding:4px 10px;">{{ item.bias }} μg/m³</td>
            <td>{{ item.r }}</td>
          </tr>
        </tbody>
      </table>
      <div class="toolbar" style="margin-top: 12px;">
        <button @click="openDialog('eval')">重新评估</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <div class="section-title">预警等级生成</div>
        <span class="badge">PM2.5</span>
      </div>
      <p class="muted">依据预测浓度自动生成轻度/中度/重度污染等级。</p>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:10px;">
        <div v-for="warning in warnings" :key="warning.level" class="card" style="background:#f8fafc;">
          <div class="flex-between">
            <div>{{ warning.level }}</div>
            <span class="badge" :class="warning.color">{{ warning.range }}</span>
          </div>
          <div class="progress-bar" style="margin-top:8px;">
            <div class="progress-inner" :style="{ width: warning.coverage + '%' }"></div>
          </div>
          <div class="muted" style="margin-top:6px;">影响城市：{{ warning.cities }}</div>
        </div>
      </div>
      <div class="toolbar" style="margin-top: 12px;">
        <button @click="openDialog('alert')">发布预警</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="flex-between">
      <div class="section-title">成果发布</div>
      <span class="badge">日报/周报</span>
    </div>
    <p class="muted">生成日报/周报，自动导出图表并推送。</p>
    <table class="table">
      <thead>
        <tr>
          <th>类型</th><th>发布时间</th><th>包含内容</th><th>状态</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.type">
          <td>{{ report.type }}</td>
          <td>{{ report.time }}</td>
          <td>{{ report.content }}</td>
          <td><span class="badge" :class="report.status === '已发布' ? 'tag-success' : 'tag-warning'">{{ report.status }}</span></td>
          <td><button @click="openDialog(report.type)">导出</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showDialog" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h3>{{ dialogTitle }}</h3>
      <form class="grid" style="gap:12px;" @submit.prevent="confirm">
        <div>
          <label>发布渠道</label>
          <select v-model="form.channel">
            <option>邮件</option>
            <option>网页</option>
            <option>短信</option>
          </select>
        </div>
        <div>
          <label>附加说明</label>
          <textarea v-model="form.note" rows="3" placeholder="如：突出重污染区域" />
        </div>
        <div class="toolbar">
          <button type="submit">确认</button>
          <button type="button" @click="close">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const stations = [
  { name: '杭州滨江', obs: 68, model: 72, bias: 4, r: 0.86 },
  { name: '宁波鄞州', obs: 55, model: 49, bias: -6, r: 0.78 },
  { name: '金华婺城', obs: 72, model: 70, bias: -2, r: 0.81 },
  { name: '温州鹿城', obs: 80, model: 90, bias: 10, r: 0.74 },
  { name: '台州椒江', obs: 60, model: 62, bias: 2, r: 0.79 }
];

const warnings = [
  { level: '轻度污染', range: '75-115', coverage: 35, cities: '杭州、绍兴', color: 'tag-warning' },
  { level: '中度污染', range: '115-150', coverage: 22, cities: '湖州、嘉兴', color: 'tag-warning' },
  { level: '重度污染', range: '>150', coverage: 8, cities: '舟山', color: 'tag-warning' },
  { level: '良', range: '35-75', coverage: 25, cities: '丽水、衢州', color: 'tag-success' },
  { level: '优', range: '<35', coverage: 10, cities: '台州临海', color: 'tag-success' }
];

const reports = [
  { type: '日报', time: '2024-04-02 08:30', content: '浓度地图+站点曲线', status: '已发布' },
  { type: '周报', time: '2024-04-01 10:00', content: '周趋势+案例分析', status: '待发布' },
  { type: '专题', time: '2024-03-30 18:00', content: '沙尘过程回顾', status: '已发布' },
  { type: '临时预警', time: '2024-04-02 07:30', content: '重污染预警', status: '待发布' },
  { type: '技术支撑', time: '2024-04-02 09:00', content: '会议简报', status: '已发布' }
];

const showDialog = ref(false);
const dialogTitle = ref('');
const form = reactive({ channel: '邮件', note: '' });

const openDialog = (type) => {
  dialogTitle.value = `发布/导出：${type}`;
  showDialog.value = true;
};

const close = () => {
  showDialog.value = false;
};

const confirm = () => {
  alert(`已通过 ${form.channel} 发布，备注：${form.note || '无'}`);
  showDialog.value = false;
  form.note = '';
};
</script>
