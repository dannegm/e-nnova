<template>
  <progress class="progress is-small is-info" :value="percent" max="100"></progress>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: ['percent']
}
</script>