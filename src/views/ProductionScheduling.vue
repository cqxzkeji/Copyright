<template>
  <section class="card-grid">
    <div class="card">
      <h3>排产负荷</h3>
      <p>本周产能利用率 87%，关键资源已锁定。</p>
      <div class="chart">
        <div v-for="(value, index) in chartData" :key="index" class="chart-bar" :style="{ height: value + '%' }">
          {{ value }}%
        </div>
      </div>
    </div>
    <div class="card">
      <h3>调度计划</h3>
      <p>优先保障 6 个重点客户交付窗口。</p>
      <div class="action-row">
        <button type="button" @click="openModal('schedule')">生成排产</button>
        <button type="button" class="secondary-button" @click="openModal('resource')">资源调度</button>
        <button type="button" class="secondary-button" @click="openModal('progress')">进度跟踪</button>
      </div>
    </div>
    <div class="card">
      <h3>生产预警</h3>
      <p>2 条产线负荷偏高，建议调整班次。</p>
      <div class="action-row">
        <button type="button" @click="openModal('warning')">查看预警</button>
        <button type="button" class="secondary-button" @click="openModal('tip')">调整提醒</button>
      </div>
    </div>
  </section>

  <section class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>排产单号</th>
          <th>客户</th>
          <th>产品规格</th>
          <th>计划产量(吨)</th>
          <th>开始日期</th>
          <th>负责人</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in schedules" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.customer }}</td>
          <td>{{ item.spec }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.owner }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <ModalDialog :open="activeModal === 'schedule'" title="生成排产计划" @close="closeModal">
    <form>
      <label>
        目标订单
        <input placeholder="选择订单编号" />
      </label>
      <label>
        计划周期
        <select>
          <option>7 天</option>
          <option>14 天</option>
          <option>30 天</option>
        </select>
      </label>
      <label>
        备注
        <textarea placeholder="填写资源约束或交付节点"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">提交排产</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'resource'" title="生产资源调度" @close="closeModal">
    <form>
      <label>
        产线选择
        <select>
          <option>热处理一线</option>
          <option>轧制二线</option>
          <option>精整三线</option>
        </select>
      </label>
      <label>
        调整班次
        <input placeholder="例如：加班 2 小时" />
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">确认调度</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'progress'" title="生产进度跟踪" @close="closeModal">
    <p>当前批次生产完成率 76%，预计按期交付。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 76%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">生成报告</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'warning'" title="生产预警" @close="closeModal">
    <p>轧制二线负荷达到 95%，建议调整班次或分流至三线。</p>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">立即处理</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'tip'" title="提示信息" @close="closeModal">
    <p>排产信息已更新并同步至现场执行人员。</p>
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

const chartData = [70, 86, 78, 92, 64];

const schedules = [
  { id: 'SCH-2001', customer: '华东精密制造', spec: 'QT-80/30mm', qty: 1200, date: '2024-05-18', owner: '韩露', status: '执行中' },
  { id: 'SCH-2002', customer: '北方装备集团', spec: 'NM450/20mm', qty: 980, date: '2024-05-19', owner: '赵洋', status: '待排产' },
  { id: 'SCH-2003', customer: '苏州新能源', spec: 'Q890/16mm', qty: 760, date: '2024-05-20', owner: '周瑶', status: '执行中' },
  { id: 'SCH-2004', customer: '大湾区船舶', spec: 'NR600/25mm', qty: 840, date: '2024-05-20', owner: '杜峰', status: '锁定资源' },
  { id: 'SCH-2005', customer: '西部重工', spec: 'XT500/30mm', qty: 1100, date: '2024-05-21', owner: '史媛', status: '执行中' },
  { id: 'SCH-2006', customer: '长江钢构', spec: 'Q690/22mm', qty: 640, date: '2024-05-22', owner: '秦松', status: '锁定资源' },
  { id: 'SCH-2007', customer: '京津精密部件', spec: 'QT-720/18mm', qty: 520, date: '2024-05-23', owner: '宋卉', status: '执行中' },
  { id: 'SCH-2008', customer: '宁波港机', spec: 'Q960/28mm', qty: 950, date: '2024-05-24', owner: '林鑫', status: '执行中' },
  { id: 'SCH-2009', customer: '成渝轨道', spec: 'CR450/12mm', qty: 680, date: '2024-05-25', owner: '冯雪', status: '待排产' },
  { id: 'SCH-2010', customer: '华南重装', spec: 'NM500/24mm', qty: 900, date: '2024-05-26', owner: '蒋坤', status: '执行中' },
  { id: 'SCH-2011', customer: '合肥动力', spec: 'QT-760/20mm', qty: 720, date: '2024-05-26', owner: '刘澜', status: '锁定资源' },
  { id: 'SCH-2012', customer: '青岛船机', spec: 'NR550/26mm', qty: 830, date: '2024-05-27', owner: '田雅', status: '执行中' },
  { id: 'SCH-2013', customer: '湖南矿机', spec: 'XT550/30mm', qty: 970, date: '2024-05-28', owner: '高杉', status: '执行中' },
  { id: 'SCH-2014', customer: '南京钢构', spec: 'HD700/36mm', qty: 690, date: '2024-05-29', owner: '谢宁', status: '待排产' },
  { id: 'SCH-2015', customer: '深圳精密', spec: 'Q890/14mm', qty: 560, date: '2024-05-30', owner: '袁秋', status: '锁定资源' },
  { id: 'SCH-2016', customer: '厦门港机', spec: 'Q960/26mm', qty: 880, date: '2024-05-30', owner: '郭琪', status: '执行中' },
  { id: 'SCH-2017', customer: '天津轨交', spec: 'CR400/18mm', qty: 640, date: '2024-05-31', owner: '苏兰', status: '执行中' },
  { id: 'SCH-2018', customer: '广西重装', spec: 'NM450/25mm', qty: 780, date: '2024-06-01', owner: '郝晨', status: '待排产' },
  { id: 'SCH-2019', customer: '云南储能', spec: 'Q690/20mm', qty: 720, date: '2024-06-02', owner: '卢娇', status: '执行中' },
  { id: 'SCH-2020', customer: '武汉船机', spec: 'NR600/32mm', qty: 940, date: '2024-06-03', owner: '梅涛', status: '锁定资源' }
];
</script>
