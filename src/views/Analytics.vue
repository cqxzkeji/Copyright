<template>
  <section>
    <div class="card-grid">
      <div class="card" v-for="item in stats" :key="item.label">
        <h3>{{ item.label }}</h3>
        <div class="value">{{ item.value }}</div>
        <p>{{ item.note }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>销售与库存报表</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openProgressModal('生成报表')">生成报表</button>
          <button class="btn secondary" type="button" @click="openFormModal('KPI设置')">KPI设置</button>
          <button class="btn ghost" type="button" @click="openNoticeModal('数据口径说明')">数据说明</button>
        </div>
      </div>
      <svg class="chart" viewBox="0 0 600 200" preserveAspectRatio="none">
        <polyline
          points="0,160 100,140 200,120 300,90 400,110 500,80 600,60"
          fill="none"
          stroke="#2454ff"
          stroke-width="4"
        />
        <circle cx="300" cy="90" r="6" fill="#7ad7ff" />
        <circle cx="500" cy="80" r="6" fill="#7ad7ff" />
      </svg>
      <div class="table-wrapper" style="margin-top: 16px;">
        <table>
          <thead>
            <tr>
              <th>报表名称</th>
              <th>指标</th>
              <th>本月数值</th>
              <th>环比</th>
              <th>负责人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td>{{ report.name }}</td>
              <td>{{ report.metric }}</td>
              <td>{{ report.value }}</td>
              <td>{{ report.mom }}</td>
              <td>{{ report.owner }}</td>
              <td>
                <span :class="['status', report.statusClass]">{{ report.status }}</span>
              </td>
              <td>
                <div class="button-group">
                  <button class="btn secondary" type="button" @click="openFormModal('查看报表')">查看</button>
                  <button class="btn" type="button" @click="openNoticeModal('指标拆解')">拆解</button>
                  <button class="btn ghost" type="button" @click="openProgressModal('导出PDF')">导出</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.formType" class="form-grid">
        <div>
          <label>指标名称</label>
          <input type="text" placeholder="输入指标名称" />
        </div>
        <div>
          <label>目标值</label>
          <input type="text" placeholder="输入目标值" />
        </div>
        <div>
          <label>负责人</label>
          <input type="text" placeholder="输入负责人" />
        </div>
      </div>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import Modal from '../components/Modal.vue';

const stats = [
  { label: '销售增长率', value: '18.6%', note: '环比 +3.2%' },
  { label: '客单价', value: '¥4,580', note: '高端套装占比提升' },
  { label: '库存周转天数', value: '26天', note: '低于预警线' },
  { label: 'KPI达成率', value: '92%', note: '需提升渠道贡献' }
];

const reports = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `经营分析报表${index + 1}`,
  metric: ['销售额', '利润率', '库存周转', '客户满意度'][index % 4],
  value: ['¥2.3M', '32%', '24天', '89分'][index % 4],
  mom: ['+6%', '+2%', '-3天', '+1分'][index % 4],
  owner: ['李珊', '王凯', '周雨', '刘洋'][index % 4],
  status: index % 4 === 0 ? '待复核' : '已更新',
  statusClass: index % 4 === 0 ? 'warning' : ''
}));

const modal = reactive({
  show: false,
  title: '',
  message: '',
  formType: false,
  showProgress: false,
  progress: 62
});

const openFormModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `请维护${action}的指标范围、周期与负责人。`;
  modal.formType = true;
  modal.showProgress = false;
};

const openProgressModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `正在执行${action}流程，请保持网络畅通。`;
  modal.formType = false;
  modal.showProgress = true;
  modal.progress = action === '导出PDF' ? 46 : 86;
};

const openNoticeModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `提示：${action}将展示关键驱动因子与改进建议。`;
  modal.formType = false;
  modal.showProgress = false;
};

const closeModal = () => {
  modal.show = false;
};
</script>
