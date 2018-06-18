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
              <VotesChart :votes="votes"></VotesChart>
              <br>
              <button class="button" @click="storeTest">Añadir registro</button>
            </Card>
          </div>
          <div class="column">
            <Card
              title="Prueba firebase"
              subtitle="Prueba de realtime de firebase">
              <List :items="testItems"></List>
            </Card>
          </div>
        </div>
      </div>

      <br />
      <div class="container">
        <Card
          title="Vertical Chart"
          subtitle="Prueba de un chart vertical">
          <VerticalChart :labels="verticalLabels" :total="verticalTotals" :data="verticalData"></VerticalChart>
        </Card>
      </div>
    </section>
  </div>
</template>

<script>

import uuid from 'uuid/v1';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { database } from '@/services/firebase';

import AppMenu from '@/components/AppMenu.vue';
import Card from '@/components/Card.vue';
import VotesChart from '@/components/VotesChart.vue';
import VerticalChart from '@/components/VerticalChart.vue';
import List from '@/components/List.vue';

export default {
  name: 'app',
  components: {
    AppMenu,
    Card,
    List,
    VerticalChart,
    VotesChart,
  },
  methods: {
    async storeTest () {
      const data = {
        uuid: uuid (),
        timestamp: Date.now (),
        vote: false,
      };
      await database.ref (`test/${data.uuid}`).set (data);
    },
  },
  mounted () {
    database.ref ('test/').on ('value', results => {
      let res = Object.values (results.val () || []).map (i => ({
        uuid: i.uuid,
        date: moment (i.timestamp).format (),
        vote: i.vote,
      }));

      this.testItems = res;
      this.votes = [
        res.filter (i => i.vote).length,
        res.filter (i => !i.vote).length
      ];

    });

    database.ref ('vertical_test/leaders').on ('value', results => {
      this.verticalData = results.val ().filter (i => !isEmpty (i));
    });
    database.ref ('vertical_test').on ('value', results => {
      this.verticalTotals = results.val ().totals;
    });
  },
  data () {
    return {
      links: [],
      testItems: [],
      votes: [0, 0],

      verticalLabels: { type: 'Tipo', name: 'Nombre', progress: 'Progreso' },
      verticalTotals: 0,
      verticalData: null,
    }
  }
};
</script>

<style>
</style>
