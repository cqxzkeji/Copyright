<template>
  <MainLayout>
    <section class="card">
      <div class="button-group" style="justify-content: space-between; align-items: center;">
        <div>
          <h3>直播场次管理</h3>
          <p>维护直播排期、主播与脚本内容</p>
        </div>
        <div class="button-group">
          <button class="button" @click="openModal('create')">新建直播</button>
          <button class="button secondary" @click="openModal('resource')">资源分配</button>
          <button class="button ghost" @click="openModal('remind')">推送提醒</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>场次编号</th>
            <th>主题</th>
            <th>主播</th>
            <th>开始时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="live in lives" :key="live.id">
            <td>{{ live.id }}</td>
            <td>{{ live.topic }}</td>
            <td>{{ live.host }}</td>
            <td>{{ live.time }}</td>
            <td>{{ live.status }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="grid-2">
      <div class="card">
        <h3>直播脚本完成度</h3>
        <div class="chart">
          <div v-for="script in scripts" :key="script.name" class="chart-row">
            <span style="width: 80px;">{{ script.name }}</span>
            <div class="chart-bar"><span :style="{ width: script.value + '%' }"></span></div>
            <strong>{{ script.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>直播间资源池</h3>
        <p>共计 {{ resources.total }} 套灯光、{{ resources.cameras }} 台摄像机、{{ resources.backdrops }} 套背景板。</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span :style="{ width: resources.usage + '%' }"></span>
        </div>
        <p style="margin-top: 8px;">当前占用率 {{ resources.usage }}%</p>
      </div>
    </section>
  </MainLayout>

  <ModalDialog
    v-if="activeModal === 'create'"
    title="新建直播场次"
    confirm-text="创建"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="form-grid">
      <div>
        <label>直播主题</label>
        <input placeholder="如：春季有机蔬菜专场" />
      </div>
      <div>
        <label>主理人</label>
        <input placeholder="选择主播" />
      </div>
      <div>
        <label>开始时间</label>
        <input type="datetime-local" />
      </div>
      <div>
        <label>脚本标签</label>
        <input placeholder="新品上新/产地溯源" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'resource'"
    title="资源分配"
    confirm-text="确认分配"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>选择本周重点直播间资源配置。</p>
    <div class="form-grid">
      <div>
        <label>灯光套数</label>
        <input type="number" placeholder="1-5" />
      </div>
      <div>
        <label>摄像机数量</label>
        <input type="number" placeholder="1-4" />
      </div>
      <div>
        <label>音频通道</label>
        <select>
          <option>双通道收音</option>
          <option>无线麦克风</option>
        </select>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'remind'"
    title="推送提醒"
    confirm-text="立即推送"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>系统将向主播、运营与场控发送直播提醒。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 60%;"></span>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModalDialog from '../components/ModalDialog.vue'

const activeModal = ref('')

const lives = [
  { id: 'L-240601', topic: '早春鲜蔬专场', host: '李珊', time: '06-01 09:30', status: '筹备中' },
  { id: 'L-240602', topic: '广西芒果上新', host: '周海', time: '06-02 14:00', status: '已排期' },
  { id: 'L-240603', topic: '高原牛肉溯源', host: '韩璐', time: '06-03 16:00', status: '脚本校对' },
  { id: 'L-240604', topic: '生态稻田认养', host: '秦朗', time: '06-04 10:30', status: '已排期' },
  { id: 'L-240605', topic: '山地苹果品鉴', host: '丁悦', time: '06-05 19:00', status: '筹备中' },
  { id: 'L-240606', topic: '村播助农计划', host: '陆明', time: '06-06 15:00', status: '已排期' },
  { id: 'L-240607', topic: '茶园夏季新茶', host: '吴茜', time: '06-07 20:00', status: '已排期' },
  { id: 'L-240608', topic: '有机水果节', host: '刘海', time: '06-08 13:00', status: '脚本校对' },
  { id: 'L-240609', topic: '冷链水产专场', host: '许宁', time: '06-09 18:30', status: '筹备中' },
  { id: 'L-240610', topic: '直播带货训练营', host: '杨若', time: '06-10 10:00', status: '已排期' }
]

const scripts = [
  { name: '上新讲解', value: 76 },
  { name: '产地溯源', value: 62 },
  { name: '福利秒杀', value: 88 },
  { name: '互动抽奖', value: 54 }
]

const resources = {
  total: 12,
  cameras: 18,
  backdrops: 9,
  usage: 68
}

const openModal = (type) => {
  activeModal.value = type
}
</script>
