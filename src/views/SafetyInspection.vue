<template>
  <div class="page-container">
    <div class="grid-2" style="margin-bottom: 16px;">
      <div class="card">
        <h3>隐患排查覆盖率</h3>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar">
            <span>{{ item.label }}</span>
            <div class="bar" :style="{ '--value': item.value + '%' }"></div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>整改跟踪指标</h3>
        <div class="grid-3">
          <div class="card">
            <h4>本周隐患</h4>
            <p style="font-size: 28px; margin: 8px 0;">28</p>
            <span class="tag">完成 21</span>
          </div>
          <div class="card">
            <h4>整改中</h4>
            <p style="font-size: 28px; margin: 8px 0;">7</p>
            <span class="tag">逾期 1</span>
          </div>
          <div class="card">
            <h4>复查合格</h4>
            <p style="font-size: 28px; margin: 8px 0;">93%</p>
            <span class="tag">风险下降</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn primary" @click="openModal('inspection')">新增巡查</button>
        <button class="btn" @click="openModal('plan')">整改计划</button>
        <button class="btn success" @click="openModal('track')">整改跟踪</button>
        <button class="btn warn" @click="openModal('report')">生成整改报告</button>
        <button class="btn" @click="openModal('tip')">提示信息</button>
        <button class="btn" @click="openModal('progress')">整改进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>隐患编号</th>
            <th>隐患描述</th>
            <th>区域</th>
            <th>发现时间</th>
            <th>责任部门</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.desc }}</td>
            <td>{{ row.area }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.owner }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
            <td>
              <button class="btn" @click="openDetail(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-model="modals.inspection" title="安全隐患巡查与记录">
    <div class="form-grid">
      <div>
        <label>巡查区域</label>
        <input placeholder="厂区A1" />
      </div>
      <div>
        <label>巡查人</label>
        <input placeholder="巡查员姓名" />
      </div>
      <div>
        <label>隐患等级</label>
        <select>
          <option>一般</option>
          <option>较大</option>
          <option>重大</option>
        </select>
      </div>
      <div>
        <label>隐患描述</label>
        <textarea rows="2" placeholder="描述发现的隐患"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.inspection = false">取消</button>
      <button class="btn primary" @click="modals.inspection = false">提交</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.plan" title="隐患整改计划">
    <div class="form-grid">
      <div>
        <label>整改措施</label>
        <input placeholder="整改措施描述" />
      </div>
      <div>
        <label>责任人</label>
        <input placeholder="责任人" />
      </div>
      <div>
        <label>计划完成时间</label>
        <input type="date" />
      </div>
      <div>
        <label>资源需求</label>
        <input placeholder="消防器材更新" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.plan = false">关闭</button>
      <button class="btn primary" @click="modals.plan = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.track" title="隐患整改跟踪">
    <div class="form-grid">
      <div>
        <label>整改状态</label>
        <select>
          <option>进行中</option>
          <option>待复查</option>
          <option>已完成</option>
        </select>
      </div>
      <div>
        <label>复查人</label>
        <input placeholder="复查负责人" />
      </div>
      <div>
        <label>复查结果</label>
        <textarea rows="2" placeholder="填写复查结论"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.track = false">取消</button>
      <button class="btn primary" @click="modals.track = false">提交</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.report" title="隐患整改报告生成">
    <div class="form-grid">
      <div>
        <label>报告周期</label>
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
        <label>接收部门</label>
        <input placeholder="管理层" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.report = false">取消</button>
      <button class="btn primary" @click="modals.report = false">生成</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.tip" title="隐患排查提示">
    <p>重点关注仓库电气线路老化问题，建议安排专项巡检。</p>
    <p>本周逾期整改 1 项，请及时跟进。</p>
    <template #footer>
      <button class="btn" @click="modals.tip = false">知道了</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.progress" title="整改进度更新">
    <p>正在更新整改计划与复查信息。</p>
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
      <button class="btn primary" @click="modals.detail = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '巡检覆盖', value: 88 },
  { label: '问题登记', value: 72 },
  { label: '整改落实', value: 63 },
  { label: '复查闭环', value: 79 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `IN-${200 + index}`,
  desc: `消防隐患问题 ${index + 1}`,
  area: ['仓库A区', '生产车间', '办公楼'][index % 3],
  date: `2024-09-${(index % 28) + 1}`,
  owner: ['设备部', '安全部', '后勤部'][index % 3],
  status: ['整改中', '待复查', '已完成'][index % 3]
}));

const modals = reactive({
  inspection: false,
  plan: false,
  track: false,
  report: false,
  tip: false,
  progress: false,
  detail: false
});

const progress = ref(57);
const detailTitle = ref('隐患详情');
const detailContent = ref('');

const openModal = (type) => {
  modals[type] = true;
};

const openDetail = (row) => {
  detailTitle.value = `隐患 ${row.id} 详情`;
  detailContent.value = `隐患“${row.desc}”发生在 ${row.area}，责任部门 ${row.owner}，当前状态 ${row.status}。`;
  modals.detail = true;
};
</script>
