<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h3 class="section-title">调度管理</h3>
        <p style="color: var(--muted);">规划线路、派单调度、监控执行进度</p>
      </div>
      <div class="chip-row">
        <button class="btn" @click="modals.newTask=true">新建任务</button>
        <button class="btn secondary" @click="modals.optimize=true">优化路线</button>
        <button class="btn light" @click="modals.publish=true">发布调度</button>
      </div>
    </div>

    <div class="summary-grid" style="margin-top: 12px;">
      <div class="summary-card" v-for="card in highlights" :key="card.title">
        <h4 style="margin-bottom: 6px;">{{ card.title }}</h4>
        <div class="flex-between">
          <strong>{{ card.value }}</strong>
          <span class="status" :class="card.level">{{ card.state }}</span>
        </div>
        <div class="chart-bar" style="margin-top: 8px;"><span :style="{ width: card.progress }"></span></div>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="flex-between">
        <p class="section-title">调度任务列表</p>
        <span class="badge">10+ 路线</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务号</th>
            <th>线路</th>
            <th>里程(km)</th>
            <th>车辆</th>
            <th>司机</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.route }}</td>
            <td>{{ task.mileage }}</td>
            <td>{{ task.truck }}</td>
            <td>{{ task.driver }}</td>
            <td><span class="status" :class="task.level">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
      <div class="card" v-for="plan in plans" :key="plan.title" style="padding: 12px;">
        <div class="flex-between">
          <div>
            <h4 style="margin: 0;">{{ plan.title }}</h4>
            <p style="color: var(--muted); margin: 4px 0 0;">{{ plan.desc }}</p>
          </div>
          <span class="tag">{{ plan.window }}</span>
        </div>
        <p style="margin: 10px 0 4px; font-weight: 700;">进度</p>
        <div class="progress"><span :style="{ width: plan.progress }"></span></div>
      </div>
    </div>
  </div>

  <ModalDialog :visible="modals.newTask" title="新建调度任务" helper="完善任务信息" @close="modals.newTask=false" @confirm="modals.newTask=false">
    <div class="form-grid">
      <div class="form-group">
        <label>线路</label>
        <input placeholder="广州 → 深圳" />
      </div>
      <div class="form-group">
        <label>预计里程</label>
        <input type="number" placeholder="120" />
      </div>
      <div class="form-group">
        <label>车辆</label>
        <input placeholder="粤A-1023" />
      </div>
      <div class="form-group">
        <label>司机</label>
        <input placeholder="王师傅" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog :visible="modals.optimize" title="优化路线" helper="正在计算时间窗" @close="modals.optimize=false" @confirm="modals.optimize=false">
    <p>综合实时路况、装载量和温控需求生成最优路线。</p>
    <div class="progress" style="margin-top: 8px;"><span style="width: 58%"></span></div>
  </ModalDialog>

  <ModalDialog :visible="modals.publish" title="发布调度" helper="发布后推送到车载终端" @close="modals.publish=false" @confirm="modals.publish=false">
    <p>确认将最新排程同步给执行车辆与司机。</p>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const modals = reactive({ newTask: false, optimize: false, publish: false });

const highlights = [
  { title: '今日派单', value: '27', state: '高效', progress: '68%', level: 'safe' },
  { title: '待优化线路', value: '5 条', state: '跟进', progress: '42%', level: 'warn' },
  { title: '异常回传', value: '2 起', state: '关注', progress: '26%', level: 'warn' }
];

const tasks = [
  { id: 'D-1021', route: '广州 → 深圳', mileage: 118, truck: '粤A1023', driver: '王刚', status: '执行中', level: 'safe' },
  { id: 'D-1022', route: '佛山 → 东莞', mileage: 96, truck: '粤B5521', driver: '刘成', status: '装货', level: 'warn' },
  { id: 'D-1023', route: '长沙 → 合肥', mileage: 412, truck: '湘A2311', driver: '张磊', status: '执行中', level: 'safe' },
  { id: 'D-1024', route: '南京 → 上海', mileage: 268, truck: '皖A8121', driver: '周杰', status: '已抵达', level: 'safe' },
  { id: 'D-1025', route: '苏州 → 无锡', mileage: 45, truck: '苏B3321', driver: '郭琪', status: '执行中', level: 'safe' },
  { id: 'D-1026', route: '合肥 → 常州', mileage: 352, truck: '皖K2190', driver: '陈康', status: '待派车', level: 'warn' },
  { id: 'D-1027', route: '上海 → 嘉兴', mileage: 102, truck: '沪C8831', driver: '李岩', status: '执行中', level: 'safe' },
  { id: 'D-1028', route: '杭州 → 宁波', mileage: 178, truck: '浙B7721', driver: '陈敏', status: '装货', level: 'warn' },
  { id: 'D-1029', route: '温州 → 台州', mileage: 141, truck: '浙C5121', driver: '钱亮', status: '执行中', level: 'safe' },
  { id: 'D-1030', route: '广州 → 湘潭', mileage: 486, truck: '粤E3123', driver: '刘洋', status: '规划', level: 'warn' },
  { id: 'D-1031', route: '合肥 → 南京', mileage: 168, truck: '皖A1911', driver: '丁鹏', status: '已抵达', level: 'safe' }
];

const plans = [
  { title: '城市商超补货', desc: '夜间送达 12 家门店', window: '22:00-06:00', progress: '76%' },
  { title: '药品应急配送', desc: '冷链药品 5 库联动', window: '全天', progress: '64%' },
  { title: '农批市场联运', desc: '联运 3 个生鲜仓', window: '08:00-18:00', progress: '52%' }
];
</script>
