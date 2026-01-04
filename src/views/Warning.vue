<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section-header">
        <div>
          <p class="eyebrow">风险预警管理</p>
          <h3>基于指标阈值进行风险评估，异常自动预警</h3>
        </div>
        <div class="chip-row">
          <button class="btn" @click="showThreshold = true">设置阈值</button>
          <button class="btn secondary" @click="simulatePreCheck">预警校验</button>
          <button class="btn secondary" @click="openInfo('短信与微信推送均已开启。')">通知配置</button>
        </div>
      </header>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="card" style="background:#fef2f2;">
          <p class="eyebrow">高风险</p>
          <h2>{{ risks.high.length }} 例</h2>
          <p>需要立即跟进</p>
        </div>
        <div class="card" style="background:#fff7ed;">
          <p class="eyebrow">中风险</p>
          <h2>{{ risks.medium.length }} 例</h2>
          <p>建议安排复查</p>
        </div>
        <div class="card" style="background:#ecfdf3;">
          <p class="eyebrow">低风险</p>
          <h2>{{ risks.low.length }} 例</h2>
          <p>持续跟踪</p>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="section-header">
        <h3>预警列表</h3>
        <small>异常会自动升级并提示</small>
        <div class="chip-row">
          <button class="btn secondary" @click="showMute = true">调整提醒频次</button>
          <button class="btn secondary" @click="openInfo('已导出至 warning-report.pdf')">导出预警</button>
        </div>
      </header>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>患者</th>
              <th>触发指标</th>
              <th>数值</th>
              <th>风险等级</th>
              <th>时间</th>
              <th>处理</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in warnings" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.indicator }}</td>
              <td>{{ item.value }}</td>
              <td><span class="badge" :class="item.level">{{ item.levelText }}</span></td>
              <td>{{ item.time }}</td>
              <td>
                <button class="btn secondary" @click="openInfo('已通知护理人员联系 ' + item.name)">通知护理</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showThreshold" title="设置预警阈值">
    <form class="grid" @submit.prevent="saveThreshold">
      <div class="form-row">
        <div>
          <label>血肌酐 (µmol/L)</label>
          <input v-model.number="thresholds.creatinine" required />
        </div>
        <div>
          <label>eGFR 下限</label>
          <input v-model.number="thresholds.egfr" required />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>尿蛋白 (mg/L)</label>
          <input v-model.number="thresholds.protein" required />
        </div>
        <div>
          <label>血压上限 (mmHg)</label>
          <input v-model="thresholds.bp" required />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" type="button" @click="showThreshold = false">取消</button>
        <button class="btn" type="submit">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showMute" title="提醒频次调整">
    <p>选择不同风险等级的推送频次：</p>
    <div class="form-row">
      <div>
        <label>高风险</label>
        <select v-model="frequencies.high" class="select">
          <option>每30分钟</option>
          <option>每1小时</option>
          <option>每4小时</option>
        </select>
      </div>
      <div>
        <label>中风险</label>
        <select v-model="frequencies.medium" class="select">
          <option>每2小时</option>
          <option>每6小时</option>
          <option>每天一次</option>
        </select>
      </div>
      <div>
        <label>低风险</label>
        <select v-model="frequencies.low" class="select">
          <option>每天一次</option>
          <option>每三天一次</option>
          <option>每周一次</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn secondary" @click="showMute = false">取消</button>
      <button class="btn" @click="openInfo('提醒频次已更新。'); showMute = false;">保存</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="提示">
    <p>{{ infoMessage }}</p>
    <div class="modal-footer">
      <button class="btn" @click="showInfo = false">好的</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showThreshold = ref(false);
const showMute = ref(false);
const showInfo = ref(false);
const infoMessage = ref('');

const thresholds = reactive({ creatinine: 120, egfr: 60, protein: 150, bp: '140/90' });
const frequencies = reactive({ high: '每30分钟', medium: '每2小时', low: '每天一次' });

const risks = reactive({
  high: ['赵雪', '李强'],
  medium: ['韩梅', '周琪', '马俊'],
  low: ['刘芳', '王凯', '吴迪', '顾峰']
});

const warnings = reactive([
  { id: 1, name: '李强', indicator: '血肌酐', value: '132 µmol/L', level: 'red', levelText: '高风险', time: '今天 09:30' },
  { id: 2, name: '周琪', indicator: '尿蛋白', value: '200 mg/L', level: 'amber', levelText: '中风险', time: '今天 10:05' },
  { id: 3, name: '韩梅', indicator: '血压', value: '145/95 mmHg', level: 'amber', levelText: '中风险', time: '今天 08:50' },
  { id: 4, name: '赵雪', indicator: 'eGFR', value: '52 ml/min', level: 'red', levelText: '高风险', time: '昨天 21:15' }
]);

const openInfo = (msg) => {
  infoMessage.value = msg;
  showInfo.value = true;
};

const saveThreshold = () => {
  openInfo(`阈值已保存：肌酐 ${thresholds.creatinine}，eGFR ${thresholds.egfr}，尿蛋白 ${thresholds.protein}，血压 ${thresholds.bp}`);
  showThreshold.value = false;
};

const simulatePreCheck = () => {
  openInfo('预警校验完成，发现2条新高风险，已同步到列表。');
};
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.table-wrapper {
  overflow-x: auto;
}
</style>
