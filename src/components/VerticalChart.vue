<template id="vertical-chart">
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>{{ labels.type }}</th>
        <th>{{ labels.name }}</th>
        <th colspan="3">{{ labels.progress }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data">
        <td>
          <div class="field has-addons">
            <p class="control">
              <button class="button is-small" @click="minus (item.index, item.value)">
                <span class="icon is-small">
                  <i class="fas fa-minus"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button is-small" @click="plus (item.index, item.value)">
                <span class="icon is-small">
                  <i class="fas fa-plus"></i>
                </span>
              </button>
            </p>
          </div>
        </td>
        <td width="10%">{{ item.type }}</td>
        <td>{{ item.label }}</td>
        <td class="vertical-center" width="25%">
          <ProgressBar :percent="parseInt (item.value / total * 100)"></ProgressBar>
        </td>
        <td width="15%"><b>{{ item.value }}</b> / {{ total }}</td>
        <td width="10%">{{ parseInt (item.value / total * 100) }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { database } from '@/services/firebase';
import ProgressBar from './ProgressBar.vue';
export default {
  name: 'VerticalChart',
  components: {
    ProgressBar,
  },
  props: ['labels', 'total', 'data'],
  methods: {
    plus (index, actual) {
      actual++;
      return database.ref (`vertical_test/leaders/${index}`).update ({
        value: actual
      });
    },
    minus (index, actual) {
      actual--;
      return database.ref (`vertical_test/leaders/${index}`).update ({
        value: actual
      });
    }
  }
};
</script>

<style>
.vertical-center {
  vertical-align: middle !important;
}
</style>