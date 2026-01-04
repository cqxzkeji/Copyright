<template>
  <div class="grid" aria-label="分级管理与随访干预">
    <div class="section-title">
      <h2>分级随访与干预</h2>
      <div class="actions">
        <button @click="openPlan">制定随访计划</button>
        <button class="secondary" @click="showReminder">发送提醒</button>
        <button class="accent" @click="showIntervention">启动干预</button>
      </div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>患者</th>
            <th>风险等级</th>
            <th>随访频次</th>
            <th>下次随访</th>
            <th>干预措施</th>
            <th>完成率</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in plans" :key="item.id">
            <td>{{ item.name }}</td>
            <td><span class="badge" :class="badgeClass(item.risk)">{{ item.risk }}</span></td>
            <td>{{ item.interval }}</td>
            <td>{{ item.next }}</td>
            <td>{{ item.actions.join('、') }}</td>
            <td>
              <div class="progress-bar" style="min-width: 120px;">
                <span :style="{ width: item.completion + '%', background: '#22c55e' }"></span>
              </div>
            </td>
            <td>
              <div class="actions">
                <button class="secondary" @click="openPlan(item)">调整</button>
                <button class="accent" @click="openTimeline(item)">随访记录</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="responsive-grid">
      <div class="card">
        <h3>自动提醒</h3>
        <p>按风险等级自动匹配随访频次，短信+院内消息双通道推送。</p>
        <div class="chip-row">
          <span class="tag">复查提醒</span>
          <span class="tag">药物依从</span>
          <span class="tag">饮食指导</span>
        </div>
      </div>
      <div class="card">
        <h3>动态调整</h3>
        <p>结合最新检验结果实时调整管理策略，保持长期健康跟踪。</p>
        <div class="progress-bar"><span :style="{ width: '64%' }"></span></div>
        <small>本周完成率 64%</small>
      </div>
      <div class="card">
        <h3>干预成效</h3>
        <p>高风险患者 78% 在 3 个月内尿蛋白下降一级。</p>
        <div class="chart-bar">
          <span>目标达成</span>
          <div class="bar-track"><div class="bar-fill" style="width: 78%; background: #22c55e;"></div></div>
          <span>78%</span>
        </div>
      </div>
    </div>

    <div v-if="showPlanModal" class="overlay" @click.self="closePlan">
      <div class="modal">
        <h3>{{ currentPlan?.id ? '调整' : '制定' }}随访计划</h3>
        <div class="form-grid">
          <label>患者姓名<input v-model="planForm.name" placeholder="王晨" /></label>
          <label>风险等级<select v-model="planForm.risk"><option>低风险</option><option>中风险</option><option>高风险</option></select></label>
          <label>随访频次<select v-model="planForm.interval"><option>每月</option><option>每两月</option><option>每季度</option></select></label>
          <label>下次随访<input type="date" v-model="planForm.next" /></label>
        </div>
        <label>干预措施<textarea v-model="planForm.actions" rows="2" placeholder="饮食指导、血压控制" /></label>
        <div class="actions" style="justify-content: flex-end; margin-top: 10px;">
          <button class="secondary" @click="savePlan">保存计划</button>
        </div>
      </div>
    </div>

    <div v-if="reminderModal" class="overlay" @click.self="reminderModal = false">
      <div class="modal">
        <h3>发送提醒</h3>
        <p>将向高风险患者发送复查与用药提示。</p>
        <div class="form-grid">
          <label>渠道<select><option>短信</option><option>院内消息</option><option>电话</option></select></label>
          <label>提醒内容<textarea rows="2" placeholder="请于本周完成肌酐、尿蛋白复查" /></label>
        </div>
        <div class="progress-bar" style="margin: 10px 0;"><span :style="{ width: '45%', background: '#f59e0b' }"></span></div>
        <small>发送进度模拟</small>
        <div class="actions" style="justify-content: flex-end;">
          <button class="accent" @click="reminderModal = false">确认发送</button>
        </div>
      </div>
    </div>

    <div v-if="interventionModal" class="overlay" @click.self="interventionModal = false">
      <div class="modal">
        <h3>启动干预</h3>
        <p>根据风险等级匹配血压、血糖与蛋白尿的综合管理方案。</p>
        <ul>
          <li>药物调整：RAAS 抑制剂优化</li>
          <li>生活干预：限盐、控糖、体重管理</li>
          <li>复查节点：2 周、1 月、3 月</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="interventionModal = false">开始执行</button>
        </div>
      </div>
    </div>

    <div v-if="timelinePatient" class="overlay" @click.self="timelinePatient = null">
      <div class="modal">
        <h3>{{ timelinePatient.name }} 的随访记录</h3>
        <ul>
          <li v-for="(node, idx) in timelinePatient.timeline" :key="idx">{{ node.date }} - {{ node.note }}</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="timelinePatient = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const plans = reactive([
  { id: 1, name: '王晨', risk: '低风险', interval: '每季度', next: '2024-07-01', actions: ['饮食指导', '血压控制'], completion: 82, timeline: timeline() },
  { id: 2, name: '张伟', risk: '高风险', interval: '每月', next: '2024-06-28', actions: ['蛋白尿监测', 'RAAS调整'], completion: 64, timeline: timeline('高风险') },
  { id: 3, name: '李敏', risk: '中风险', interval: '每两月', next: '2024-07-05', actions: ['血糖控制', '肾脏饮食'], completion: 71, timeline: timeline('中风险') },
  { id: 4, name: '孙丽', risk: '中风险', interval: '每两月', next: '2024-07-12', actions: ['血压监测', '蛋白尿评估'], completion: 58, timeline: timeline('中风险') },
  { id: 5, name: '刘颖', risk: '低风险', interval: '每季度', next: '2024-08-02', actions: ['生活方式', '复查肌酐'], completion: 88, timeline: timeline() }
]);

const showPlanModal = ref(false);
const reminderModal = ref(false);
const interventionModal = ref(false);
const timelinePatient = ref(null);
const currentPlan = ref(null);
const planForm = reactive({ name: '', risk: '中风险', interval: '每两月', next: '', actions: '' });

const badgeClass = (risk) => {
  if (risk === '高风险') return 'red badge';
  if (risk === '中风险') return 'orange badge';
  return 'green badge';
};

const openPlan = (plan) => {
  currentPlan.value = plan;
  showPlanModal.value = true;
  if (plan) {
    Object.assign(planForm, { name: plan.name, risk: plan.risk, interval: plan.interval, next: plan.next, actions: plan.actions.join('、') });
  } else {
    Object.assign(planForm, { name: '', risk: '中风险', interval: '每两月', next: '', actions: '' });
  }
};

const savePlan = () => {
  if (currentPlan.value) {
    Object.assign(currentPlan.value, {
      name: planForm.name || currentPlan.value.name,
      risk: planForm.risk,
      interval: planForm.interval,
      next: planForm.next,
      actions: planForm.actions.split('、').filter(Boolean)
    });
  } else {
    plans.push({
      id: Date.now(),
      name: planForm.name || '未命名',
      risk: planForm.risk,
      interval: planForm.interval,
      next: planForm.next || '2024-07-15',
      actions: planForm.actions ? planForm.actions.split('、') : ['饮食指导'],
      completion: 0,
      timeline: timeline(planForm.risk)
    });
  }
  showPlanModal.value = false;
};

const closePlan = () => {
  showPlanModal.value = false;
};

const showReminder = () => {
  reminderModal.value = true;
};

const showIntervention = () => {
  interventionModal.value = true;
};

const openTimeline = (plan) => {
  timelinePatient.value = plan;
};

function timeline(level = '低风险') {
  const notes = level === '高风险' ? ['复查尿蛋白 3+', '调整 RAAS 药物', '电解质监测'] : level === '中风险' ? ['饮食评估', '血压跟踪', '复查肌酐'] : ['生活指导', '年度体检'];
  return notes.map((note, idx) => ({ date: `2024-0${idx + 3}-0${idx + 2}`, note }));
}
</script>
