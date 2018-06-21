<template>
  <div class="field has-addons">
    <div class="control">
      <div class="dropdown" :class="{ 'is-active': isActive }">
        <div class="dropdown-trigger">
          <button
            class="button"
            :disabled="disabled"
            @click="isActive = !isActive">
            <span>{{selected.label}}</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down"></i>
            </span>
          </button>
        </div>

        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a
              class="dropdown-item"
              v-if="items.length"
              v-for="item in items"
              :class="{ 'is-active': item.label == selected.label }"
              @click="doSelected (item)">
              {{item.label}}
            </a>
            <div
              v-else
              class="dropdown-item">
              Empty list
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showReset" class="control">
      <button
        class="button is-info"
        @click="doReset ()">
        <span class="icon is-small">
          <i class="fas fa-times"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: [
    'placeholder',
    'items',
    'disabled',
    'selectFirst',
    'canReset',
    'onSelected',
    'onReset',
  ],
  methods: {
    doSelected (item) {
      this.isActive = false;
      this.selected = item;
      this.onSelected (item);
      this.showReset = this.canReset;
    },
    doReset () {
      this.showReset = false;
      this.isActive = false;
      if (this.onReset) this.onReset ();
      if (this.placeholder) {
        this.selected = this.placeholder;
      } else {
        this.selected = {
          label: 'Choose one..'
        };
      }
    }
  },
  watch: {
    items: {
      deep: true,
      handler: function () {
        if (!this.hasInitialized
            && this.selectFirst
            && this.items.length > 0) {
          this.selected = this.items [0];
          this.hasInitialized = true;
        }
      },
    },
  },
  mounted () {
    if (this.placeholder)
      this.selected = this.placeholder;

  },
  data () {
    return {
      showReset: false,
      hasInitialized: false,
      selected: {
        label: 'Choose one..'
      },
      isActive: false,
    }
  }
};
</script>
<style scoped>
a.dropdown-item {
  justify-content: start !important;
  padding: 0.6rem 3rem 0.6rem 1rem !important;
}
</style>