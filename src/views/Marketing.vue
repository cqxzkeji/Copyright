<template>
  <div class="page">
    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>营销与推广（20条+）</h3>
          <p class="muted-text">覆盖直播、活动、优惠券、渠道投放</p>
        </div>
        <div class="table-actions">
          <button @click="openCampaign">新建活动</button>
          <button @click="openCoupon">发券</button>
          <button @click="openPush">渠道投放</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>活动</th>
            <th>类型</th>
            <th>预算</th>
            <th>ROI</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in campaigns" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>¥{{ item.budget }}</td>
            <td>{{ item.roi }}x</td>
            <td><span class="badge" :class="item.stateClass">{{ item.state }}</span></td>
            <td class="table-actions">
              <button @click="openOptimize(item)">调优</button>
              <button @click="openPause(item)">暂停</button>
              <button @click="openReport(item)">生成报表</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid">
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;">渠道点击</div>
            <div class="muted-text">近7日</div>
          </div>
          <button @click="openChannel">渠道调整</button>
        </div>
        <div class="bar-chart" style="height:130px;grid-template-columns:repeat(6,1fr);">
          <div v-for="(h, idx) in channelBars" :key="idx" class="bar" :style="{ height: h + 'px' }"></div>
        </div>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;">私域运营</div>
            <div class="muted-text">社群、会员</div>
          </div>
          <button @click="openSegment">分层触达</button>
        </div>
        <div class="progress-bar" style="height:14px;margin-top:10px;"><span style="width:68%"></span></div>
        <p class="muted-text">会员留存、复购提升，自动生成活跃清单。</p>
      </div>
    </div>

    <Modal v-if="campaignModal" title="新建活动" @close="campaignModal = false">
      <form @submit.prevent="campaignModal = false" style="display:grid;gap:10px;">
        <input placeholder="活动名称" required />
        <select required>
          <option>限时秒杀</option>
          <option>直播间</option>
          <option>团购</option>
        </select>
        <input type="number" min="0" placeholder="预算" required />
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="campaignModal = false">取消</button>
          <button type="submit">创建</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="couponModal" title="发券" @close="couponModal = false">
      <form @submit.prevent="couponModal = false" style="display:grid;gap:10px;">
        <select required>
          <option>新人券</option>
          <option>满减券</option>
          <option>包邮券</option>
        </select>
        <div class="progress-bar" style="height:14px;">
          <span style="width:50%"></span>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="couponModal = false">取消</button>
          <button type="submit">发送</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="pushModal" title="渠道投放" @close="pushModal = false">
      <p>推送至抖音、视频号、村口大屏等渠道。</p>
      <div class="progress-bar" style="height:14px;margin:10px 0;">
        <span style="width:60%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="pushModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="optimizeModal" :title="activeCampaign?.name + '调优'" @close="optimizeModal = false">
      <form @submit.prevent="optimizeModal = false" style="display:grid;gap:10px;">
        <label>调优策略</label>
        <select required>
          <option>提高出价</option>
          <option>优化定向</option>
          <option>切换素材</option>
        </select>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="optimizeModal = false">取消</button>
          <button type="submit">应用</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="pauseModal" :title="'暂停 - ' + activeCampaign?.name" @close="pauseModal = false">
      <p>暂停后可随时恢复，是否继续？</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="pauseModal = false">取消</button>
        <button @click="pauseModal = false">确认</button>
      </div>
    </Modal>

    <Modal v-if="reportModal" :title="activeCampaign?.name + '报表'" @close="reportModal = false">
      <p>将生成周报并推送到邮箱。</p>
      <div class="progress-bar" style="height:14px;margin:10px 0;">
        <span style="width:74%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="reportModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="channelModal" title="渠道调整" @close="channelModal = false">
      <p>根据点击趋势自动分配预算，是否应用推荐策略？</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="channelModal = false">稍后</button>
        <button @click="channelModal = false">应用</button>
      </div>
    </Modal>

    <Modal v-if="segmentModal" title="分层触达" @close="segmentModal = false">
      <form @submit.prevent="segmentModal = false" style="display:grid;gap:10px;">
        <label>触达人群</label>
        <select required>
          <option>高价值会员</option>
          <option>复购用户</option>
          <option>沉睡用户</option>
        </select>
        <textarea rows="3" placeholder="触达文案与权益"></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="segmentModal = false">取消</button>
          <button type="submit">发送</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const campaigns = reactive([
  { name: '春耕节-农资补贴', type: '直播', budget: 80000, roi: 4.2, state: '进行中', stateClass: 'info' },
  { name: '乡味特产日', type: '团购', budget: 42000, roi: 3.6, state: '进行中', stateClass: 'info' },
  { name: '高山蔬菜上新', type: '限时', budget: 23000, roi: 2.8, state: '排期', stateClass: 'warn' },
  { name: '村播专场', type: '直播', budget: 36000, roi: 3.9, state: '进行中', stateClass: 'info' },
  { name: '米面粮油囤货', type: '团购', budget: 27000, roi: 2.6, state: '进行中', stateClass: 'info' },
  { name: '水果溯源周', type: '限时', budget: 19000, roi: 2.4, state: '排期', stateClass: 'warn' },
  { name: '土鸡蛋回馈', type: '直播', budget: 26000, roi: 3.1, state: '进行中', stateClass: 'info' },
  { name: '乡村好物榜', type: '团购', budget: 31000, roi: 2.9, state: '进行中', stateClass: 'info' },
  { name: '腊味年货节', type: '限时', budget: 45000, roi: 4.5, state: '总结', stateClass: 'success' },
  { name: '乡野甜品周', type: '直播', budget: 21000, roi: 2.7, state: '进行中', stateClass: 'info' },
  { name: '生态粮油月', type: '团购', budget: 34000, roi: 3.3, state: '进行中', stateClass: 'info' },
  { name: '鲜花特供', type: '限时', budget: 18000, roi: 2.2, state: '排期', stateClass: 'warn' },
  { name: '山珍礼盒季', type: '直播', budget: 39000, roi: 3.8, state: '进行中', stateClass: 'info' },
  { name: '春茶首发', type: '限时', budget: 25000, roi: 3.0, state: '进行中', stateClass: 'info' },
  { name: '乡村零食夜', type: '直播', budget: 22000, roi: 2.5, state: '进行中', stateClass: 'info' },
  { name: '农机团购', type: '团购', budget: 52000, roi: 3.1, state: '排期', stateClass: 'warn' },
  { name: '夏季防暑', type: '限时', budget: 24000, roi: 2.1, state: '排期', stateClass: 'warn' },
  { name: '乡村咖啡节', type: '直播', budget: 28000, roi: 2.9, state: '进行中', stateClass: 'info' },
  { name: '生态饮品周', type: '团购', budget: 26000, roi: 2.6, state: '进行中', stateClass: 'info' },
  { name: '乡村宠物日', type: '限时', budget: 20000, roi: 2.3, state: '排期', stateClass: 'warn' },
  { name: '助农公益专场', type: '直播', budget: 30000, roi: 4.8, state: '总结', stateClass: 'success' }
]);

const channelBars = [90, 120, 110, 150, 100, 130];

const campaignModal = ref(false);
const couponModal = ref(false);
const pushModal = ref(false);
const optimizeModal = ref(false);
const pauseModal = ref(false);
const reportModal = ref(false);
const channelModal = ref(false);
const segmentModal = ref(false);
const activeCampaign = ref(null);

const openCampaign = () => { campaignModal.value = true; };
const openCoupon = () => { couponModal.value = true; };
const openPush = () => { pushModal.value = true; };
const openOptimize = (item) => { activeCampaign.value = item; optimizeModal.value = true; };
const openPause = (item) => { activeCampaign.value = item; pauseModal.value = true; };
const openReport = (item) => { activeCampaign.value = item; reportModal.value = true; };
const openChannel = () => { channelModal.value = true; };
const openSegment = () => { segmentModal.value = true; };
</script>
