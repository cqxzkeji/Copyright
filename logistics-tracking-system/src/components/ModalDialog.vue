<template>
  <div v-if="visible" class="overlay" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <div class="content">
        <slot />
      </div>
      <footer>
        <slot name="footer">
          <button class="primary" @click="$emit('close')">确认</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '提示'
  }
})
defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 31, 66, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  width: min(90vw, 700px);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 15px 45px rgba(22, 64, 119, 0.28);
}
header,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #edf3fc;
}
footer {
  border-bottom: 0;
  border-top: 1px solid #edf3fc;
  justify-content: end;
}
.content {
  padding: 20px;
}
.close {
  border: none;
  background: transparent;
  font-size: 24px;
}
.primary {
  border: none;
  background: linear-gradient(135deg, #2f8cff, #5ab2ff);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
}
</style>
