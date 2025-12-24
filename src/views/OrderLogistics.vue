<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>订单与物流管理</h3>
        <p>跟踪订单履约、车次调度与冷链监控，保障农品准时送达。</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openDispatch">发起调度</button>
        <button class="secondary-btn" @click="openUpdate">状态更新</button>
        <button class="secondary-btn" @click="openNotice">物流提醒</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric-card" v-for="m in logisticsStats" :key="m.label">
        <div style="color:#5c6c80;font-size:13px;">{{ m.label }}</div>
        <div style="font-size:22px;font-weight:800;">{{ m.value }}</div>
        <div class="progress-bar" style="margin-top:6px;"><span :style="{ width: m.progress + '%' }"></span></div>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0;">履约订单</h4>
        <span style="color:#5c6c80;">共 {{ orders.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>商品</th>
            <th>数量</th>
            <th>收货地</th>
            <th>车牌</th>
            <th>温控</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in orders" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.product }}</td>
            <td>{{ row.count }}</td>
            <td>{{ row.dest }}</td>
            <td>{{ row.truck }}</td>
            <td>{{ row.temp }}</td>
            <td><span class="tag" :class="row.status === '在途' ? 'blue' : 'green'">{{ row.status }}</span></td>
            <td><button class="secondary-btn" @click="editRow(row)">改期</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showDispatch" title="冷链发车调度" @close="showDispatch = false">
      <p>推送给司机与仓库，确认发车中...</p>
      <div class="progress-bar" style="margin:12px 0;height:14px;"><span :style="{ width: dispatchProgress + '%' }"></span></div>
      <p style="margin:0;color:#6d7b8f;">{{ dispatchProgress }}% 完成</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="secondary-btn" @click="showDispatch = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal :show="showUpdate" title="状态更新" @close="showUpdate = false">
      <form class="form-grid" @submit.prevent="submitUpdate">
        <label>订单号<input v-model="updateForm.id" required /></label>
        <label>最新状态<select v-model="updateForm.status"><option>在途</option><option>已签收</option><option>异常</option></select></label>
        <label>温控记录<input v-model="updateForm.temp" /></label>
        <label>调度备注<textarea v-model="updateForm.note"></textarea></label>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button type="button" class="secondary-btn" @click="showUpdate = false">取消</button>
          <button class="primary-btn">保存</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showNotice" title="提示" @close="showNotice = false">
      <p>已向收货人推送提醒，并同步镇村物流联系人。</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="primary-btn" @click="showNotice = false">好的</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const logisticsStats = [
  { label: '今日签收', value: '186 单', progress: 78 },
  { label: '在途冷链', value: '42 车', progress: 54 },
  { label: '异常反馈', value: '3 起', progress: 12 }
];

const orders = reactive([
  { id: 'OD24070101', product: '富硒大米', count: '12 吨', dest: '宁波鄞州区', truck: '浙A1209F', temp: '4℃', status: '在途' },
  { id: 'OD24070102', product: '脐橙礼袋', count: '6 吨', dest: '杭州滨江区', truck: '浙B2211K', temp: '6℃', status: '在途' },
  { id: 'OD24070103', product: '高山茶礼盒', count: '400 箱', dest: '上海宝山', truck: '沪C8765', temp: '常温', status: '已签收' },
  { id: 'OD24070104', product: '羊肚菌干片', count: '1.5 吨', dest: '南京江宁', truck: '苏D1903L', temp: '2℃', status: '在途' },
  { id: 'OD24070105', product: '油茶籽油', count: '3 吨', dest: '长沙雨花', truck: '湘A8821Q', temp: '常温', status: '已签收' },
  { id: 'OD24070106', product: '蜂蜜礼盒', count: '2 吨', dest: '武汉江汉', truck: '鄂A9022W', temp: '常温', status: '在途' },
  { id: 'OD24070107', product: '高山茶礼盒', count: '150 箱', dest: '苏州吴中', truck: '苏E1099M', temp: '常温', status: '已签收' },
  { id: 'OD24070108', product: '高山蔬菜', count: '9 吨', dest: '嘉兴南湖', truck: '浙F2100P', temp: '5℃', status: '在途' },
  { id: 'OD24070109', product: '板栗南瓜', count: '12 吨', dest: '合肥瑶海', truck: '皖A8871Q', temp: '常温', status: '在途' },
  { id: 'OD24070110', product: '脆梨', count: '4 吨', dest: '南昌红谷滩', truck: '赣A1908Z', temp: '3℃', status: '已签收' },
  { id: 'OD24070111', product: '紫薯', count: '7 吨', dest: '上海浦东', truck: '沪A3345', temp: '常温', status: '在途' },
  { id: 'OD24070112', product: '花椒干货', count: '1 吨', dest: '重庆渝北', truck: '渝A2201M', temp: '常温', status: '在途' },
  { id: 'OD24070113', product: '竹荪', count: '0.8 吨', dest: '广州白云', truck: '粤A8988P', temp: '4℃', status: '在途' },
  { id: 'OD24070114', product: '油茶籽油', count: '2 吨', dest: '深圳宝安', truck: '粤B9988L', temp: '常温', status: '已签收' },
  { id: 'OD24070115', product: '高山茶礼盒', count: '90 箱', dest: '长沙岳麓', truck: '湘A6210Q', temp: '常温', status: '已签收' },
  { id: 'OD24070116', product: '马铃薯淀粉', count: '10 吨', dest: '郑州金水', truck: '豫A2981K', temp: '常温', status: '在途' },
  { id: 'OD24070117', product: '莲藕粉', count: '5 吨', dest: '福州仓山', truck: '闽A1209S', temp: '常温', status: '在途' },
  { id: 'OD24070118', product: '蜂蜜礼盒', count: '1.2 吨', dest: '成都高新', truck: '川A8110Y', temp: '常温', status: '在途' },
  { id: 'OD24070119', product: '脐橙礼袋', count: '8 吨', dest: '青岛城阳', truck: '鲁B7281X', temp: '6℃', status: '在途' },
  { id: 'OD24070120', product: '羊肚菌干片', count: '0.6 吨', dest: '西安雁塔', truck: '陕A1938P', temp: '2℃', status: '在途' }
]);

const showDispatch = ref(false);
const showUpdate = ref(false);
const showNotice = ref(false);
const dispatchProgress = ref(0);
const updateForm = reactive({ id: '', status: '在途', temp: '', note: '' });

const openDispatch = () => {
  showDispatch.value = true;
  dispatchProgress.value = 0;
  const timer = setInterval(() => {
    dispatchProgress.value += 20;
    if (dispatchProgress.value >= 100) {
      dispatchProgress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};

const openUpdate = () => {
  showUpdate.value = true;
};

const openNotice = () => {
  showNotice.value = true;
};

const submitUpdate = () => {
  const target = orders.find((o) => o.id === updateForm.id);
  if (target) {
    target.status = updateForm.status;
    target.temp = updateForm.temp || target.temp;
  }
  showUpdate.value = false;
};

const editRow = (row) => {
  Object.assign(updateForm, row);
  showUpdate.value = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8e4f4;
  background: #f9fbff;
}

.form-grid textarea {
  min-height: 80px;
}
</style>
