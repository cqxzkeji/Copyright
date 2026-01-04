<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section-header">
        <div>
          <p class="eyebrow">健康数据采集</p>
          <h3>采集并管理慢性肾脏病相关健康数据</h3>
        </div>
        <div class="chip-row">
          <button class="btn" @click="showAdd = true">手动录入</button>
          <button class="btn secondary" @click="startSync">设备数据接入</button>
          <button class="btn secondary" @click="openInfo('同步任务已排队，将在后台完成。')">同步提示</button>
        </div>
      </header>
      <div class="form-row">
        <div class="card" style="background:#f8fafc;">
          <p class="eyebrow">今日汇总</p>
          <h2>{{ todayTotal }} 条</h2>
          <p>包含手动与设备数据。</p>
        </div>
        <div class="card" style="background:#eff6ff;">
          <p class="eyebrow">近7日</p>
          <h2>{{ lastWeekTotal }} 条</h2>
          <p>连续记录天数 {{ streak }} 天。</p>
        </div>
        <div class="card" style="background:#ecfeff;">
          <p class="eyebrow">患者覆盖</p>
          <h2>{{ uniquePatients }} 人</h2>
          <p>动态连接 {{ connectedDevices }} 台设备。</p>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="section-header">
        <h3>采集记录（{{ records.length }} 条）</h3>
        <small>点击按钮可查看、编辑或导出数据</small>
        <div class="chip-row">
          <button class="btn secondary" @click="openInfo('数据导出成功，文件已保存到本地 download/ckd-data.xlsx')">导出数据</button>
          <button class="btn secondary" @click="openInfo('批量校验完成：无缺失值，3条边界值已标记。')">数据校验</button>
        </div>
      </header>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>患者</th>
              <th>日期</th>
              <th>收集方式</th>
              <th>血压 (mmHg)</th>
              <th>尿蛋白 (mg/L)</th>
              <th>肌酐 (µmol/L)</th>
              <th>eGFR</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in records" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.date }}</td>
              <td><span class="badge" :class="row.source === '设备' ? 'green' : 'amber'">{{ row.source }}</span></td>
              <td>{{ row.bp }}</td>
              <td>{{ row.protein }}</td>
              <td>{{ row.creatinine }}</td>
              <td>{{ row.egfr }}</td>
              <td>
                <button class="btn secondary" @click="openInfo('查看详情: ' + row.name)">查看</button>
                <button class="btn secondary" @click="openInfo('编辑成功，记录已更新。')">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showAdd" title="手动录入数据">
    <form class="grid" @submit.prevent="submitForm">
      <div class="form-row">
        <div>
          <label>患者姓名</label>
          <input v-model="form.name" required />
        </div>
        <div>
          <label>采集日期</label>
          <input type="date" v-model="form.date" required />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>血压</label>
          <input v-model="form.bp" placeholder="120/80" required />
        </div>
        <div>
          <label>尿蛋白 (mg/L)</label>
          <input v-model.number="form.protein" required />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>血肌酐 (µmol/L)</label>
          <input v-model.number="form.creatinine" required />
        </div>
        <div>
          <label>eGFR</label>
          <input v-model.number="form.egfr" required />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" type="button" @click="showAdd = false">取消</button>
        <button class="btn" type="submit">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showSync" title="设备接入进度">
    <p>正在同步智能血压计与尿蛋白检测仪数据...</p>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: syncProgress + '%' }"></div>
    </div>
    <p style="margin-top:8px">当前进度：{{ syncProgress }}%</p>
    <div class="modal-footer">
      <button class="btn secondary" @click="showSync = false">关闭</button>
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
import { reactive, ref, computed } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showAdd = ref(false);
const showSync = ref(false);
const showInfo = ref(false);
const syncProgress = ref(5);
const infoMessage = ref('');
const form = reactive({ name: '', date: '', bp: '', protein: '', creatinine: '', egfr: '' });

const records = reactive([
  { id: 1, name: '刘芳', date: '2024-12-01', source: '设备', bp: '120/78', protein: 90, creatinine: 78, egfr: 96 },
  { id: 2, name: '王凯', date: '2024-12-01', source: '手动', bp: '128/82', protein: 130, creatinine: 102, egfr: 82 },
  { id: 3, name: '张敏', date: '2024-12-02', source: '设备', bp: '118/76', protein: 75, creatinine: 88, egfr: 90 },
  { id: 4, name: '李强', date: '2024-12-02', source: '手动', bp: '135/85', protein: 160, creatinine: 120, egfr: 68 },
  { id: 5, name: '赵雪', date: '2024-12-03', source: '设备', bp: '110/70', protein: 50, creatinine: 72, egfr: 102 },
  { id: 6, name: '陈晨', date: '2024-12-03', source: '手动', bp: '125/80', protein: 140, creatinine: 110, egfr: 75 },
  { id: 7, name: '吴迪', date: '2024-12-04', source: '设备', bp: '119/79', protein: 92, creatinine: 86, egfr: 95 },
  { id: 8, name: '周婷', date: '2024-12-04', source: '手动', bp: '132/83', protein: 170, creatinine: 118, egfr: 69 },
  { id: 9, name: '郑伟', date: '2024-12-05', source: '设备', bp: '124/80', protein: 105, creatinine: 98, egfr: 83 },
  { id: 10, name: '林琳', date: '2024-12-05', source: '手动', bp: '128/84', protein: 145, creatinine: 112, egfr: 72 },
  { id: 11, name: '何平', date: '2024-12-06', source: '设备', bp: '117/74', protein: 88, creatinine: 82, egfr: 99 },
  { id: 12, name: '唐燕', date: '2024-12-06', source: '手动', bp: '134/86', protein: 168, creatinine: 126, egfr: 63 },
  { id: 13, name: '许凯', date: '2024-12-07', source: '设备', bp: '121/79', protein: 95, creatinine: 92, egfr: 88 },
  { id: 14, name: '韩梅', date: '2024-12-07', source: '手动', bp: '137/88', protein: 182, creatinine: 132, egfr: 58 },
  { id: 15, name: '宋江', date: '2024-12-08', source: '设备', bp: '116/75', protein: 85, creatinine: 80, egfr: 101 },
  { id: 16, name: '崔倩', date: '2024-12-08', source: '手动', bp: '130/84', protein: 150, creatinine: 118, egfr: 70 },
  { id: 17, name: '刘畅', date: '2024-12-09', source: '设备', bp: '122/80', protein: 98, creatinine: 90, egfr: 86 },
  { id: 18, name: '周琪', date: '2024-12-09', source: '手动', bp: '140/90', protein: 200, creatinine: 140, egfr: 55 },
  { id: 19, name: '龚力', date: '2024-12-10', source: '设备', bp: '115/73', protein: 82, creatinine: 76, egfr: 103 },
  { id: 20, name: '马俊', date: '2024-12-10', source: '手动', bp: '129/83', protein: 155, creatinine: 117, egfr: 71 },
  { id: 21, name: '顾峰', date: '2024-12-11', source: '设备', bp: '118/77', protein: 90, creatinine: 84, egfr: 92 },
  { id: 22, name: '薛敏', date: '2024-12-11', source: '手动', bp: '133/85', protein: 165, creatinine: 124, egfr: 66 }
]);

const todayTotal = computed(() => records.filter(r => r.date === '2024-12-11').length);
const lastWeekTotal = computed(() => records.length);
const streak = 11;
const uniquePatients = computed(() => new Set(records.map(r => r.name)).size);
const connectedDevices = 6;

const submitForm = () => {
  records.unshift({
    id: Date.now(),
    ...form,
    source: '手动'
  });
  showAdd.value = false;
  openInfo('保存成功，已加入采集列表。');
  form.name = '';
  form.date = '';
  form.bp = '';
  form.protein = '';
  form.creatinine = '';
  form.egfr = '';
};

const startSync = () => {
  showSync.value = true;
  syncProgress.value = 5;
  const timer = setInterval(() => {
    if (syncProgress.value >= 100) {
      clearInterval(timer);
      openInfo('设备同步完成，新增 3 条记录。');
      showSync.value = false;
    } else {
      syncProgress.value += 15;
    }
  }, 400);
};

const openInfo = (msg) => {
  infoMessage.value = msg;
  showInfo.value = true;
};
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.table-wrapper {
  overflow-x: auto;
}
</style>
