<template>
  <div class="modal-overlay" role="dialog" aria-modal="true" v-if="open" @click.self="onClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="onClose">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: String,
  onClose: Function
})

const onClose = () => {
  props.onClose && props.onClose()
}
</script>
