<template>
  <div class="page-container">
    <div class="grid-2" style="margin-bottom: 16px;">
      <div class="card">
        <h3>培训与演练统计分析</h3>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar">
            <span>{{ item.label }}</span>
            <div class="bar" :style="{ '--value': item.value + '%' }"></div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>综合安全指标</h3>
        <div class="grid-3">
          <div class="card">
            <h4>培训覆盖率</h4>
            <p style="font-size: 28px; margin: 8px 0;">96%</p>
            <span class="tag">较上月 +3%</span>
          </div>
          <div class="card">
            <h4>演练达标</h4>
            <p style="font-size: 28px; margin: 8px 0;">89%</p>
            <span class="tag">风险下降</span>
          </div>
          <div class="card">
            <h4>隐患整改</h4>
            <p style="font-size: 28px; margin: 8px 0;">82%</p>
            <span class="tag">需重点跟进</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn primary" @click="openModal('export')">生成综合报告</button>
        <button class="btn" @click="openModal('training')">培训统计</button>
        <button class="btn success" @click="openModal('drill')">演练统计</button>
        <button class="btn warn" @click="openModal('inspection')">隐患统计</button>
        <button class="btn" @click="openModal('tip')">提示信息</button>
        <button class="btn" @click="openModal('progress')">导出进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>报告编号</th>
            <th>报告名称</th>
            <th>统计周期</th>
            <th>负责人</th>
            <th>生成时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.range }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.date }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
            <td>
              <button class="btn" @click="openDetail(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-model="modals.export" title="综合安全报告生成与导出">
    <div class="form-grid">
      <div>
        <label>报告周期</label>
        <select>
          <option>本月</option>
          <option>本季度</option>
          <option>本年度</option>
        </select>
      </div>
      <div>
        <label>导出格式</label>
        <select>
          <option>PDF</option>
          <option>Excel</option>
          <option>PPT</option>
        </select>
      </div>
      <div>
        <label>接收部门</label>
        <input placeholder="管理层" />
      </div>
      <div>
        <label>报告摘要</label>
        <textarea rows="2" placeholder="填写重点摘要"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.export = false">取消</button>
      <button class="btn primary" @click="modals.export = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.training" title="培训统计分析">
    <div class="form-grid">
      <div>
        <label>统计范围</label>
        <select>
          <option>全部培训</option>
          <option>专项培训</option>
        </select>
      </div>
      <div>
        <label>展示维度</label>
        <select>
          <option>部门</option>
          <option>课程</option>
          <option>讲师</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.training = false">关闭</button>
      <button class="btn primary" @click="modals.training = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.drill" title="演练统计分析">
    <div class="form-grid">
      <div>
        <label>演练类型</label>
        <select>
          <option>综合演练</option>
          <option>专项演练</option>
        </select>
      </div>
      <div>
        <label>统计指标</label>
        <select>
          <option>响应时间</option>
          <option>整改闭环</option>
          <option>参演率</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.drill = false">关闭</button>
      <button class="btn primary" @click="modals.drill = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.inspection" title="隐患统计分析">
    <div class="form-grid">
      <div>
        <label>隐患等级</label>
        <select>
          <option>全部</option>
          <option>重大</option>
          <option>一般</option>
        </select>
      </div>
      <div>
        <label>统计方式</label>
        <select>
          <option>区域</option>
          <option>部门</option>
          <option>时间</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.inspection = false">关闭</button>
      <button class="btn primary" @click="modals.inspection = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.tip" title="报告提示">
    <p>本月综合安全报告预计 30 日生成。</p>
    <p>培训与演练统计已覆盖 95% 数据来源。</p>
    <template #footer>
      <button class="btn" @click="modals.tip = false">知道了</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.progress" title="导出进度">
    <p>正在生成综合报告，请稍候。</p>
    <div class="progress">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>当前完成 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="modals.progress = false">后台继续</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.detail" :title="detailTitle">
    <p>{{ detailContent }}</p>
    <template #footer>
      <button class="btn" @click="modals.detail = false">关闭</button>
      <button class="btn primary" @click="modals.detail = false">确定</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '培训完成', value: 92 },
  { label: '演练响应', value: 85 },
  { label: '隐患整改', value: 78 },
  { label: '合规检查', value: 88 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `RP-${300 + index}`,
  name: `安全综合报告 ${index + 1}`,
  range: ['本周', '本月', '本季度'][index % 3],
  owner: ['安全部', '培训部', '综合部'][index % 3],
  date: `2024-09-${(index % 28) + 1}`,
  status: ['已生成', '生成中', '待复核'][index % 3]
}));

const modals = reactive({
  export: false,
  training: false,
  drill: false,
  inspection: false,
  tip: false,
  progress: false,
  detail: false
});

const progress = ref(61);
const detailTitle = ref('报告详情');
const detailContent = ref('');

const openModal = (type) => {
  modals[type] = true;
};

const openDetail = (row) => {
  detailTitle.value = `报告 ${row.id} 详情`;
  detailContent.value = `《${row.name}》统计周期 ${row.range}，由 ${row.owner} 负责生成，状态 ${row.status}。`;
  modals.detail = true;
};
</script>
