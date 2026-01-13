<template>
  <div class="grid grid-3">
    <ChartCard title="告警响应" value="13 min" subtitle="平均响应时长" badge="提升" :data="[18, 16, 15, 14, 13, 12, 13]" />
    <ChartCard title="工单完成率" value="88%" subtitle="近7天" badge="稳定" :data="[60, 62, 65, 70, 72, 76, 80]" />
    <ChartCard title="备件充足率" value="94%" subtitle="关键备件" badge="充足" :data="[70, 74, 78, 80, 83, 86, 90]" />
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">告警联动与运维维保</div>
    <div class="toolbar" style="margin-bottom: 16px;">
      <button class="btn" @click="openModal('alarm', '阈值告警设置')">阈值告警</button>
      <button class="btn btn-outline" @click="openModal('diagnosis', '故障诊断工单')">故障诊断</button>
      <button class="btn btn-outline" @click="openModal('spare', '备件领用申请')">备件管理</button>
      <button class="btn btn-accent" @click="openModal('maintenance', '维保计划进度')">维保计划</button>
      <button class="btn btn-outline" @click="openModal('tips', '运维提示')">按钮提示</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>工单编号</th>
          <th>告警类型</th>
          <th>设备</th>
          <th>责任人</th>
          <th>处理状态</th>
          <th>预计完成</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in workOrders" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.device }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.status }}</td>
          <td><span class="badge">{{ item.due }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal v-model="modalVisible" :title="modalTitle">
    <div v-if="modalType === 'alarm'" class="form-row">
      <label class="form-group">
        <span>监测指标</span>
        <select class="form-input">
          <option>电流</option>
          <option>扭矩</option>
          <option>温度</option>
          <option>振动</option>
        </select>
      </label>
      <label class="form-group">
        <span>阈值</span>
        <input class="form-input" placeholder="请输入阈值" />
      </label>
      <label class="form-group">
        <span>告警等级</span>
        <select class="form-input">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
      <label class="form-group">
        <span>联动方式</span>
        <select class="form-input">
          <option>短信+邮件</option>
          <option>工单</option>
          <option>声光报警</option>
        </select>
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>说明</span>
        <textarea class="form-input" rows="3" placeholder="联动策略说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存阈值</button>
      </div>
    </div>

    <div v-else-if="modalType === 'diagnosis'" class="form-row">
      <label class="form-group">
        <span>故障描述</span>
        <input class="form-input" placeholder="输入故障描述" />
      </label>
      <label class="form-group">
        <span>设备编号</span>
        <input class="form-input" placeholder="RB-1001" />
      </label>
      <label class="form-group">
        <span>紧急程度</span>
        <select class="form-input">
          <option>紧急</option>
          <option>一般</option>
          <option>低</option>
        </select>
      </label>
      <label class="form-group">
        <span>责任班组</span>
        <input class="form-input" placeholder="输入班组" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>诊断说明</span>
        <textarea class="form-input" rows="3" placeholder="填写诊断建议"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">生成工单</button>
      </div>
    </div>

    <div v-else-if="modalType === 'spare'" class="form-row">
      <label class="form-group">
        <span>备件名称</span>
        <input class="form-input" placeholder="编码器" />
      </label>
      <label class="form-group">
        <span>规格型号</span>
        <input class="form-input" placeholder="XJ-2024" />
      </label>
      <label class="form-group">
        <span>数量</span>
        <input class="form-input" placeholder="请输入数量" />
      </label>
      <label class="form-group">
        <span>用途工位</span>
        <input class="form-input" placeholder="装配线" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>备注</span>
        <textarea class="form-input" rows="3" placeholder="领用说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">提交申请</button>
      </div>
    </div>

    <div v-else-if="modalType === 'maintenance'">
      <p>本月计划完成 18 项维保，当前完成 11 项。</p>
      <div style="margin-top: 16px; display: grid; gap: 12px;">
        <div v-for="item in maintenancePlan" :key="item.name">
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
        <button class="btn btn-outline" @click="modalVisible = false">暂停计划</button>
        <button class="btn">更新进度</button>
      </div>
    </div>

    <div v-else>
      <p>提示：建议设置分级阈值告警与工单联动，确保运维闭环。</p>
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
const modalType = ref("alarm");
const modalTitle = ref("");

const openModal = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  modalVisible.value = true;
};

const workOrders = Array.from({ length: 20 }, (_, idx) => ({
  id: `AL-${3001 + idx}`,
  type: idx % 3 === 0 ? "温度超限" : idx % 3 === 1 ? "扭矩波动" : "振动异常",
  device: `RB-${1001 + idx}`,
  owner: idx % 2 === 0 ? "张工" : "李工",
  status: idx % 4 === 0 ? "处理中" : "待处理",
  due: `2024-09-${(10 + idx).toString().padStart(2, "0")}`
}));

const maintenancePlan = [
  { name: "润滑保养", progress: 62 },
  { name: "传感器复检", progress: 45 },
  { name: "驱动器清洁", progress: 78 },
  { name: "安全回路检查", progress: 53 }
];
</script>
