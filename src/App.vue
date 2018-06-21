<template>
  <div id="app">
    <AppMenu :links="links"></AppMenu>

    <section class="section">
      <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
          <ul>
            <li>
              <Dropdown
                :items="districs"
                :selectFirst="true"
                :disabled="!!sectionSelected"
                :onSelected="setDistrict">
                </Dropdown>
            </li>
            <li>
              <Dropdown
                :placeholder="{ label: 'Selecciona una sección'}"
                :items="sections"
                :canReset="true"
                :disabled="!!managerSelected"
                :onSelected="setSection"
                :onReset="resetSection">
                </Dropdown>
            </li>
            <li v-if="!!sectionSelected">
              <Dropdown
                :placeholder="{ label: 'Selecciona un coordinador'}"
                :items="managers"
                :canReset="true"
                :disabled="!!leaderSelected"
                :onSelected="setManager"
                :onReset="resetManager">
                </Dropdown>
            </li>
            <li v-if="!!sectionSelected && !!managerSelected">
              <Dropdown
                :placeholder="{ label: 'Selecciona un líder'}"
                :items="leaders"
                :canReset="true"
                :onSelected="setLeader"
                :onReset="resetLeader">
                </Dropdown>
            </li>
          </ul>
        </nav>
      </div>

      <br />
      <div class="container">
        <div class="columns">
          <div class="column is-one-third">
            <Card
              title="Secciones"
              subtitle="Gráfica de votantes contra no votantes">
              <VotesChart :votes="votesPercents"></VotesChart>
            </Card>
          </div>

          <div class="column">
            <Card
              title="Detalle"
              subtitle="Listado de votantes">
              <VerticalChart :labels="verticalLabels" :total="verticalTotals" :data="verticalData"></VerticalChart>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import { reduce } from 'lodash';
import { database } from '@/services/firebase';

import AppMenu from '@/components/AppMenu.vue';
import Card from '@/components/Card.vue';
import Dropdown from '@/components/Dropdown.vue';
import VotesChart from '@/components/VotesChart.vue';
import VerticalChart from '@/components/VerticalChart.vue';

export default {
  name: 'app',
  components: {
    AppMenu,
    Card,
    Dropdown,
    VerticalChart,
    VotesChart,
  },
  methods: {
    setDistrict (district) {
      this.districSelected = district;
      this.sections = Object.values (district.sections).map (i => {
        i.key = i.name;
        i.label = `Sección ${i.name}`;
        return i;
      });
      this.actual = 'district';
      console.log (test);
    },

    setSection (section) {
      this.sectionSelected = section;
      this.managers = Object.values (section.managers).map (i => {
        i.key = i.name;
        i.label = `C: ${i.name}`;
        return i;
      });
      this.actual = 'section';
    },
    resetSection () {
      this.sectionSelected = null;
      this.managerSelected = null;
      this.leaderSelected = null;
      this.actual = 'district';
    },

    setManager (manager) {
      this.managerSelected = manager;
      this.leaders = Object.values (manager.leaders).map (i => {
        i.key = i.name;
        i.label = `L: ${i.name}`;
        return i;
      });
      this.actual = 'manager';
    },
    resetManager () {
      this.managerSelected = null;
      this.leaderSelected = null;
      this.actual = 'section';
    },

    setLeader (leader) {
      this.leaderSelected = leader;
      this.actual = 'leader';
    },
    resetLeader () {
      this.leaderSelected = null;
      this.actual = 'manager';
    },
  },
  mounted () {
    database.ref ('votes/districts').on ('value', results => {
      this.votes = results.val ();
      this.districs = Object.values (this.votes).map (i => {
        i.key = i.name;
        i.label = `Distrito ${i.name}`;
        return i;
      });
      this.setDistrict (this.districs [0]);
    });
  },
  data () {
    return {
      links: [],
      actual: 'district',
      votes: {},
      votesPercents: [0, 100],

      districs: [],
      districSelected: null,

      sections: [],
      sectionSelected: null,

      managers: [],
      managerSelected: null,

      leaders: [],
      leaderSelected: null,

      votesData: [1, 1],
      verticalLabels: { type: 'Tipo', name: 'Nombre', progress: 'Progreso' },
      verticalTotals: 0,
      verticalData: null,
    }
  }
};
</script>

<style scoped>
.breadcrumb li+li::before {
  margin: 0px 10px !important;
  font-size: 1.6em !important;
}
</style>
