<template>
  <div id="app">

    <div class="container py-3">
      <h2>Example 1</h2>
      <v-table
          api="http://etda-threatwatch.test/users"
          ref="table"
          :headers="headers"
          :advance_filters="advance_filters"
          edit_url="ascascascas"
          delete_url="ascacas"
      >
        <template v-slot:create-button>
          <div class="col-md-auto pl-0">
            <a href="https://www.google.com" class="btn btn-primary mr-2">Google</a>
            <button class="btn btn-info" @click="doSomething">Something</button>
          </div>
        </template>

        <template v-slot:advance-filters>
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
                  class="btn btn-primary mr-2"
                  @click="goSearch(true)"
              >
                ค้นหา
              </button>

              <button
                  type="button"
                  class="btn btn-secondary"
                  @click="goSearch(false)"
              >
                Reset
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
      </v-table>


      <h2 class="mt-5">Example 2</h2>
      <v-table
          api="http://etda-threatwatch.test/users"
          ref="table2"
          :headers="headers"
          :filters="filters"
          actions
      >
        <template v-slot:filters>
          <div class="row justify-content-end">
            <div class="col-sm-6 col-md-4 mb-2">
              <select v-model="filters.status" class="custom-select">
                <option :value="0">0</option>
                <option :value="1">1</option>
              </select>
            </div>

            <div class="col-sm-6 col-md-4 mb-2">

              <div class="input-group">
                <input
                    v-model="filters.search"
                    class="form-control"
                    type="text"
                    placeholder="ค้นหา"
                    aria-label="ค้นหา"
                    aria-describedby="search-btn"
                />
                <div class="input-group-append">
                  <button id="search-btn" class="btn" type="button" @click="goFilter">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>

            </div>

            <div class="col-md-auto">
              <a href="https://www.google.com" class="btn btn-primary mr-2">Google</a>
              <button class="btn btn-info" @click="doSomething">Something</button>
            </div>
          </div>

        </template>

        <template v-slot:td(actions)="{ row }">
          <button
              class="btn btn-sm btn-secondary"
              @click="doSomething"
          >
            doSomething
          </button>
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
      filters: {
        status: 1,
      },
      advance_filters: {
        date: null,
        status: 1,
      },
    }
  },

  methods: {
    goSearch(use_advance_filters) {
      if (!use_advance_filters) {
        // Reset advance filters
        this.advance_filters = {
          date: null,
          status: 1,
        }
      }

      this.$refs.table.callApi(use_advance_filters)
    },

    changeStatus(row) {
      alert(`${row.id}: ${row.status}`)
    },

    doSomething() {
      alert('doSomething')
    },

    goFilter() {
      this.$refs.table2.goFilter()
    }
  },
}
</script>

<style lang="scss">
// Bootstrap
@import '~bootstrap/scss/bootstrap';
@import "../date-picker/date-picker.css";
</style>
