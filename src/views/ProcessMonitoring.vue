<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>改造过程进度监测</h2>
        <p>拆迁安置、基础设施、公共服务、产业导入全过程跟踪。</p>
      </div>
      <div class="actions">
        <button @click="openProgress('pipeline')">查看进度</button>
        <button class="ghost" @click="openWarning">滞后预警</button>
        <button class="ghost" @click="openUpdate">更新节点</button>
      </div>
    </div>

    <div class="progress-grid">
      <div class="card" v-for="item in progressCards" :key="item.title">
        <div class="top">
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
          <span class="badge">{{ item.status }}</span>
        </div>
        <div class="bar"><span :style="{ width: item.percent + '%' }"></span></div>
        <div class="footer">{{ item.percent }}% 完成 · 目标 {{ item.target }}</div>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>关键节点</th>
            <th>责任单位</th>
            <th>计划时间</th>
            <th>实际进度</th>
            <th>滞后天数</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in taskRows" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.plan }}</td>
            <td>
              <div class="mini-bar"><span :style="{ width: row.progress + '%' }"></span></div>
              {{ row.progress }}%
            </td>
            <td :class="{ delay: row.delay > 0 }">{{ row.delay }}</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="desc">{{ modal.desc }}</p>

        <div v-if="modal.type === 'progress'" class="progress-box">
          <div class="bar large"><span :style="{ width: modal.percent + '%' }"></span></div>
          <p class="center">当前整体完成 {{ modal.percent }}%，预计 {{ modal.eta }} 完成。</p>
        </div>

        <div v-else-if="modal.type === 'warning'" class="info-list">
          <p v-for="warn in warnings" :key="warn.title">⚠️ {{ warn.title }}：{{ warn.detail }}</p>
        </div>

        <div v-else class="form-grid">
          <label>节点名称<input v-model="form.name" placeholder="如：道路迁改完成" /></label>
          <label>完成百分比<input v-model="form.progress" type="number" min="0" max="100" /></label>
          <label>备注<input v-model="form.note" placeholder="输入说明" /></label>
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

const progressCards = [
  { title: '拆迁安置', desc: '签约、腾退、回迁房源调配', percent: 76, status: '稳步推进', target: '2024Q3' },
  { title: '基础设施建设', desc: '管网迁改、道路贯通、景观一体化', percent: 64, status: '在建', target: '2024Q4' },
  { title: '公共服务配套', desc: '学校、社区卫生、养老驿站同步建设', percent: 52, status: '协调中', target: '2025Q1' },
  { title: '产业导入', desc: '创新型企业与生活服务业引入', percent: 38, status: '招商中', target: '2025Q2' }
];

const taskRows = ref([
  { name: '签约完成率', owner: '征收办', plan: '2024-04', progress: 78, delay: 0, note: '按节点推进' },
  { name: '腾退交地', owner: '街道办', plan: '2024-04', progress: 70, delay: 3, note: '个别楼栋未腾退' },
  { name: '回迁房源锁定', owner: '住房保障中心', plan: '2024-05', progress: 55, delay: 0, note: '房源对接中' },
  { name: '安置补偿复核', owner: '财政局', plan: '2024-05', progress: 62, delay: 2, note: '待复核部分资料' },
  { name: '燃气迁改', owner: '城建集团', plan: '2024-06', progress: 40, delay: 6, note: '等待施工窗口' },
  { name: '强弱电下地', owner: '电力公司', plan: '2024-06', progress: 44, delay: 4, note: '材料配送延后' },
  { name: '海绵设施建设', owner: '市政院', plan: '2024-07', progress: 36, delay: 0, note: '设计深化中' },
  { name: '示范街景', owner: '建设局', plan: '2024-07', progress: 58, delay: 1, note: '招标完成' },
  { name: '学校主体封顶', owner: '教育局', plan: '2024-08', progress: 32, delay: 0, note: '桩基完成' },
  { name: '社区卫生中心', owner: '卫健委', plan: '2024-08', progress: 28, delay: 0, note: '方案评审' },
  { name: '养老驿站装修', owner: '民政局', plan: '2024-09', progress: 22, delay: 0, note: '立项审批' },
  { name: '公交首末站', owner: '交通委', plan: '2024-09', progress: 18, delay: 5, note: '施工许可证待办' },
  { name: 'TOD换乘大厅', owner: '轨道集团', plan: '2024-10', progress: 26, delay: 0, note: '地下结构施工' },
  { name: '创新企业签约', owner: '投促中心', plan: '2024-10', progress: 34, delay: 2, note: '首批意向达成' },
  { name: '公共空间导示系统', owner: '设计院', plan: '2024-11', progress: 20, delay: 0, note: '深化设计中' },
  { name: '慢行系统连通', owner: '交委', plan: '2024-11', progress: 25, delay: 3, note: '局部占道协调' },
  { name: '综合管廊联调', owner: '城建集团', plan: '2024-12', progress: 30, delay: 0, note: '设备进场' },
  { name: '雨污分流切换', owner: '水务局', plan: '2024-12', progress: 27, delay: 1, note: '夜间施工排期' },
  { name: '公共WiFi全覆盖', owner: '数字城管', plan: '2025-01', progress: 16, delay: 0, note: '试点部署' },
  { name: '社区运营团队进场', owner: '街道办', plan: '2025-01', progress: 14, delay: 0, note: '组建团队中' }
]);

const modal = reactive({ visible: false, title: '', desc: '', type: 'progress', percent: 0, eta: '' });
const warnings = ref([
  { title: '腾退交地滞后', detail: '腾退滞后 3 天，建议追加夜间施工班组。' },
  { title: '公交首末站施工证件', detail: '许可办理推进缓慢，需要市级协调窗口。' },
  { title: '慢行系统占道', detail: '施工占道需与交警协调分时段施工。' }
]);
const form = reactive({ name: '', progress: 0, note: '' });

const openProgress = () => {
  modal.visible = true;
  modal.type = 'progress';
  modal.title = '整体进度跟踪';
  modal.desc = '实时展示关键任务总完成度与预计交付时间。';
  modal.percent = 61;
  modal.eta = '2025年2月';
};

const openWarning = () => {
  modal.visible = true;
  modal.type = 'warning';
  modal.title = '滞后预警';
  modal.desc = '以下节点存在滞后风险，建议立即协调。';
};

const openUpdate = () => {
  modal.visible = true;
  modal.type = 'update';
  modal.title = '更新节点进展';
  modal.desc = '记录最新进展，自动同步至进度曲线。';
};

const submitModal = () => {
  modal.visible = false;
  if (modal.type === 'update' && form.name) {
    taskRows.value.unshift({
      name: form.name,
      owner: '项目上报',
      plan: '即时',
      progress: Number(form.progress) || 0,
      delay: 0,
      note: form.note || '已提交'
    });
    form.name = '';
    form.progress = 0;
    form.note = '';
  }
};
</script>

<style scoped>
.module { display: flex; flex-direction: column; gap: 14px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; }
.actions { display: flex; gap: 10px; }
button { padding: 10px 14px; border: none; border-radius: 10px; background: linear-gradient(90deg, #22d3ee, #3b82f6); color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 12px 30px rgba(59,130,246,0.25);} 
button.ghost { background: #e5edff; color: #3157c3; box-shadow: none; }

.progress-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 12px; }
.card { background: #f8fbff; border: 1px solid #e5edff; border-radius: 12px; padding: 12px; }
.top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.badge { background: #ecfeff; color: #0e7490; padding: 6px 10px; border-radius: 10px; font-weight: 700; }
.card h3 { margin: 0; }
.card p { margin: 4px 0 8px; color: #6b7280; }
.bar { background: #e5edff; height: 10px; border-radius: 10px; overflow: hidden; }
.bar span { display: block; height: 100%; background: linear-gradient(90deg,#34d399,#60a5fa); }
.footer { margin-top: 8px; color: #4b5563; font-size: 13px; }

.table-wrapper { border: 1px solid #e5edff; border-radius: 12px; overflow: auto; }
table { width: 100%; border-collapse: collapse; min-width: 880px; }
th, td { padding: 10px 12px; border-bottom: 1px solid #edf2fb; text-align: left; }
th { background: #f3f7ff; }
.mini-bar { background: #e5edff; height: 8px; border-radius: 8px; overflow: hidden; margin-bottom: 4px; }
.mini-bar span { display: block; height: 100%; background: linear-gradient(90deg,#f59e0b,#6366f1); }
.delay { color: #d14343; font-weight: 700; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.32); display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; padding: 18px; border-radius: 12px; width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.desc { color: #6b7280; margin: 6px 0 12px; }
.progress-box .bar.large { height: 16px; margin-bottom: 10px; }
.progress-box .center { text-align: center; color: #374151; }
.info-list { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 10px; color: #9a3412; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); gap: 10px; }
.form-grid label { display: flex; flex-direction: column; gap: 6px; color: #4b5563; font-size: 13px; }
.form-grid input { padding: 10px; border-radius: 10px; border: 1px solid #d8e2f2; }
.actions-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; }
</style>
