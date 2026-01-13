<template>
  <div class="grid grid-3">
    <ChartCard title="零点偏移" value="0.18 mm" subtitle="最大偏移量" badge="可控" :data="[10, 18, 16, 22, 20, 26, 23]" />
    <ChartCard title="健康度评分" value="92 分" subtitle="综合监测" badge="良好" :data="[65, 68, 70, 75, 72, 78, 80]" />
    <ChartCard title="温升趋势" value="36.2 ℃" subtitle="峰值温度" badge="正常" :data="[20, 24, 27, 29, 31, 33, 36]" />
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">高精度校准与状态监测</div>
    <div class="toolbar" style="margin-bottom: 16px;">
      <button class="btn" @click="openModal('zero', '零点校准配置')">零点校准</button>
      <button class="btn btn-outline" @click="openModal('frame', '坐标系校准')">坐标系校准</button>
      <button class="btn btn-outline" @click="openModal('compensation', '误差补偿参数')">误差补偿</button>
      <button class="btn btn-accent" @click="openModal('monitor', '实时监测进度')">实时监测</button>
      <button class="btn btn-outline" @click="openModal('tips', '监测提示')">按钮提示</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>监测时间</th>
          <th>电流(A)</th>
          <th>扭矩(N·m)</th>
          <th>温度(℃)</th>
          <th>振动(mm/s)</th>
          <th>健康度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in monitorData" :key="item.time">
          <td>{{ item.time }}</td>
          <td>{{ item.current }}</td>
          <td>{{ item.torque }}</td>
          <td>{{ item.temp }}</td>
          <td>{{ item.vibration }}</td>
          <td><span class="badge">{{ item.health }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal v-model="modalVisible" :title="modalTitle">
    <div v-if="modalType === 'zero'" class="form-row">
      <label class="form-group">
        <span>标定对象</span>
        <select class="form-input">
          <option>机械臂 A1</option>
          <option>机械臂 B2</option>
          <option>机械臂 C3</option>
        </select>
      </label>
      <label class="form-group">
        <span>零点偏差阈值</span>
        <input class="form-input" placeholder="0.2 mm" />
      </label>
      <label class="form-group">
        <span>校准模式</span>
        <select class="form-input">
          <option>自动</option>
          <option>人工复核</option>
        </select>
      </label>
      <label class="form-group">
        <span>采样次数</span>
        <input class="form-input" placeholder="10" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>校准说明</span>
        <textarea class="form-input" rows="3" placeholder="填写校准说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">执行校准</button>
      </div>
    </div>

    <div v-else-if="modalType === 'frame'" class="form-row">
      <label class="form-group">
        <span>坐标系名称</span>
        <input class="form-input" placeholder="基座/工装" />
      </label>
      <label class="form-group">
        <span>参考点数量</span>
        <input class="form-input" placeholder="4" />
      </label>
      <label class="form-group">
        <span>对齐精度</span>
        <input class="form-input" placeholder="0.1 mm" />
      </label>
      <label class="form-group">
        <span>执行人</span>
        <input class="form-input" placeholder="输入执行人" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>坐标系备注</span>
        <textarea class="form-input" rows="3" placeholder="工装/工位信息"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存坐标系</button>
      </div>
    </div>

    <div v-else-if="modalType === 'compensation'" class="form-row">
      <label class="form-group">
        <span>补偿模型</span>
        <select class="form-input">
          <option>热漂移补偿</option>
          <option>负载补偿</option>
          <option>磨损补偿</option>
        </select>
      </label>
      <label class="form-group">
        <span>误差阈值</span>
        <input class="form-input" placeholder="0.15 mm" />
      </label>
      <label class="form-group">
        <span>适用轴</span>
        <input class="form-input" placeholder="1-6 轴" />
      </label>
      <label class="form-group">
        <span>补偿等级</span>
        <select class="form-input">
          <option>轻度</option>
          <option>中度</option>
          <option>强化</option>
        </select>
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>补偿备注</span>
        <textarea class="form-input" rows="3" placeholder="补偿参数说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存补偿</button>
      </div>
    </div>

    <div v-else-if="modalType === 'monitor'">
      <p>实时监测已覆盖 12 套机械臂，采集频率 50ms。</p>
      <div class="grid grid-2" style="margin-top: 16px;">
        <div class="card">
          <div class="stat-value">0.9 A</div>
          <div class="stat-label">平均电流波动</div>
        </div>
        <div class="card">
          <div class="stat-value">1.2 mm/s</div>
          <div class="stat-label">振动均值</div>
        </div>
      </div>
      <div style="margin-top: 16px;">
        <div class="progress-track">
          <div class="progress-bar" style="width: 78%;"></div>
        </div>
        <div style="margin-top: 8px; color: var(--muted);">状态采集进度 78%</div>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">停止监测</button>
        <button class="btn">保持监测</button>
      </div>
    </div>

    <div v-else>
      <p>提示：校准前请确认机械臂空载并完成安全锁定。</p>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button class="btn" @click="modalVisible = false">确认</button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/Modal.vue";
import ChartCard from "../components/ChartCard.vue";

const modalVisible = ref(false);
const modalType = ref("zero");
const modalTitle = ref("");

const openModal = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  modalVisible.value = true;
};

const monitorData = Array.from({ length: 20 }, (_, idx) => ({
  time: `09:${(10 + idx).toString().padStart(2, "0")}`,
  current: (1.8 + idx * 0.03).toFixed(2),
  torque: (12 + idx * 0.4).toFixed(1),
  temp: (32 + idx * 0.2).toFixed(1),
  vibration: (1.1 + idx * 0.05).toFixed(2),
  health: idx % 5 === 0 ? "关注" : "良好"
}));
</script>
