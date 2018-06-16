<template id="vertical-chart">
  <table class="table">
    <thead>
      <tr>
        <th>{{ labels.type }}</th>
        <th>{{ labels.name }}</th>
        <th colspan="3">{{ labels.progress }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data">
        <th width="10%">{{ item.type }}</th>
        <td>{{ item.label }}</td>
        <td width="25%">
          <ProgressBar :percent="parseInt (item.value / total * 100)"></ProgressBar>
        </td>
        <td width="10%">{{ item.value }}/{{ total }}</td>
        <td width="10%">{{ parseInt (item.value / total * 100) }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ProgressBar from './ProgressBar.vue';
export default {
  name: 'VerticalChart',
  components: {
    ProgressBar,
  },
  props: ['labels', 'total', 'data']
}
</script>