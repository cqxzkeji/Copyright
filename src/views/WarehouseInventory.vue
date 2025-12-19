<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>仓储库存监控</h3>
        <p>覆盖入库、出库与温控状态，实时联动。</p>
      </div>
      <div class="actions">
        <button @click="showForm = true">新增入库</button>
        <button @click="showProgress = true">盘点进度</button>
        <button @click="showInfo = true">库存提示</button>
      </div>
    </div>

    <div class="media-grid">
      <div class="card">
        <h4>温控动态</h4>
        <div class="placeholder-box">
          <p>冷库 A 温控稳定在 4℃，过去 24 小时无波动。</p>
        </div>
      </div>
      <div class="card">
        <h4>设备分布</h4>
        <img src="/src/assets/field.svg" alt="设备分布" />
        <p>设备在线率 97%。</p>
      </div>
    </div>

    <div class="table-card">
      <h4>库存批次明细</h4>
      <table>
        <thead>
          <tr>
            <th>仓位</th>
            <th>批次</th>
            <th>品类</th>
            <th>库存量</th>
            <th>入库时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.slot">
            <td>{{ item.slot }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.crop }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ item.date }}</td>
            <td><span class="status">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" title="新增入库记录" @close="showForm = false">
      <form class="form-grid">
        <label>
          仓位
          <input type="text" placeholder="如：A-02" />
        </label>
        <label>
          批次号
          <input type="text" placeholder="如：SC-2410" />
        </label>
        <label>
          库存量 (吨)
          <input type="number" placeholder="如：12" />
        </label>
        <label>
          温控策略
          <select>
            <option>冷藏 2-6℃</option>
            <option>常温</option>
            <option>冷冻 -18℃</option>
          </select>
        </label>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="盘点任务进度" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前盘点 8/12 库区完成，进度 {{ progress }}%。</p>
    </BaseModal>

    <BaseModal :open="showInfo" title="库存提示" @close="showInfo = false">
      <p>低库存预警：A-05 仓位草莓库存不足，请及时补货。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(66);

const inventory = [
  { slot: 'A-01', batch: 'SC-2401', crop: '有机黄瓜', qty: '8 吨', date: '2024-06-10', status: '正常' },
  { slot: 'A-02', batch: 'SC-2402', crop: '鲜食玉米', qty: '10 吨', date: '2024-06-10', status: '正常' },
  { slot: 'A-03', batch: 'SC-2403', crop: '苹果', qty: '16 吨', date: '2024-06-09', status: '正常' },
  { slot: 'A-04', batch: 'SC-2404', crop: '草莓', qty: '6 吨', date: '2024-06-09', status: '待出库' },
  { slot: 'A-05', batch: 'SC-2405', crop: '生菜', qty: '4 吨', date: '2024-06-08', status: '低库存' },
  { slot: 'B-01', batch: 'SC-2406', crop: '西蓝花', qty: '9 吨', date: '2024-06-08', status: '正常' },
  { slot: 'B-02', batch: 'SC-2407', crop: '芦笋', qty: '7 吨', date: '2024-06-08', status: '正常' },
  { slot: 'B-03', batch: 'SC-2408', crop: '青椒', qty: '12 吨', date: '2024-06-07', status: '正常' },
  { slot: 'B-04', batch: 'SC-2409', crop: '胡萝卜', qty: '11 吨', date: '2024-06-07', status: '待出库' },
  { slot: 'B-05', batch: 'SC-2410', crop: '葡萄', qty: '5 吨', date: '2024-06-06', status: '低库存' },
  { slot: 'C-01', batch: 'SC-2411', crop: '藜麦', qty: '13 吨', date: '2024-06-06', status: '正常' },
  { slot: 'C-02', batch: 'SC-2412', crop: '蓝莓', qty: '9 吨', date: '2024-06-05', status: '正常' }
];
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h3 {
  margin: 0 0 4px;
}

.module-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  border: none;
  background: #dcfce7;
  color: #15803d;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.card img {
  width: 100%;
  border-radius: 12px;
  margin: 10px 0;
}

.placeholder-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  min-height: 160px;
  display: flex;
  align-items: center;
  color: #475569;
}

.table-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-card th,
.table-card td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  background: #fef9c3;
  color: #a16207;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}
</style>
