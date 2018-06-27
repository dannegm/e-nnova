<template>
  <tr>
    <td>
      <button
        @click="isOpen = !isOpen"
        class="button is-white">
        <i class="fas" :class="{ 'fa-angle-down': isOpen, 'fa-angle-right': !isOpen }"></i>
      </button>
    </td>
    <td>{{ item.type }}</td>
    <td>
      <b>{{ item.name }}</b>
      <div v-if="isOpen">
        <br />
        <div class="notification has-background-light">
          <div>
            <p>{{ item.address.street }}
              <span>
                <span v-if="item.address.ext != ''">#{{ item.address.ext }}</span>
                <span v-else>S/N</span>
              </span>
              <span v-if="item.address.int != ''">int {{ item.address.int }}</span>,
              <br />{{ item.address.town }}, {{ item.address.parish }}</p>
          </div>

          <div>
            <br />
            <p v-if="item.contact.tel != ''"><i class="fa fa-phone"></i> {{ item.contact.tel }}</p>
            <p v-if="item.contact.cel != ''"><i class="fa fa-mobile"></i> {{ item.contact.cel }}</p>
            <p v-if="item.contact.email != ''"><i class="fa fa-envelope-open"></i> {{ item.contact.email }}</p>
            <p v-if="item.contact.social != ''"><i class="fa fa-share-alt"></i> {{ item.contact.social }}</p>
          </div>
        </div>
      </div>
    </td>
    <td>
      <span v-if="!item.vote" class="has-text-danger">
        <i class="fa fa-times"></i> Falta por votar
      </span>
      <span v-else class="has-text-success">
        <i class="fa fa-check"></i> Ha votado
      </span>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: ['item'],
  data () {
    return {
      isOpen: false
    }
  }
};
</script>