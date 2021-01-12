<template>
  <div id="app">

    <div class="container py-3">
      <v-table
          api="http://etda-threatwatch.test/users"
          ref="table"
          :headers="headers"
          edit_url="ascascascas"
          delete_url="ascacas"
          actions
      >
        <template v-slot:create-button>
          <div class="col-md-auto pl-0">
            <a href="https://www.google.com" class="btn btn-primary mr-2">Google</a>
            <button class="btn btn-info" @click="doSomething">Something</button>
          </div>
        </template>

        <template v-slot:advance-filter>
          <div class="row">
            <div class="col-md-4">
              <v-datepicker
                  v-model="advance_filters.date"
              ></v-datepicker>
            </div>
            <div class="col-md-4">
              <select v-model="advance_filters.status" class="custom-select">
                <option :value="0">0</option>
                <option :value="1">1</option>
              </select>
            </div>
            <div class="col-md-auto">
              <button
                  type="button"
                  class="btn btn-primary"
                  @click="goSearch"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </template>

        <template v-slot:td(status)="{ row }">
          <select v-model="row.status" class="custom-select" @change="changeStatus(row)">
            <option :value="0">0</option>
            <option :value="1">1</option>
          </select>
        </template>

        <template v-slot:td(actions)="{ row }">
        </template>
      </v-table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      headers: [
        {
          value: 'first_name',
          title: 'ชื่อ',
        },
        {
          value: 'last_name',
          title: 'นามสกุล',
        },
        {
          value: 'full_name',
          title: 'ชื่อ - สกุล',
          _value: (value, item) => {
            return `${item.first_name} ${item.last_name}`
          },
          sortable: false,
        },
        {
          value: 'email',
          title: 'E-mail',
        },
        {
          value: 'status',
          title: 'Status',
          b_class: 'py-1',
          sortable: false,
          width: 80,
        },
      ],
      advance_filters: {
        date: null,
        status: 1,
      },
    }
  },

  methods: {
    goSearch() {
      this.$refs.table.callApi(this.advance_filters)
    },

    changeStatus(row) {
      alert(`${row.id}: ${row.status}`)
    },

    doSomething() {
      alert('doSomething')
    },
  },
}
</script>

<style lang="scss">
// Bootstrap
@import '~bootstrap/scss/bootstrap';
@import "../date-picker/date-picker.css";
</style>
