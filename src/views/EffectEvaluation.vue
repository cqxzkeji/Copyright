<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>更新成效评估与指标分析</h2>
        <p>经济、社会、环境、空间品质多维指标量化评估。</p>
      </div>
      <div class="actions">
        <button @click="openModal('evaluate')">计算成效</button>
        <button class="ghost" @click="openModal('compare')">对比分析</button>
        <button class="ghost" @click="openModal('report')">生成报告</button>
      </div>
    </div>

    <div class="radar">
      <div class="ring" v-for="level in [100, 80, 60, 40, 20]" :key="level">{{ level }}</div>
      <div class="pointer" :style="{ height: '72%', transform: 'rotate(10deg)' }">经济</div>
      <div class="pointer" :style="{ height: '68%', transform: 'rotate(80deg)' }">社会</div>
      <div class="pointer" :style="{ height: '64%', transform: 'rotate(150deg)' }">环境</div>
      <div class="pointer" :style="{ height: '70%', transform: 'rotate(220deg)' }">空间</div>
      <div class="pointer" :style="{ height: '76%', transform: 'rotate(290deg)' }">治理</div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>指标名称</th>
            <th>维度</th>
            <th>当前值</th>
            <th>年度目标</th>
            <th>完成率</th>
            <th>解读</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in indicators" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.dimension }}</td>
            <td>{{ row.value }}</td>
            <td>{{ row.target }}</td>
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

        <div v-if="modal.type === 'evaluate'" class="progress-box">
          <div class="bar large"><span :style="{ width: '72%' }"></span></div>
          <p>综合得分 82 分，成效良好。</p>
        </div>

        <div v-else-if="modal.type === 'compare'" class="info-list">
          <p>• 经济与治理维度领先，拉动整体提升。</p>
          <p>• 环境维度滞后，建议加大生态投入。</p>
          <p>• 公共服务使用率较去年提升 12%。</p>
        </div>

        <div v-else class="form-grid">
          <label>报告名称<input v-model="form.title" placeholder="如：二季度评估报告" /></label>
          <label>接收邮箱<input v-model="form.email" placeholder="report@example.com" /></label>
          <label>备注<input v-model="form.note" placeholder="附加说明" /></label>
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

const indicators = ref([
  { name: '固定资产投资增速', dimension: '经济效益', value: '11.2%', target: '12%', rate: 93, note: '社会资本加速投资' },
  { name: '产业导入企业数', dimension: '经济效益', value: '48 家', target: '55 家', rate: 87, note: '加速签约' },
  { name: '新增就业岗位', dimension: '经济效益', value: '4200 个', target: '5000 个', rate: 84, note: '产业用房交付后将提升' },
  { name: '公共服务满意度', dimension: '社会效益', value: '89/100', target: '90/100', rate: 99, note: '口碑良好' },
  { name: '保障性住房套数', dimension: '社会效益', value: '1800 套', target: '2000 套', rate: 90, note: '剩余楼栋施工中' },
  { name: '文化设施开放率', dimension: '社会效益', value: '86%', target: '92%', rate: 93, note: '活动策划推进' },
  { name: 'PM2.5 平均值', dimension: '环境改善', value: '21 μg/m³', target: '20 μg/m³', rate: 95, note: '大气治理稳定' },
  { name: '绿地率', dimension: '环境改善', value: '35%', target: '36%', rate: 97, note: '口袋公园施工' },
  { name: '海绵设施完工率', dimension: '环境改善', value: '62%', target: '85%', rate: 73, note: '需加快雨水花园' },
  { name: '立面整治完成率', dimension: '空间品质', value: '58%', target: '80%', rate: 72, note: '示范段先行' },
  { name: '慢行系统连通率', dimension: '空间品质', value: '66%', target: '90%', rate: 73, note: '占道协调' },
  { name: '公共空间活力指数', dimension: '空间品质', value: '78/100', target: '85/100', rate: 92, note: '活动频次提升' },
  { name: '智慧感知覆盖率', dimension: '治理效能', value: '72%', target: '90%', rate: 80, note: '设备到货' },
  { name: '事件响应时长', dimension: '治理效能', value: '17 分钟', target: '15 分钟', rate: 88, note: '联动调度优化' },
  { name: '社会参与度', dimension: '治理效能', value: '68%', target: '80%', rate: 85, note: '社区共建平台推广' },
  { name: '碳排放强度下降', dimension: '环境改善', value: '7.5%', target: '10%', rate: 75, note: '建筑节能改造实施' },
  { name: '夜间经济指数', dimension: '经济效益', value: '65/100', target: '75/100', rate: 87, note: '街区运营上新' },
  { name: '教育资源提升指数', dimension: '社会效益', value: '72/100', target: '80/100', rate: 90, note: '学校扩容' },
  { name: '水体黑臭治理', dimension: '环境改善', value: '90%', target: '100%', rate: 90, note: '监测稳定' },
  { name: '无障碍设施覆盖', dimension: '空间品质', value: '82%', target: '90%', rate: 91, note: '细节完善' }
]);

const modal = reactive({ visible: false, type: 'evaluate', title: '', desc: '' });
const form = reactive({ title: '', email: '', note: '' });

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  if (type === 'evaluate') {
    modal.title = '计算综合成效';
    modal.desc = '基于最新数据重新计算综合得分与维度排名。';
  } else if (type === 'compare') {
    modal.title = '对比分析';
    modal.desc = '与周边片区进行横向对比，识别优势与短板。';
  } else {
    modal.title = '生成评估报告';
    modal.desc = '输出评估报告PDF，并推送至指定邮箱。';
  }
};

const submitModal = () => {
  modal.visible = false;
  form.title = form.email = form.note = '';
};
</script>

<style scoped>
.module { display: flex; flex-direction: column; gap: 14px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; }
.actions { display: flex; gap: 10px; }
button { padding: 10px 14px; border: none; border-radius: 10px; background: linear-gradient(90deg, #22d3ee, #3b82f6); color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 12px 30px rgba(59,130,246,0.25); }
button.ghost { background: #e5edff; color: #3157c3; box-shadow: none; }

.radar { position: relative; height: 280px; border-radius: 12px; background: radial-gradient(circle at center, #f8fbff, #eef2ff); overflow: hidden; margin-top: 6px; }
.ring { position: absolute; inset: 20px; border: 1px dashed #dbeafe; border-radius: 50%; text-align: right; padding: 6px; color: #9ca3af; }
.ring:nth-child(2) { inset: 40px; }
.ring:nth-child(3) { inset: 60px; }
.ring:nth-child(4) { inset: 80px; }
.ring:nth-child(5) { inset: 100px; }
.pointer { position: absolute; left: 50%; top: 50%; width: 2px; background: linear-gradient(180deg,#38bdf8,#6366f1); transform-origin: bottom center; color: #0f172a; font-size: 12px; padding-top: 6px; text-align: center; }

.table-wrapper { border: 1px solid #e5edff; border-radius: 12px; overflow: auto; }
table { width: 100%; min-width: 820px; border-collapse: collapse; }
th, td { padding: 10px 12px; border-bottom: 1px solid #edf2fb; text-align: left; }
th { background: #f3f7ff; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.32); display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 18px; border-radius: 12px; width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.desc { color: #6b7280; margin: 6px 0 12px; }
.progress-box .bar.large { background: #e5edff; height: 14px; border-radius: 10px; overflow: hidden; }
.progress-box .bar.large span { display: block; height: 100%; background: linear-gradient(90deg,#38bdf8,#6366f1); }
.info-list { background: #f5f7ff; border: 1px dashed #c7d2fe; border-radius: 10px; padding: 12px; color: #4b5563; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 10px; }
.form-grid label { display: flex; flex-direction: column; gap: 6px; color: #4b5563; font-size: 13px; }
.form-grid input { padding: 10px; border-radius: 10px; border: 1px solid #d8e2f2; }
.actions-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; }
</style>
