<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>标准制定工作台</h3>
          <p>覆盖起草、评审、发布、修订与作废全流程。</p>
        </div>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('create')">新建标准</button>
          <button class="secondary" type="button" @click="openModal('compare')">版本比对</button>
          <button class="secondary" type="button" @click="openModal('review')">提交评审</button>
          <button class="secondary" type="button" @click="openModal('publish')">发布标准</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>标准编号</th>
              <th>名称</th>
              <th>钢种</th>
              <th>版本</th>
              <th>状态</th>
              <th>责任人</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.grade }}</td>
              <td>{{ row.version }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.updated }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>变更记录追溯</h3>
        <button class="secondary" type="button" @click="openModal('trace')">查看变更轨迹</button>
      </div>
      <ol class="timeline">
        <li v-for="item in timeline" :key="item.id">
          <span class="dot"></span>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </li>
      </ol>
    </section>

    <Modal :show="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <div v-if="modalType === 'create'" class="modal-content">
        <label>
          标准名称
          <input type="text" placeholder="输入标准名称" />
        </label>
        <label>
          钢种类别
          <select>
            <option>合金结构钢</option>
            <option>轴承钢</option>
            <option>弹簧钢</option>
            <option>齿轮钢</option>
          </select>
        </label>
        <label>
          协同角色
          <select>
            <option>技术</option>
            <option>质量</option>
            <option>销售</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'compare'" class="modal-content">
        <p>选择两个版本进行差异比对，系统将自动生成变更摘要。</p>
        <label>
          对比版本 A
          <select>
            <option>V2.4</option>
            <option>V2.3</option>
          </select>
        </label>
        <label>
          对比版本 B
          <select>
            <option>V2.3</option>
            <option>V2.2</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'review'" class="modal-content">
        <p>评审流程已启动，当前进度 68%。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '68%' }"></div>
        </div>
        <label>
          评审意见
          <textarea rows="3" placeholder="填写评审意见"></textarea>
        </label>
      </div>
      <div v-else-if="modalType === 'publish'" class="modal-content">
        <p>请选择发布范围与生效时间。</p>
        <label>
          发布范围
          <select>
            <option>全部销售区域</option>
            <option>重点客户</option>
            <option>内部试运行</option>
          </select>
        </label>
        <label>
          生效时间
          <input type="date" />
        </label>
      </div>
      <div v-else class="modal-content">
        <p>标准 ST-008 变更链路已生成，请选择查看节点。</p>
        <ul>
          <li>起草人：王工（2024-02-10）</li>
          <li>评审人：质量部（2024-02-18）</li>
          <li>发布人：技术总监（2024-02-25）</li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = [
  {
    code: 'SM-001',
    name: '高强度轴类用钢标准',
    grade: '42CrMo',
    version: 'V2.4',
    status: '执行中',
    owner: '李明',
    updated: '2024-03-10'
  },
  {
    code: 'SM-002',
    name: '齿轮钢热处理规范',
    grade: '20CrMnTi',
    version: 'V3.1',
    status: '执行中',
    owner: '周洁',
    updated: '2024-03-08'
  },
  {
    code: 'SM-003',
    name: '弹簧钢性能指标',
    grade: '60Si2Mn',
    version: 'V1.9',
    status: '复审中',
    owner: '张超',
    updated: '2024-03-06'
  },
  {
    code: 'SM-004',
    name: '轴承钢材料标准',
    grade: 'GCr15',
    version: 'V4.2',
    status: '执行中',
    owner: '刘倩',
    updated: '2024-03-05'
  },
  {
    code: 'SM-005',
    name: '耐磨合金钢技术条件',
    grade: '40Cr',
    version: 'V2.0',
    status: '修订中',
    owner: '赵磊',
    updated: '2024-03-03'
  },
  {
    code: 'SM-006',
    name: '冷镦钢控制标准',
    grade: 'ML35',
    version: 'V1.6',
    status: '执行中',
    owner: '王蕾',
    updated: '2024-03-01'
  },
  {
    code: 'SM-007',
    name: '曲轴用钢技术标准',
    grade: '35CrMo',
    version: 'V2.2',
    status: '执行中',
    owner: '张伟',
    updated: '2024-02-28'
  },
  {
    code: 'SM-008',
    name: '电机轴用钢标准',
    grade: '45Cr',
    version: 'V1.7',
    status: '修订中',
    owner: '李倩',
    updated: '2024-02-25'
  },
  {
    code: 'SM-009',
    name: '高韧性螺栓钢规范',
    grade: '30CrMo',
    version: 'V2.1',
    status: '执行中',
    owner: '陈阳',
    updated: '2024-02-22'
  },
  {
    code: 'SM-010',
    name: '高精度齿轮钢标准',
    grade: '20MnCr5',
    version: 'V1.5',
    status: '执行中',
    owner: '吴婷',
    updated: '2024-02-20'
  },
  {
    code: 'SM-011',
    name: '热作模具钢规范',
    grade: 'H13',
    version: 'V3.3',
    status: '复审中',
    owner: '宋洋',
    updated: '2024-02-18'
  },
  {
    code: 'SM-012',
    name: '高温合金钢标准',
    grade: '15CrMo',
    version: 'V2.0',
    status: '执行中',
    owner: '邓敏',
    updated: '2024-02-16'
  },
  {
    code: 'SM-013',
    name: '连铸坯钢种标准',
    grade: '20CrNiMo',
    version: 'V1.4',
    status: '执行中',
    owner: '黄俊',
    updated: '2024-02-14'
  },
  {
    code: 'SM-014',
    name: '高速轴承钢规范',
    grade: 'M50',
    version: 'V1.8',
    status: '修订中',
    owner: '唐琳',
    updated: '2024-02-12'
  },
  {
    code: 'SM-015',
    name: '高压齿轮钢规范',
    grade: '18CrNiMo7-6',
    version: 'V2.6',
    status: '执行中',
    owner: '徐航',
    updated: '2024-02-10'
  },
  {
    code: 'SM-016',
    name: '工程机械用钢标准',
    grade: '30CrNiMo8',
    version: 'V1.3',
    status: '执行中',
    owner: '何亮',
    updated: '2024-02-08'
  },
  {
    code: 'SM-017',
    name: '耐磨板材用钢规范',
    grade: 'NM400',
    version: 'V1.5',
    status: '执行中',
    owner: '孙悦',
    updated: '2024-02-06'
  },
  {
    code: 'SM-018',
    name: '海工用钢标准',
    grade: 'EH36',
    version: 'V2.2',
    status: '复审中',
    owner: '周磊',
    updated: '2024-02-04'
  },
  {
    code: 'SM-019',
    name: '重载车轴钢规范',
    grade: '25Cr2MoV',
    version: 'V1.9',
    status: '执行中',
    owner: '杨倩',
    updated: '2024-02-02'
  },
  {
    code: 'SM-020',
    name: '耐低温钢标准',
    grade: '09MnNiD',
    version: 'V1.2',
    status: '执行中',
    owner: '陆峰',
    updated: '2024-01-30'
  },
  {
    code: 'SM-021',
    name: '优特钢交付规范',
    grade: '50CrV',
    version: 'V2.5',
    status: '执行中',
    owner: '梁婷',
    updated: '2024-01-28'
  },
  {
    code: 'SM-022',
    name: '高洁净度钢标准',
    grade: '20Cr2Ni4A',
    version: 'V1.6',
    status: '修订中',
    owner: '范阳',
    updated: '2024-01-26'
  }
];

const timeline = [
  {
    id: 1,
    title: 'ST-008 版本修订启动',
    desc: '销售提出冷拔尺寸调整需求，进入标准修订流程。'
  },
  {
    id: 2,
    title: 'ST-004 评审完成',
    desc: '质量部完成材质检验项复核，待发布。'
  },
  {
    id: 3,
    title: 'ST-012 发布提醒',
    desc: '预计下周五发布，需完成内部培训。'
  }
];

const modalVisible = ref(false);
const modalType = ref('');
const modalTitle = ref('');

const titles = {
  create: '新建标准',
  compare: '版本比对',
  review: '提交评审',
  publish: '发布标准',
  trace: '变更记录追溯'
};

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value = titles[type];
  modalVisible.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary,
.secondary {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: white;
}

.secondary {
  background: #e0e7ff;
  color: #1e3a8a;
}

.table-wrapper {
  overflow-x: auto;
}

th,
 td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  font-size: 14px;
}

th {
  background: #f8fafc;
  color: #475569;
}

.timeline {
  list-style: none;
  display: grid;
  gap: 12px;
}

.timeline li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.timeline .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2563eb;
  margin-top: 6px;
}

.modal-content {
  display: grid;
  gap: 12px;
}

.modal-content label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select,
textarea {
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 8px 10px;
}

.progress {
  width: 100%;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #14b8a6);
}
</style>
