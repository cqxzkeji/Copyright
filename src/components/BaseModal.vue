<template>
  <div class="modal-mask" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <h4>{{ title }}</h4>
        <button class="ghost" type="button" @click="onClose">关闭</button>
      </header>
      <section>
        <slot />
      </section>
      <footer>
        <slot name="footer">
          <button class="secondary" type="button" @click="onClose">完成</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const onClose = () => emit('close');
</script>
