<template>
  <div>
    <div class="flex" style="justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0;">客户与运营</h3>
      <div class="flex" style="gap: 8px;">
        <button @click="openCampaign">新建营销</button>
        <button class="secondary" @click="openTagging">批量打标</button>
      </div>
    </div>

    <div class="table-card">
      <h3>客户列表（20 条）</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>等级</th>
            <th>最近消费</th>
            <th>标签</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.level }}</td>
            <td>{{ c.lastPurchase }}</td>
            <td>
              <div class="tag-list">
                <span class="badge info" v-for="tag in c.tags" :key="tag">{{ tag }}</span>
              </div>
            </td>
            <td class="flex" style="gap: 6px;">
              <button class="secondary" @click="openMessage(c)">私信</button>
              <button class="accent" @click="openCoupon(c)">发券</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showCampaign" title="新建营销活动">
      <form @submit.prevent="saveCampaign">
        <input v-model="campaign.name" placeholder="活动名称" />
        <input v-model="campaign.channel" placeholder="投放渠道" />
        <div class="modal-footer">
          <button type="button" class="secondary" @click="showCampaign = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showTagging" title="批量打标">
      <p>正在对高价值客户打标...</p>
      <div class="progress-bar">
        <span :style="{ width: tagProgress + '%' }"></span>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showMessage" title="发送私信">
      <p>向 {{ activeCustomer?.name }} 发送关怀信息</p>
      <textarea v-model="message" rows="3" placeholder="输入内容"></textarea>
      <template #footer>
        <button class="secondary" @click="showMessage = false">取消</button>
        <button @click="sendMessage">发送</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showCoupon" title="发券">
      <p>向 {{ activeCustomer?.name }} 发放优惠券</p>
      <select v-model="coupon">
        <option value="满199减30">满199减30</option>
        <option value="运费券">运费券</option>
        <option value="买二送一">买二送一</option>
      </select>
      <template #footer>
        <button class="secondary" @click="showCoupon = false">取消</button>
        <button @click="deliverCoupon">确认发放</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const names = ['李田', '周云', '张宇', '刘曼', '王城', '黄子', '赵夏', '陈西'];
const customers = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    id: `CUS-${300 + idx}`,
    name: names[idx % names.length],
    level: ['银卡', '金卡', '白金'][idx % 3],
    lastPurchase: `${3 + (idx % 5)} 天前`,
    tags: ['乡村偏好', '高复购', '新客', '需回访'].slice(0, 2 + (idx % 2))
  }))
);

const showCampaign = ref(false);
const showTagging = ref(false);
const showMessage = ref(false);
const showCoupon = ref(false);
const tagProgress = ref(25);
const activeCustomer = ref(null);
const message = ref('');
const coupon = ref('满199减30');
const campaign = reactive({ name: '', channel: '' });

const openCampaign = () => {
  showCampaign.value = true;
};

const openTagging = () => {
  showTagging.value = true;
  tagProgress.value = 25;
  const timer = setInterval(() => {
    if (tagProgress.value >= 100) {
      clearInterval(timer);
      showTagging.value = false;
    } else {
      tagProgress.value += 25;
    }
  }, 400);
};

const openMessage = (customer) => {
  activeCustomer.value = customer;
  message.value = '感谢支持，农产品新品上线可享折扣';
  showMessage.value = true;
};

const openCoupon = (customer) => {
  activeCustomer.value = customer;
  coupon.value = '满199减30';
  showCoupon.value = true;
};

const saveCampaign = () => {
  showCampaign.value = false;
  campaign.name = '';
  campaign.channel = '';
};

const sendMessage = () => {
  showMessage.value = false;
};

const deliverCoupon = () => {
  showCoupon.value = false;
};
</script>
