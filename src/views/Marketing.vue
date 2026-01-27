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
        <h2>营销活动与客户细分</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openFormModal('新建活动')">新建活动</button>
          <button class="btn secondary" type="button" @click="openProgressModal('投放预算复核')">预算复核</button>
          <button class="btn ghost" type="button" @click="openNoticeModal('优惠券策略')">优惠券策略</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>活动名称</th>
              <th>目标客群</th>
              <th>渠道</th>
              <th>投放预算</th>
              <th>转化率</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="campaign in campaigns" :key="campaign.id">
              <td>{{ campaign.name }}</td>
              <td>{{ campaign.segment }}</td>
              <td>{{ campaign.channel }}</td>
              <td>{{ campaign.budget }}</td>
              <td>{{ campaign.conversion }}</td>
              <td>
                <span :class="['status', campaign.statusClass]">{{ campaign.status }}</span>
              </td>
              <td>
                <div class="button-group">
                  <button class="btn secondary" type="button" @click="openFormModal('编辑活动')">编辑</button>
                  <button class="btn" type="button" @click="openNoticeModal('投放监测')">监测</button>
                  <button class="btn ghost" type="button" @click="openProgressModal('暂停投放')">暂停</button>
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
          <label>活动名称</label>
          <input type="text" placeholder="输入活动名称" />
        </div>
        <div>
          <label>目标客群</label>
          <input type="text" placeholder="输入客群描述" />
        </div>
        <div>
          <label>预算额度</label>
          <input type="text" placeholder="输入预算" />
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
  { label: '进行中活动', value: '12', note: '覆盖 8 城市' },
  { label: '优惠券使用率', value: '54%', note: '本月提升 6%' },
  { label: '客户回访', value: '860', note: '高价值客户' },
  { label: '广告ROI', value: '3.8', note: '达标' }
];

const campaigns = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `智慧家居推广${index + 1}`,
  segment: ['新装客户', '老客户复购', '渠道合作', '高端定制'][index % 4],
  channel: ['社媒广告', '线下门店', '短视频', '合作伙伴'][index % 4],
  budget: `¥${(50000 + index * 1500).toLocaleString()}`,
  conversion: `${(2.4 + (index % 5) * 0.6).toFixed(1)}%`,
  status: index % 4 === 0 ? '优化中' : '投放中',
  statusClass: index % 4 === 0 ? 'warning' : ''
}));

const modal = reactive({
  show: false,
  title: '',
  message: '',
  formType: false,
  showProgress: false,
  progress: 66
});

const openFormModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `请完善${action}的活动方案、预算与目标客群。`;
  modal.formType = true;
  modal.showProgress = false;
};

const openProgressModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `正在执行${action}流程，系统将同步投放状态。`;
  modal.formType = false;
  modal.showProgress = true;
  modal.progress = action === '暂停投放' ? 48 : 84;
};

const openNoticeModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `提示：${action}将展示渠道点击率与客户反馈。`;
  modal.formType = false;
  modal.showProgress = false;
};

const closeModal = () => {
  modal.show = false;
};
</script>
