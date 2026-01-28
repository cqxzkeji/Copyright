<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>多体动力学仿真（MBD）</h2>
        <p>车辆动力学仿真与悬挂、传动系统优化。</p>
      </div>
      <div class="actions">
        <button class="outline" type="button" @click="showScenarioModal = true">新建工况</button>
        <button class="outline" type="button" @click="showParamModal = true">参数配置</button>
        <button class="primary" type="button" @click="startSimulation">运行仿真</button>
        <button class="outline" type="button" @click="showReportModal = true">输出动力学报告</button>
        <button class="ghost" type="button" @click="showTipModal = true">提示信息</button>
      </div>
    </div>

    <div class="module-body">
      <div class="left-panel">
        <img :src="caeVisual" alt="多体动力学示意图" />
        <div class="card">
          <h3>车辆模型</h3>
          <ul>
            <li>整车自由度：124</li>
            <li>悬挂类型：双叉臂</li>
            <li>动力系统：电驱动总成</li>
            <li>路谱场景：城市 + 高速</li>
          </ul>
        </div>
        <div class="card">
          <h3>仿真进度</h3>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
          <p class="progress-text">已完成 {{ progress }}%</p>
        </div>
      </div>

      <div class="right-panel">
        <div class="metrics">
          <div class="metric">
            <span>最大横向加速度</span>
            <strong>0.84 g</strong>
          </div>
          <div class="metric">
            <span>车身侧倾角</span>
            <strong>2.1°</strong>
          </div>
          <div class="metric">
            <span>制动距离</span>
            <strong>36.5 m</strong>
          </div>
          <div class="metric">
            <span>牵引效率</span>
            <strong>92%</strong>
          </div>
        </div>

        <div class="table-card">
          <h3>动力学工况列表</h3>
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>工况名称</th>
                <th>速度</th>
                <th>路面</th>
                <th>峰值加速度</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.scene }}</td>
                <td>{{ row.speed }}</td>
                <td>{{ row.road }}</td>
                <td>{{ row.acc }}</td>
                <td><span :class="['status', row.statusClass]">{{ row.status }}</span></td>
                <td>
                  <button class="link" type="button" @click="openDetail(row)">查看</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <BaseModal v-if="showScenarioModal" title="新建工况" @close="showScenarioModal = false">
      <form class="modal-form">
        <label>
          工况名称
          <input type="text" placeholder="紧急变道" />
        </label>
        <label>
          目标速度
          <input type="text" placeholder="80 km/h" />
        </label>
        <label>
          备注
          <textarea rows="3" placeholder="输入工况说明"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showScenarioModal = false">取消</button>
        <button class="primary" type="button" @click="showScenarioModal = false">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showParamModal" title="参数配置" @close="showParamModal = false">
      <form class="modal-form">
        <label>
          悬挂刚度
          <input type="text" value="32 kN/m" />
        </label>
        <label>
          阻尼系数
          <input type="text" value="3.8 kN·s/m" />
        </label>
        <label>
          转向比
          <input type="text" value="14.7" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showParamModal = false">取消</button>
        <button class="primary" type="button" @click="showParamModal = false">应用</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showReportModal" title="输出动力学报告" @close="showReportModal = false">
      <form class="modal-form">
        <label>
          报告范围
          <select>
            <option>全部工况</option>
            <option>当前工况</option>
          </select>
        </label>
        <label>
          输出格式
          <select>
            <option>PDF</option>
            <option>HTML</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showReportModal = false">取消</button>
        <button class="primary" type="button" @click="showReportModal = false">生成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showTipModal" title="提示信息" @close="showTipModal = false">
      <p>建议在 60-100 km/h 区间增加试验点，以提升操稳拟合精度。</p>
      <template #footer>
        <button class="primary" type="button" @click="showTipModal = false">知道了</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showProgressModal" title="仿真进度" @close="closeProgress">
      <p>多体动力学求解正在进行中。</p>
      <div class="progress-track large">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="progress-text">已完成 {{ progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeProgress">后台运行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detailModal" title="工况详情" @close="detailModal = null">
      <p>工况：{{ detailModal?.scene }}</p>
      <p>速度：{{ detailModal?.speed }}</p>
      <p>路面：{{ detailModal?.road }}</p>
      <p>峰值加速度：{{ detailModal?.acc }}</p>
      <template #footer>
        <button class="primary" type="button" @click="detailModal = null">关闭</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import caeVisual from '../assets/cae-visual.svg';

const showScenarioModal = ref(false);
const showParamModal = ref(false);
const showReportModal = ref(false);
const showTipModal = ref(false);
const showProgressModal = ref(false);
const detailModal = ref(null);

const progress = ref(54);
let timer;

const tableRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    scene: `操稳工况-${id}`,
    speed: `${60 + id} km/h`,
    road: id % 2 === 0 ? '沥青' : '湿滑',
    acc: `${0.5 + id * 0.01} g`,
    status: id % 4 === 0 ? '需复核' : '完成',
    statusClass: id % 4 === 0 ? 'warn' : 'ok'
  };
});

const startSimulation = () => {
  showProgressModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  progress.value = 0;
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 15, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 550);
};

const closeProgress = () => {
  showProgressModal.value = false;
};

const openDetail = (row) => {
  detailModal.value = row;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.module-header p {
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.actions button {
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
}

.ghost {
  background: #f1f5f9;
  border: none;
}

.module-body {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 24px;
}

@media (max-width: 960px) {
  .module-body {
    grid-template-columns: 1fr;
  }
}

.left-panel {
  display: grid;
  gap: 16px;
}

.left-panel img {
  width: 100%;
  border-radius: 18px;
}

.card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.card ul {
  margin-top: 8px;
  padding-left: 18px;
  color: #475569;
  display: grid;
  gap: 6px;
}

.progress-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-track.large {
  height: 14px;
  margin: 16px 0 8px;
}

.progress-bar {
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  height: 100%;
  border-radius: inherit;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.metric {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  display: grid;
  gap: 6px;
}

.metric span {
  color: #64748b;
  font-size: 12px;
}

.table-card {
  margin-top: 16px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  overflow-x: auto;
}

.table-card h3 {
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.ok {
  background: #dcfce7;
  color: #15803d;
}

.status.warn {
  background: #fef3c7;
  color: #b45309;
}

.link {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
}
</style>
