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

    <br />
    <div v-if="showInfo" class="columns">
      <div class="column is-half">
        <h1 class="has-text-info">{{percent (votes[0])}}%</h1>
        <p><b>{{votes [0]}}</b> de <b>{{total}}</b>, han votado.</p>
      </div>
      <div class="column is-half">
        <h1 class="has-text-grey">{{percent (votes[1])}}%</h1>
        <p><b>{{votes [1]}}</b> Faltan por votar</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Pie, mixins } from 'vue-chartjs';

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
  mounted () {
    this.showInfo = !!(this.votes [0] || this.votes [1]);
    this.fillChart (this.votes);
  },
  methods: {
    percent (partial) {
      const percent = parseInt ((partial / this.total) * 100)
      return isNaN (percent) ? 0 : percent;
    },
    fillChart (votes) {
      this.showInfo = !!(votes [0] || votes [1]);
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
      handler: function (val) {
        this.showInfo = !!(val [0] || val [1]);
        this.fillChart (val);
        this.total = val [0] + val [1];
      },
    },
  },
  data () {
    return {
      total: 0,
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