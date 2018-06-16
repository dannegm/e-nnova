<template>
  <div>
    <table v-if="items.length > 0" class="table">
      <thead>
        <tr>
          <th>Vote (?)</th>
          <th></th>
          <th>UUID</th>
          <th>Time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <th v-if="!item.vote">
            <span class="has-text-danger">
              <i class="fa fa-times"></i>
            </span>
          </th>
          <th v-if="item.vote">
            <span class="has-text-success">
              <i class="fa fa-check"></i>
            </span>
          </th>
          <td>
           <button v-if="!item.vote"  class="button is-success is-small" @click="vote (item.uuid)">Vote</button>
          </td>
          <th>{{ item.uuid }}</th>
          <td>{{ item.date }}</td>
          <td>
           <button class="button is-danger is-small" @click="deleteItem (item.uuid)">
             <i class="fa fa-trash"></i>
           </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="items.length == 0" class="notification is-info">
      No existen registros aún
    </div>
  </div>
</template>

<script>
import { database } from '@/services/firebase';
export default {
  name: 'List',
  props: ['items', 'isEmpty'],
  methods: {
    deleteItem (uuid) {
      return database.ref (`test/${uuid}`).remove ();
    },
    vote (uuid) {
      return database.ref (`test/${uuid}`).update ({
        vote: true
      });
    }
  }
};
</script>