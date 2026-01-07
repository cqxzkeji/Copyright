<template>
  <section class="card-grid">
    <div class="card">
      <h3>报价执行</h3>
      <p>本周生成报价单 23 份，合同确认率 78%。</p>
      <div class="chart">
        <div v-for="(value, index) in chartData" :key="index" class="chart-bar" :style="{ height: value + '%' }">
          {{ value }}%
        </div>
      </div>
    </div>
    <div class="card">
      <h3>订单审批</h3>
      <p>待审批 9 项订单，重点关注高毛利项目。</p>
      <div class="action-row">
        <button type="button" @click="openModal('newQuote')">生成报价</button>
        <button type="button" class="secondary-button" @click="openModal('discount')">折扣策略</button>
        <button type="button" class="secondary-button" @click="openModal('contract')">合同管理</button>
      </div>
    </div>
    <div class="card">
      <h3>执行跟踪</h3>
      <p>订单履行率 92%，发运排期稳定。</p>
      <div class="action-row">
        <button type="button" @click="openModal('approval')">审批流转</button>
        <button type="button" class="secondary-button" @click="openModal('tip')">订单提醒</button>
      </div>
    </div>
  </section>

  <section class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>订单编号</th>
          <th>客户名称</th>
          <th>产品方案</th>
          <th>报价金额(万元)</th>
          <th>折扣</th>
          <th>负责人</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ order.plan }}</td>
          <td>{{ order.price }}</td>
          <td>{{ order.discount }}</td>
          <td>{{ order.owner }}</td>
          <td><span class="status-pill">{{ order.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <ModalDialog :open="activeModal === 'newQuote'" title="生成报价单" @close="closeModal">
    <form>
      <label>
        客户名称
        <input placeholder="选择客户" />
      </label>
      <label>
        报价方案
        <input placeholder="输入方案名称" />
      </label>
      <label>
        备注说明
        <textarea placeholder="填写关键交付条件"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('progress')">提交报价</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'discount'" title="折扣策略设置" @close="closeModal">
    <form>
      <label>
        订单类型
        <select>
          <option>战略客户</option>
          <option>年度框架</option>
          <option>现货订单</option>
        </select>
      </label>
      <label>
        折扣比例(%)
        <input type="number" placeholder="5" />
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">保存策略</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'contract'" title="合同管理" @close="closeModal">
    <form>
      <label>
        合同编号
        <input placeholder="输入合同编号" />
      </label>
      <label>
        合同条款
        <textarea placeholder="填写交付与付款条款"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">保存合同</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'approval'" title="订单审批进度" @close="closeModal">
    <p>订单正在流转审批，预计 2 小时内完成。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 70%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">发送提醒</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'progress'" title="报价生成进度" @close="closeModal">
    <p>系统正在生成报价单并同步合同模板。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 88%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">查看报价</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'tip'" title="提示信息" @close="closeModal">
    <p>报价信息已更新并发送给客户负责人。</p>
    <div class="action-row" style="margin-top:16px;">
      <button type="button" class="primary-button" @click="closeModal">确定</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const activeModal = ref('');

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const chartData = [62, 81, 73, 68, 90];

const orders = [
  { id: 'ORD-1001', customer: '华东精密制造', plan: 'QT-80方案', price: '320', discount: '4%', owner: '刘杰', status: '审批中' },
  { id: 'ORD-1002', customer: '北方装备集团', plan: '耐磨钢X2', price: '410', discount: '6%', owner: '陈慧', status: '待确认' },
  { id: 'ORD-1003', customer: '苏州新能源', plan: '高强钢P3', price: '275', discount: '3%', owner: '张晗', status: '合同草拟' },
  { id: 'ORD-1004', customer: '大湾区船舶', plan: '耐蚀钢C5', price: '360', discount: '5%', owner: '孙阳', status: '审批中' },
  { id: 'ORD-1005', customer: '西部重工', plan: '高韧钢T7', price: '298', discount: '4%', owner: '郑娜', status: '报价确认' },
  { id: 'ORD-1006', customer: '长江钢构', plan: '耐候钢W4', price: '210', discount: '2%', owner: '魏浩', status: '合同草拟' },
  { id: 'ORD-1007', customer: '京津精密部件', plan: '热处理钢H6', price: '185', discount: '2%', owner: '吴宁', status: '报价确认' },
  { id: 'ORD-1008', customer: '宁波港机', plan: '高强钢P5', price: '440', discount: '6%', owner: '李航', status: '审批中' },
  { id: 'ORD-1009', customer: '成渝轨道', plan: 'QT-90方案', price: '330', discount: '4%', owner: '周琳', status: '待确认' },
  { id: 'ORD-1010', customer: '华南重装', plan: '耐磨钢X3', price: '315', discount: '5%', owner: '许媛', status: '报价确认' },
  { id: 'ORD-1011', customer: '合肥动力', plan: '高强钢P2', price: '260', discount: '3%', owner: '曾黎', status: '合同草拟' },
  { id: 'ORD-1012', customer: '青岛船机', plan: '耐蚀钢C7', price: '355', discount: '4%', owner: '金敏', status: '审批中' },
  { id: 'ORD-1013', customer: '湖南矿机', plan: '高韧钢T4', price: '240', discount: '3%', owner: '宋迪', status: '报价确认' },
  { id: 'ORD-1014', customer: '南京钢构', plan: '耐候钢W5', price: '195', discount: '2%', owner: '罗倩', status: '合同草拟' },
  { id: 'ORD-1015', customer: '深圳精密', plan: '热处理钢H9', price: '420', discount: '5%', owner: '高源', status: '审批中' },
  { id: 'ORD-1016', customer: '厦门港机', plan: '高强钢P4', price: '310', discount: '4%', owner: '潘晨', status: '报价确认' },
  { id: 'ORD-1017', customer: '天津轨交', plan: 'QT-70方案', price: '225', discount: '3%', owner: '杜明', status: '待确认' },
  { id: 'ORD-1018', customer: '广西重装', plan: '耐磨钢X5', price: '335', discount: '4%', owner: '夏彤', status: '合同草拟' },
  { id: 'ORD-1019', customer: '云南储能', plan: '高强钢P6', price: '305', discount: '3%', owner: '莫凡', status: '报价确认' },
  { id: 'ORD-1020', customer: '武汉船机', plan: '耐蚀钢C4', price: '280', discount: '3%', owner: '程星', status: '审批中' }
];
</script>
