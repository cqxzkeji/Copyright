<template>
  <div>
    <section class="panel">
      <h2>特征提取与分析</h2>
      <div class="grid two">
        <div class="card">
          <h3>灰斑特征摘要</h3>
          <p>纹理均匀度：0.84</p>
          <p>灰斑密度：12.4%</p>
          <p>边缘清晰度：91.2%</p>
        </div>
        <div class="card">
          <h3>特征分布图</h3>
          <img :src="railImage" alt="特征分析图" style="width: 100%; border-radius: 12px;" />
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>特征样本库</h2>
      <div class="actions">
        <button class="btn" @click="openModal('extract')">启动特征提取</button>
        <button class="btn secondary" @click="openModal('classify')">分类策略设置</button>
        <button class="btn ghost" @click="openModal('stat')">统计分析报告</button>
        <button class="btn secondary" @click="openModal('compare')">样本对比</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>样本编号</th>
              <th>纹理特征</th>
              <th>灰度均值</th>
              <th>裂纹长度(mm)</th>
              <th>类别</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in samples" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.texture }}</td>
              <td>{{ item.gray }}</td>
              <td>{{ item.length }}</td>
              <td>{{ item.type }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <h3>{{ modalTitle }}</h3>
        <div v-if="activeModal === 'extract'">
          <p>选择批次后系统将生成灰斑特征向量。</p>
          <form>
            <input placeholder="批次编号" />
            <select>
              <option>GLCM纹理</option>
              <option>LBP局部二值</option>
              <option>HOG方向梯度</option>
            </select>
            <input placeholder="特征维度" />
          </form>
        </div>
        <div v-else-if="activeModal === 'classify'">
          <form>
            <select>
              <option>支持向量机 SVM</option>
              <option>随机森林 RF</option>
              <option>轻量CNN分类器</option>
            </select>
            <input placeholder="训练比例 0.8" />
            <input placeholder="交叉验证折数 5" />
          </form>
        </div>
        <div v-else-if="activeModal === 'stat'">
          <p>统计分析已完成，灰斑高风险样本占比 6.2%。</p>
          <div class="progress-bar">
            <span :style="{ width: '88%' }"></span>
          </div>
          <p style="margin-top: 8px; color: #4b5a78;">报告生成中 88%</p>
        </div>
        <div v-else>
          <form>
            <input placeholder="样本编号 A" />
            <input placeholder="样本编号 B" />
            <textarea rows="3" placeholder="对比说明"></textarea>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">关闭</button>
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import railImage from "../assets/rail-sample.svg";

const activeModal = ref("");

const samples = Array.from({ length: 20 }, (_, index) => ({
  id: `FX-${3100 + index}`,
  texture: `纹理级别 ${index % 5}`,
  gray: (112 + index * 2).toFixed(1),
  length: (8.5 + index * 0.7).toFixed(1),
  type: index % 3 === 0 ? "高风险" : index % 3 === 1 ? "中风险" : "低风险"
}));

const modalTitleMap = {
  extract: "启动特征提取",
  classify: "分类策略设置",
  stat: "统计分析报告",
  compare: "样本对比"
};

const modalTitle = computed(() => modalTitleMap[activeModal.value]);

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>
