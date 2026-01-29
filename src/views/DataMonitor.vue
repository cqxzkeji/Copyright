<template>
  <div class="card-grid">
    <section class="card">
      <h2>实时数据监控</h2>
      <p>持续记录动作数据，自动生成关键指标趋势。</p>
      <div class="chart" style="margin-top: 12px;">
        <div
          v-for="(value, index) in trend"
          :key="index"
          class="chart-bar"
          :style="{ height: `${value}%` }"
        ></div>
      </div>
      <div class="button-group" style="margin-top: 16px;">
        <button class="primary-button" type="button" @click="openModal('report')">生成报告</button>
        <button class="secondary-button" type="button" @click="openModal('export')">导出图表</button>
        <button class="secondary-button" type="button" @click="openModal('alert')">异常提醒</button>
        <button class="secondary-button" type="button" @click="openModal('tip')">指标说明</button>
      </div>
    </section>
    <section class="card">
      <h2>动作数据记录</h2>
      <p>最近训练记录共 {{ records.length }} 条，支持实时检索。</p>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>学员</th>
            <th>动作类型</th>
            <th>完整度</th>
            <th>状态</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.user }}</td>
            <td>{{ record.action }}</td>
            <td>{{ record.score }}%</td>
            <td><span class="badge">{{ record.status }}</span></td>
            <td>{{ record.time }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="card">
      <h2>监控指标设置</h2>
      <p>自定义关键指标阈值，自动触发提醒。</p>
      <div class="form-grid" style="margin-top: 12px;">
        <label>
          稳定性阈值
          <input v-model="metrics.stability" />
        </label>
        <label>
          完整度阈值
          <input v-model="metrics.completion" />
        </label>
        <label>
          延迟上限
          <input v-model="metrics.latency" />
        </label>
      </div>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('save')">保存阈值</button>
      </div>
    </section>
  </div>
  <BaseModal :open="modal.open" :title="modal.title" @close="closeModal" @confirm="confirmModal">
    <div v-if="modal.type === 'report'">
      <p>选择报告范围与格式，系统将生成统计分析报告。</p>
      <div class="form-grid">
        <label>
          报告周期
          <select v-model="modalForm.range">
            <option value="daily">今日训练</option>
            <option value="weekly">本周训练</option>
            <option value="monthly">本月训练</option>
          </select>
        </label>
        <label>
          报告格式
          <select v-model="modalForm.format">
            <option value="pdf">PDF</option>
            <option value="ppt">PPT</option>
            <option value="doc">Word</option>
          </select>
        </label>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track"><span style="width: 62%"></span></div>
        <small>分析进度 62%</small>
      </div>
    </div>
    <div v-else-if="modal.type === 'export'">
      <p>选择导出图表类型，支持多维度指标。</p>
      <div class="form-grid">
        <label>
          图表类型
          <select v-model="modalForm.chart">
            <option value="bar">柱状图</option>
            <option value="line">折线图</option>
            <option value="radar">雷达图</option>
          </select>
        </label>
        <label>
          导出分辨率
          <input v-model="modalForm.resolution" />
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'alert'">
      <p>设置异常提醒对象与通道，及时干预训练过程。</p>
      <div class="form-grid">
        <label>
          通知对象
          <input v-model="modalForm.receiver" placeholder="请输入联系人" />
        </label>
        <label>
          通知方式
          <select v-model="modalForm.channel">
            <option value="sms">短信</option>
            <option value="app">App 推送</option>
            <option value="email">邮件</option>
          </select>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'save'">
      <p>确认保存监控阈值并同步到当前训练中心。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 85%"></span></div>
      <small>同步进度 85%</small>
    </div>
    <div v-else>
      <p>稳定性用于评估动作连贯程度，完整度衡量动作达标比例。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 100%"></span></div>
      <small>指标说明已更新</small>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const trend = [72, 86, 64, 90, 78, 88, 70, 96]

const records = [
  { id: 1, user: '李欣', action: '手势控制', score: 91, status: '正常', time: '09:02' },
  { id: 2, user: '王敏', action: '上肢伸展', score: 88, status: '正常', time: '09:05' },
  { id: 3, user: '周杰', action: '下蹲训练', score: 76, status: '关注', time: '09:10' },
  { id: 4, user: '陈晓', action: '步态评估', score: 82, status: '正常', time: '09:12' },
  { id: 5, user: '刘晨', action: '躯干扭转', score: 90, status: '正常', time: '09:18' },
  { id: 6, user: '孙怡', action: '平衡测试', score: 79, status: '关注', time: '09:20' },
  { id: 7, user: '张琳', action: '手势控制', score: 93, status: '正常', time: '09:23' },
  { id: 8, user: '赵彤', action: '上肢伸展', score: 86, status: '正常', time: '09:30' },
  { id: 9, user: '曹宇', action: '步态评估', score: 84, status: '正常', time: '09:33' },
  { id: 10, user: '杨柳', action: '下蹲训练', score: 74, status: '关注', time: '09:40' },
  { id: 11, user: '魏强', action: '躯干扭转', score: 89, status: '正常', time: '09:42' },
  { id: 12, user: '贾文', action: '平衡测试', score: 80, status: '正常', time: '09:48' },
  { id: 13, user: '洪涛', action: '手势控制', score: 92, status: '正常', time: '09:52' },
  { id: 14, user: '丁露', action: '上肢伸展', score: 87, status: '正常', time: '09:55' },
  { id: 15, user: '叶青', action: '步态评估', score: 83, status: '正常', time: '10:02' },
  { id: 16, user: '罗娜', action: '下蹲训练', score: 78, status: '关注', time: '10:05' },
  { id: 17, user: '林越', action: '躯干扭转', score: 90, status: '正常', time: '10:08' },
  { id: 18, user: '许晨', action: '平衡测试', score: 85, status: '正常', time: '10:12' },
  { id: 19, user: '廖菲', action: '手势控制', score: 94, status: '正常', time: '10:18' },
  { id: 20, user: '邹宁', action: '上肢伸展', score: 88, status: '正常', time: '10:20' },
  { id: 21, user: '姚雅', action: '步态评估', score: 81, status: '正常', time: '10:24' },
  { id: 22, user: '毛莉', action: '下蹲训练', score: 77, status: '关注', time: '10:28' },
  { id: 23, user: '朱敏', action: '躯干扭转', score: 88, status: '正常', time: '10:31' },
  { id: 24, user: '韩雪', action: '平衡测试', score: 82, status: '正常', time: '10:35' }
]

const metrics = reactive({
  stability: '低于 80% 提醒',
  completion: '低于 75% 提醒',
  latency: '超过 50ms 提醒'
})

const modalForm = reactive({
  range: 'weekly',
  format: 'pdf',
  chart: 'bar',
  resolution: '1920x1080',
  receiver: '张教练',
  channel: 'app'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'report'
})

const openModal = (type) => {
  modal.open = true
  modal.type = type
  const titles = {
    report: '生成监控报告',
    export: '导出图表',
    alert: '异常提醒设置',
    save: '保存阈值',
    tip: '指标说明'
  }
  modal.title = titles[type] || '提示'
}

const closeModal = () => {
  modal.open = false
}

const confirmModal = () => {
  modal.open = false
}
</script>
