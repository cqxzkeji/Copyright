<template>
  <div>
    <div class="section-header">
      <h2>联单与合规管理</h2>
      <div class="button-group">
        <button class="btn" @click="openModal('manifest')">生成电子联单</button>
        <button class="btn outline" @click="openModal('license')">资质校验</button>
        <button class="btn secondary" @click="openModal('risk')">风险预警配置</button>
        <button class="btn secondary" @click="openModal('handling')">异常处理进度</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h3>联单流转中</h3>
        <p>22 份联单等待确认</p>
      </div>
      <div class="card">
        <h3>资质校验通过率</h3>
        <p>99.1%</p>
      </div>
      <div class="card">
        <h3>风险预警</h3>
        <p>3 条偏航超时提醒</p>
      </div>
      <div class="card">
        <h3>异常闭环率</h3>
        <p>92.4%</p>
      </div>
    </div>

    <div class="chart-box">
      <div class="chart card">
        <strong>联单签章进度</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in signBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
      <div class="chart card">
        <strong>风险预警分布</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in riskBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2>联单合规清单</h2>
        <div class="tag">共 {{ manifestRows.length }} 条</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>联单编号</th>
            <th>企业</th>
            <th>运输单位</th>
            <th>状态</th>
            <th>偏航/超时</th>
            <th>合规等级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in manifestRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.enterprise }}</td>
            <td>{{ row.carrier }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.risk }}</td>
            <td>{{ row.level }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="modalState === 'manifest'" title="生成电子联单" @close="closeModal">
      <form>
        <div>
          <label>企业名称</label>
          <input placeholder="华北化工厂" />
        </div>
        <div>
          <label>批次</label>
          <input placeholder="BCH-240920" />
        </div>
        <div>
          <label>运输单位</label>
          <input placeholder="津源危废运输" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">生成联单</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'license'" title="资质校验" @close="closeModal">
      <p>对运输单位资质、驾驶员证照和处置单位许可进行校验。</p>
      <div class="progress-bar">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p>校验进度 {{ progress }}%</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">完成</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'risk'" title="风险预警配置" @close="closeModal">
      <form>
        <div>
          <label>偏航阈值(公里)</label>
          <input placeholder="5" />
        </div>
        <div>
          <label>超时时间(分钟)</label>
          <input placeholder="30" />
        </div>
        <div>
          <label>提醒方式</label>
          <select>
            <option>短信 + 系统通知</option>
            <option>系统通知</option>
            <option>邮件</option>
          </select>
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">保存配置</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'handling'" title="异常处理进度" @close="closeModal">
      <p>当前异常处理完成度。</p>
      <div class="progress-bar">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p>异常闭环 {{ progress }}%</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">确认</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const modalState = ref('');
const progress = ref(0);

const signBars = [60, 55, 70, 65, 80, 75, 90];
const riskBars = [35, 40, 55, 45, 60, 50, 70];

const manifestRows = [
  { id: 'MN-240901', enterprise: '华北化工厂', carrier: '津源危废运输', status: '待签章', risk: '正常', level: 'A级' },
  { id: 'MN-240902', enterprise: '顺达电子', carrier: '海港环保物流', status: '流转中', risk: '偏航', level: 'B级' },
  { id: 'MN-240903', enterprise: '新港物流', carrier: '津源危废运输', status: '已确认', risk: '正常', level: 'A级' },
  { id: 'MN-240904', enterprise: '晨光电镀', carrier: '远航物流', status: '待签章', risk: '正常', level: 'A级' },
  { id: 'MN-240905', enterprise: '泰和机械', carrier: '海港环保物流', status: '流转中', risk: '超时', level: 'B级' },
  { id: 'MN-240906', enterprise: '海辰石化', carrier: '津源危废运输', status: '已确认', risk: '正常', level: 'A级' },
  { id: 'MN-240907', enterprise: '天成电池', carrier: '远航物流', status: '待签章', risk: '正常', level: 'A级' },
  { id: 'MN-240908', enterprise: '绿源建材', carrier: '海港环保物流', status: '流转中', risk: '偏航', level: 'B级' },
  { id: 'MN-240909', enterprise: '正航金属', carrier: '津源危废运输', status: '已确认', risk: '正常', level: 'A级' },
  { id: 'MN-240910', enterprise: '诚益机械', carrier: '海港环保物流', status: '待签章', risk: '正常', level: 'A级' },
  { id: 'MN-240911', enterprise: '泰宁制药', carrier: '远航物流', status: '流转中', risk: '超时', level: 'B级' },
  { id: 'MN-240912', enterprise: '晨光电镀', carrier: '津源危废运输', status: '已确认', risk: '正常', level: 'A级' },
  { id: 'MN-240913', enterprise: '华北化工厂', carrier: '远航物流', status: '待签章', risk: '正常', level: 'A级' },
  { id: 'MN-240914', enterprise: '顺达电子', carrier: '海港环保物流', status: '流转中', risk: '偏航', level: 'B级' },
  { id: 'MN-240915', enterprise: '新港物流', carrier: '津源危废运输', status: '已确认', risk: '正常', level: 'A级' },
  { id: 'MN-240916', enterprise: '海辰石化', carrier: '远航物流', status: '待签章', risk: '正常', level: 'A级' },
  { id: 'MN-240917', enterprise: '天成电池', carrier: '海港环保物流', status: '流转中', risk: '正常', level: 'A级' },
  { id: 'MN-240918', enterprise: '绿源建材', carrier: '津源危废运输', status: '已确认', risk: '正常', level: 'A级' },
  { id: 'MN-240919', enterprise: '正航金属', carrier: '远航物流', status: '待签章', risk: '超时', level: 'B级' },
  { id: 'MN-240920', enterprise: '诚益机械', carrier: '海港环保物流', status: '流转中', risk: '正常', level: 'A级' }
];

const openModal = (state) => {
  modalState.value = state;
  if (state === 'license' || state === 'handling') {
    progress.value = 0;
    const interval = setInterval(() => {
      progress.value = Math.min(progress.value + 15, 100);
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
