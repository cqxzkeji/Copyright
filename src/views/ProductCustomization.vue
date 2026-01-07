<template>
  <section class="card-grid">
    <div class="card">
      <h3>规格库概览</h3>
      <p>当前维护 48 类优特钢规格，主打 12 类高强度产品。</p>
      <div class="chart">
        <div v-for="(value, index) in chartData" :key="index" class="chart-bar" :style="{ height: value + '%' }">
          {{ value }}%
        </div>
      </div>
    </div>
    <div class="card">
      <h3>在线配置工具</h3>
      <p>支持多参数组合，自动校验冶炼与热处理工艺。</p>
      <div class="action-row">
        <button type="button" @click="openModal('newSpec')">新增规格</button>
        <button type="button" class="secondary-button" @click="openModal('customConfig')">在线配置</button>
        <button type="button" class="secondary-button" @click="openModal('parameterCheck')">参数校验</button>
      </div>
    </div>
    <div class="card">
      <h3>定制进度</h3>
      <p>待确认 8 条定制参数，需同步工艺中心。</p>
      <div class="action-row">
        <button type="button" @click="openModal('processSync')">工艺同步</button>
        <button type="button" class="secondary-button" @click="openModal('tip')">配置说明</button>
      </div>
    </div>
  </section>

  <section class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>规格编号</th>
          <th>钢种</th>
          <th>厚度(mm)</th>
          <th>宽度(mm)</th>
          <th>热处理</th>
          <th>应用场景</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in specs" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.grade }}</td>
          <td>{{ item.thickness }}</td>
          <td>{{ item.width }}</td>
          <td>{{ item.heat }}</td>
          <td>{{ item.scene }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <ModalDialog :open="activeModal === 'newSpec'" title="新增规格" @close="closeModal">
    <form>
      <label>
        钢种名称
        <input placeholder="例如：QT-900" />
      </label>
      <label>
        厚度区间
        <input placeholder="10-45" />
      </label>
      <label>
        备注
        <textarea placeholder="填写特殊冶炼要求"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('tip')">保存规格</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'customConfig'" title="在线配置" @close="closeModal">
    <form>
      <label>
        目标客户
        <input placeholder="选择客户" />
      </label>
      <label>
        配置项
        <select>
          <option>高强度</option>
          <option>耐磨</option>
          <option>耐腐蚀</option>
          <option>超厚板</option>
        </select>
      </label>
      <label>
        目标性能
        <textarea placeholder="填写性能指标"></textarea>
      </label>
      <button type="button" class="primary-button" @click="openModal('progress')">生成配置</button>
    </form>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'parameterCheck'" title="参数校验" @close="closeModal">
    <p>系统正在校验冶炼、轧制与热处理参数一致性。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 74%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">确认结果</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'processSync'" title="工艺同步进度" @close="closeModal">
    <p>正在同步工艺中心，请保持网络畅通。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 63%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">完成同步</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'progress'" title="配置生成进度" @close="closeModal">
    <p>系统正在计算最佳工艺参数组合。</p>
    <div class="progress-bar" style="margin-top:12px;">
      <span style="width: 86%;"></span>
    </div>
    <button type="button" class="primary-button" style="margin-top:16px;" @click="openModal('tip')">查看结果</button>
  </ModalDialog>

  <ModalDialog :open="activeModal === 'tip'" title="提示信息" @close="closeModal">
    <p>配置已同步至工艺中心，并生成最新版本记录。</p>
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

const chartData = [58, 76, 69, 84, 62];

const specs = [
  { id: 'SPEC-001', grade: 'QT-900', thickness: '12-40', width: '1600', heat: '调质', scene: '轨道车辆', status: '活跃' },
  { id: 'SPEC-002', grade: 'QT-780', thickness: '8-32', width: '1500', heat: '正火', scene: '工程机械', status: '活跃' },
  { id: 'SPEC-003', grade: 'QT-650', thickness: '20-60', width: '2200', heat: '回火', scene: '船舶制造', status: '评审中' },
  { id: 'SPEC-004', grade: 'NM450', thickness: '6-45', width: '2000', heat: '淬火', scene: '矿山设备', status: '活跃' },
  { id: 'SPEC-005', grade: 'NM500', thickness: '10-50', width: '2100', heat: '淬火', scene: '港口设备', status: '活跃' },
  { id: 'SPEC-006', grade: 'Q960', thickness: '12-80', width: '2300', heat: '调质', scene: '重型装备', status: '评审中' },
  { id: 'SPEC-007', grade: 'Q890', thickness: '14-70', width: '2300', heat: '调质', scene: '桥梁工程', status: '活跃' },
  { id: 'SPEC-008', grade: 'Q690', thickness: '8-60', width: '2200', heat: '调质', scene: '风电塔筒', status: '活跃' },
  { id: 'SPEC-009', grade: 'CR400', thickness: '6-32', width: '1800', heat: '正火', scene: '轨道交通', status: '活跃' },
  { id: 'SPEC-010', grade: 'CR450', thickness: '10-35', width: '1800', heat: '正火', scene: '轨道交通', status: '活跃' },
  { id: 'SPEC-011', grade: 'MT550', thickness: '16-50', width: '2100', heat: '淬火', scene: '矿山设备', status: '活跃' },
  { id: 'SPEC-012', grade: 'WT600', thickness: '12-55', width: '2000', heat: '回火', scene: '港机结构', status: '评审中' },
  { id: 'SPEC-013', grade: 'QT-720', thickness: '10-45', width: '1900', heat: '正火', scene: '汽车结构', status: '活跃' },
  { id: 'SPEC-014', grade: 'QT-760', thickness: '10-50', width: '2000', heat: '调质', scene: '工程机械', status: '活跃' },
  { id: 'SPEC-015', grade: 'HD700', thickness: '18-65', width: '2200', heat: '调质', scene: '建筑钢构', status: '评审中' },
  { id: 'SPEC-016', grade: 'HD780', thickness: '20-70', width: '2200', heat: '调质', scene: '桥梁工程', status: '活跃' },
  { id: 'SPEC-017', grade: 'NR550', thickness: '12-48', width: '1800', heat: '正火', scene: '船舶制造', status: '活跃' },
  { id: 'SPEC-018', grade: 'NR600', thickness: '16-56', width: '2000', heat: '回火', scene: '海工装备', status: '评审中' },
  { id: 'SPEC-019', grade: 'XT500', thickness: '14-60', width: '2100', heat: '淬火', scene: '矿山设备', status: '活跃' },
  { id: 'SPEC-020', grade: 'XT550', thickness: '10-48', width: '2000', heat: '淬火', scene: '港口设备', status: '活跃' }
];
</script>
