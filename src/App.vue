<template>
  <div id="app" v-if="settings.online">
    <AppMenu :links="links"></AppMenu>


      <div class="container">
        
        <input v-model="testSocket" />
        <br />
        <br />
      </div>

    <section class="section">
      <div v-if="settings.hasUpdates" class="container">
        <div class="notification is-warning">
          <h1 class="is-size-3">Actualización</h1>
          <p>Hay una nueva actualización disponible, para aplicar los cambios refresca la página</p>
          <small>
            Versión actual: <b>{{settings.version}}</b> | Versión nueva: <b>{{settings.newVersion}}</b>
          </small>
          <br />
          <br />
          <button
            @click="refresh"
            class="button is-info">
            Actualizar
          </button>
        </div>
        <br />
      </div>

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
              :title="votesChart.title"
              subtitle="Gráfica de votantes contra no votantes">
              <VotesChart :votes="votesChart.percents"></VotesChart>
              <br />
              <Excel
                v-if="settings.canExport"
                :fields="excel.fields"
                :data="excel.data"
                :meta="excel.meta"
                name="ennova.xls"
                class="button is-info">
                Exportar excel <i class="fa fa-file-export"></i>
              </Excel>
            </Card>
          </div>

          <div class="column">
            <Card
              title="Detalle"
              :subtitle="`Progreso de votantes por ${votesChart.titleChild}`">
              <VerticalChart
                v-if="actual != 'leader'"
                :labels="verticalChart.labels"
                :data="verticalChart.data">
                </VerticalChart>
              <List
                v-else
                :labels="verticalChart.labels"
                :data="verticalChart.data">
                </List>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import Vue from 'vue';
import io from 'socket.io-client';

import { each } from 'lodash';
import JsonExcel from 'vue-json-excel';
import { database } from '@/services/firebase';

import AppMenu from '@/components/AppMenu.vue';
import Card from '@/components/Card.vue';
import Dropdown from '@/components/Dropdown.vue';
import VotesChart from '@/components/VotesChart.vue';
import VerticalChart from '@/components/VerticalChart.vue';
import List from '@/components/List.vue';

Vue.component ('Excel', JsonExcel);

const socket = io.connect ('http://localhost:3312/');

export default {
  name: 'app',
  components: {
    AppMenu,
    Card,
    Dropdown,
    VerticalChart,
    VotesChart,
    List,
  },
  methods: {
    refresh () {
      location.reload ();
    },
    calculateChart (supporters) {
      const voted = supporters.filter (s => s.vote);
      const unvoted = supporters.filter (s => !s.vote);
      this.votesChart.percents = [voted.length, unvoted.length];
    },

    flatter (container, level) {
      let flatten = [];

      if (level == 'district')
        each (container.sections, s => 
          each (s.managers, m =>
            each (m.leaders, l => 
              each (l.supporters, supporter =>
                flatten.push (supporter)
              )
            )
          )
        );

      if (level == 'section')
        each (container.managers, m =>
          each (m.leaders, l => 
            each (l.supporters, supporter =>
              flatten.push (supporter)
            )
          )
        );

      if (level == 'manager')
        each (container.leaders, l => 
          each (l.supporters, supporter =>
            flatten.push (supporter)
          )
        );

      if (level == 'leader')
        each (container.supporters, supporter =>
          flatten.push (supporter)
        );

      return flatten;
    },
    tabulate (data) {
      each (data, d => {
        each (d.sections, s => {
          each (s.managers, m => {
            each (m.leaders, l => {
              each (l.supporters, i => {
                const item = {
                  district: d.name,
                  section: s.name,
                  manager: m.name,
                  leader: l.name,
                  id: i.id,
                  name: i.name,
                  vote: i.vote,
                  contact: i.contact,
                  address: i.address,
                };
                this.excel.data.push (item)
              })
            })
          })
        })
      });
    },

    setFilter (level) {
      const levels = {
        district: {
          title: 'Distrito',
          type: 'Distrito',
          labelName: '#',
          data: this.districSelected,
          childKey: 'sections',
          childLevel: 'section',
        },
        section: {
          title: 'Secciones',
          type: 'Sección',
          labelName: '#',
          data: this.sectionSelected,
          childKey: 'managers',
          childLevel: 'manager',
        },
        manager: {
          title: 'Coordinadores',
          type: 'Coordinador',
          labelName: 'Nombre',
          data: this.managerSelected,
          childKey: 'leaders',
          childLevel: 'leader',
        },
        leader: {
          title: 'Líderes',
          type: 'Líder',
          labelName: 'Nombre',
          data: this.leaderSelected,
          childKey: 'supporters',
          childLevel: 'supporter',
        },
        supporter: {
          title: 'Simpatizantes',
          type: 'Simpatizante',
          labelName: 'Nombre',
        },
      };

      const levelTitle = levels [level].title;
      const levelData = levels [level].data;

      const levelChildKey = levels [level].childKey;
      const levelChildLevel = levels [level].childLevel;
      const levelChildLabelName = levels [level].labelName;

      const levelChildTitle = levels [levelChildLevel].title;
      const levelChildType = levels [levelChildLevel].type;

      this.actual = level;
      this.votesChart.title = levelTitle;
      this.votesChart.titleChild = levelChildTitle;
      this.verticalChart.labels.name = levelChildLabelName;

      let flatten = this.flatter (levelData, level);
      this.calculateChart (flatten);

      const childs = Object.values (levelData [levelChildKey]);
      if (this.actual != 'leader') {
        this.verticalChart.data = childs.map (child => {
          const value = this.flatter (child, levelChildLevel);
          return {
            type: levelChildType,
            label: child.name,
            partial: value.filter (i => i.vote).length,
            total: value.length,
          };
        });
      } else {
        this.verticalChart.data = childs.map (i => {
          i.type = levelChildType;
          return i;
        });
      }
    },

    onUpdateFilters (level, newData) {
      const levels = {
        district: () => {
          this.setDistrict (newData)
        },
        section: () => {
          this.setDistrict (newData)
          this.setSection (newData.sections [this.sectionSelected.name])
        },
        manager: () => {
          this.setDistrict (newData)
          this.setSection (newData.sections [this.sectionSelected.name])
          this.setManager (
            newData
              .sections [this.sectionSelected.name]
              .managers [this.managerSelected.name]
          )
        },
        leader: () => {
          this.setDistrict (newData)
          this.setSection (newData.sections [this.sectionSelected.name])
          this.setManager (
            newData
              .sections [this.sectionSelected.name]
              .managers [this.managerSelected.name]
          )
          this.setLeader (
            newData
              .sections [this.sectionSelected.name]
              .managers [this.managerSelected.name]
              .leaders [this.leaderSelected.name]
          )
        },
      }
      levels [level] ();
    },

    setDistrict (district) {
      this.districSelected = district;
      this.sections = Object.values (district.sections).map (i => {
        i.key = i.name;
        i.label = `Sección ${i.name}`;
        return i;
      });

      this.setFilter ('district');
    },

    setSection (section) {
      this.sectionSelected = section;
      this.managers = Object.values (section.managers).map (i => {
        i.key = i.name;
        i.label = `C: ${i.name}`;
        return i;
      });

      this.setFilter ('section');
    },
    resetSection () {
      this.sectionSelected = null;
      this.managerSelected = null;
      this.leaderSelected = null;

      this.setFilter ('district');
    },

    setManager (manager) {
      this.managerSelected = manager;
      this.leaders = Object.values (manager.leaders).map (i => {
        i.key = i.name;
        i.label = `L: ${i.name}`;
        return i;
      });

      this.setFilter ('manager');
    },
    resetManager () {
      this.managerSelected = null;
      this.leaderSelected = null;
      this.setFilter ('section');
    },

    setLeader (leader) {
      this.leaderSelected = leader;
      this.setFilter ('leader');
    },
    resetLeader () {
      this.leaderSelected = null;
      this.setFilter ('manager');
    },
  },
  mounted () {
    database.ref ('settings').on ('value', results => {
      const settings = results.val ().web;
      this.settings.canExport = settings.canExport;
      this.settings.online = settings.online;

      if (this.settings.version != settings.version) {
        if (settings.autoRefresh) location.reload ();
        this.settings.hasUpdates = true;
        this.settings.newVersion = settings.version;
      } else {
        this.settings.hasUpdates = false;
      }
    });

    database.ref ('votes/districts').on ('value', results => {
      this.districs = Object.values (results.val ()).map (i => {
        i.key = i.name;
        i.label = `Distrito ${i.name}`;
        return i;
      });
      this.districSelected = this.districs [0];
      this.onUpdateFilters (this.actual, this.districSelected);
      this.tabulate (this.districs);
    });
  },
  watch: {
    testSocket: {
      deep: true,
      handler: function (val) {
        socket.emit ('message', {
          msg: val,
        })
      },
    },
  },
  data () {
    return {
      testSocket: 'Pruena',
      settings: {
        canExport: false,
        online: false,
        version: '1.3.18',
        newVersion: null,
        hasUpdates: false,
      },
      links: [],
      actual: 'district',

      votesChart: {
        title: 'Distritos',
        percents: [0, 0],
      },
      verticalChart: {
        labels: {
          type: '',
          name: '',
          progress: 'Progreso'
        },
        data: null,
      },

      districs: [],
      districSelected: null,

      sections: [],
      sectionSelected: null,

      managers: [],
      managerSelected: null,

      leaders: [],
      leaderSelected: null,

      excel: {
        fields: {
          'Distrito': 'district',
          'Sección': 'section',
          'Coordinador': 'manager',
          'Líder': 'leader',
          'ID': 'id',
          'Nombre': 'name',
          'Ha votado (?)': {
            field: 'vote',
            callback: v => v ? 'SI' : 'NO',
          },
          'Teléfono': 'contact.tel',
          'Celular': 'contact.cel',
          'Email': 'contact.email',
          'Red social': 'contact.social',
          'Calle': 'address.street',
          'Ext': 'address.ext',
          'Int': 'address.int',
          'Colonia': 'address.town',
          'Municipio': 'address.parish',
        },
        data: [],
        meta: [
          [
            {
              'key': 'charset',
              'value': 'utf-8'
            }
          ]
        ],
      }
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
