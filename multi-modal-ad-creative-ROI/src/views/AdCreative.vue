<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
    <div class="card">
      <p class="helper-text" style="margin: 0;">创意覆盖</p>
      <h2 style="margin: 0.2rem 0 0;">72 条</h2>
      <p class="helper-text">近 7 天自动生成并完成审核的创意数量</p>
    </div>
    <div class="card">
      <p class="helper-text" style="margin: 0;">文案多样性</p>
      <h2 style="margin: 0.2rem 0 0;">18 种模版</h2>
      <p class="helper-text">覆盖图文、短视频、幻灯片、AI 生成等 18 种模版</p>
    </div>
    <div class="card">
      <p class="helper-text" style="margin: 0;">审核通过率</p>
      <h2 style="margin: 0.2rem 0 0;">96.4%</h2>
      <p class="helper-text">结合违规词检测与历史投放经验生成</p>
    </div>
  </div>

  <div class="card" style="margin-top: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">广告创意池</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">创意生成、素材上传、进度与导出均可在此完成</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="primary-btn" @click="showGenerator = true">生成创意</button>
        <button class="secondary-btn" @click="showUploader = true">上传素材</button>
        <button class="secondary-btn" @click="showProgress = true">审核进度</button>
        <button class="secondary-btn" @click="showExport = true">导出报告</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>创意名称</th>
          <th>投放渠道</th>
          <th>优化目标</th>
          <th>状态</th>
          <th>CTR</th>
          <th>CPC</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in creatives" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.channel }}</td>
          <td>{{ item.goal }}</td>
          <td><span class="tag">{{ item.status }}</span></td>
          <td>{{ item.ctr }}%</td>
          <td>¥{{ item.cpc }}</td>
          <td class="table-actions">
            <button class="secondary-btn" @click="selectPreview(item)">预览</button>
            <button class="secondary-btn" @click="openTooltip(item)">提示</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showGenerator" title="生成创意" subtitle="填写需求并生成模态弹窗" @close="showGenerator = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">投放渠道</span>
        <select class="input" v-model="generator.channel">
          <option>信息流</option>
          <option>短视频</option>
          <option>搜索广告</option>
          <option>OTT</option>
        </select>
      </label>
      <label>
        <span class="helper-text">推广目标</span>
        <select class="input" v-model="generator.goal">
          <option>线索</option>
          <option>下载</option>
          <option>成交</option>
          <option>品牌曝光</option>
        </select>
      </label>
      <label>
        <span class="helper-text">预算 (元)</span>
        <input class="input" type="number" min="0" v-model="generator.budget" />
      </label>
    </div>
    <label style="display: block; margin-top: 0.75rem;">
      <span class="helper-text">创意描述</span>
      <textarea class="text-area" v-model="generator.desc" placeholder="请输入品牌卖点、目标人群、素材要求"></textarea>
    </label>
    <template #footer>
      <button class="secondary-btn" @click="showGenerator = false">取消</button>
      <button class="primary-btn" @click="launchGenerator">生成中...</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showUploader" title="素材上传" subtitle="表单弹窗" @close="showUploader = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">素材类型</span>
        <select class="input">
          <option>图片</option>
          <option>视频</option>
          <option>落地页</option>
        </select>
      </label>
      <label>
        <span class="helper-text">文件链接</span>
        <input class="input" placeholder="https://" />
      </label>
      <label>
        <span class="helper-text">命名规则</span>
        <input class="input" placeholder="示例：产品-渠道-日期" />
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showUploader = false">取消</button>
      <button class="primary-btn" @click="showUploader = false">提交</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showProgress" title="生成进度" subtitle="进度条弹窗" @close="showProgress = false">
    <div class="grid">
      <div v-for="task in tasks" :key="task.name" class="card" style="box-shadow: none; border: 1px dashed #cbd5e1;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p class="helper-text" style="margin: 0;">{{ task.name }}</p>
            <p class="helper-text" style="margin: 0.2rem 0 0;">{{ task.channel }} · {{ task.type }}</p>
          </div>
          <span class="badge">{{ task.status }}</span>
        </div>
        <div class="progress-shell" style="margin-top: 0.5rem;">
          <div class="progress-inner" :style="{ width: task.progress + '%' }"></div>
        </div>
      </div>
    </div>
    <template #footer>
      <button class="primary-btn" @click="showProgress = false">关闭</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showExport" title="导出报告" subtitle="提示信息弹窗" @close="showExport = false">
    <p class="helper-text">系统将导出当前筛选条件下的创意表现数据，并通过邮件发送给您。</p>
    <div class="form-grid">
      <label>
        <span class="helper-text">接收邮箱</span>
        <input class="input" v-model="exportEmail" placeholder="analytics@company.com" />
      </label>
      <label>
        <span class="helper-text">时间范围</span>
        <select class="input" v-model="exportRange">
          <option>近 7 天</option>
          <option>近 30 天</option>
          <option>本季度</option>
        </select>
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showExport = false">取消</button>
      <button class="primary-btn" @click="confirmExport">发送报告</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showPreview" :title="previewItem?.name || '创意预览'" subtitle="图文预览" @close="showPreview = false">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
      <div class="card" style="box-shadow: none; border: 1px solid #e2e8f0;">
        <p class="helper-text" style="margin: 0;">视觉示意</p>
        <div
          style="height: 150px; border-radius: 12px; background: linear-gradient(135deg, #bae6fd, #c7d2fe); display: grid; place-items: center; color: #0f172a; font-weight: 700;"
        >
          {{ previewItem?.channel }} · {{ previewItem?.goal }}
        </div>
      </div>
      <div>
        <p class="helper-text" style="margin: 0;">文案示例</p>
        <h3 style="margin: 0.15rem 0 0.35rem;">{{ previewItem?.headline }}</h3>
        <p class="helper-text">{{ previewItem?.desc }}</p>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog v-if="showTooltip" title="操作提示" subtitle="按钮提示信息弹窗" @close="showTooltip = false">
    <p class="helper-text">{{ tooltipMessage }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showGenerator = ref(false);
const showUploader = ref(false);
const showProgress = ref(false);
const showExport = ref(false);
const showPreview = ref(false);
const showTooltip = ref(false);
const exportEmail = ref('analytics@company.com');
const exportRange = ref('近 7 天');
const tooltipMessage = ref('');
const previewItem = ref(null);

const generator = reactive({
  channel: '信息流',
  goal: '线索',
  budget: 15000,
  desc: '突出新品亮点，面向泛兴趣人群生成 4 组多模态素材。',
});

const creatives = reactive([
  { name: '新品短视频 A1', channel: '短视频', goal: '下载', status: '审核通过', ctr: 3.2, cpc: 0.85, headline: '3D 视觉体验', desc: '30 秒快速讲清卖点，适合冷启动曝光' },
  { name: '优惠信息流 B1', channel: '信息流', goal: '成交', status: '投放中', ctr: 4.5, cpc: 0.72, headline: '限时 3 折', desc: '突出优惠倒计时，强调库存有限' },
  { name: '品牌故事海报', channel: '展示', goal: '品牌曝光', status: '审核中', ctr: 2.1, cpc: 1.2, headline: '品牌愿景', desc: '海报化叙事，突出品牌温度' },
  { name: '场景对比视频', channel: '短视频', goal: '成交', status: '投放中', ctr: 5.1, cpc: 0.65, headline: '真实案例对比', desc: '用对比证明效果，适合高意向人群' },
  { name: '直播预告封面', channel: '信息流', goal: '线索', status: '已下线', ctr: 1.9, cpc: 1.05, headline: '今晚八点见', desc: '直播预热与专属优惠组合' },
  { name: 'H5 互动页', channel: '搜索广告', goal: '线索', status: '投放中', ctr: 3.8, cpc: 0.9, headline: '3 步快速预约', desc: '互动式填写，提升留资率' },
  { name: 'AI 幻灯片', channel: 'OTT', goal: '品牌曝光', status: '审核通过', ctr: 2.6, cpc: 1.1, headline: '高清大屏体验', desc: '多屏同步，适合客厅场景' },
  { name: '节日祝福素材', channel: '信息流', goal: '成交', status: '投放中', ctr: 4.2, cpc: 0.76, headline: '节日闪购', desc: '节日氛围文案 + 限量优惠' },
  { name: '新品测评合集', channel: '短视频', goal: '下载', status: '审核通过', ctr: 3.9, cpc: 0.8, headline: '真实口碑', desc: '达人口播+实测画面合集' },
  { name: '品牌长图文', channel: '展示', goal: '品牌曝光', status: '审核中', ctr: 1.6, cpc: 1.35, headline: '深度故事', desc: '长图文讲述品牌升级历程' },
]);

const tasks = reactive([
  { name: '视频生成批次 #104', channel: '短视频', type: 'AI 合成', status: '处理中', progress: 68 },
  { name: '信息流素材检测', channel: '信息流', type: '违规词检测', status: '即将完成', progress: 92 },
  { name: '落地页快照', channel: '搜索', type: '截图与加载测速', status: '进行中', progress: 55 },
  { name: '多模态描述生成', channel: 'OTT', type: '图文配音', status: '处理中', progress: 61 },
]);

const launchGenerator = () => {
  showGenerator.value = false;
  showProgress.value = true;
  tasks.push({ name: `新创意 ${creatives.length + 1}`, channel: generator.channel, type: generator.goal, status: '排队中', progress: 10 });
};

const confirmExport = () => {
  showExport.value = false;
  tooltipMessage.value = `报告已发送至 ${exportEmail.value}（${exportRange.value}）`;
  showTooltip.value = true;
};

const selectPreview = (item) => {
  previewItem.value = item;
  showPreview.value = true;
};

const openTooltip = (item) => {
  tooltipMessage.value = `${item.name} 的表现已同步至数据分析模块，点击即可查看详情。`;
  showTooltip.value = true;
};
</script>
