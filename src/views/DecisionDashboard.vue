<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>综合决策支持与成果展示</h2>
        <p>可视化看板、趋势分析与阶段性成果集中展示。</p>
      </div>
      <div class="actions">
        <button @click="openModal('board')">看板设置</button>
        <button class="ghost" @click="openModal('trend')">推送简报</button>
        <button class="ghost" @click="openModal('showcase')">展示成果</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>阶段性成果</h3>
        <ul>
          <li v-for="item in highlights" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="card">
        <h3>趋势分析</h3>
        <div class="trend" v-for="t in trends" :key="t.label">
          <div class="label">{{ t.label }}</div>
          <div class="line">
            <span :style="{ width: t.value + '%', background: t.color }"></span>
          </div>
          <div class="value">{{ t.value }}%</div>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>事项</th>
            <th>牵头单位</th>
            <th>节点</th>
            <th>状态</th>
            <th>下一步</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in decisions" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.milestone }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.next }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="desc">{{ modal.desc }}</p>

        <div v-if="modal.type === 'board'" class="form-grid">
          <label>看板主题<input v-model="form.title" placeholder="如：周度例会" /></label>
          <label>展示范围<input v-model="form.scope" placeholder="全区/片区" /></label>
          <label>刷新频率<input v-model="form.frequency" placeholder="每日/每周" /></label>
        </div>

        <div v-else-if="modal.type === 'trend'" class="info-list">
          <p>• 将最新进展与滞后项推送至领导邮箱。</p>
          <p>• 支持一键导出PDF与截图打包。</p>
          <p>• 订阅人列表可在系统内维护。</p>
        </div>

        <div v-else class="info-list">
          <p>• 展示安置房封顶、示范街景、口袋公园等成果。</p>
          <p>• 可配置播放顺序与展示设备。</p>
          <p>• 支持导入图片和视频素材。</p>
        </div>

        <div class="actions-row">
          <button class="ghost" @click="modal.visible = false">取消</button>
          <button @click="submitModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const highlights = [
  '首批安置房主体封顶并启动样板间开放',
  '公共空间示范段亮灯，累计吸引 3 万人次',
  'TOD 综合体地下结构完成，地上商业启动招标',
  '城市记忆馆完成布展设计，进入施工阶段'
];

const trends = [
  { label: '开工率', value: 78, color: '#22c55e' },
  { label: '资金执行率', value: 66, color: '#3b82f6' },
  { label: '公共服务达成度', value: 59, color: '#f59e0b' },
  { label: '产业导入进度', value: 44, color: '#8b5cf6' }
];

const decisions = ref([
  { name: '学校扩容方案审议', owner: '教育局', milestone: '2024-05-20', status: '待审议', next: '专家评审' },
  { name: '示范街景运营方案', owner: '城运公司', milestone: '2024-05-18', status: '进行中', next: '票价策略确定' },
  { name: '安置房分配规则', owner: '住保中心', milestone: '2024-05-15', status: '已完成', next: '公示名单' },
  { name: '社区卫生中心设备采购', owner: '卫健委', milestone: '2024-05-22', status: '招标中', next: '评标定标' },
  { name: '文化记忆馆施工许可', owner: '文旅局', milestone: '2024-05-25', status: '办理中', next: '现场踏勘' },
  { name: '能源站并网方案', owner: '发改局', milestone: '2024-05-30', status: '对接中', next: '技术审查' },
  { name: '夜间经济运营指引', owner: '商务局', milestone: '2024-06-05', status: '编制中', next: '征求意见' },
  { name: '智慧感知平台调试', owner: '数字城管', milestone: '2024-06-10', status: '调试中', next: '联调演练' },
  { name: '绿色建筑标识申报', owner: '住建局', milestone: '2024-06-15', status: '准备中', next: '资料收集' },
  { name: '社区共建议题发布', owner: '街道办', milestone: '2024-06-20', status: '进行中', next: '收集反馈' }
]);

const modal = reactive({ visible: false, type: 'board', title: '', desc: '' });
const form = reactive({ title: '', scope: '', frequency: '' });

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  if (type === 'board') {
    modal.title = '看板设置';
    modal.desc = '调整看板主题、范围与刷新频率。';
  } else if (type === 'trend') {
    modal.title = '推送简报';
    modal.desc = '生成数据快照并推送指定订阅人。';
  } else {
    modal.title = '成果展示';
    modal.desc = '配置阶段成果素材并启动展示。';
  }
};

const submitModal = () => {
  modal.visible = false;
  if (modal.type === 'board' && form.title) {
    highlights.unshift(`已设置看板：${form.title}`);
    form.title = form.scope = form.frequency = '';
  }
};
</script>

<style scoped>
.module { display: flex; flex-direction: column; gap: 14px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; }
.actions { display: flex; gap: 10px; }
button { padding: 10px 14px; border: none; border-radius: 10px; background: linear-gradient(90deg, #22d3ee, #3b82f6); color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 12px 30px rgba(59,130,246,0.25); }
button.ghost { background: #e5edff; color: #3157c3; box-shadow: none; }

.grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 12px; }
.card { background: #f8fbff; border: 1px solid #e5edff; border-radius: 12px; padding: 12px; }
.card ul { padding-left: 18px; margin: 8px 0 0; color: #4b5563; }
.card li { margin-bottom: 6px; }
.trend { display: grid; grid-template-columns: 120px 1fr 60px; align-items: center; gap: 8px; margin-bottom: 8px; }
.trend .line { background: #e5edff; height: 10px; border-radius: 10px; overflow: hidden; }
.trend .line span { display: block; height: 100%; }

.table-wrapper { border: 1px solid #e5edff; border-radius: 12px; overflow: auto; }
table { width: 100%; min-width: 760px; border-collapse: collapse; }
th, td { padding: 10px 12px; border-bottom: 1px solid #edf2fb; text-align: left; }
th { background: #f3f7ff; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.32); display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 18px; border-radius: 12px; width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.desc { color: #6b7280; margin: 6px 0 12px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 10px; }
.form-grid label { display: flex; flex-direction: column; gap: 6px; color: #4b5563; font-size: 13px; }
.form-grid input { padding: 10px; border-radius: 10px; border: 1px solid #d8e2f2; }
.info-list { background: #f5f7ff; border: 1px dashed #c7d2fe; border-radius: 10px; padding: 12px; color: #4b5563; }
.actions-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; }
</style>
