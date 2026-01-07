<template>
  <div class="section">
    <div class="section-title">报告与通知概览</div>
    <div class="card-grid">
      <div class="card">
        <h3>已生成报告</h3>
        <p>{{ stats.reports }} 份</p>
      </div>
      <div class="card">
        <h3>质量反馈</h3>
        <p>{{ stats.quality }} 条</p>
      </div>
      <div class="card">
        <h3>待通知事项</h3>
        <p>{{ stats.alerts }} 项</p>
      </div>
      <div class="card">
        <h3>准时提醒率</h3>
        <p>{{ stats.timely }}%</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">通知发送趋势</div>
    <div class="chart">
      <div v-for="item in chart" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">报告与通知操作</div>
    <div class="button-row">
      <button class="btn" type="button" @click="openModal('report')">生成报告</button>
      <button class="btn secondary" type="button" @click="openModal('quality')">质量进度</button>
      <button class="btn ghost" type="button" @click="openModal('notify')">发送通知</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">报告清单</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>报告名称</th>
            <th>类型</th>
            <th>生成时间</th>
            <th>负责人</th>
            <th>状态</th>
            <th>通知对象</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reports" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.target }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'report'" title="生成销售报告" @close="activeModal = ''">
    <form>
      <div>
        <label>报告类型</label>
        <select>
          <option>月度销售报告</option>
          <option>产品质量报告</option>
          <option>客户跟进报告</option>
        </select>
      </div>
      <div>
        <label>覆盖时间</label>
        <input type="text" placeholder="例如 2024-08-01 至 2024-08-31" />
      </div>
      <div>
        <label>备注</label>
        <textarea rows="3" placeholder="输入报告说明"></textarea>
      </div>
      <div class="button-row">
        <button class="btn" type="button">生成并发送</button>
        <button class="btn ghost" type="button" @click="activeModal = ''">取消</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'quality'" title="质量报告进度" @close="activeModal = ''">
    <p style="margin-top: 0;">正在汇总产品质量巡检数据。</p>
    <div class="progress-bar">
      <span style="width: 67%;"></span>
    </div>
    <p style="margin: 12px 0 0; color: var(--muted);">已完成 67%，预计 45 秒完成。</p>
  </BaseModal>

  <BaseModal v-if="activeModal === 'notify'" title="发送通知" @close="activeModal = ''">
    <p style="margin-top: 0;">已向销售、技术与生产团队发送通知提醒。</p>
    <button class="btn" type="button" @click="activeModal = ''">确认</button>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = {
  reports: 28,
  quality: 14,
  alerts: 9,
  timely: 96
};

const chart = [
  { label: '周一', value: 40 },
  { label: '周二', value: 58 },
  { label: '周三', value: 62 },
  { label: '周四', value: 48 },
  { label: '周五', value: 70 },
  { label: '周六', value: 52 }
];

const reports = [
  { name: '8月销售日报', type: '销售', date: '2024-08-21', owner: '李娜', status: '已发送', target: '管理层' },
  { name: '8月质量巡检', type: '质量', date: '2024-08-21', owner: '周博', status: '已发送', target: '技术团队' },
  { name: '重点客户跟进', type: '客户', date: '2024-08-20', owner: '张凯', status: '待发送', target: '销售团队' },
  { name: '订单交付周报', type: '交付', date: '2024-08-20', owner: '王杰', status: '已发送', target: '生产团队' },
  { name: '产品稳定性分析', type: '质量', date: '2024-08-19', owner: '刘欣', status: '已发送', target: '质量中心' },
  { name: '客户满意度报告', type: '客户', date: '2024-08-19', owner: '陈伟', status: '待发送', target: '管理层' },
  { name: '交付风险预警', type: '预警', date: '2024-08-18', owner: '许晨', status: '已发送', target: '物流团队' },
  { name: '库存消耗分析', type: '运营', date: '2024-08-18', owner: '赵倩', status: '已发送', target: '采购部' },
  { name: '8月客户回款', type: '财务', date: '2024-08-17', owner: '韩宇', status: '待发送', target: '财务部' },
  { name: '定制方案汇总', type: '技术', date: '2024-08-17', owner: '宋扬', status: '已发送', target: '技术团队' },
  { name: '高强钢销量统计', type: '销售', date: '2024-08-16', owner: '蒋宁', status: '已发送', target: '营销中心' },
  { name: '工艺改进建议', type: '技术', date: '2024-08-16', owner: '叶青', status: '已发送', target: '研发中心' },
  { name: '订单履约盘点', type: '运营', date: '2024-08-15', owner: '沈毅', status: '待发送', target: '供应链' },
  { name: '客户需求洞察', type: '客户', date: '2024-08-15', owner: '杜航', status: '已发送', target: '销售团队' },
  { name: '售后反馈分析', type: '服务', date: '2024-08-14', owner: '冯雪', status: '已发送', target: '服务中心' },
  { name: '重点项目进度', type: '项目', date: '2024-08-14', owner: '丁敏', status: '待发送', target: '项目组' },
  { name: '应急库存报告', type: '运营', date: '2024-08-13', owner: '吕明', status: '已发送', target: '仓储中心' },
  { name: '产品合格率追踪', type: '质量', date: '2024-08-13', owner: '郭超', status: '已发送', target: '质量中心' },
  { name: '订单响应效率', type: '运营', date: '2024-08-12', owner: '潘悦', status: '已发送', target: '运营中心' },
  { name: '交付异常处理', type: '预警', date: '2024-08-12', owner: '邵鹏', status: '待发送', target: '物流团队' }
];

const activeModal = ref('');

const openModal = (name) => {
  activeModal.value = name;
};
</script>
