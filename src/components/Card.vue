<template>
  <div class="card">
    <div class="card-content">
      <p class="title">{{ title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>

    <div class="card-content">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['title', 'subtitle']
};
</script>