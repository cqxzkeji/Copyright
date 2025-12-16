<template>
  <section>
    <div class="topbar" style="padding: 14px 16px;">
      <div class="title">风险预警与应对</div>
      <div class="actions">
        <button class="btn" @click="showPush = true">推送预警</button>
        <button class="btn primary" @click="showDrill = true">执行应急演练</button>
        <button class="btn" @click="showAdvice = true">生成改进建议</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>预警覆盖</h3>
        <div class="tag-grid">
          <div class="tag" v-for="channel in channels" :key="channel">{{ channel }}</div>
        </div>
        <p class="hint">多渠道同步预警，确保核心团队在 5 分钟内收到提醒。</p>
      </div>
      <div class="card">
        <h3>演练进展</h3>
        <div class="info-grid">
          <div class="item" v-for="drill in drills" :key="drill.name">
            <strong>{{ drill.status }}</strong>
            <div>{{ drill.name }}</div>
            <div class="progress" style="margin-top: 8px;">
              <div class="bar" :style="{ width: `${drill.progress}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>预警事件列表</h3>
        <button class="btn primary" @click="showPush = true">批量推送</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>事件</th>
            <th>等级</th>
            <th>影响环节</th>
            <th>责任人</th>
            <th>处理时限</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in warnings" :key="item.event">
            <td>{{ item.event }}</td>
            <td><span class="badge">{{ item.level }}</span></td>
            <td>{{ item.stage }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.deadline }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showPush" title="推送预警" @confirm="showPush = false">
      <div class="form-grid">
        <label>
          选择事件
          <select>
            <option v-for="item in warnings" :key="item.event">{{ item.event }}</option>
          </select>
        </label>
        <label>
          通知渠道
          <select>
            <option>短信</option>
            <option>邮件</option>
            <option>企业 IM</option>
          </select>
        </label>
      </div>
    </BaseModal>

    <BaseModal v-model="showDrill" title="应急演练进度" @confirm="runDrill">
      <p>演练会同步更新演练清单并记录响应时间。</p>
      <div class="progress">
        <div class="bar" :style="{ width: `${drillProgress}%` }"></div>
      </div>
      <p style="text-align: right; margin: 6px 0 0;">当前进度：{{ drillProgress }}%</p>
    </BaseModal>

    <BaseModal v-model="showAdvice" title="改进建议" @confirm="showAdvice = false">
      <p>系统根据预警事件与演练表现生成可行动建议。</p>
      <ul>
        <li>针对高等级预警，建议增加 20% 备用库存并启用跨区域调拨。</li>
        <li>演练中响应超时的环节需优化 SOP 并增加值班人手。</li>
        <li>对接 IT 运维团队，确保报警链路不间断。</li>
      </ul>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showPush = ref(false);
const showDrill = ref(false);
const showAdvice = ref(false);
const drillProgress = ref(35);

const channels = reactive(['短信', '邮件', '企业 IM', '电话语音', '应急大屏', '现场广播']);

const drills = reactive([
  { name: '供应中断演练', status: '进行中', progress: 55 },
  { name: '物流延误演练', status: '待启动', progress: 20 },
  { name: '需求暴增演练', status: '已完成', progress: 100 },
  { name: '质量召回演练', status: '排期中', progress: 40 }
]);

const warnings = reactive([
  { event: '供应延迟', level: '高', stage: '采购', owner: '刘明', deadline: '2 小时' },
  { event: '港口拥堵', level: '中', stage: '运输', owner: '王芳', deadline: '6 小时' },
  { event: '库存不足', level: '高', stage: '仓储', owner: '赵强', deadline: '3 小时' },
  { event: '运输延误', level: '中', stage: '运输', owner: '刘颖', deadline: '8 小时' },
  { event: '需求突增', level: '高', stage: '销售', owner: '陈凯', deadline: '4 小时' },
  { event: '质量异常', level: '中', stage: '质检', owner: '张敏', deadline: '12 小时' },
  { event: '信息中断', level: '高', stage: 'IT', owner: '李静', deadline: '1 小时' },
  { event: '设备故障', level: '中', stage: '生产', owner: '孙浩', deadline: '10 小时' },
  { event: '天气预警', level: '中', stage: '运输', owner: '王勇', deadline: '6 小时' },
  { event: '合规风险', level: '低', stage: '法务', owner: '周莉', deadline: '24 小时' }
]);

const runDrill = () => {
  drillProgress.value = 0;
  const timer = setInterval(() => {
    drillProgress.value += 22;
    if (drillProgress.value >= 100) {
      drillProgress.value = 100;
      clearInterval(timer);
    }
  }, 220);
};
</script>
