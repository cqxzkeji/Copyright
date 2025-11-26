<template>
  <div class="module">
    <div class="card">
      <div class="header">
        <div>
          <h3>分级预警总览</h3>
          <p class="muted">按照严重度分布的实时统计</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openProgress('同步历史告警')">同步</button>
          <button class="btn secondary" @click="openForm('新建预案')">预案维护</button>
          <button class="btn ghost" @click="openAlert('已推送最新告警至值班微信群。')">推送</button>
        </div>
      </div>
      <div class="tiles">
        <div v-for="item in tiles" :key="item.level" class="tile card">
          <div class="tile-top">
            <span class="badge" :class="item.badge">{{ item.level }}</span>
            <span class="chip">{{ item.count }} 条</span>
          </div>
          <h2>{{ item.desc }}</h2>
          <div class="progress-bar"><div class="fill" :style="{ width: item.ratio + '%' }"></div></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>最新告警记录</h3>
          <p class="muted">点击操作对单条预警进行处置</p>
        </div>
        <button class="btn" @click="openForm('批量处置')">批量处置</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>级别</th>
            <th>来源</th>
            <th>描述</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in alarms" :key="alarm.id">
            <td>{{ alarm.id }}</td>
            <td><span class="badge" :class="alarm.badge">{{ alarm.level }}</span></td>
            <td>{{ alarm.source }}</td>
            <td>{{ alarm.desc }}</td>
            <td>{{ alarm.time }}</td>
            <td class="actions">
              <button class="btn secondary" @click="openForm(`处置 ${alarm.id}`)">处置</button>
              <button class="btn ghost" @click="openAlert(`${alarm.id} 已通知巡检人员`)">通知</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal-panel">
        <h3>{{ modal.title }}</h3>
        <form v-if="modal.type === 'form'" @submit.prevent="submitForm">
          <div class="form-row">
            <label>处置人</label>
            <input v-model="form.owner" required />
          </div>
          <div class="form-row">
            <label>措施</label>
            <textarea v-model="form.action" rows="2" required></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn" type="submit">确认</button>
            <button class="btn ghost" type="button" @click="closeModal">取消</button>
          </div>
        </form>
        <div v-else-if="modal.type === 'progress'">
          <p class="muted">{{ modal.message }}</p>
          <div class="progress-bar"><div class="fill" :style="{ width: modal.progress + '%' }"></div></div>
          <p class="muted">{{ modal.progress }}% 完成</p>
          <div class="modal-actions">
            <button class="btn ghost" @click="closeModal">关闭</button>
          </div>
        </div>
        <div v-else>
          <p class="muted">{{ modal.message }}</p>
          <div class="modal-actions">
            <button class="btn" @click="closeModal">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tiles = [
  { level: 'Ⅰ级严重', count: 2, desc: '立即停运建议', ratio: 92, badge: 'danger' },
  { level: 'Ⅱ级预警', count: 5, desc: '需要人工复核', ratio: 68, badge: 'warning' },
  { level: 'Ⅲ级提示', count: 11, desc: '保持跟踪', ratio: 42, badge: 'success' },
];

const alarms = reactive([
  { id: 'AL-902', level: 'Ⅰ级', badge: 'danger', source: '绕组振动', desc: '高频振动超过 2.1g', time: '14:21:10' },
  { id: 'AL-876', level: 'Ⅱ级', badge: 'warning', source: '油温', desc: '油温高于 85℃', time: '14:20:48' },
  { id: 'AL-851', level: 'Ⅱ级', badge: 'warning', source: '局放', desc: '脉冲计数连续上升', time: '14:19:52' },
  { id: 'AL-830', level: 'Ⅲ级', badge: 'success', source: '铁芯位移', desc: '偏移趋势增加', time: '14:18:33' },
  { id: 'AL-818', level: 'Ⅲ级', badge: 'success', source: '风机', desc: '风机运行电流偏高', time: '14:17:59' },
]);

const modal = reactive({ visible: false, type: 'alert', title: '', message: '', progress: 0 });
const form = reactive({ owner: '值班员', action: '通知检修班组确认。' });
const timer = ref(null);

const openForm = (title) => {
  modal.visible = true;
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title) => {
  modal.visible = true;
  modal.type = 'progress';
  modal.title = title;
  modal.message = '正在同步并生成最新分级报表…';
  modal.progress = 15;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer.value);
    } else {
      modal.progress += 20;
    }
  }, 500);
};

const openAlert = (message) => {
  modal.visible = true;
  modal.type = 'alert';
  modal.title = '提示';
  modal.message = message;
};

const submitForm = () => {
  modal.type = 'alert';
  modal.title = '已提交';
  modal.message = '已记录措施并分配责任人。';
};

const closeModal = () => {
  modal.visible = false;
  clearInterval(timer.value);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.tiles {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

@media (min-width: 900px) {
  .tiles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.tile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions {
  display: flex;
  gap: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>
