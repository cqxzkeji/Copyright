<template>
  <div class="card">
    <div class="section-header">
      <h3>主播管理</h3>
      <div class="btn-group">
        <button class="btn" type="button" @click="showForm = true">新增主播</button>
        <button class="btn secondary" type="button" @click="showProgress = true">排班同步</button>
        <button class="btn warn" type="button" @click="showTip = true">绩效提醒</button>
      </div>
    </div>
    <p class="section-desc">维护主播档案、排班与培训状态。</p>
  </div>

  <div class="card">
    <h3>主播档案</h3>
    <table class="table">
      <thead>
        <tr>
          <th>主播</th>
          <th>擅长品类</th>
          <th>粉丝数</th>
          <th>评分</th>
          <th>排班</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="anchor in anchors" :key="anchor.name">
          <td>{{ anchor.name }}</td>
          <td>{{ anchor.category }}</td>
          <td>{{ anchor.fans }}</td>
          <td>{{ anchor.score }}</td>
          <td>{{ anchor.shift }}</td>
          <td><span class="tag">{{ anchor.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h3>培训计划</h3>
    <table class="table">
      <thead>
        <tr>
          <th>课程</th>
          <th>负责人</th>
          <th>时间</th>
          <th>参与人数</th>
          <th>进度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="train in trainings" :key="train.course">
          <td>{{ train.course }}</td>
          <td>{{ train.owner }}</td>
          <td>{{ train.time }}</td>
          <td>{{ train.count }}</td>
          <td>{{ train.progress }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新增主播" @close="showForm = false">
    <div class="form-grid">
      <div class="form-item">
        <label>主播姓名</label>
        <input placeholder="输入姓名" />
      </div>
      <div class="form-item">
        <label>擅长品类</label>
        <select>
          <option>果蔬</option>
          <option>粮油</option>
          <option>生鲜</option>
          <option>特产</option>
        </select>
      </div>
      <div class="form-item">
        <label>粉丝基础</label>
        <input placeholder="输入粉丝数" />
      </div>
      <div class="form-item">
        <label>排班周期</label>
        <input type="date" />
      </div>
      <div class="form-item" style="grid-column: 1 / -1;">
        <label>标签备注</label>
        <textarea rows="3" placeholder="主播标签"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showForm = false">取消</button>
      <button class="btn" type="button" @click="showForm = false">保存档案</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="排班同步" @close="showProgress = false">
    <p>正在同步主播排班与直播计划。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: '72%' }"></div>
    </div>
    <template #footer>
      <button class="btn" type="button" @click="showProgress = false">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showTip" title="绩效提醒" @close="showTip = false">
    <p>有 3 位主播近 7 日带货转化率低于 5%，建议跟进辅导。</p>
    <template #footer>
      <button class="btn" type="button" @click="showTip = false">了解</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)

const anchors = [
  { name: '林晓雨', category: '果蔬', fans: '32.4万', score: '4.8', shift: '晚场', status: '在播' },
  { name: '赵子涵', category: '粮油', fans: '28.6万', score: '4.7', shift: '午场', status: '待命' },
  { name: '周雪', category: '特产', fans: '21.3万', score: '4.6', shift: '晚场', status: '在播' },
  { name: '何乐乐', category: '生鲜', fans: '19.8万', score: '4.5', shift: '早场', status: '休息' },
  { name: '李沐', category: '果蔬', fans: '17.9万', score: '4.4', shift: '午场', status: '培训中' },
  { name: '陈果', category: '乳品', fans: '14.5万', score: '4.3', shift: '晚场', status: '待命' },
  { name: '魏然', category: '粮油', fans: '12.8万', score: '4.2', shift: '早场', status: '在播' },
  { name: '杨澈', category: '果蔬', fans: '10.6万', score: '4.1', shift: '午场', status: '待命' },
  { name: '苏婧', category: '特产', fans: '9.2万', score: '4.0', shift: '晚场', status: '休息' },
  { name: '郭晨', category: '生鲜', fans: '8.4万', score: '3.9', shift: '早场', status: '培训中' }
]

const trainings = [
  { course: '新品卖点梳理', owner: '运营一组', time: '周一 14:00', count: '12', progress: '已完成' },
  { course: '直播互动话术', owner: '培训部', time: '周二 10:00', count: '18', progress: '进行中' },
  { course: '粉丝私域运营', owner: '市场部', time: '周三 16:00', count: '15', progress: '进行中' },
  { course: '危机处理演练', owner: '客服组', time: '周四 09:30', count: '10', progress: '待开始' },
  { course: '直播设备优化', owner: '技术部', time: '周四 15:00', count: '9', progress: '待开始' },
  { course: '区域农品介绍', owner: '供应链', time: '周五 11:00', count: '14', progress: '待开始' },
  { course: '复盘数据分析', owner: '数据组', time: '周五 16:00', count: '11', progress: '待开始' },
  { course: '短视频剪辑', owner: '内容组', time: '周六 10:30', count: '13', progress: '待开始' },
  { course: '场景布置规范', owner: '运营二组', time: '周六 15:00', count: '8', progress: '待开始' },
  { course: '会员留存策略', owner: '市场部', time: '周日 14:00', count: '16', progress: '待开始' }
]
</script>

<style scoped>
.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-desc {
  color: #6b7280;
  margin: 12px 0 0;
}
</style>
