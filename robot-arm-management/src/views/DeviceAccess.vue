<template>
  <div class="grid grid-2">
    <ChartCard title="资产在线率" value="92.6%" subtitle="当前在线设备 / 总资产" badge="稳定" :data="[30, 42, 38, 60, 55, 68, 72]" />
    <ChartCard title="通讯健康度" value="98.1" subtitle="TCP/串口/EtherCAT 综合" badge="优" :data="[40, 50, 48, 70, 66, 78, 82]" />
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">设备接入与资产管理</div>
    <div class="toolbar" style="margin-bottom: 16px;">
      <button class="btn" @click="openModal('add', '新增设备建档')">新增设备</button>
      <button class="btn btn-outline" @click="openModal('comm', '通讯参数配置')">通讯配置</button>
      <button class="btn btn-accent" @click="openModal('firmware', '固件升级进度')">固件升级</button>
      <button class="btn btn-outline" @click="openModal('inventory', '资产盘点确认')">资产盘点</button>
      <button class="btn btn-outline" @click="openModal('tips', '操作提示')">按钮提示</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>资产编号</th>
          <th>设备类型</th>
          <th>通讯方式</th>
          <th>固件版本</th>
          <th>标定状态</th>
          <th>在线状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.comm }}</td>
          <td>{{ item.firmware }}</td>
          <td>{{ item.calibration }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal v-model="modalVisible" :title="modalTitle">
    <div v-if="modalType === 'add'" class="form-row">
      <label class="form-group">
        <span>设备名称</span>
        <input class="form-input" placeholder="输入机械臂名称" />
      </label>
      <label class="form-group">
        <span>设备类型</span>
        <select class="form-input">
          <option>六轴机械臂</option>
          <option>协作机械臂</option>
          <option>SCARA</option>
        </select>
      </label>
      <label class="form-group">
        <span>资产编号</span>
        <input class="form-input" placeholder="输入资产编号" />
      </label>
      <label class="form-group">
        <span>安装位置</span>
        <input class="form-input" placeholder="输入工位" />
      </label>
      <label class="form-group">
        <span>驱动器型号</span>
        <input class="form-input" placeholder="输入驱动器型号" />
      </label>
      <label class="form-group">
        <span>末端执行器</span>
        <input class="form-input" placeholder="夹具/焊枪" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>标定备注</span>
        <textarea class="form-input" rows="3" placeholder="填写标定信息"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存建档</button>
      </div>
    </div>

    <div v-else-if="modalType === 'comm'" class="form-row">
      <label class="form-group">
        <span>协议类型</span>
        <select class="form-input">
          <option>TCP/IP</option>
          <option>串口</option>
          <option>EtherCAT</option>
        </select>
      </label>
      <label class="form-group">
        <span>主站地址</span>
        <input class="form-input" placeholder="192.168.1.100" />
      </label>
      <label class="form-group">
        <span>端口/波特率</span>
        <input class="form-input" placeholder="502 / 115200" />
      </label>
      <label class="form-group">
        <span>心跳周期</span>
        <input class="form-input" placeholder="50 ms" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>安全策略</span>
        <textarea class="form-input" rows="3" placeholder="白名单/IP 绑定/加密"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存配置</button>
      </div>
    </div>

    <div v-else-if="modalType === 'firmware'">
      <p>当前正在升级 3 台驱动器，请确认升级计划与进度。</p>
      <div style="margin-top: 16px; display: grid; gap: 12px;">
        <div v-for="item in firmwareTasks" :key="item.name">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>{{ item.name }}</span>
            <span>{{ item.progress }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">暂停升级</button>
        <button class="btn">确认继续</button>
      </div>
    </div>

    <div v-else-if="modalType === 'inventory'">
      <p>系统将对 24 套机械臂进行资产盘点，请确认盘点范围与责任人。</p>
      <div class="form-row" style="margin-top: 16px;">
        <label class="form-group">
          <span>盘点负责人</span>
          <input class="form-input" placeholder="输入负责人" />
        </label>
        <label class="form-group">
          <span>盘点范围</span>
          <input class="form-input" placeholder="设备组/工位" />
        </label>
        <label class="form-group" style="grid-column: 1 / -1;">
          <span>盘点说明</span>
          <textarea class="form-input" rows="3" placeholder="请输入盘点说明"></textarea>
        </label>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">生成盘点单</button>
      </div>
    </div>

    <div v-else>
      <p>提示：请先完成设备建档与通讯配置，再进行固件升级与标定信息同步。</p>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button class="btn" @click="modalVisible = false">我知道了</button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/Modal.vue";
import ChartCard from "../components/ChartCard.vue";

const modalVisible = ref(false);
const modalType = ref("add");
const modalTitle = ref("");

const openModal = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  modalVisible.value = true;
};

const tableData = Array.from({ length: 20 }, (_, idx) => ({
  id: `RB-${1001 + idx}`,
  type: idx % 3 === 0 ? "六轴机械臂" : idx % 3 === 1 ? "协作机械臂" : "SCARA",
  comm: idx % 2 === 0 ? "TCP/IP" : "EtherCAT",
  firmware: `v2.${(idx % 5) + 1}.0`,
  calibration: idx % 4 === 0 ? "待标定" : "已标定",
  status: idx % 5 === 0 ? "离线" : "在线"
}));

const firmwareTasks = [
  { name: "驱动器 A 组", progress: 35 },
  { name: "驱动器 B 组", progress: 62 },
  { name: "末端执行器 C 组", progress: 88 }
];
</script>
