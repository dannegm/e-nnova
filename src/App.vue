<template>
  <div id="app">
    <AppMenu :links="links"></AppMenu>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-two-fifths">
            <Card
              title="Totales"
              subtitle="Gráfica de votantes contra no votantes">
              
              <PieChart v-if="testResults.length > 0"
                :chartData="pieData"
                :options="pieOptions">
              </PieChart>

              <div v-if="testResults.length == 0" class="notification is-info">
                Se necesitan datos para visualizar la gráfica
              </div>

              <div v-if="testResults.length > 0">
                <span class="tag is-success">{{votesData [0]}}</span>&nbsp;
                <span class="tag is-danger">{{votesData [1]}}</span>
                <br /><br />
              </div>

              <button class="button" @click="storeTest">Añadir registro</button>
            </Card>
          </div>
          <div class="column">
            <Card
              title="Prueba firebase"
              subtitle="Prueba de realtime de firebase">
              <List :items="testResults"></List>
            </Card>
          </div>
        </div>
      </div>

      <br />
      <div class="container">
        <Card
          title="Vertical Chart"
          subtitle="Prueba de un chart vertical">
          <VerticalChart :labels="{ type: 'Tipo', name: 'Nombre', progress: 'Progreso' }" total="83" :data='verticalData'></VerticalChart>
        </Card>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';

import { database } from '@/services/firebase';
import uuid from 'uuid/v1';
import moment from 'moment';

import { Pie, mixins } from 'vue-chartjs';

import AppMenu from '@/components/AppMenu.vue';
import Card from '@/components/Card.vue';
import VerticalChart from '@/components/VerticalChart.vue';
import List from '@/components/List.vue';

Vue.component ('PieChart', {
  props: ['options'],
  extends: Pie,
  mixins: [ mixins.reactiveProp ],
  mounted () {
    this.renderChart (this.chartData, this.options);
  }
});

export default {
  name: 'app',
  components: {
    AppMenu,
    Card,
    List,
    VerticalChart,
  },
  methods: {
    async storeTest () {
      const data = {
        uuid: uuid (),
        timestamp: Date.now (),
        vote: false,
      };
      await database.ref (`test/${data.uuid}`).set (data);
      this.fillChart ();
    },
    fillChart () {
      this.pieData = {
        labels: ['Han votado', 'No han votado'],
        datasets: [
          {
            label: 'Totales',
            backgroundColor: ['#23d160','#ff3860'],
            data: this.votesData,
          }
        ]
      }
    }
  },
  mounted () {
    database.ref ('test/').on ('value', results => {
      const res = Object.values (results.val ()).map (i => ({
        uuid: i.uuid,
        date: moment (i.timestamp).format (),
        vote: i.vote,
      }));

      this.testResults = res;

      const voted = res.filter (i => i.vote);
      const unvoted = res.filter (i => !i.vote);
      this.votesData = [ voted.length, unvoted.length ];
      this.fillChart ();
    });
  },
  data () {
    return {
      links: [],
      testResults: [],
      votesData: [ 1, 1 ],
      pieData: null,
      pieOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      verticalData: [
        {
          type: 'Líder',
          label: 'Juan',
          value: 75,
        },
        {
          type: 'Líder',
          label: 'Pedro',
          value: 34,
        },
        {
          type: 'Líder',
          label: 'Jose',
          value: 57,
        },
        {
          type: 'Líder',
          label: 'Miguel',
          value: 48,
        },
        {
          type: 'Líder',
          label: 'Oscar',
          value: 83,
        },
      ]
    }
  }
};
</script>

<style>
</style>
