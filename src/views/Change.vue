<template>
  <div class="page">
    <div class="grid overview" :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }">
      <div class="card overview-card">
        <h3>设计变更</h3>
        <p>本月新增变更 8 项，已关闭 5 项。</p>
        <div class="overview-actions">
          <button class="primary" type="button" @click="openModal('change')">发起变更</button>
          <button class="ghost" type="button" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="card overview-card">
        <h3>归档进度</h3>
        <p>已归档文档 64 份，完成度 92%。</p>
        <div class="progress-bar"><span :style="{ width: '92%' }"></span></div>
        <button class="ghost" type="button" @click="openModal('progress')">查看进度</button>
      </div>
      <div class="card overview-card">
        <h3>文档发布示意</h3>
        <img class="overview-image" src="/src/assets/seat-diagram.svg" alt="文档发布示意" />
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>变更与归档记录</h3>
          <p>追踪设计变更与文档发布状态。</p>
        </div>
        <div class="table-actions">
          <button class="ghost" type="button" @click="openModal('publish')">发布文档</button>
          <button class="primary" type="button" @click="openModal('archive')">归档记录</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>变更内容</th>
            <th>影响范围</th>
            <th>责任人</th>
            <th>发布日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in changes" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.scope }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.date }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'change'">
        <div class="input-group">
          <label>变更主题</label>
          <input v-model="form.title" placeholder="如：调整头枕泡沫密度" />
        </div>
        <div class="input-group">
          <label>影响范围</label>
          <select v-model="form.scope">
            <option>座垫</option>
            <option>靠背</option>
            <option>滑轨</option>
            <option>内饰面套</option>
          </select>
        </div>
        <div class="input-group">
          <label>变更原因</label>
          <textarea v-model="form.reason" rows="3" placeholder="填写变更原因"></textarea>
        </div>
      </template>
      <template v-else-if="activeModal === 'publish'">
        <div class="input-group">
          <label>文档名称</label>
          <input v-model="form.doc" placeholder="如：座椅BOM v2" />
        </div>
        <div class="input-group">
          <label>发布说明</label>
          <textarea v-model="form.publishNote" rows="3" placeholder="填写发布说明"></textarea>
        </div>
      </template>
      <template v-else-if="activeModal === 'archive'">
        <p>归档将同步最新变更记录与验证报告。</p>
        <div class="input-group">
          <label>归档批次</label>
          <input v-model="form.archiveBatch" placeholder="如：AR-2024-09" />
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>归档完成度 92%，剩余文档集中在仿真报告与供应商审核记录。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: '92%' }"></span>
        </div>
      </template>
      <template v-else-if="activeModal === 'tips'">
        <ul>
          <li>变更发起后需关联需求与验证记录。</li>
          <li>发布文档前请完成审批流程。</li>
          <li>归档批次建议与里程碑节点一致。</li>
        </ul>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const changes = [
  { code: 'C-001', title: '调整座垫泡沫密度', scope: '座垫', owner: '李欣', date: '2024-08-12', status: '已发布' },
  { code: 'C-002', title: '优化滑轨防腐涂层', scope: '滑轨', owner: '王凯', date: '2024-08-15', status: '审批中' },
  { code: 'C-003', title: '更新头枕结构加强件', scope: '靠背', owner: '陈昕', date: '2024-08-18', status: '已发布' },
  { code: 'C-004', title: '更换座椅面套材质', scope: '内饰面套', owner: '刘雅', date: '2024-08-21', status: '已发布' },
  { code: 'C-005', title: '调整腰托机构供应商', scope: '靠背', owner: '周晨', date: '2024-08-23', status: '审批中' },
  { code: 'C-006', title: '升级加热垫功率', scope: '座垫', owner: '林涛', date: '2024-08-25', status: '已发布' },
  { code: 'C-007', title: '新增通风模块滤网', scope: '座垫', owner: '孙悦', date: '2024-08-27', status: '已发布' },
  { code: 'C-008', title: '调整滑轨行程', scope: '滑轨', owner: '郭明', date: '2024-08-29', status: '已发布' },
  { code: 'C-009', title: '优化侧翼支撑角度', scope: '靠背', owner: '许婷', date: '2024-09-01', status: '审批中' },
  { code: 'C-010', title: '升级座椅控制线束', scope: '座垫', owner: '韩飞', date: '2024-09-03', status: '已发布' },
  { code: 'C-011', title: '调整扶手结构', scope: '内饰面套', owner: '郑鹏', date: '2024-09-05', status: '已发布' },
  { code: 'C-012', title: '更新滑轨耐久标准', scope: '滑轨', owner: '段慧', date: '2024-09-06', status: '审批中' },
  { code: 'C-013', title: '修改头枕锁止力', scope: '靠背', owner: '张森', date: '2024-09-07', status: '已发布' },
  { code: 'C-014', title: '提升座垫舒适层', scope: '座垫', owner: '孔娜', date: '2024-09-08', status: '已发布' },
  { code: 'C-015', title: '优化靠背强度连接', scope: '靠背', owner: '沈越', date: '2024-09-09', status: '审批中' },
  { code: 'C-016', title: '替换饰板材质', scope: '内饰面套', owner: '蒋程', date: '2024-09-10', status: '已发布' },
  { code: 'C-017', title: '滑轨锁止结构微调', scope: '滑轨', owner: '彭蕾', date: '2024-09-11', status: '已发布' },
  { code: 'C-018', title: '更新泡沫供应商', scope: '座垫', owner: '许平', date: '2024-09-12', status: '已发布' },
  { code: 'C-019', title: '优化腰托行程', scope: '靠背', owner: '宋琪', date: '2024-09-13', status: '审批中' },
  { code: 'C-020', title: '调整安全带导向角度', scope: '靠背', owner: '何卓', date: '2024-09-14', status: '已发布' },
];

const activeModal = ref('');
const form = reactive({
  title: '',
  scope: '座垫',
  reason: '',
  doc: '',
  publishNote: '',
  archiveBatch: '',
});

const modalTitle = computed(() => {
  const map = {
    change: '发起变更',
    publish: '发布文档',
    archive: '归档记录',
    progress: '归档进度',
    tips: '提示信息',
  };
  return map[activeModal.value] || '弹窗';
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const confirmModal = () => {
  closeModal();
};
</script>

<style scoped>
.overview {
  margin-bottom: 20px;
}

.overview-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overview-actions {
  display: flex;
  gap: 10px;
}

.overview-image {
  width: 100%;
  border-radius: 14px;
}

.table-card {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: linear-gradient(90deg, #38bdf8, #4f46e5);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.ghost {
  background: #e2e8f0;
  color: #334155;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
