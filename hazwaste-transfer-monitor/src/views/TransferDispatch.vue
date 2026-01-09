<template>
  <div>
    <div class="section-header">
      <h2>转运计划调度</h2>
      <div class="button-group">
        <button class="btn" @click="openModal('apply')">新增转运申请</button>
        <button class="btn outline" @click="openModal('assign')">车辆与人员分配</button>
        <button class="btn secondary" @click="openModal('route')">路线规划</button>
        <button class="btn secondary" @click="openModal('progress')">执行进度更新</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h3>待执行计划</h3>
        <p>6 条转运任务待出库</p>
      </div>
      <div class="card">
        <h3>在途车辆</h3>
        <p>8 辆车辆正在执行任务</p>
      </div>
      <div class="card">
        <h3>平均调度时长</h3>
        <p>1.8 小时</p>
      </div>
      <div class="card">
        <h3>路线合规率</h3>
        <p>97.5%</p>
      </div>
    </div>

    <div class="chart-box">
      <div class="chart card">
        <strong>车辆负载占比</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in loadBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
      <div class="chart card">
        <strong>今日调度密度</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in dispatchBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2>转运计划列表</h2>
        <div class="tag">共 {{ dispatchRows.length }} 条</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>计划编号</th>
            <th>出发地</th>
            <th>目的地</th>
            <th>车辆</th>
            <th>司机</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dispatchRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.origin }}</td>
            <td>{{ row.destination }}</td>
            <td>{{ row.vehicle }}</td>
            <td>{{ row.driver }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="modalState === 'apply'" title="新增转运申请" @close="closeModal">
      <form>
        <div>
          <label>出发单位</label>
          <input placeholder="华北化工厂" />
        </div>
        <div>
          <label>目的单位</label>
          <input placeholder="滨海处置中心" />
        </div>
        <div>
          <label>危废批次</label>
          <input placeholder="BCH-240920" />
        </div>
        <div>
          <label>预计出发时间</label>
          <input type="datetime-local" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">提交申请</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'assign'" title="车辆与人员分配" @close="closeModal">
      <form>
        <div>
          <label>计划编号</label>
          <input placeholder="TR-240913" />
        </div>
        <div>
          <label>车辆</label>
          <select>
            <option>津A-08321</option>
            <option>津B-21009</option>
            <option>津C-55261</option>
          </select>
        </div>
        <div>
          <label>驾驶员</label>
          <select>
            <option>李向东</option>
            <option>赵海涛</option>
            <option>王建军</option>
          </select>
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">确认分配</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'route'" title="路线规划与确认" @close="closeModal">
      <p>规划最优路线并评估风险节点。</p>
      <div class="progress-bar">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p>路线生成进度 {{ progress }}%</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">完成</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'progress'" title="执行进度更新" @close="closeModal">
      <form>
        <div>
          <label>计划编号</label>
          <input placeholder="TR-240915" />
        </div>
        <div>
          <label>当前节点</label>
          <select>
            <option>装车完成</option>
            <option>离厂</option>
            <option>在途</option>
            <option>到达处置中心</option>
          </select>
        </div>
        <div>
          <label>备注</label>
          <textarea rows="3" placeholder="输入备注信息" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">更新进度</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const modalState = ref('');
const progress = ref(0);

const loadBars = [65, 45, 80, 55, 70, 50, 60];
const dispatchBars = [30, 55, 40, 75, 60, 50, 80];

const dispatchRows = [
  { id: 'TR-240901', origin: '华北化工厂', destination: '滨海处置中心', vehicle: '津A-08321', driver: '李向东', status: '待出发' },
  { id: 'TR-240902', origin: '顺达电子', destination: '高新区中转站', vehicle: '津B-21009', driver: '赵海涛', status: '调度中' },
  { id: 'TR-240903', origin: '新港物流', destination: '滨海处置中心', vehicle: '津C-55261', driver: '王建军', status: '待出发' },
  { id: 'TR-240904', origin: '晨光电镀', destination: '西部处置中心', vehicle: '津A-19025', driver: '刘海峰', status: '在途' },
  { id: 'TR-240905', origin: '泰和机械', destination: '高新区中转站', vehicle: '津B-33108', driver: '陈伟', status: '待出发' },
  { id: 'TR-240906', origin: '海辰石化', destination: '滨海处置中心', vehicle: '津C-66772', driver: '张宇', status: '在途' },
  { id: 'TR-240907', origin: '天成电池', destination: '西部处置中心', vehicle: '津A-55081', driver: '徐强', status: '待出发' },
  { id: 'TR-240908', origin: '绿源建材', destination: '高新区中转站', vehicle: '津B-10229', driver: '冯亮', status: '调度中' },
  { id: 'TR-240909', origin: '正航金属', destination: '滨海处置中心', vehicle: '津C-99872', driver: '宋海', status: '在途' },
  { id: 'TR-240910', origin: '诚益机械', destination: '西部处置中心', vehicle: '津A-78211', driver: '苏鹏', status: '待出发' },
  { id: 'TR-240911', origin: '泰宁制药', destination: '高新区中转站', vehicle: '津B-30555', driver: '杜军', status: '待出发' },
  { id: 'TR-240912', origin: '晨光电镀', destination: '滨海处置中心', vehicle: '津A-55822', driver: '韩松', status: '在途' },
  { id: 'TR-240913', origin: '华北化工厂', destination: '西部处置中心', vehicle: '津C-61123', driver: '梁磊', status: '调度中' },
  { id: 'TR-240914', origin: '顺达电子', destination: '滨海处置中心', vehicle: '津B-19031', driver: '潘亮', status: '待出发' },
  { id: 'TR-240915', origin: '新港物流', destination: '高新区中转站', vehicle: '津A-09220', driver: '杨杰', status: '在途' },
  { id: 'TR-240916', origin: '海辰石化', destination: '滨海处置中心', vehicle: '津C-88211', driver: '吕鹏', status: '待出发' },
  { id: 'TR-240917', origin: '天成电池', destination: '西部处置中心', vehicle: '津A-66718', driver: '郭峰', status: '待出发' },
  { id: 'TR-240918', origin: '绿源建材', destination: '高新区中转站', vehicle: '津B-77211', driver: '朱宁', status: '调度中' },
  { id: 'TR-240919', origin: '正航金属', destination: '滨海处置中心', vehicle: '津C-11209', driver: '许杰', status: '在途' },
  { id: 'TR-240920', origin: '诚益机械', destination: '西部处置中心', vehicle: '津A-99331', driver: '梁浩', status: '待出发' }
];

const openModal = (state) => {
  modalState.value = state;
  if (state === 'route') {
    progress.value = 0;
    const interval = setInterval(() => {
      progress.value = Math.min(progress.value + 12, 100);
      if (progress.value >= 100) {
        clearInterval(interval);
      }
    }, 120);
  }
};

const closeModal = () => {
  modalState.value = '';
};

const saveModal = () => {
  modalState.value = '';
};
</script>
