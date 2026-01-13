<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>设备接入与驱控管理</h3>
        <p>统一接入多型号机器臂、驱动器与编码器，实现集中化建模与在线驱控。</p>
      </div>
      <div class="module-actions">
        <button class="secondary" type="button" @click="openModal('register')">设备接入</button>
        <button class="secondary" type="button" @click="openModal('params')">参数配置</button>
        <button class="primary" type="button" @click="openModal('dispatch')">下发驱控指令</button>
      </div>
    </div>
    <div class="summary-grid">
      <div class="card">
        <h4>在线设备</h4>
        <p class="metric">18 台</p>
        <span>已完成工业协议适配 6 类</span>
      </div>
      <div class="card">
        <h4>驱动器健康度</h4>
        <p class="metric">96%</p>
        <span>温升、振动、电流指标稳定</span>
      </div>
      <div class="card">
        <h4>建模队列</h4>
        <p class="metric">3 项</p>
        <span>待生成数字孪生模型</span>
      </div>
      <div class="card image-card">
        <img src="/src/assets/arm-diagram.svg" alt="设备接入示意" />
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h4>设备清单</h4>
        <button class="ghost" type="button" @click="openModal('tips')">接入提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>设备编号</th>
            <th>型号</th>
            <th>协议</th>
            <th>驱动器状态</th>
            <th>编码器</th>
            <th>运行模式</th>
            <th>在线控制</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in devices" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.protocol }}</td>
            <td>{{ item.driver }}</td>
            <td>{{ item.encoder }}</td>
            <td>{{ item.mode }}</td>
            <td>
              <button class="table-button" type="button" @click="openRowModal(item)">
                {{ item.action }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="closeModal">
      <template v-if="activeModal === 'register'">
        <p>快速登记新设备并选择工业通信协议。</p>
        <div class="modal-grid">
          <label>
            设备型号
            <input v-model="modalForm.model" type="text" placeholder="XR-Arm-6" />
          </label>
          <label>
            通信协议
            <select v-model="modalForm.protocol">
              <option value="EtherCAT">EtherCAT</option>
              <option value="Profinet">Profinet</option>
              <option value="CANopen">CANopen</option>
              <option value="Modbus">Modbus TCP</option>
            </select>
          </label>
          <label>
            接入驱动器
            <input v-model="modalForm.driver" type="text" placeholder="伺服驱动器型号" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'params'">
        <p>设置伺服电机与编码器的关键参数。</p>
        <div class="modal-grid">
          <label>
            最大转速 (rpm)
            <input v-model="modalForm.speed" type="number" />
          </label>
          <label>
            电流阈值 (A)
            <input v-model="modalForm.current" type="number" />
          </label>
          <label>
            编码器分辨率
            <input v-model="modalForm.encoder" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'dispatch'">
        <p>选择驱控指令模板并立即下发。</p>
        <div class="modal-grid">
          <label>
            指令类型
            <select v-model="modalForm.command">
              <option value="mode">模式切换</option>
              <option value="reset">回零校准</option>
              <option value="jog">点动控制</option>
            </select>
          </label>
          <label>
            目标设备
            <input v-model="modalForm.target" type="text" placeholder="设备编号" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'tips'">
        <p>设备接入前请确认驱动器与编码器固件版本一致。</p>
        <ul>
          <li>建议提前建立数字孪生模型以验证运动学参数。</li>
          <li>设备接入成功后需进行零点标定。</li>
          <li>已支持 12 种工业协议模板。</li>
        </ul>
      </template>
      <template v-else-if="activeModal === 'row'">
        <p>即将对 {{ selectedDevice?.id }} 进行在线控制。</p>
        <div class="modal-grid">
          <label>
            控制模式
            <select v-model="modalForm.controlMode">
              <option value="remote">远程模式</option>
              <option value="local">本地模式</option>
              <option value="lock">安全锁定</option>
            </select>
          </label>
          <label>
            输出频率
            <input v-model="modalForm.frequency" type="number" />
          </label>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const selectedDevice = ref(null);

const modalForm = reactive({
  model: 'XR-Arm-6',
  protocol: 'EtherCAT',
  driver: 'SV-1200',
  speed: 2800,
  current: 18,
  encoder: '23-bit',
  command: 'mode',
  target: 'ARM-01',
  controlMode: 'remote',
  frequency: 120
});

const devices = Array.from({ length: 22 }, (_, index) => ({
  id: `ARM-${(index + 1).toString().padStart(2, '0')}`,
  model: index % 2 === 0 ? 'XR-Arm-6' : 'XR-Arm-7',
  protocol: ['EtherCAT', 'Profinet', 'CANopen'][index % 3],
  driver: index % 2 === 0 ? '正常' : '预警',
  encoder: index % 2 === 0 ? '多圈编码器' : '绝对式编码器',
  mode: ['自动', '示教', '维护'][index % 3],
  action: '在线控制'
}));

const modalTitle = computed(() => {
  const titles = {
    register: '设备接入登记',
    params: '驱控参数配置',
    dispatch: '驱控指令下发',
    tips: '接入提示',
    row: '在线控制设置'
  };
  return titles[activeModal.value] || '';
});

const openModal = (type) => {
  activeModal.value = type;
};

const openRowModal = (device) => {
  selectedDevice.value = device;
  activeModal.value = 'row';
};

const closeModal = () => {
  activeModal.value = '';
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
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header p {
  color: #64748b;
  margin-top: 6px;
}

.module-actions {
  display: flex;
  gap: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 8px;
}

.card .metric {
  font-size: 26px;
  font-weight: 700;
}

.image-card {
  padding: 0;
  overflow: hidden;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel h4 {
  font-size: 18px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f7;
}

.table-button {
  border: none;
  background: #e0e7ff;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 12px;
}

@media (max-width: 920px) {
  .module-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
