<template>
  <div class="page">
    <div class="grid three">
      <div class="card">
        <div class="section-title">预警统计</div>
        <div class="warn-number">今日预警 {{ stats.today }} 条</div>
        <p>处理中 {{ stats.processing }} 条 / 已关闭 {{ stats.closed }} 条</p>
        <div class="actions">
          <button class="btn" @click="openModal('create')">新建预警规则</button>
          <button class="btn secondary" @click="openModal('guide')">处理指引</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">风险趋势</div>
        <div class="bar-chart">
          <div v-for="item in trend" :key="item.time" class="bar-item">
            <span>{{ item.time }}</span>
            <div class="bar">
              <span :style="{ width: item.value + '%' }"></span>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('analysis')">趋势分析</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">预警处置进度</div>
        <p>重点关注温度异常与病害风险。</p>
        <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
        <p class="progress-text">{{ progress }}% 预警已处置</p>
        <div class="actions">
          <button class="btn" @click="openModal('progress')">查看详情</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">预警列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>类型</th>
            <th>地块</th>
            <th>等级</th>
            <th>触发时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in warnings" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.zone }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.time }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>
              <button class="btn secondary" @click="openModal('handle')">处置</button>
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
          <template v-if="activeModal === 'create'">
            <p>配置新的预警规则以提升监测敏感度。</p>
            <label>预警类型<select><option>温度异常</option><option>湿度过高</option><option>病害风险</option></select></label>
            <label>阈值<input type="number" placeholder="例如 30" /></label>
            <label>通知方式<select><option>短信</option><option>平台通知</option><option>邮件</option></select></label>
          </template>
          <template v-else-if="activeModal === 'guide'">
            <p>建议优先处理高等级预警，并记录处置措施。</p>
          </template>
          <template v-else-if="activeModal === 'analysis'">
            <p>风险趋势显示近期光照偏强，建议增加遮阳策略。</p>
          </template>
          <template v-else-if="activeModal === 'progress'">
            <p>预警处置进度正在更新。</p>
            <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
            <p>{{ progress }}% 已完成处置。</p>
          </template>
          <template v-else>
            <p>填写预警处置方案并确认执行。</p>
            <label>处置人员<input placeholder="输入责任人" /></label>
            <label>措施<select><option>增设通风</option><option>调整灌溉</option><option>喷雾降温</option></select></label>
            <label>备注<textarea rows="3" placeholder="处置记录"></textarea></label>
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

const stats = { today: 12, processing: 4, closed: 8 };
const progress = ref(74);
const activeModal = ref("");

const trend = [
  { time: "周一", value: 35 },
  { time: "周二", value: 50 },
  { time: "周三", value: 42 },
  { time: "周四", value: 60 },
  { time: "周五", value: 70 },
  { time: "周六", value: 55 },
  { time: "周日", value: 45 }
];

const warnings = Array.from({ length: 21 }, (_, index) => ({
  id: `WARN-${100 + index}`,
  type: index % 3 === 0 ? "温度异常" : index % 3 === 1 ? "湿度过高" : "病害风险",
  zone: ["A区", "B区", "C区", "D区"][index % 4],
  level: ["高", "中", "低"][index % 3],
  time: `2024-06-1${index % 10} ${8 + (index % 6)}:30`,
  status: index % 4 === 0 ? "处理中" : "已关闭"
}));

const modalTitle = computed(() => {
  const titleMap = {
    create: "新建预警规则",
    guide: "处理指引",
    analysis: "趋势分析",
    progress: "处置进度",
    handle: "预警处置"
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
.warn-number {
  font-size: 28px;
  font-weight: 600;
  margin: 8px 0;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.bar {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
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
