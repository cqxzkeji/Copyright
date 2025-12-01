<template>
  <div class="card">
    <h2>报告生成与可视化</h2>
    <p class="helper-text">汇总建模、优化、测试与模拟结果，生成图表化报告。</p>
    <div class="flex">
      <button @click="showTemplate = true">选择模板</button>
      <button @click="renderReport">生成报告</button>
      <button @click="showShare = true">导出与分享</button>
    </div>

    <div class="grid" style="margin-top: 16px;">
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">关键指标雷达</div>
        <div class="chart">
          <div v-for="item in radarData" :key="item.metric" class="bar" :style="{ height: 70 + item.score * 1.2 + 'px', background: 'linear-gradient(180deg,#c8ffe0,#4dd091)' }">
            <span>{{ item.score }}</span>
            <small>{{ item.metric }}</small>
          </div>
        </div>
      </div>
      <div class="card" style="margin-bottom: 0;">
        <div class="badge">版本与审批</div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>版本</th>
                <th>状态</th>
                <th>提交人</th>
                <th>审批人</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in versions" :key="row.ver">
                <td>{{ row.ver }}</td>
                <td>{{ row.status }}</td>
                <td>{{ row.author }}</td>
                <td>{{ row.reviewer }}</td>
                <td>{{ row.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="badge">图表摘要</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>值</th>
              <th>描述</th>
              <th>数据来源</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in summary" :key="row.metric">
              <td>{{ row.metric }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.desc }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showTemplate" class="modal-mask">
    <div class="modal-container">
      <h3>报告模板</h3>
      <div class="input-row">
        <label>选择版式</label>
        <select v-model="template">
          <option>科研评审版</option>
          <option>产业转移版</option>
          <option>学生汇报版</option>
        </select>
      </div>
      <div class="input-row">
        <label>高亮章节</label>
        <input v-model="highlight" placeholder="例如：模拟与测试" />
      </div>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="showTemplate = false">应用模板</button>
      </div>
    </div>
  </div>

  <div v-if="showRender" class="modal-mask">
    <div class="modal-container">
      <h3>报告生成中</h3>
      <p>正在编译文档与图表，请稍候。</p>
      <div class="progress"><div :style="{ width: progress + '%' }"></div></div>
      <p class="helper-text">完成度：{{ progress }}%</p>
    </div>
  </div>

  <div v-if="showShare" class="modal-mask">
    <div class="modal-container">
      <h3>导出与分享</h3>
      <div class="input-row">
        <label>导出格式</label>
        <select v-model="exportType">
          <option>PDF</option>
          <option>Word</option>
          <option>图文摘要</option>
        </select>
      </div>
      <div class="input-row">
        <label>分享邮箱</label>
        <input v-model="shareEmail" placeholder="lab@cnm.com" />
      </div>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="showShare = false">发送与导出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

const radarData = [
  { metric: '强度', score: 92 },
  { metric: '透气', score: 86 },
  { metric: '抗菌', score: 95 },
  { metric: '稳定性', score: 88 },
  { metric: '可持续', score: 91 }
];

const versions = [
  { ver: 'v1.0', status: '审核中', author: '林工', reviewer: '周老师', date: '2024-06-12' },
  { ver: 'v1.1', status: '通过', author: '林工', reviewer: '刘主任', date: '2024-06-18' },
  { ver: 'v1.2', status: '草稿', author: '李博士', reviewer: '待分配', date: '2024-06-25' },
  { ver: 'v1.3', status: '通过', author: '李博士', reviewer: '周老师', date: '2024-07-02' },
  { ver: 'v1.4', status: '审核中', author: '王同学', reviewer: '刘主任', date: '2024-07-06' },
  { ver: 'v2.0', status: '草稿', author: '林工', reviewer: '待分配', date: '2024-07-10' },
  { ver: 'v2.1', status: '通过', author: '李博士', reviewer: '周老师', date: '2024-07-12' },
  { ver: 'v2.2', status: '审核中', author: '王同学', reviewer: '刘主任', date: '2024-07-14' },
  { ver: 'v2.3', status: '草稿', author: '林工', reviewer: '周老师', date: '2024-07-18' },
  { ver: 'v2.4', status: '通过', author: '李博士', reviewer: '周老师', date: '2024-07-20' }
];

const summary = [
  { metric: '厚度均匀度', value: '±3 nm', desc: '5 层厚度偏差', source: '建模', note: '满足设计要求' },
  { metric: '孔隙率', value: '26%', desc: '平均孔隙率', source: '建模', note: '偏向高透气' },
  { metric: '固含量', value: '26.8%', desc: '优化后配方', source: '优化', note: '匹配目标强度' },
  { metric: '干燥时间', value: '44 min', desc: '最优干燥区间', source: '优化', note: '可缩短 12%' },
  { metric: '断裂强度', value: '102 MPa', desc: '纵向平均', source: '测试', note: '满足包装要求' },
  { metric: '透气率', value: '17.2 mm/s', desc: '100 Pa 压差', source: '测试', note: '与预期一致' },
  { metric: '抗菌率', value: '98%', desc: '大肠杆菌', source: '测试', note: '需补充金葡菌数据' },
  { metric: '氧气透过', value: '420 cc/m²·d', desc: '包装场景', source: '模拟', note: '需低温复核' },
  { metric: '压差稳定', value: '320 Pa', desc: '过滤场景', source: '模拟', note: '符合安全阈值' },
  { metric: '综合评分', value: 'A-', desc: '多维加权', source: '汇总', note: '可提交评审' }
];

const showTemplate = ref(false);
const showRender = ref(false);
const showShare = ref(false);
const progress = ref(0);
const template = ref('科研评审版');
const highlight = ref('模拟与测试');
const exportType = ref('PDF');
const shareEmail = ref('lab@cnm.com');
let timer;

const renderReport = () => {
  showRender.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 9);
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showRender.value = false), 800);
    }
  }, 250);
};

onBeforeUnmount(() => clearInterval(timer));
</script>
