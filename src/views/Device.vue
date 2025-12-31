<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>设备接入与通信</h3>
        <div class="flex">
          <button @click="openAdd = true">新增设备</button>
          <button @click="openNetwork = true">网络配置</button>
          <button @click="openPing = true">通信测试</button>
        </div>
      </div>
      <table class="table" style="margin-top: 12px">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>类型</th>
            <th>连接</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in devices" :key="item.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.link }}</td>
            <td>
              <span :class="item.state === '在线' ? 'status-ok' : 'status-warn'">{{ item.state }}</span>
            </td>
            <td>
              <button style="padding: 6px 10px" @click="showDetail(item)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="gap: 12px">
      <div class="card">
        <div class="flex-between">
          <h4>传感器监测</h4>
          <button @click="openCalibrate = true">快速校准</button>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-top: 10px;">
          <div v-for="sensor in sensors" :key="sensor.name" class="card" style="padding: 12px;">
            <p class="flex-between">
              <span>{{ sensor.name }}</span>
              <span class="badge">{{ sensor.type }}</span>
            </p>
            <p>当前值：{{ sensor.value }}</p>
            <p :class="sensor.status === '正常' ? 'status-ok' : 'status-warn'">{{ sensor.status }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <h4>通信配置</h4>
          <button @click="openUpdate = true">固件升级</button>
        </div>
        <p>当前链路：5G + 有线冗余；心跳 50ms；重传 3 次</p>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="progress-inner" :style="{ width: linkHealth + '%' }"></div>
        </div>
        <p>链路健康度：{{ linkHealth }}%</p>
      </div>
    </div>
  </div>

  <div v-if="openAdd" class="modal-overlay" @click.self="openAdd = false">
    <div class="modal">
      <h3>新增设备</h3>
      <div class="grid">
        <label>设备名称<input v-model="form.name" placeholder="例如：六足本体 A" /></label>
        <label>类型<select v-model="form.type"><option>本体</option><option>相机</option><option>雷达</option><option>IMU</option></select></label>
        <label>连接<select v-model="form.link"><option>以太网</option><option>USB</option><option>串口</option></select></label>
      </div>
      <div class="flex-between" style="margin-top: 14px">
        <span class="badge">实时写入配置</span>
        <button @click="addDevice">确认新增</button>
      </div>
    </div>
  </div>

  <div v-if="openNetwork" class="modal-overlay" @click.self="openNetwork = false">
    <div class="modal">
      <h3>网络配置</h3>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <label>主控 IP<input v-model="network.master" /></label>
        <label>备用 IP<input v-model="network.backup" /></label>
        <label>端口<input v-model="network.port" /></label>
        <label>协议<select v-model="network.proto"><option>UDP</option><option>TCP</option></select></label>
      </div>
      <p style="margin-top: 10px">将实时下发到机器人通信中枢，并同步心跳参数。</p>
      <div class="flex-between">
        <span class="tag">冗余校验开启</span>
        <button @click="saveNetwork">保存配置</button>
      </div>
    </div>
  </div>

  <div v-if="openPing" class="modal-overlay" @click.self="openPing = false">
    <div class="modal">
      <h3>通信测试</h3>
      <p>对所有设备执行 ping 与端口握手测试。</p>
      <ul>
        <li v-for="item in devices" :key="item.id">{{ item.name }} - {{ item.type }} - 端口 {{ item.port }} - 预计耗时 50ms</li>
      </ul>
      <div class="progress-bar" style="margin-top: 10px">
        <div class="progress-inner" :style="{ width: testProgress + '%' }"></div>
      </div>
      <div class="flex-between" style="margin-top: 10px">
        <span>{{ testProgress }}% 完成</span>
        <button @click="runPing">开始</button>
      </div>
    </div>
  </div>

  <div v-if="openUpdate" class="modal-overlay" @click.self="openUpdate = false">
    <div class="modal">
      <h3>固件升级</h3>
      <p>上传最新通信固件，升级期间保持有线连接。</p>
      <input type="file" />
      <div class="progress-bar" style="margin-top: 10px">
        <div class="progress-inner" :style="{ width: updateProgress + '%' }"></div>
      </div>
      <div class="flex-between" style="margin-top: 10px">
        <span>写入进度：{{ updateProgress }}%</span>
        <button @click="simulateUpdate">执行升级</button>
      </div>
    </div>
  </div>

  <div v-if="openCalibrate" class="modal-overlay" @click.self="openCalibrate = false">
    <div class="modal">
      <h3>传感器快速校准</h3>
      <p>选择需要同步零点的传感器，发送校准指令。</p>
      <label>传感器<select v-model="calibrateTarget"><option v-for="sensor in sensors" :key="sensor.name">{{ sensor.name }}</option></select></label>
      <div class="flex-between" style="margin-top: 10px">
        <span class="badge">自动校准</span>
        <button @click="doCalibrate">执行</button>
      </div>
    </div>
  </div>

  <div v-if="detailDevice" class="modal-overlay" @click.self="detailDevice = null">
    <div class="modal">
      <h3>{{ detailDevice.name }} - 设备详情</h3>
      <p>类型：{{ detailDevice.type }}</p>
      <p>连接：{{ detailDevice.link }}</p>
      <p>心跳：50ms | 端口：{{ detailDevice.port }} | 加密：AES-GCM</p>
      <button @click="detailDevice = null">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const devices = ref(
  Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `设备-${i + 1}`,
    type: i % 3 === 0 ? '本体' : i % 3 === 1 ? '相机' : 'IMU',
    link: i % 2 === 0 ? '以太网' : 'USB',
    state: i % 4 === 0 ? '维护' : '在线',
    port: 5000 + i
  }))
);

const sensors = ref([
  { name: '立体相机', type: '视觉', value: '30 FPS', status: '正常' },
  { name: '深度相机', type: '视觉', value: '1.2m', status: '正常' },
  { name: 'IMU', type: '惯导', value: '0.01°', status: '正常' },
  { name: '里程计', type: '里程', value: '0.3% 漂移', status: '需复位' }
]);

const form = reactive({ name: '', type: '本体', link: '以太网' });
const network = reactive({ master: '192.168.1.10', backup: '192.168.1.11', port: 6000, proto: 'UDP' });
const testProgress = ref(0);
const updateProgress = ref(0);
const linkHealth = ref(92);
const calibrateTarget = ref('立体相机');
const detailDevice = ref(null);

const openAdd = ref(false);
const openNetwork = ref(false);
const openPing = ref(false);
const openUpdate = ref(false);
const openCalibrate = ref(false);

const addDevice = () => {
  devices.value.unshift({
    id: devices.value.length + 1,
    name: form.name || '新设备',
    type: form.type,
    link: form.link,
    state: '在线',
    port: 5000 + devices.value.length
  });
  openAdd.value = false;
};

const saveNetwork = () => {
  alert(`已保存网络：${network.master} / ${network.port}`);
  openNetwork.value = false;
};

const runPing = () => {
  testProgress.value = 100;
};

const simulateUpdate = () => {
  updateProgress.value = Math.min(100, updateProgress.value + 40);
};

const doCalibrate = () => {
  alert(`${calibrateTarget.value} 校准完成`);
  openCalibrate.value = false;
};

const showDetail = (item) => {
  detailDevice.value = item;
};
</script>
