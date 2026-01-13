<template>
  <div class="grid grid-3">
    <ChartCard title="轨迹合格率" value="97.4%" subtitle="近24小时规划" badge="稳定" :data="[55, 60, 62, 70, 68, 75, 78]" />
    <ChartCard title="任务节拍" value="32.8 s" subtitle="平均节拍" badge="优化中" :data="[20, 24, 26, 29, 27, 32, 34]" />
    <ChartCard title="仿真通过率" value="94.2%" subtitle="离线仿真" badge="可发布" :data="[40, 44, 48, 52, 50, 58, 61]" />
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">运动控制与任务编排</div>
    <div class="toolbar" style="margin-bottom: 16px;">
      <button class="btn" @click="openModal('teach', '点位示教任务')">点位示教</button>
      <button class="btn btn-outline" @click="openModal('plan', '轨迹规划配置')">轨迹规划</button>
      <button class="btn btn-outline" @click="openModal('simulate', '离线仿真报告')">离线仿真</button>
      <button class="btn btn-accent" @click="openModal('deploy', '一键下发进度')">一键下发</button>
      <button class="btn btn-outline" @click="openModal('tips', '任务编排提示')">按钮提示</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>工序名称</th>
          <th>动作组</th>
          <th>节拍(s)</th>
          <th>仿真状态</th>
          <th>发布状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in taskList" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.group }}</td>
          <td>{{ task.cycle }}</td>
          <td>{{ task.sim }}</td>
          <td><span class="badge">{{ task.release }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal v-model="modalVisible" :title="modalTitle">
    <div v-if="modalType === 'teach'" class="form-row">
      <label class="form-group">
        <span>示教工位</span>
        <input class="form-input" placeholder="输入工位编号" />
      </label>
      <label class="form-group">
        <span>动作组名称</span>
        <input class="form-input" placeholder="动作组" />
      </label>
      <label class="form-group">
        <span>目标点数量</span>
        <input class="form-input" placeholder="输入点位数量" />
      </label>
      <label class="form-group">
        <span>速度等级</span>
        <select class="form-input">
          <option>精细</option>
          <option>标准</option>
          <option>高速</option>
        </select>
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>示教说明</span>
        <textarea class="form-input" rows="3" placeholder="输入示教说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存示教</button>
      </div>
    </div>

    <div v-else-if="modalType === 'plan'" class="form-row">
      <label class="form-group">
        <span>轨迹模式</span>
        <select class="form-input">
          <option>五次多项式</option>
          <option>样条曲线</option>
          <option>最短路径</option>
        </select>
      </label>
      <label class="form-group">
        <span>最大加速度</span>
        <input class="form-input" placeholder="mm/s²" />
      </label>
      <label class="form-group">
        <span>碰撞检测</span>
        <select class="form-input">
          <option>开启</option>
          <option>关闭</option>
        </select>
      </label>
      <label class="form-group">
        <span>节拍目标</span>
        <input class="form-input" placeholder="输入节拍(s)" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>工序说明</span>
        <textarea class="form-input" rows="3" placeholder="轨迹约束/安全区"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">生成轨迹</button>
      </div>
    </div>

    <div v-else-if="modalType === 'simulate'">
      <p>本次仿真覆盖 6 条工序、96 条轨迹，预测节拍优化 8.2%。</p>
      <div class="grid grid-2" style="margin-top: 16px;">
        <div class="card">
          <div class="stat-value">0.43 mm</div>
          <div class="stat-label">最大位置误差</div>
        </div>
        <div class="card">
          <div class="stat-value">2.8 %</div>
          <div class="stat-label">碰撞风险</div>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">关闭</button>
        <button class="btn">导出报告</button>
      </div>
    </div>

    <div v-else-if="modalType === 'deploy'">
      <p>正在向 5 套机械臂下发任务包，请保持网络稳定。</p>
      <div style="margin-top: 16px; display: grid; gap: 12px;">
        <div v-for="item in deployTasks" :key="item.name">
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
        <button class="btn btn-outline" @click="modalVisible = false">暂停下发</button>
        <button class="btn">确认继续</button>
      </div>
    </div>

    <div v-else>
      <p>提示：建议先完成轨迹规划与离线仿真，再执行一键下发。</p>
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
const modalType = ref("teach");
const modalTitle = ref("");

const openModal = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  modalVisible.value = true;
};

const taskList = Array.from({ length: 20 }, (_, idx) => ({
  id: `MO-${2001 + idx}`,
  name: idx % 3 === 0 ? "焊接工序" : idx % 3 === 1 ? "装配工序" : "搬运工序",
  group: `动作组-${(idx % 5) + 1}`,
  cycle: (28 + (idx % 6)).toFixed(1),
  sim: idx % 4 === 0 ? "待仿真" : "已通过",
  release: idx % 5 === 0 ? "待发布" : "已发布"
}));

const deployTasks = [
  { name: "柔性产线 A", progress: 45 },
  { name: "协作产线 B", progress: 66 },
  { name: "搬运产线 C", progress: 72 },
  { name: "精密装配 D", progress: 58 },
  { name: "焊接产线 E", progress: 80 }
];
</script>
