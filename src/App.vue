<template>
  <div id="app">

    <div class="container">
      <v-table
          api="http://etda-threatwatch.test/users"
          :headers="headers"
          edit_url="ascascascas"
          delete_url="ascacas"
          actions
      >
        <template v-slot:create-button>
          <a href="www.google.com" class="btn btn-primary">Google</a>
        </template>

        <template v-slot:advance-filter>
          <div class="row">
            <div class="col-md-4">
              <v-datepicker
                  v-model="date"
              ></v-datepicker>
            </div>
          </div>
        </template>

        <template v-slot:td(status)="{ row }">
          {{ row.status }}
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
          value: 'email',
          title: 'E-mail',
        },
        {
          value: 'status',
          title: 'Status',
        },
      ],
      date: null,
    }
  },
}
</script>

<style lang="scss">
// Bootstrap
@import '~bootstrap/scss/bootstrap';
@import "../date-picker/date-picker.css";
</style>
