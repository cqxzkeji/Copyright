<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>质量安全追溯</h3>
        <p>覆盖抽检、留样与溯源码，保障品质安全。</p>
      </div>
      <div class="actions">
        <button @click="showForm = true">新增抽检</button>
        <button @click="showProgress = true">抽检进度</button>
        <button @click="showInfo = true">合规提示</button>
      </div>
    </div>

    <div class="media-grid">
      <div class="card">
        <h4>质检概况</h4>
        <div class="placeholder-box">
          <p>本周合格率 99.4%，抽检覆盖 6 个核心品类。</p>
        </div>
      </div>
      <div class="card">
        <h4>追溯码样例</h4>
        <img src="/src/assets/field.svg" alt="追溯码样例" />
        <p>扫码可直达批次溯源档案。</p>
      </div>
    </div>

    <div class="table-card">
      <h4>质检记录</h4>
      <table>
        <thead>
          <tr>
            <th>样品号</th>
            <th>批次</th>
            <th>检测项</th>
            <th>检测结果</th>
            <th>检测日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inspections" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.item }}</td>
            <td>{{ item.result }}</td>
            <td>{{ item.date }}</td>
            <td><span class="status">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" title="新增质检记录" @close="showForm = false">
      <form class="form-grid">
        <label>
          样品号
          <input type="text" placeholder="如：QC-1021" />
        </label>
        <label>
          批次号
          <input type="text" placeholder="如：SC-2410" />
        </label>
        <label>
          检测项目
          <input type="text" placeholder="如：农残" />
        </label>
        <label>
          结论
          <select>
            <option>合格</option>
            <option>复检</option>
            <option>不合格</option>
          </select>
        </label>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="抽检任务进度" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>今日抽检批次完成 {{ progress }}%，剩余 4 个。</p>
    </BaseModal>

    <BaseModal :open="showInfo" title="合规提示" @close="showInfo = false">
      <p>发现 2 个批次需复检，已自动生成复检工单。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(80);

const inspections = [
  { id: 'QC-1001', batch: 'SC-2401', item: '农残', result: '合格', date: '2024-06-08', status: '通过' },
  { id: 'QC-1002', batch: 'SC-2402', item: '重金属', result: '合格', date: '2024-06-08', status: '通过' },
  { id: 'QC-1003', batch: 'SC-2403', item: '微生物', result: '合格', date: '2024-06-09', status: '通过' },
  { id: 'QC-1004', batch: 'SC-2404', item: '农残', result: '复检', date: '2024-06-09', status: '复检' },
  { id: 'QC-1005', batch: 'SC-2405', item: '重金属', result: '合格', date: '2024-06-09', status: '通过' },
  { id: 'QC-1006', batch: 'SC-2406', item: '农残', result: '合格', date: '2024-06-10', status: '通过' },
  { id: 'QC-1007', batch: 'SC-2407', item: '微生物', result: '合格', date: '2024-06-10', status: '通过' },
  { id: 'QC-1008', batch: 'SC-2408', item: '农残', result: '合格', date: '2024-06-10', status: '通过' },
  { id: 'QC-1009', batch: 'SC-2409', item: '重金属', result: '复检', date: '2024-06-11', status: '复检' },
  { id: 'QC-1010', batch: 'SC-2410', item: '农残', result: '合格', date: '2024-06-11', status: '通过' },
  { id: 'QC-1011', batch: 'SC-2411', item: '微生物', result: '合格', date: '2024-06-11', status: '通过' },
  { id: 'QC-1012', batch: 'SC-2412', item: '农残', result: '合格', date: '2024-06-12', status: '通过' }
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
  background: #fef3c7;
  color: #b45309;
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
  background: #dbeafe;
  color: #1d4ed8;
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
  background: linear-gradient(90deg, #f59e0b, #84cc16);
}
</style>
