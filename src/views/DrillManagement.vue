<template>
  <div class="page-container">
    <div class="grid-2" style="margin-bottom: 16px;">
      <div class="card">
        <h3>演练方案推进情况</h3>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar">
            <span>{{ item.label }}</span>
            <div class="bar" :style="{ '--value': item.value + '%' }"></div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>演练组织要点</h3>
        <div class="grid-3">
          <div class="card">
            <h4>本月演练</h4>
            <p style="font-size: 28px; margin: 8px 0;">8</p>
            <span class="tag">审批通过 6</span>
          </div>
          <div class="card">
            <h4>参演人数</h4>
            <p style="font-size: 28px; margin: 8px 0;">412</p>
            <span class="tag">覆盖率 94%</span>
          </div>
          <div class="card">
            <h4>整改建议</h4>
            <p style="font-size: 28px; margin: 8px 0;">15</p>
            <span class="tag">完成率 73%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn primary" @click="openModal('plan')">设计演练方案</button>
        <button class="btn" @click="openModal('approval')">方案审批</button>
        <button class="btn success" @click="openModal('organize')">组织演练</button>
        <button class="btn warn" @click="openModal('record')">记录数据</button>
        <button class="btn" @click="openModal('improve')">改进跟踪</button>
        <button class="btn" @click="openModal('progress')">进度监控</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>演练编号</th>
            <th>演练主题</th>
            <th>方案负责人</th>
            <th>演练时间</th>
            <th>参与部门</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.department }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
            <td>
              <button class="btn" @click="openDetail(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-model="modals.plan" title="演练方案设计">
    <div class="form-grid">
      <div>
        <label>演练主题</label>
        <input placeholder="如：夜间疏散演练" />
      </div>
      <div>
        <label>风险场景</label>
        <input placeholder="仓库起火" />
      </div>
      <div>
        <label>演练区域</label>
        <input placeholder="B栋仓库" />
      </div>
      <div>
        <label>预计时长</label>
        <input placeholder="45分钟" />
      </div>
      <div>
        <label>应急物资</label>
        <input placeholder="灭火器、担架" />
      </div>
      <div>
        <label>注意事项</label>
        <textarea rows="2" placeholder="关键步骤说明"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.plan = false">取消</button>
      <button class="btn primary" @click="modals.plan = false">提交</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.approval" title="演练方案审批">
    <div class="form-grid">
      <div>
        <label>审批人</label>
        <input placeholder="安全主管" />
      </div>
      <div>
        <label>审批结果</label>
        <select>
          <option>通过</option>
          <option>退回修改</option>
        </select>
      </div>
      <div>
        <label>整改要求</label>
        <textarea rows="2" placeholder="填写审批意见"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.approval = false">关闭</button>
      <button class="btn primary" @click="modals.approval = false">确认</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.organize" title="演练组织与参与">
    <div class="form-grid">
      <div>
        <label>参演部门</label>
        <input placeholder="生产部、仓储部" />
      </div>
      <div>
        <label>集合时间</label>
        <input type="datetime-local" />
      </div>
      <div>
        <label>集合地点</label>
        <input placeholder="厂区广场" />
      </div>
      <div>
        <label>联络人</label>
        <input placeholder="值班班长" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.organize = false">取消</button>
      <button class="btn primary" @click="modals.organize = false">发布通知</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.record" title="演练数据记录">
    <div class="form-grid">
      <div>
        <label>响应时间</label>
        <input placeholder="3分20秒" />
      </div>
      <div>
        <label>疏散完成率</label>
        <input placeholder="98%" />
      </div>
      <div>
        <label>问题记录</label>
        <textarea rows="2" placeholder="记录现场发现的问题"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.record = false">关闭</button>
      <button class="btn primary" @click="modals.record = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.improve" title="演练后续改进">
    <div class="form-grid">
      <div>
        <label>改进事项</label>
        <input placeholder="优化疏散路线指示" />
      </div>
      <div>
        <label>责任人</label>
        <input placeholder="安全部" />
      </div>
      <div>
        <label>完成时限</label>
        <input type="date" />
      </div>
      <div>
        <label>跟踪方式</label>
        <select>
          <option>周报</option>
          <option>现场复核</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.improve = false">取消</button>
      <button class="btn primary" @click="modals.improve = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.progress" title="演练评估进度">
    <p>正在整理演练数据并生成评估报告。</p>
    <div class="progress">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>当前完成 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="modals.progress = false">完成后通知</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.detail" :title="detailTitle">
    <p>{{ detailContent }}</p>
    <template #footer>
      <button class="btn" @click="modals.detail = false">关闭</button>
      <button class="btn primary" @click="modals.detail = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '方案设计', value: 78 },
  { label: '审批流程', value: 65 },
  { label: '组织通知', value: 82 },
  { label: '评估复盘', value: 70 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `DR-${2024}${index + 1}`,
  name: `综合演练 ${index + 1}`,
  owner: ['赵负责人', '钱主管', '孙专员'][index % 3],
  time: `2024-09-${(index % 28) + 1} 14:00`,
  department: ['生产部', '仓储部', '后勤部'][index % 3],
  status: ['待审批', '筹备中', '已完成'][index % 3]
}));

const modals = reactive({
  plan: false,
  approval: false,
  organize: false,
  record: false,
  improve: false,
  progress: false,
  detail: false
});

const progress = ref(52);
const detailTitle = ref('演练详情');
const detailContent = ref('');

const openModal = (type) => {
  modals[type] = true;
};

const openDetail = (row) => {
  detailTitle.value = `演练 ${row.id} 详情`;
  detailContent.value = `“${row.name}”由 ${row.owner} 负责，涉及 ${row.department}，计划在 ${row.time} 开展。`;
  modals.detail = true;
};
</script>
