<template>
  <div>
    <div class="section-header">
      <div>
        <p class="status-pill">商品与内容运营</p>
        <small>统一商品池、直播带货与短视频素材，驱动转化</small>
      </div>
      <div class="nav-links">
        <button class="btn" @click="openModal('publish')">发布上架</button>
        <button class="btn secondary" @click="openModal('story')">素材脚本</button>
        <button class="btn secondary" @click="openModal('promo')">发起营销</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <div class="section-header">
          <span>{{ metric.label }}</span>
          <span class="status-pill">{{ metric.badge }}</span>
        </div>
        <p style="font-size: 24px; color: #0f6ad8;">{{ metric.value }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>商品</th>
          <th>类目</th>
          <th>库存</th>
          <th>渠道</th>
          <th>近7日销量</th>
          <th>内容状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.channels }}</td>
          <td>{{ item.sales }}</td>
          <td><span class="status-pill">{{ item.content }}</span></td>
          <td>
            <button class="btn secondary" @click="openModal('publish', item)">上架配置</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
      <template v-if="modal.type === 'publish'">
        <form class="form-grid" @submit.prevent="savePublish">
          <div>
            <label>商品名称</label>
            <input v-model="publishForm.name" required />
          </div>
          <div>
            <label>上架渠道</label>
            <select v-model="publishForm.channels" multiple>
              <option>自营小程序</option>
              <option>抖音小店</option>
              <option>拼多多店铺</option>
              <option>线下团购</option>
            </select>
          </div>
          <div>
            <label>价格带</label>
            <input v-model="publishForm.price" placeholder="如 39.9-49.9" />
          </div>
          <div>
            <label>直播话术</label>
            <textarea rows="2" v-model="publishForm.script" placeholder="突出产地、品质与优惠信息" />
          </div>
          <button class="btn" type="submit">提交配置</button>
        </form>
      </template>
      <template v-else-if="modal.type === 'story'">
        <form class="form-grid" @submit.prevent="saveStory">
          <div>
            <label>短视频脚本</label>
            <textarea rows="4" v-model="story" placeholder="30 秒拍摄提纲" />
          </div>
          <button class="btn" type="submit">保存脚本</button>
        </form>
      </template>
      <template v-else>
        <p>营销活动下发中，将同步到渠道与达人任务。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: promoProgress + '%' }"></div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = [
  { label: '爆品池', value: 18, badge: '主打19.9直播' },
  { label: '素材完成', value: '46 条', badge: '4 条待审核' },
  { label: '短视频GMV', value: '￥168 万', badge: '+12% 环比' }
];

const products = reactive([
  { name: '富硒大米 5kg', category: '粮油', stock: 820, channels: '小程序/抖音', sales: 680, content: '脚本已就绪' },
  { name: '脐橙礼盒 8斤', category: '水果', stock: 420, channels: '抖音/团购', sales: 510, content: '待素材' },
  { name: '老坛酸菜鱼套装', category: '预制菜', stock: 360, channels: '全渠道', sales: 740, content: '有直播话术' },
  { name: '五香牛肉干', category: '零食', stock: 300, channels: '小程序', sales: 260, content: '脚本已就绪' },
  { name: '高山云雾绿茶', category: '茶饮', stock: 580, channels: '小程序/拼多多', sales: 320, content: '待素材' },
  { name: '农家蜂蜜 1kg', category: '蜂蜜', stock: 210, channels: '全渠道', sales: 190, content: '脚本已就绪' },
  { name: '散养土鸡蛋 30枚', category: '蛋品', stock: 640, channels: '小程序/团购', sales: 520, content: '有直播话术' },
  { name: '紫薯山药粉', category: '杂粮', stock: 270, channels: '抖音', sales: 210, content: '待素材' },
  { name: '无抗跑山鸡', category: '生鲜', stock: 180, channels: '团购', sales: 140, content: '脚本已就绪' },
  { name: '手工苎麻布', category: '手作', stock: 130, channels: '拼多多', sales: 90, content: '待素材' }
]);

const modal = reactive({ visible: false, type: 'publish', title: '商品发布' });
const publishForm = reactive({ name: '', channels: ['自营小程序'], price: '', script: '' });
const story = ref('');
const promoProgress = ref(30);

const openModal = (type, item) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'story' ? '内容脚本' : type === 'promo' ? '营销分发' : '商品发布';
  if (item) {
    publishForm.name = item.name;
    publishForm.channels = item.channels.split('/');
  } else {
    publishForm.name = '';
    publishForm.channels = ['自营小程序'];
  }
  if (type === 'promo') {
    promoProgress.value = 30;
    const timer = setInterval(() => {
      if (promoProgress.value >= 100) {
        clearInterval(timer);
      } else {
        promoProgress.value += 20;
      }
    }, 500);
  }
};

const savePublish = () => {
  const target = products.find((p) => p.name === publishForm.name);
  if (target) {
    target.channels = publishForm.channels.join('/');
    target.content = '上架配置已更新';
  } else {
    products.unshift({
      name: publishForm.name,
      category: '待定',
      stock: 200,
      channels: publishForm.channels.join('/'),
      sales: 0,
      content: '待素材'
    });
  }
  modal.visible = false;
};

const saveStory = () => {
  modal.visible = false;
};
</script>
