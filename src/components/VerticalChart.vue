<template>
  <div>
    <table v-if="data && data.length > 0" class="table">
      <thead>
        <tr>
          <th>{{ labels.type }}</th>
          <th>{{ labels.name }}</th>
          <th colspan="3">{{ labels.progress }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data">
          <td width="10%">{{ item.type }}</td>
          <td>{{ item.label }}</td>

          <td class="vertical-center" width="25%">
            <ProgressBar :percent="parseInt ((item.partial / item.total) * 100)"></ProgressBar>
          </td>
          <td width="15%"><b>{{ item.partial }}</b> / {{ item.total }}</td>
          <td width="10%">{{ parseInt ((item.partial / item.total) * 100) }}%</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="notification is-info">
      No existen registros aún
    </div>
  </div>
</template>

<script>
import { database } from '@/services/firebase';
import ProgressBar from './ProgressBar.vue';
export default {
  name: 'VerticalChart',
  components: {
    ProgressBar,
  },
  props: ['labels', 'data'],
  methods: {
  }
};
</script>

<style>
.vertical-center {
  vertical-align: middle !important;
}
</style>