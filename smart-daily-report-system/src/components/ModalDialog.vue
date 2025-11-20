<template>
  <div v-if="show" class="overlay" @click.self="close">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="close">×</button>
      </header>
      <div class="body">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '提示'
  }
})

const emit = defineEmits(['close'])

const close = () => emit('close')
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 12, 32, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  width: min(420px, 90%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(7, 18, 67, 0.2);
  display: flex;
  flex-direction: column;
}

header {
  padding: 18px 20px;
  border-bottom: 1px solid #eef1f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.body {
  padding: 20px;
  color: #475066;
  line-height: 1.6;
}

.footer {
  padding: 16px 20px;
  border-top: 1px solid #eef1f8;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.close {
  border: none;
  background: transparent;
  font-size: 20px;
}
</style>
