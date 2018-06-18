<template>
  <div>
    <div v-if="!showInfo" class="notification is-info">
      Se necesitan datos para visualizar la gráfica
    </div>
    <PieChart
      v-if="showInfo"
      :chartData="pieData"
      :options="pieOptions">
    </PieChart>

    <div v-if="showInfo">
      <span class="tag is-info">{{ votes[0] }}</span>&nbsp;
      <span class="tag has-text-white-bis has-background-grey-light">{{ votes[1] }}</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Pie, mixins } from 'vue-chartjs';
import { isEmpty } from 'lodash';
import { database } from '@/services/firebase';

Vue.component ('PieChart', {
  props: ['options'],
  extends: Pie,
  mixins: [ mixins.reactiveProp ],
  mounted () {
    this.renderChart (this.chartData, this.options);
  }
});

export default {
  name: 'VotesChart',
  props: ['votes'],
  methods: {
    fillChart (votes) {
      this.pieData = {
        labels: ['Han votado', 'No han votado'],
        datasets: [
          {
            label: 'Totales',
            backgroundColor: ['#209bee','#b5b5b5'],
            data: votes,
          }
        ]
      }
    },
  },
  watch: {
    votes: {
      deep: true,
      handler: function (val, oldVal) {
        this.showInfo = !!(val [0] || val [1]);
        this.fillChart (val);
      },
    },
  },
  data () {
    return {
      showInfo: false,
      pieData: null,
      pieOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
    }
  }
};
</script>