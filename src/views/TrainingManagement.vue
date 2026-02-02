<template>
  <div class="page-container">
    <div class="grid-2" style="margin-bottom: 16px;">
      <div class="card">
        <h3>培训课程进度概览</h3>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar">
            <span>{{ item.label }}</span>
            <div class="bar" :style="{ '--value': item.value + '%' }"></div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>培训质量指标</h3>
        <div class="grid-3">
          <div class="card">
            <h4>本周开课</h4>
            <p style="font-size: 28px; margin: 8px 0;">12</p>
            <span class="tag">完成率 92%</span>
          </div>
          <div class="card">
            <h4>学员参与</h4>
            <p style="font-size: 28px; margin: 8px 0;">386</p>
            <span class="tag">签到率 96%</span>
          </div>
          <div class="card">
            <h4>考试通过</h4>
            <p style="font-size: 28px; margin: 8px 0;">91%</p>
            <span class="tag">满意度 4.7</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn primary" @click="openModal('course')">新建课程</button>
        <button class="btn" @click="openModal('trainee')">新增学员</button>
        <button class="btn success" @click="openModal('assessment')">考核安排</button>
        <button class="btn warn" @click="openModal('report')">生成报告</button>
        <button class="btn" @click="openModal('feedback')">反馈收集</button>
        <button class="btn" @click="openModal('progress')">同步进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>课程编号</th>
            <th>课程名称</th>
            <th>讲师</th>
            <th>计划时间</th>
            <th>参与人数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.teacher }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.attendee }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
            <td>
              <button class="btn" @click="openDetail(row)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-model="modals.course" title="新建培训课程">
    <div class="form-grid">
      <div>
        <label>课程名称</label>
        <input placeholder="请输入课程名称" />
      </div>
      <div>
        <label>讲师</label>
        <input placeholder="选择讲师" />
      </div>
      <div>
        <label>培训地点</label>
        <input placeholder="如：一号培训室" />
      </div>
      <div>
        <label>计划日期</label>
        <input type="date" />
      </div>
      <div>
        <label>参训人数</label>
        <input type="number" placeholder="30" />
      </div>
      <div>
        <label>培训重点</label>
        <input placeholder="如：灭火器使用" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.course = false">取消</button>
      <button class="btn primary" @click="modals.course = false">提交</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.trainee" title="学员管理与考核">
    <div class="form-grid">
      <div>
        <label>学员姓名</label>
        <input placeholder="请输入学员姓名" />
      </div>
      <div>
        <label>部门</label>
        <input placeholder="生产一线" />
      </div>
      <div>
        <label>岗位</label>
        <input placeholder="安全巡检" />
      </div>
      <div>
        <label>考核方式</label>
        <select>
          <option>线上考试</option>
          <option>实操评估</option>
          <option>现场答疑</option>
        </select>
      </div>
      <div>
        <label>成绩目标</label>
        <input placeholder="80分" />
      </div>
      <div>
        <label>备注</label>
        <textarea rows="2" placeholder="补充说明"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.trainee = false">关闭</button>
      <button class="btn primary" @click="modals.trainee = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.assessment" title="培训考核安排">
    <div class="form-grid">
      <div>
        <label>考核批次</label>
        <input placeholder="2024-Q3" />
      </div>
      <div>
        <label>考试时间</label>
        <input type="datetime-local" />
      </div>
      <div>
        <label>考核人</label>
        <input placeholder="指定考核人" />
      </div>
      <div>
        <label>通知范围</label>
        <select>
          <option>全部学员</option>
          <option>未考核学员</option>
          <option>新入职学员</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.assessment = false">取消</button>
      <button class="btn primary" @click="modals.assessment = false">发布</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.report" title="培训记录与报告生成">
    <div class="form-grid">
      <div>
        <label>统计周期</label>
        <select>
          <option>本周</option>
          <option>本月</option>
          <option>本季度</option>
        </select>
      </div>
      <div>
        <label>报告格式</label>
        <select>
          <option>PDF</option>
          <option>Excel</option>
        </select>
      </div>
      <div>
        <label>接收人</label>
        <input placeholder="安全主管" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.report = false">关闭</button>
      <button class="btn primary" @click="modals.report = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.feedback" title="培训评估与反馈">
    <div class="form-grid">
      <div>
        <label>满意度评分</label>
        <select>
          <option>5 - 非常满意</option>
          <option>4 - 满意</option>
          <option>3 - 一般</option>
          <option>2 - 需改进</option>
        </select>
      </div>
      <div>
        <label>改进建议</label>
        <textarea rows="3" placeholder="填写培训改进建议"></textarea>
      </div>
      <div>
        <label>后续培训主题</label>
        <input placeholder="消防设备维护" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.feedback = false">取消</button>
      <button class="btn primary" @click="modals.feedback = false">提交</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.progress" title="培训进度同步">
    <p>正在同步最新培训数据与考核结果。</p>
    <div class="progress">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>当前完成 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="modals.progress = false">后台运行</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.detail" :title="detailTitle">
    <p>{{ detailContent }}</p>
    <template #footer>
      <button class="btn" @click="modals.detail = false">返回</button>
      <button class="btn primary" @click="modals.detail = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '消防器材实操', value: 92 },
  { label: '疏散演练', value: 85 },
  { label: '防火巡检', value: 78 },
  { label: '应急联络', value: 88 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `TR-${2024}${index + 1}`,
  name: `消防安全课程 ${index + 1}`,
  teacher: ['张教官', '王讲师', '李老师'][index % 3],
  time: `2024-09-${(index % 28) + 1} 09:00`,
  attendee: 25 + (index % 10),
  status: ['准备中', '进行中', '已完成'][index % 3]
}));

const modals = reactive({
  course: false,
  trainee: false,
  assessment: false,
  report: false,
  feedback: false,
  progress: false,
  detail: false
});

const progress = ref(68);
const detailTitle = ref('课程详情');
const detailContent = ref('');

const openModal = (type) => {
  modals[type] = true;
};

const openDetail = (row) => {
  detailTitle.value = `课程 ${row.id} 详情`;
  detailContent.value = `课程“${row.name}”由 ${row.teacher} 负责，计划 ${row.time} 开课，预计参与人数 ${row.attendee} 人。`;
  modals.detail = true;
};
</script>
