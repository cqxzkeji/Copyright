<template>
  <MainLayout>
    <section class="grid-3">
      <div class="card metric">
        <span class="badge">直播中</span>
        <h3>12 场</h3>
        <p>今日已安排直播</p>
      </div>
      <div class="card metric">
        <span class="badge">成交额</span>
        <h3>¥ 286,540</h3>
        <p>较昨日提升 8.6%</p>
      </div>
      <div class="card metric">
        <span class="badge">库存预警</span>
        <h3>6 项</h3>
        <p>需要补货的农产品</p>
      </div>
    </section>

    <section class="grid-2">
      <div class="card">
        <div class="button-group" style="justify-content: space-between; align-items: center;">
          <div>
            <h3>直播热度趋势</h3>
            <p>过去 7 天观看热度统计</p>
          </div>
          <button class="button secondary" @click="openModal('trend')">查看趋势</button>
        </div>
        <div class="chart">
          <div v-for="item in trend" :key="item.day" class="chart-row">
            <span style="width: 60px;">{{ item.day }}</span>
            <div class="chart-bar"><span :style="{ width: item.value + '%' }"></span></div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="button-group" style="justify-content: space-between; align-items: center;">
          <div>
            <h3>频道排期概览</h3>
            <p>本周各渠道排期状态</p>
          </div>
          <button class="button secondary" @click="openModal('schedule')">调整排期</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>渠道</th>
              <th>负责人</th>
              <th>排期密度</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in schedule" :key="row.channel">
              <td>{{ row.channel }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.rate }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <div class="button-group" style="justify-content: space-between; align-items: center;">
        <div>
          <h3>订单履约概览</h3>
          <p>今日订单履约详情（示例）</p>
        </div>
        <button class="button" @click="openModal('report')">生成报表</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>订单编号</th>
            <th>商品</th>
            <th>数量</th>
            <th>状态</th>
            <th>配送方式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in orders" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.product }}</td>
            <td>{{ row.qty }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.delivery }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </MainLayout>

  <ModalDialog
    v-if="activeModal === 'trend'"
    title="直播热度趋势分析"
    confirm-text="下载报告"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>系统已根据观看人数、停留时长与互动率生成趋势洞察。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 72%;"></span>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'schedule'"
    title="调整排期"
    confirm-text="保存排期"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="form-grid">
      <div>
        <label>选择渠道</label>
        <select>
          <option>抖音旗舰直播间</option>
          <option>视频号产地专场</option>
        </select>
      </div>
      <div>
        <label>直播日期</label>
        <input type="date" />
      </div>
      <div>
        <label>预计场次</label>
        <input type="number" placeholder="请输入场次" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'report'"
    title="生成履约报表"
    confirm-text="开始生成"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>点击开始生成将自动汇总今日履约数据，预计用时 15 秒。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 45%;"></span>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModalDialog from '../components/ModalDialog.vue'

const activeModal = ref('')

const trend = [
  { day: '周一', value: 65 },
  { day: '周二', value: 72 },
  { day: '周三', value: 58 },
  { day: '周四', value: 80 },
  { day: '周五', value: 66 },
  { day: '周六', value: 92 },
  { day: '周日', value: 77 }
]

const schedule = [
  { channel: '抖音旗舰直播间', owner: '李婷', rate: '高', status: '已排期' },
  { channel: '视频号产地专场', owner: '周敏', rate: '中', status: '确认中' },
  { channel: '快手助农频道', owner: '陈浩', rate: '高', status: '已排期' },
  { channel: '淘宝农品馆', owner: '王琪', rate: '低', status: '待安排' },
  { channel: '乡村优选直播', owner: '刘畅', rate: '中', status: '已排期' },
  { channel: '社区团购直播', owner: '赵峰', rate: '低', status: '排期调整' },
  { channel: '农旅直播间', owner: '郭媛', rate: '中', status: '已排期' },
  { channel: '产地溯源直播', owner: '韩晨', rate: '高', status: '已排期' },
  { channel: '生鲜秒杀直播', owner: '吴昊', rate: '高', status: '确认中' },
  { channel: '品牌联动专场', owner: '唐洁', rate: '中', status: '待安排' }
]

const orders = [
  { id: 'A20240512001', product: '有机富硒大米', qty: 320, status: '拣货中', delivery: '产地直发' },
  { id: 'A20240512002', product: '山地苹果礼盒', qty: 120, status: '已出库', delivery: '冷链配送' },
  { id: 'A20240512003', product: '高山绿茶', qty: 76, status: '已签收', delivery: '干线配送' },
  { id: 'A20240512004', product: '生态鸡蛋', qty: 540, status: '配送中', delivery: '同城快送' },
  { id: 'A20240512005', product: '红心火龙果', qty: 88, status: '已出库', delivery: '冷链配送' },
  { id: 'A20240512006', product: '紫薯预制包', qty: 210, status: '拣货中', delivery: '仓配一体' },
  { id: 'A20240512007', product: '土蜂蜜', qty: 64, status: '已签收', delivery: '快递配送' },
  { id: 'A20240512008', product: '高原牦牛肉', qty: 34, status: '配送中', delivery: '冷链配送' },
  { id: 'A20240512009', product: '鲜玉米', qty: 480, status: '已出库', delivery: '产地直发' },
  { id: 'A20240512010', product: '蔬菜盲盒', qty: 150, status: '拣货中', delivery: '仓配一体' }
]

const openModal = (type) => {
  activeModal.value = type
}
</script>
