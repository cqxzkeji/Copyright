<template>
  <div class="page">
    <div class="grid three">
      <div class="card">
        <div class="section-title">智能调控概览</div>
        <p>当前自动策略：节水模式</p>
        <div class="control-tags">
          <span class="badge">灌溉设备 12 台</span>
          <span class="badge">通风设备 8 台</span>
          <span class="badge">遮阳系统 6 套</span>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('strategy')">调整策略</button>
          <button class="btn secondary" @click="openModal('schedule')">排班设置</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">调控联动模拟</div>
        <p>根据实时环境启动联动动作。</p>
        <div class="progress">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p class="progress-text">{{ progress }}% 联动已完成</p>
        <div class="actions">
          <button class="btn" @click="openModal('progress')">查看执行进度</button>
          <button class="btn ghost" @click="openModal('tip')">调控提示</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">手动控制面板</div>
        <div class="grid two">
          <button class="btn" @click="openModal('irrigation')">启动灌溉</button>
          <button class="btn secondary" @click="openModal('vent')">开启通风</button>
          <button class="btn ghost" @click="openModal('shade')">调节遮阳</button>
          <button class="btn" @click="openModal('stop')">停止全部设备</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">设备控制清单</div>
      <table class="table">
        <thead>
          <tr>
            <th>设备编号</th>
            <th>设备类型</th>
            <th>所在地块</th>
            <th>运行模式</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="device in devices" :key="device.id">
            <td>{{ device.id }}</td>
            <td>{{ device.type }}</td>
            <td>{{ device.zone }}</td>
            <td>{{ device.mode }}</td>
            <td><span class="tag">{{ device.status }}</span></td>
            <td>
              <button class="btn secondary" @click="openModal('device')">联动配置</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
      <div class="modal">
        <header>
          <h3>{{ modalTitle }}</h3>
          <button class="btn ghost" @click="closeModal">关闭</button>
        </header>
        <div class="modal-body">
          <template v-if="activeModal === 'strategy'">
            <p>选择新的智能调控策略，系统将同步更新设备执行计划。</p>
            <label>策略类型<select><option>节水模式</option><option>快速降温</option><option>夜间保温</option></select></label>
            <label>温度阈值<input type="number" placeholder="例如 28" /></label>
            <label>湿度阈值<input type="number" placeholder="例如 65" /></label>
          </template>
          <template v-else-if="activeModal === 'schedule'">
            <p>配置设备的自动排班执行时间。</p>
            <label>开始时间<input type="time" /></label>
            <label>结束时间<input type="time" /></label>
            <label>适用设备<select><option>灌溉</option><option>通风</option><option>遮阳</option></select></label>
          </template>
          <template v-else-if="activeModal === 'progress'">
            <p>联动任务正在执行。</p>
            <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
            <p>{{ progress }}% 已完成，预计 6 分钟完成全部动作。</p>
          </template>
          <template v-else-if="activeModal === 'tip'">
            <p>通风设备已在 10 分钟前启动，当前无需重复操作。</p>
          </template>
          <template v-else-if="activeModal === 'irrigation'">
            <p>启动灌溉将持续 18 分钟并覆盖 A/B/C 区。</p>
            <label>水量调节<input type="range" min="10" max="30" /></label>
            <label>覆盖地块<select><option>A区</option><option>B区</option><option>C区</option></select></label>
          </template>
          <template v-else-if="activeModal === 'vent'">
            <p>开启通风以降低温度和湿度。</p>
            <label>目标温度<input type="number" placeholder="例如 24" /></label>
            <label>通风时长<select><option>10 分钟</option><option>20 分钟</option><option>30 分钟</option></select></label>
          </template>
          <template v-else-if="activeModal === 'shade'">
            <p>调整遮阳强度，保护作物免受强光影响。</p>
            <label>遮阳比例<select><option>30%</option><option>50%</option><option>70%</option></select></label>
            <label>目标区域<select><option>西区大棚</option><option>东区温室</option></select></label>
          </template>
          <template v-else-if="activeModal === 'stop'">
            <p>确认停止全部设备运行？将进入安全待机模式。</p>
          </template>
          <template v-else>
            <p>配置设备联动计划，并同步到执行端。</p>
            <label>联动规则<select><option>温度高于 28°C 自动通风</option><option>湿度低于 60% 自动灌溉</option></select></label>
            <label>生效时间<input type="date" /></label>
          </template>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const progress = ref(62);
const activeModal = ref("");

const devices = Array.from({ length: 22 }, (_, index) => ({
  id: `DEV-${String(index + 1).padStart(3, "0")}`,
  type: index % 3 === 0 ? "灌溉" : index % 3 === 1 ? "通风" : "遮阳",
  zone: ["A区", "B区", "C区", "D区"][index % 4],
  mode: index % 2 === 0 ? "自动" : "手动",
  status: index % 5 === 0 ? "待机" : "运行中"
}));

const modalTitle = computed(() => {
  const titleMap = {
    strategy: "调整智能策略",
    schedule: "排班设置",
    progress: "联动执行进度",
    tip: "调控提示",
    irrigation: "启动灌溉",
    vent: "开启通风",
    shade: "调节遮阳",
    stop: "停止设备",
    device: "设备联动配置"
  };
  return titleMap[activeModal.value] || "提示";
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>

<style scoped>
.control-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.progress-text {
  margin: 12px 0;
  color: var(--muted);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.modal-body label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
}
</style>
