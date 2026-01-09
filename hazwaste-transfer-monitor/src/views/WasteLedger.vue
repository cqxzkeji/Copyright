<template>
  <div>
    <div class="section-header">
      <h2>危废基础台账</h2>
      <div class="button-group">
        <button class="btn" @click="openModal('create')">新增台账</button>
        <button class="btn outline" @click="openModal('verify')">批次核验</button>
        <button class="btn secondary" @click="openModal('inspect')">容器点检</button>
        <button class="btn secondary" @click="openModal('export')">导出台账</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h3>危废类别</h3>
        <p>12 类危废已纳入统一台账</p>
      </div>
      <div class="card">
        <h3>在库重量</h3>
        <p>312.6 吨</p>
      </div>
      <div class="card">
        <h3>资质到期预警</h3>
        <p>4 家单位需要续期</p>
      </div>
      <div class="card">
        <h3>容器合规率</h3>
        <p>98.7%</p>
      </div>
    </div>

    <div class="chart-box">
      <div class="chart card">
        <strong>危废来源分布</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in sourceBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
      <div class="chart card">
        <strong>近7日入库重量</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in intakeBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2>台账明细</h2>
        <div class="tag">共 {{ ledgerRows.length }} 条</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>批次</th>
            <th>类别</th>
            <th>来源单位</th>
            <th>重量(吨)</th>
            <th>容器类型</th>
            <th>资质状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in ledgerRows" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.weight }}</td>
            <td>{{ row.container }}</td>
            <td>{{ row.license }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="modalState === 'create'" title="新增危废台账" @close="closeModal">
      <form>
        <div>
          <label>危废类别</label>
          <input placeholder="HW08 含油废物" />
        </div>
        <div>
          <label>来源单位</label>
          <input placeholder="华北化工厂" />
        </div>
        <div>
          <label>重量(吨)</label>
          <input placeholder="10.5" />
        </div>
        <div>
          <label>容器与批次</label>
          <input placeholder="密闭桶 / 2024-09-01" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">保存并生成批次</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'verify'" title="批次资质核验" @close="closeModal">
      <p>系统将对选中批次的危废类别、来源及运输资质进行自动核验。</p>
      <form>
        <div>
          <label>批次编号</label>
          <input placeholder="BCH-2024-0826" />
        </div>
        <div>
          <label>核验说明</label>
          <textarea rows="3" placeholder="请输入核验备注" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">发起核验</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'inspect'" title="容器点检进度" @close="closeModal">
      <p>正在执行现场容器扫码与密封性检查。</p>
      <div class="progress-bar">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p>已完成 {{ progress }}%</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">完成</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'export'" title="导出台账报告" @close="closeModal">
      <p>请选择导出范围与格式。</p>
      <form>
        <div>
          <label>时间范围</label>
          <select>
            <option>最近30天</option>
            <option>最近90天</option>
            <option>全年</option>
          </select>
        </div>
        <div>
          <label>格式</label>
          <select>
            <option>Excel</option>
            <option>PDF</option>
          </select>
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">生成报告</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const modalState = ref('');
const progress = ref(0);

const sourceBars = [40, 65, 55, 80, 35, 70, 50];
const intakeBars = [20, 45, 65, 55, 40, 60, 75];

const ledgerRows = [
  { batch: 'BCH-240901', type: 'HW08 含油废物', source: '华北化工厂', weight: 12.5, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240902', type: 'HW06 废酸', source: '顺达电子', weight: 9.1, container: '防腐槽', license: '有效' },
  { batch: 'BCH-240903', type: 'HW49 其他废物', source: '新港物流', weight: 6.8, container: 'IBC 吨桶', license: '待核验' },
  { batch: 'BCH-240904', type: 'HW17 表面处理废物', source: '晨光电镀', weight: 18.2, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240905', type: 'HW09 废乳化液', source: '泰和机械', weight: 7.6, container: 'IBC 吨桶', license: '有效' },
  { batch: 'BCH-240906', type: 'HW08 含油废物', source: '海辰石化', weight: 14.3, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240907', type: 'HW06 废酸', source: '天成电池', weight: 5.9, container: '防腐槽', license: '待核验' },
  { batch: 'BCH-240908', type: 'HW49 其他废物', source: '绿源建材', weight: 10.2, container: 'IBC 吨桶', license: '有效' },
  { batch: 'BCH-240909', type: 'HW17 表面处理废物', source: '正航金属', weight: 11.7, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240910', type: 'HW09 废乳化液', source: '诚益机械', weight: 8.4, container: 'IBC 吨桶', license: '有效' },
  { batch: 'BCH-240911', type: 'HW08 含油废物', source: '海辰石化', weight: 13.2, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240912', type: 'HW06 废酸', source: '顺达电子', weight: 6.5, container: '防腐槽', license: '有效' },
  { batch: 'BCH-240913', type: 'HW49 其他废物', source: '泰宁制药', weight: 9.8, container: 'IBC 吨桶', license: '待核验' },
  { batch: 'BCH-240914', type: 'HW17 表面处理废物', source: '晨光电镀', weight: 7.1, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240915', type: 'HW09 废乳化液', source: '佳诚机械', weight: 5.4, container: 'IBC 吨桶', license: '有效' },
  { batch: 'BCH-240916', type: 'HW08 含油废物', source: '海辰石化', weight: 16.3, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240917', type: 'HW06 废酸', source: '天成电池', weight: 4.8, container: '防腐槽', license: '待核验' },
  { batch: 'BCH-240918', type: 'HW49 其他废物', source: '绿源建材', weight: 12.1, container: 'IBC 吨桶', license: '有效' },
  { batch: 'BCH-240919', type: 'HW17 表面处理废物', source: '正航金属', weight: 6.3, container: '密闭桶', license: '有效' },
  { batch: 'BCH-240920', type: 'HW09 废乳化液', source: '诚益机械', weight: 9.6, container: 'IBC 吨桶', license: '有效' }
];

const openModal = (state) => {
  modalState.value = state;
  if (state === 'inspect') {
    progress.value = 0;
    const interval = setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
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
