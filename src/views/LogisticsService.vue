<template>
  <div class="card">
    <h3>物流与售后服务</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
      <button @click="showRoute = true">更新路由</button>
      <button class="secondary" @click="showAfterSale = true">售后工单</button>
      <button class="ghost" @click="showCarrier = true">联系承运商</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>运单号</th>
          <th>商品</th>
          <th>收货地</th>
          <th>状态</th>
          <th>时效</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in shipments" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.item }}</td>
          <td>{{ row.city }}</td>
          <td><span class="badge">{{ row.status }}</span></td>
          <td>{{ row.sla }}</td>
          <td style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ghost" @click="openTrack(row)">轨迹</button>
            <button class="secondary" @click="openClaim(row)">赔付</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showRoute" title="更新物流路由">
    <div class="form-grid">
      <div>
        <label>承运商</label>
        <select v-model="routeForm.carrier">
          <option>顺丰</option>
          <option>京东物流</option>
          <option>极兔</option>
        </select>
      </div>
      <div>
        <label>下一站</label>
        <input v-model="routeForm.next" placeholder="杭州集散中心" />
      </div>
      <div>
        <label>预计送达</label>
        <input v-model="routeForm.eta" type="datetime-local" />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showRoute = false">取消</button>
      <button @click="updateRoute">确认更新</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showAfterSale" title="售后工单进度">
    <p style="margin-top: 0;">正在同步客服仲裁节点。</p>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: afterSaleProgress + '%' }"></div>
    </div>
    <template #footer>
      <button class="ghost" @click="showAfterSale = false">关闭</button>
      <button class="secondary" @click="accelerate">加速</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showCarrier" title="联系承运商">
    <p style="margin-top: 0;">将自动拨打值班电话并推送短信。</p>
    <template #footer>
      <button class="ghost" @click="showCarrier = false">取消</button>
      <button @click="contact">立即联系</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showTrack" :title="'轨迹 ' + currentShipment?.id">
    <ul style="margin: 0; padding-left: 16px; color: var(--muted);">
      <li>拣货完成 - {{ currentShipment?.times[0] }}</li>
      <li>干线运输 - {{ currentShipment?.times[1] }}</li>
      <li>派送中 - {{ currentShipment?.times[2] }}</li>
    </ul>
    <template #footer>
      <button class="ghost" @click="showTrack = false">关闭</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showClaim" :title="'赔付 ' + currentShipment?.id">
    <div class="form-grid">
      <div>
        <label>赔付原因</label>
        <select v-model="claimForm.reason">
          <option>破损</option>
          <option>延误</option>
          <option>缺件</option>
        </select>
      </div>
      <div>
        <label>金额</label>
        <input v-model="claimForm.amount" placeholder="¥50" />
      </div>
      <div>
        <label>支付方式</label>
        <select v-model="claimForm.method">
          <option>原路退回</option>
          <option>站内余额</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showClaim = false">取消</button>
      <button class="secondary" @click="submitClaim">发起赔付</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="操作提示">
    <p style="margin: 0; color: var(--muted);">{{ infoMessage }}</p>
    <template #footer>
      <button class="ghost" @click="showInfo = false">确认</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const shipments = ref([
  { id: 'SF10011', item: '赣南脐橙', city: '杭州', status: '派送中', sla: '当日达', times: ['08:00', '09:30', '10:10'] },
  { id: 'YT29001', item: '五常大米', city: '南京', status: '干线运输', sla: '次日达', times: ['08:30', '10:00', ''] },
  { id: 'JD88021', item: '草莓礼盒', city: '苏州', status: '已签收', sla: '当日达', times: ['07:30', '09:00', '09:40'] },
  { id: 'STO22310', item: '生鲜蔬菜箱', city: '合肥', status: '待揽收', sla: '次日达', times: ['--', '--', '--'] },
  { id: 'ZTO31100', item: '粮油礼包', city: '南昌', status: '派送中', sla: '次日达', times: ['09:10', '10:50', '11:20'] },
  { id: 'SF10012', item: '冷鲜三文鱼', city: '上海', status: '派送中', sla: '当日达', times: ['09:15', '10:20', '11:00'] },
  { id: 'YD99801', item: '散养土鸡', city: '长沙', status: '干线运输', sla: '次日达', times: ['08:50', '10:30', ''] },
  { id: 'SF10013', item: '藜麦', city: '福州', status: '已签收', sla: '当日达', times: ['07:50', '09:10', '09:40'] },
  { id: 'JD88022', item: '冰糖橙', city: '广州', status: '派送中', sla: '当日达', times: ['09:40', '10:30', '11:10'] },
  { id: 'STO22311', item: '鸡蛋礼盒', city: '成都', status: '待揽收', sla: '次日达', times: ['--', '--', '--'] }
]);

const routeForm = reactive({
  carrier: '顺丰',
  next: '',
  eta: ''
});

const claimForm = reactive({
  reason: '破损',
  amount: '¥50',
  method: '原路退回'
});

const afterSaleProgress = ref(66);
const showRoute = ref(false);
const showAfterSale = ref(false);
const showCarrier = ref(false);
const showTrack = ref(false);
const showClaim = ref(false);
const currentShipment = ref(null);
const showInfo = ref(false);
const infoMessage = ref('');

const updateRoute = () => {
  infoMessage.value = `已更新至 ${routeForm.next || '下一站待定'}，承运商 ${routeForm.carrier}`;
  showRoute.value = false;
  showInfo.value = true;
};

const accelerate = () => {
  afterSaleProgress.value = Math.min(100, afterSaleProgress.value + 12);
};

const contact = () => {
  infoMessage.value = '已联系承运商值班电话，并同步短信';
  showCarrier.value = false;
  showInfo.value = true;
};

const openTrack = (row) => {
  currentShipment.value = row;
  showTrack.value = true;
};

const openClaim = (row) => {
  currentShipment.value = row;
  showClaim.value = true;
};

const submitClaim = () => {
  infoMessage.value = `赔付 ${claimForm.amount}，原因 ${claimForm.reason}`;
  showClaim.value = false;
  showInfo.value = true;
};
</script>
