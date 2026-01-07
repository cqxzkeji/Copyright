<template>
  <section class="card-grid">
    <div class="card">
      <h3>售后响应</h3>
      <p>本月处理 28 个售后工单，平均响应 2.4 小时。</p>
      <div class="chart">
        <div v-for="(value, index) in chartData" :key="index" class="chart-bar" :style="{ height: value + '%' }">
          {{ value }}%
        </div>
      </div>
    </div>
    <div class="card">
      <h3>质量追溯</h3>
      <p>已完成 16 批次质量追溯，风险闭环率 96%。</p>
      <div class="action-row">
        <button type="button" @click="openModal('service')">新增售后</button>
        <button type="button" class="secondary-button" @click="openModal('trace')">质量追溯</button>
        <button type="button" class="secondary-button" @click="openModal('inspection')">检验记录</button>
      </div>
    </div>
    <div class="card">
      <h3>满意度反馈</h3>
      <p>满意度均分 4.6 / 5，重点客户持续提升。</p>
      <div class="action-row">
        <button type="button" @click="openModal('survey')">发起调查</button>
        <button type="button" class="secondary-button" @click="openModal('tip')">反馈总结</button>
      </div>
    </div>
  </section>

  <section class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>工单编号</th>
          <th>客户</th>
          <th>问题类型</th>
          <th>关联批次</th>
          <th>处理方式</th>
          <th>负责人</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tickets" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.customer }}</td>
          <td>{{ item.issue }}</td>
          <td>{{ item.batch }}</td>
          <td>{{ item.action }}</td>
          <td>{{ item.owner }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <ModalDialog :open="activeModal === 'service'" title="新增售后工单" @close="closeModal">
    <form>
      <label>
        客户名称
        <input placeholder="输入客户名称" />
      </label>
      <label>
        问题描述
        <textarea placeholder="填写问题详情"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">提交工单</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'trace'" title="质量追溯" @close="closeModal">
    <form>
      <label>
        批次编号
        <input placeholder="输入批次编号" />
      </label>
      <label>
        追溯原因
        <textarea placeholder="填写追溯原因"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('progress')">开始追溯</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'inspection'" title="检验记录" @close="closeModal">
    <form>
      <label>
        检验项目
        <input placeholder="例如：硬度、冲击" />
      </label>
      <label>
        检验结论
        <textarea placeholder="填写检验结论"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">保存记录</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'survey'" title="满意度调查" @close="closeModal">
    <form>
      <label>
        调查对象
        <input placeholder="输入客户名称" />
      </label>
      <label>
        调查内容
        <textarea placeholder="填写调查内容"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">发送调查</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'progress'" title="质量追溯进度" @close="closeModal">
    <p>系统正在匹配原材料、工艺与检验记录。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 79%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">生成报告</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'tip'" title="提示信息" @close="closeModal">
    <p>反馈已更新并同步至质量中心。</p>
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

const chartData = [74, 88, 69, 92, 81];

const tickets = [
  { id: 'SRV-3001', customer: '华东精密制造', issue: '耐磨不足', batch: 'B-240510', action: '更换批次', owner: '吕萌', status: '处理中' },
  { id: 'SRV-3002', customer: '北方装备集团', issue: '表面缺陷', batch: 'B-240511', action: '补充检验', owner: '梁青', status: '已受理' },
  { id: 'SRV-3003', customer: '苏州新能源', issue: '性能波动', batch: 'B-240512', action: '工艺复核', owner: '康琪', status: '已关闭' },
  { id: 'SRV-3004', customer: '大湾区船舶', issue: '尺寸偏差', batch: 'B-240513', action: '现场指导', owner: '袁雪', status: '处理中' },
  { id: 'SRV-3005', customer: '西部重工', issue: '交付延迟', batch: 'B-240514', action: '排产调整', owner: '郑瑾', status: '已受理' },
  { id: 'SRV-3006', customer: '长江钢构', issue: '焊接性能', batch: 'B-240515', action: '追加试验', owner: '蒋峰', status: '处理中' },
  { id: 'SRV-3007', customer: '京津精密部件', issue: '硬度偏低', batch: 'B-240516', action: '工艺复核', owner: '彭璐', status: '已关闭' },
  { id: 'SRV-3008', customer: '宁波港机', issue: '冲击韧性', batch: 'B-240517', action: '追加检验', owner: '于莎', status: '处理中' },
  { id: 'SRV-3009', customer: '成渝轨道', issue: '表面裂纹', batch: 'B-240518', action: '现场复查', owner: '景然', status: '已受理' },
  { id: 'SRV-3010', customer: '华南重装', issue: '耐蚀需求', batch: 'B-240519', action: '方案调整', owner: '段凯', status: '处理中' },
  { id: 'SRV-3011', customer: '合肥动力', issue: '强度偏差', batch: 'B-240520', action: '工艺复核', owner: '卢梅', status: '已关闭' },
  { id: 'SRV-3012', customer: '青岛船机', issue: '检测报告', batch: 'B-240521', action: '补充报告', owner: '白鑫', status: '已受理' },
  { id: 'SRV-3013', customer: '湖南矿机', issue: '耐磨不足', batch: 'B-240522', action: '补充检验', owner: '孙乔', status: '处理中' },
  { id: 'SRV-3014', customer: '南京钢构', issue: '尺寸偏差', batch: 'B-240523', action: '现场指导', owner: '林芝', status: '已关闭' },
  { id: 'SRV-3015', customer: '深圳精密', issue: '交付延迟', batch: 'B-240524', action: '排产调整', owner: '谭越', status: '处理中' },
  { id: 'SRV-3016', customer: '厦门港机', issue: '焊接性能', batch: 'B-240525', action: '追加试验', owner: '曹露', status: '已受理' },
  { id: 'SRV-3017', customer: '天津轨交', issue: '硬度偏低', batch: 'B-240526', action: '工艺复核', owner: '李滨', status: '已关闭' },
  { id: 'SRV-3018', customer: '广西重装', issue: '表面缺陷', batch: 'B-240527', action: '补充检验', owner: '霍伟', status: '处理中' },
  { id: 'SRV-3019', customer: '云南储能', issue: '性能波动', batch: 'B-240528', action: '方案调整', owner: '庞悦', status: '已受理' },
  { id: 'SRV-3020', customer: '武汉船机', issue: '冲击韧性', batch: 'B-240529', action: '追加检验', owner: '秦文', status: '处理中' }
];
</script>
