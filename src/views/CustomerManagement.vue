<template>
  <section class="card-grid">
    <div class="card">
      <h3>客户总量</h3>
      <p>本月新增 36 家重点客户，续签率 91%。</p>
      <div class="chart">
        <div v-for="(value, index) in chartData" :key="index" class="chart-bar" :style="{ height: value + '%' }">
          {{ value }}%
        </div>
      </div>
    </div>
    <div class="card">
      <h3>匹配建议</h3>
      <p>已生成 12 份优特钢匹配方案，等待确认 4 份。</p>
      <div class="action-row">
        <button type="button" @click="openModal('newCustomer')">新增客户</button>
        <button type="button" class="secondary-button" @click="openModal('matchPlan')">快速匹配</button>
        <button type="button" class="secondary-button" @click="openModal('communication')">沟通记录</button>
      </div>
    </div>
    <div class="card">
      <h3>定制跟踪</h3>
      <p>15 个客户进入定制需求澄清阶段。</p>
      <div class="action-row">
        <button type="button" @click="openModal('tracking')">需求跟踪</button>
        <button type="button" class="secondary-button" @click="openModal('crmSync')">同步CRM</button>
      </div>
    </div>
  </section>

  <section class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>客户编号</th>
          <th>企业名称</th>
          <th>主要行业</th>
          <th>需求等级</th>
          <th>匹配方案</th>
          <th>负责人</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in customers" :key="client.id">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.industry }}</td>
          <td>{{ client.level }}</td>
          <td>{{ client.plan }}</td>
          <td>{{ client.owner }}</td>
          <td><span class="status-pill">{{ client.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <ModalDialog :open="activeModal === 'newCustomer'" title="新增客户资料" @close="closeModal">
    <form>
      <label>
        客户名称
        <input placeholder="例如：华东精密制造" />
      </label>
      <label>
        需求重点
        <input placeholder="例如：高强度耐磨钢" />
      </label>
      <label>
        预估年需求量（吨）
        <input type="number" placeholder="5000" />
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">保存客户</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'matchPlan'" title="生成匹配方案" @close="closeModal">
    <form>
      <label>
        目标客户
        <input placeholder="请选择客户" />
      </label>
      <label>
        需求描述
        <textarea placeholder="输入客户应用场景与性能要求"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('progress')">开始匹配</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'communication'" title="沟通记录同步" @close="closeModal">
    <form>
      <label>
        会议主题
        <input placeholder="填写沟通主题" />
      </label>
      <label>
        结论摘要
        <textarea placeholder="填写沟通结论"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">保存记录</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'tracking'" title="定制需求跟踪" @close="closeModal">
    <form>
      <label>
        需求阶段
        <select>
          <option>需求澄清</option>
          <option>方案确认</option>
          <option>试样验证</option>
        </select>
      </label>
      <label>
        风险提示
        <textarea placeholder="填写潜在风险或资源瓶颈"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">更新跟踪</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'crmSync'" title="CRM同步进度" @close="closeModal">
    <p>正在同步最新客户资料，请稍候。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 68%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">完成同步</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'progress'" title="方案匹配进度" @close="closeModal">
    <p>系统正在计算最佳优特钢产品组合与性能指标。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 82%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">生成报告</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'tip'" title="操作提示" @close="closeModal">
    <p>信息已保存并同步至客户中心，请继续下一步操作。</p>
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

const chartData = [65, 80, 55, 72, 90];

const customers = [
  { id: 'CUS-001', name: '华东精密制造', industry: '轨道交通', level: 'A级', plan: 'QT-80方案', owner: '刘杰', status: '跟进中' },
  { id: 'CUS-002', name: '北方装备集团', industry: '工程机械', level: 'S级', plan: '耐磨钢X2', owner: '陈慧', status: '待确认' },
  { id: 'CUS-003', name: '苏州新能源', industry: '新能源', level: 'A级', plan: '高强钢P3', owner: '张晗', status: '方案确认' },
  { id: 'CUS-004', name: '大湾区船舶', industry: '船舶制造', level: 'B级', plan: '耐蚀钢C5', owner: '孙阳', status: '试样验证' },
  { id: 'CUS-005', name: '西部重工', industry: '矿山机械', level: 'A级', plan: '高韧钢T7', owner: '郑娜', status: '跟进中' },
  { id: 'CUS-006', name: '长江钢构', industry: '建筑', level: 'B级', plan: '耐候钢W4', owner: '魏浩', status: '需求澄清' },
  { id: 'CUS-007', name: '京津精密部件', industry: '汽车零部件', level: 'A级', plan: '热处理钢H6', owner: '吴宁', status: '待确认' },
  { id: 'CUS-008', name: '宁波港机', industry: '港口设备', level: 'S级', plan: '高强钢P5', owner: '李航', status: '跟进中' },
  { id: 'CUS-009', name: '成渝轨道', industry: '轨道交通', level: 'A级', plan: 'QT-90方案', owner: '周琳', status: '方案确认' },
  { id: 'CUS-010', name: '华南重装', industry: '工程机械', level: 'B级', plan: '耐磨钢X3', owner: '许媛', status: '试样验证' },
  { id: 'CUS-011', name: '合肥动力', industry: '新能源', level: 'A级', plan: '高强钢P2', owner: '曾黎', status: '跟进中' },
  { id: 'CUS-012', name: '青岛船机', industry: '船舶制造', level: 'A级', plan: '耐蚀钢C7', owner: '金敏', status: '方案确认' },
  { id: 'CUS-013', name: '湖南矿机', industry: '矿山机械', level: 'B级', plan: '高韧钢T4', owner: '宋迪', status: '需求澄清' },
  { id: 'CUS-014', name: '南京钢构', industry: '建筑', level: 'A级', plan: '耐候钢W5', owner: '罗倩', status: '跟进中' },
  { id: 'CUS-015', name: '深圳精密', industry: '汽车零部件', level: 'S级', plan: '热处理钢H9', owner: '高源', status: '待确认' },
  { id: 'CUS-016', name: '厦门港机', industry: '港口设备', level: 'A级', plan: '高强钢P4', owner: '潘晨', status: '方案确认' },
  { id: 'CUS-017', name: '天津轨交', industry: '轨道交通', level: 'B级', plan: 'QT-70方案', owner: '杜明', status: '试样验证' },
  { id: 'CUS-018', name: '广西重装', industry: '工程机械', level: 'A级', plan: '耐磨钢X5', owner: '夏彤', status: '跟进中' },
  { id: 'CUS-019', name: '云南储能', industry: '新能源', level: 'A级', plan: '高强钢P6', owner: '莫凡', status: '方案确认' },
  { id: 'CUS-020', name: '武汉船机', industry: '船舶制造', level: 'B级', plan: '耐蚀钢C4', owner: '程星', status: '需求澄清' }
];
</script>
