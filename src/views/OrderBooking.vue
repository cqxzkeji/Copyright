<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>订单预约管理</h2>
        <p>支持果蔬品类选择、采摘时间预约、数量下单与订单状态跟踪。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新增预约订单</button>
        <button class="ghost" @click="openModal('update')">修改订单</button>
        <button class="ghost" @click="openModal('cancel')">取消订单</button>
        <button class="ghost" @click="openModal('track')">订单跟踪</button>
      </div>
    </header>

    <div class="stats">
      <div class="stat-card">
        <h3>今日预约量</h3>
        <strong>86 单</strong>
        <span>完成率 92%</span>
      </div>
      <div class="stat-card">
        <h3>即将采摘</h3>
        <strong>32 单</strong>
        <span>2 小时内安排</span>
      </div>
      <div class="stat-card">
        <h3>团购客户</h3>
        <strong>14 组</strong>
        <span>平均 120 斤/单</span>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>订单编号</th>
            <th>客户名称</th>
            <th>品类</th>
            <th>预约时间</th>
            <th>数量(kg)</th>
            <th>状态</th>
            <th>渠道</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.category }}</td>
            <td>{{ order.time }}</td>
            <td>{{ order.amount }}</td>
            <td><span class="tag">{{ order.status }}</span></td>
            <td>{{ order.channel }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <div v-if="modalType === 'create'" class="form-grid">
        <label>
          客户名称
          <input v-model="form.customer" placeholder="请输入客户名称" />
        </label>
        <label>
          预约品类
          <select v-model="form.category">
            <option value="">请选择</option>
            <option value="草莓">草莓</option>
            <option value="番茄">番茄</option>
            <option value="葡萄">葡萄</option>
            <option value="黄瓜">黄瓜</option>
          </select>
        </label>
        <label>
          预约时间
          <input v-model="form.time" type="datetime-local" />
        </label>
        <label>
          预约数量(kg)
          <input v-model="form.amount" type="number" placeholder="例如 50" />
        </label>
      </div>
      <div v-else-if="modalType === 'update'" class="form-grid">
        <label>
          订单编号
          <input v-model="form.id" placeholder="请输入订单编号" />
        </label>
        <label>
          新预约时间
          <input v-model="form.time" type="datetime-local" />
        </label>
        <label>
          状态调整
          <select v-model="form.status">
            <option value="已确认">已确认</option>
            <option value="待采摘">待采摘</option>
            <option value="已取消">已取消</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'cancel'">
        <p>请选择需要取消的订单，并填写取消原因。</p>
        <div class="form-grid">
          <label>
            订单编号
            <input v-model="form.id" placeholder="请输入订单编号" />
          </label>
          <label>
            取消原因
            <textarea v-model="form.reason" rows="3" placeholder="客户变更、天气影响等" />
          </label>
        </div>
      </div>
      <div v-else>
        <p>订单跟踪展示采摘进度与配送安排。</p>
        <div class="track-grid">
          <div>
            <strong>采摘进度</strong>
            <div class="progress">
              <div class="progress-bar" :style="{ width: '72%' }"></div>
            </div>
            <span>已完成 72%</span>
          </div>
          <div>
            <strong>配送时间</strong>
            <p>预计 16:30 前完成分拣</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="ghost" @click="modalVisible = false">取消</button>
        <button class="primary" @click="submitModal">提交</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const orders = ref([
  { id: 'OB-24001', customer: '金禾商贸', category: '草莓', time: '2024-05-20 09:00', amount: 120, status: '已确认', channel: '线上' },
  { id: 'OB-24002', customer: '清甜超市', category: '番茄', time: '2024-05-20 10:00', amount: 80, status: '待采摘', channel: '线下' },
  { id: 'OB-24003', customer: '禾风社区团购', category: '黄瓜', time: '2024-05-20 10:30', amount: 60, status: '已确认', channel: '团购' },
  { id: 'OB-24004', customer: '晨露餐饮', category: '葡萄', time: '2024-05-20 11:00', amount: 90, status: '待采摘', channel: '线上' },
  { id: 'OB-24005', customer: '绿色厨房', category: '草莓', time: '2024-05-20 11:30', amount: 45, status: '已确认', channel: '线下' },
  { id: 'OB-24006', customer: '顺丰生鲜', category: '番茄', time: '2024-05-20 12:00', amount: 110, status: '已确认', channel: '线上' },
  { id: 'OB-24007', customer: '社区驿站', category: '辣椒', time: '2024-05-20 12:30', amount: 70, status: '待采摘', channel: '团购' },
  { id: 'OB-24008', customer: '绿叶配送', category: '西兰花', time: '2024-05-20 13:00', amount: 55, status: '已确认', channel: '线下' },
  { id: 'OB-24009', customer: '珍果便利', category: '葡萄', time: '2024-05-20 13:30', amount: 40, status: '待采摘', channel: '线上' },
  { id: 'OB-24010', customer: '好味鲜', category: '草莓', time: '2024-05-20 14:00', amount: 95, status: '已确认', channel: '团购' },
  { id: 'OB-24011', customer: '悦享果蔬', category: '番茄', time: '2024-05-20 14:30', amount: 88, status: '待采摘', channel: '线下' },
  { id: 'OB-24012', customer: '星辰餐饮', category: '黄瓜', time: '2024-05-20 15:00', amount: 65, status: '已确认', channel: '线上' },
  { id: 'OB-24013', customer: '禾谷生鲜', category: '葡萄', time: '2024-05-20 15:30', amount: 78, status: '待采摘', channel: '团购' },
  { id: 'OB-24014', customer: '丰泽果园', category: '草莓', time: '2024-05-20 16:00', amount: 52, status: '已确认', channel: '线上' },
  { id: 'OB-24015', customer: '悦清农贸', category: '番茄', time: '2024-05-20 16:30', amount: 100, status: '待采摘', channel: '线下' },
  { id: 'OB-24016', customer: '鲜露配送', category: '西兰花', time: '2024-05-20 17:00', amount: 58, status: '已确认', channel: '线上' },
  { id: 'OB-24017', customer: '悦心团购', category: '黄瓜', time: '2024-05-20 17:30', amount: 84, status: '待采摘', channel: '团购' },
  { id: 'OB-24018', customer: '益农餐厅', category: '辣椒', time: '2024-05-20 18:00', amount: 66, status: '已确认', channel: '线上' },
  { id: 'OB-24019', customer: '蓝湾超市', category: '葡萄', time: '2024-05-20 18:30', amount: 73, status: '待采摘', channel: '线下' },
  { id: 'OB-24020', customer: '丰润食堂', category: '草莓', time: '2024-05-20 19:00', amount: 90, status: '已确认', channel: '线上' }
]);

const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('create');
const form = reactive({
  id: '',
  customer: '',
  category: '',
  time: '',
  amount: '',
  status: '已确认',
  reason: ''
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  const titles = {
    create: '新增预约订单',
    update: '修改订单信息',
    cancel: '取消订单',
    track: '订单跟踪进度'
  };
  modalTitle.value = titles[type];
};

const submitModal = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.module-header h2 {
  margin: 0 0 6px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.stat-card {
  background: #f7fbf8;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  display: grid;
  gap: 6px;
}

.table-card {
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 14px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e6f4ea;
  color: var(--primary-dark);
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.track-grid {
  display: grid;
  gap: 12px;
}

.progress {
  height: 10px;
  background: #edf4ef;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
}

.primary {
  background: var(--primary);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
