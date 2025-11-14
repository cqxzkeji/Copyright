<template>
  <div v-if="modelValue" class="overlay" @click.self="close">
    <div class="dialog">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="close">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  width: min(520px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 20px 40px rgba(30, 64, 175, 0.25);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #1d2a4a;
}

.close {
  border: none;
  background: #eff2ff;
  border-radius: 8px;
  padding: 0.2rem 0.6rem;
  font-size: 1.2rem;
}

section {
  color: #4b5563;
  line-height: 1.6;
}

footer {
  margin-top: 1rem;
  text-align: right;
}
</style>
