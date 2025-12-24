<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>信息服务与资源发布</h3>
        <p>统一发布农资、供需、政策资讯，支持村镇自主维护。</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="showCreate = true">新增资源</button>
        <button class="secondary-btn" @click="openPublish">批量发布</button>
        <button class="secondary-btn" @click="openTips">通知县域</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric-card" v-for="item in highlights" :key="item.label">
        <div style="color:#5c6c80;font-size:13px;">{{ item.label }}</div>
        <div style="font-size:22px;font-weight:800;">{{ item.value }}</div>
        <div class="progress-bar" style="margin-top:6px;"><span :style="{ width: item.progress + '%' }"></span></div>
      </div>
    </div>

    <div class="table-card" style="margin-top:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0;">资源列表</h4>
        <span style="color:#5c6c80;">共 {{ resources.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>资源名称</th>
            <th>发布主体</th>
            <th>覆盖乡镇</th>
            <th>状态</th>
            <th>发布时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in resources" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.town }}</td>
            <td><span class="tag" :class="item.status === '已发布' ? 'green' : 'orange'">{{ item.status }}</span></td>
            <td>{{ item.time }}</td>
            <td>
              <button class="secondary-btn" @click="edit(item)">调整</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showCreate" title="新增资源" @close="showCreate = false">
      <form class="form-grid" @submit.prevent="submitCreate">
        <label>资源名称<input v-model="form.name" required /></label>
        <label>覆盖乡镇<input v-model="form.town" required /></label>
        <label>发布主体<input v-model="form.owner" required /></label>
        <label>资源类型<select v-model="form.type" required>
          <option>农资供应</option>
          <option>特色农品</option>
          <option>培训资讯</option>
        </select></label>
        <label>备注<textarea v-model="form.note"></textarea></label>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button type="button" class="secondary-btn" @click="showCreate = false">取消</button>
          <button class="primary-btn">保存</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showPublish" title="批量发布进度" @close="showPublish = false">
      <p style="color:#4a5b73;">正在推送至各乡镇公众号与短信群发渠道...</p>
      <div class="progress-bar" style="margin:12px 0;height:14px;"><span :style="{ width: publishProgress + '%' }"></span></div>
      <p style="margin:0;color:#6d7b8f;">当前进度 {{ publishProgress }}%</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="secondary-btn" @click="showPublish = false">完成</button>
      </div>
    </BaseModal>

    <BaseModal :show="showTips" title="县域通知" @close="showTips = false">
      <p>已经通过短信/微信通知乡镇联络员，请关注反馈。</p>
      <div style="display:flex;justify-content:flex-end;margin-top:10px;">
        <button class="primary-btn" @click="showTips = false">知道了</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const highlights = [
  { label: '活跃村站', value: '128', progress: 72 },
  { label: '本周新增', value: '42', progress: 55 },
  { label: '短信触达', value: '6,820', progress: 64 }
];

const resources = reactive([
  { name: '优质大米采购需求', owner: '双桥村', town: '双桥镇', status: '待发布', time: '2024-07-01' },
  { name: '农机合作社服务', owner: '星火合作社', town: '石泉镇', status: '已发布', time: '2024-06-29' },
  { name: '蓝莓采摘志愿者招募', owner: '观景村', town: '观景镇', status: '已发布', time: '2024-06-28' },
  { name: '农技专家巡田计划', owner: '农业局', town: '全县', status: '已发布', time: '2024-06-26' },
  { name: '特色羊肚菌供应', owner: '绿谷家庭农场', town: '绿谷乡', status: '待发布', time: '2024-06-24' },
  { name: '电商主播培训班', owner: '县商务局', town: '县城', status: '已发布', time: '2024-06-20' },
  { name: '柑橘产销对接', owner: '柑香合作社', town: '柑香镇', status: '已发布', time: '2024-06-18' },
  { name: '农资团购优惠', owner: '供销社', town: '全县', status: '已发布', time: '2024-06-16' },
  { name: '夏季防汛物资储备', owner: '应急管理局', town: '沿河镇', status: '待发布', time: '2024-06-14' },
  { name: '乡村民宿曝光合作', owner: '文旅局', town: '山水乡', status: '已发布', time: '2024-06-12' },
  { name: '樱桃采摘节活动', owner: '樱桃谷村', town: '樱桃镇', status: '已发布', time: '2024-06-10' },
  { name: '农机驾驶证培训', owner: '交通局', town: '县城', status: '待发布', time: '2024-06-08' },
  { name: '高标准农田项目公示', owner: '农业农村局', town: '全县', status: '已发布', time: '2024-06-06' },
  { name: '冷链车调度申请', owner: '供应链中心', town: '物流园', status: '待发布', time: '2024-06-04' },
  { name: '订单农业签约会', owner: '农服中心', town: '产业园', status: '已发布', time: '2024-06-02' },
  { name: '农技无人机巡检', owner: '智慧农业办', town: '高标准田', status: '已发布', time: '2024-05-30' },
  { name: '绿色农残检测通告', owner: '检测站', town: '全县', status: '已发布', time: '2024-05-28' },
  { name: '土壤改良示范田招募', owner: '科研院', town: '试验田', status: '待发布', time: '2024-05-26' },
  { name: '山货产销节直播报名', owner: '乡村振兴办', town: '县城', status: '已发布', time: '2024-05-24' },
  { name: '农险理赔资料收集', owner: '保险公司', town: '全县', status: '待发布', time: '2024-05-22' }
]);

const showCreate = ref(false);
const showPublish = ref(false);
const showTips = ref(false);
const publishProgress = ref(15);
const form = reactive({ name: '', town: '', owner: '', type: '农资供应', note: '' });

const submitCreate = () => {
  resources.unshift({
    name: form.name,
    owner: form.owner,
    town: form.town,
    status: '待发布',
    time: new Date().toISOString().slice(0, 10)
  });
  showCreate.value = false;
  form.name = form.town = form.owner = form.note = '';
  form.type = '农资供应';
};

const openPublish = () => {
  showPublish.value = true;
  publishProgress.value = 0;
  const timer = setInterval(() => {
    publishProgress.value += 20;
    if (publishProgress.value >= 100) {
      publishProgress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};

const openTips = () => {
  showTips.value = true;
};

const edit = (item) => {
  form.name = item.name;
  form.town = item.town;
  form.owner = item.owner;
  showCreate.value = true;
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
