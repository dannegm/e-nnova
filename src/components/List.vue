<template>
  <div>
    <table v-if="data.length > 0" class="table">
      <thead>
        <tr>
          <th></th>
          <th>{{ labels.type }}</th>
          <th>{{ labels.name }}</th>
          <th colspan="3"></th>
        </tr>
      </thead>
      <tbody>
        <ListItem
          v-for="item in data"
          :item="item">
        </ListItem>
      </tbody>
    </table>

    <div v-else class="notification is-info">
      No existen registros aún
    </div>
  </div>
</template>

<script>
import ListItem from './ListItem.vue';
export default {
  name: 'List',
  props: ['data', 'labels'],
  components: {
    ListItem,
  },
};
</script>