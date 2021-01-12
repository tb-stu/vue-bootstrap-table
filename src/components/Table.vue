<template>
  <div :class="div_1_class ">
    <slot v-if="show_filter" name="filters">
      <div class="row justify-content-end">
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
        <slot name="create-button"></slot>
      </div>
    </slot>

    <slot name="advance-filters"></slot>

    <div :class="div_2_class">
      <div class="table-responsive position-relative">
        <div v-if="loading" class="table-loading d-flex justify-content-end">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <table class="table table-striped table-hover table-borderless">
          <thead>
            <tr>
              <th
                  v-for="(h, k) in headers"
                  :key="`head_${ k }`"
                  :style="[
                    !!h.width ? {
                      'min-width': `${ h.width }px`,
                      'max-width': `${ h.width }px`,
                      'width': `${ h.width }px`,
                    } : {}
                  ]"
                  class="bg-white text-gray font-weight-normal short-text"
                  :class="[
                    {
                      'pr-0': typeof h.sortable === 'undefined' || (typeof h.sortable !== 'undefined' && h.sortable === true),
                    },
                    (!!h.h_class ? h.h_class : null),
                  ]"
              >
                <span
                    :class="{ 'sort-column': typeof h.sortable !== 'undefined' ? h.sortable : true }"
                    @click="sort(typeof h.sortable !== 'undefined' ? h.sortable : true, h.value)"
                >
                  {{ h.title }}

                  <template v-if="typeof h.sortable !== 'undefined' ? h.sortable : true">
                    <template v-if="sort_key === h.value">
                      <i v-if="!sort_desc" class="fas fa-sort-up sorted"></i>
                      <i v-else class="fas fa-sort-down sorted"></i>
                    </template>
                    <i v-else class="fas fa-sort"></i>
                  </template>
                </span>
              </th>

              <th
                  v-if="!!actions"
                  style="width: 50px;"
                  class="bg-white"
              ></th>
            </tr>
          </thead>

          <tbody :class="{ 'text-gray': loading }">
            <tr
                v-for="(row, k) in data.data"
                :key="`row_${k}`"
            >
              <td
                  v-for="(column, ck) in headers"
                  :key="`row_${k}_${ck}`"
                  :class="[
                    {
                      'text-center': typeof column.align !== 'undefined' && column.align === 'center',
                      'text-right': typeof column.align !== 'undefined' && column.align === 'right',
                      'cursor-pointer': !!row_click && (typeof column.row_clickable === 'undefined' || column.row_clickable),
                    },
                    (column.b_class || null),
                  ]"
                  @click="onClick(row, column)"
              >
                <slot
                    :name="`td(${column.value})`"
                    v-bind:row="row"
                >
                  <div v-html="getValue(row, column)"></div>
                </slot>
              </td>

              <td
                  v-if="!!actions || !!edit_url || !!delete_url"
                  class="px-3 py-2 action-column"
              >
                <div class="d-flex justify-content-start align-items-center">

                  <slot
                      name="td(actions)"
                      v-bind:row="row"
                  ></slot>

                  <a
                      v-if="!!edit_url"
                      :href="edit_url.replace(':id', row.id)"
                      class="btn btn-sm text-warning"
                      :disabled="loading"
                  >
                    <i class="fas fa-pen"></i>
                  </a>

                  <button
                      v-if="!!delete_url"
                      type="button"
                      class="btn btn-sm text-danger"
                      @click="showConfirmDelete(delete_url, row)"
                      :disabled="loading"
                  >
                    <i class="fas fa-trash"></i>
                  </button>

                </div>
              </td>
            </tr>

            <tr v-if="data.data.length === 0">
              <slot name="no-data">
                <td
                    :colspan="(!!actions || !!edit_url || !!delete_url) ? headers.length + 1 : headers.length"
                    class="text-center"
                >
                  <span v-if="loading" class="text-light">Loading...</span>
                  <span v-else>ไม่พบข้อมูล {{ name }}</span>
                </td>
              </slot>
            </tr>
          </tbody>
        </table>
      </div>

      <v-pagination
          v-if="!!data.links && !!data.meta"
          v-model="per_page"
          :links="data.links"
          :meta="data.meta"
          :text_class="paginate_text_class"
          :paginate_justify_class="paginate_justify_class"
          @gotoPage="changePage"
      ></v-pagination>
    </div>

    <!-- Confirm delete modal -->
    <div
        id="confirm_delete_modal"
        class="modal fade"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="confirm_delete_modal_label"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h6 id="confirm_delete_modal_label" class="modal-title">
              ยืนยันการดำเนินการ
            </h6>
          </div>
          <div class="modal-body">
            คุณต้องการที่จะลบข้อมูลใช่หรือไม่ ?
          </div>
          <div class="modal-footer p-2">
            <button
                type="button"
                class="btn btn-outline-gray btn-rounded mr-2"
                data-dismiss="modal"
            >
              <span class="mx-1">ยกเลิก</span>
            </button>

            <v-btn-loading
                type="button"
                class="btn btn-danger btn-rounded shadow-dark"
                :fn="destroy"
                stopSpin
            >
              <span class="mx-3">ยืนยัน</span>
            </v-btn-loading>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirm delete modal -->
  </div>
</template>

<script>
const header_options = {
  value: String,
  title: String,
  _value: Function, //(val, item) => { return something }
  align: String, //'left'|'center'|'right'
  sortable: Boolean,
  row_clickable: Boolean,
  width: Number,
  h_class: String,
  b_class: String,
  _onclick: Function, //(val, item) => { do something }
}

export default {
  name: 'v-table',

  props: {
    api: {
      type: String,
      require: false,
      default: null,
    },
    headers: {
      type: Array,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    options: {
      type: Object,
      require: false,
      default: null,
    },
    actions: {
      type: Boolean,
      require: false,
      default: false,
    },
    edit_url: {
      type: String | null,
      require: false,
      default: null,
    },
    delete_url: {
      type: String | null,
      require: false,
      default: null,
    },
    show_filter: {
      type: Boolean,
      require: false,
      default: true,
    },
    filters: {
      type: Object,
      require: false,
      default: () => {
        return {
          search: '',
        }
      },
    },
    advance_filters: {
      type: Object,
      require: false,
      default: () => {
        return {}
      },
    },
    row_click: {
      type: Function,
      require: false,
    },
    div_1_class: {
      type: String,
      require: false,
      default: '',
    },
    div_2_class: {
      type: String,
      require: false,
      default: '',
    },
    import_data: {
      type: Array,
      require: false,
      default: () => [],
    },
    paginate_text_class: {
      type: String | Object,
      require: false,
      default: 'col-md-auto d-flex justify-content-center justify-content-md-start align-items-center',
    },
    paginate_justify_class: {
      type: String | Object,
      require: false,
      default: 'justify-content-center justify-content-md-end',
    },
    info_class: {
      type: String | Object,
      require: false,
      default: 'warning',
    },
  },

  data() {
    return {
      data: {
        data: [],
        import_data: [],
        links: null,
        meta: null,
      },
      loading: true,
      per_page: 10,
      page: 1,
      sort_key: null,
      sort_desc: false,
      timeout: null,
      old_filters: _.clone(this.filters),
      use_advance_filters: false,
    }
  },

  mounted() {
    if (!!this.api) {
      this.callApi()
    } else {
      this.setupImportData()

      this.loading = false
    }
  },

  methods: {
    sort(can_sort, key) {
      if (can_sort) {
        let sort_key = null
        let sort_desc = false

        if (this.sort_key === key && this.sort_desc) {
          // Do nothing just reset sort
        } else {
          sort_key = key

          if (this.sort_key === key) {
            sort_desc = true
          }
        }

        this.sort_key = sort_key
        this.sort_desc = sort_desc
        this.page = null

        if (!!this.api) {
          this.callApi()
        } else {
          let data = _.sortBy(this.import_data, [this.sort_key])
          if (sort_desc) data.reverse()

          this.setupImportData(data)
        }
      }
    },

    changePage(page) {
      this.page = page

      if (!!this.api) {
        this.callApi()
      } else {
        this.calculatePaginate(page)
      }
    },

    callApi(use_advance_filters = false) {
      this.use_advance_filters = use_advance_filters

      let sort_text = this.sort_key
      let sort_desc = null

      if (sort_text) {
        sort_desc = !this.sort_desc ? 'asc' : 'desc'
      }

      this.filters.sort = sort_text
      this.filters.sort_desc = sort_desc

      this.$emit('filtersChange', this.filters)

      let params = {
        page: this.page,
        per_page: this.per_page,
        ...this.filters,
      }

      if (this.use_advance_filters) {
        params = {
          ...params,
          ...this.advance_filters,
        }
      }

      this.old_filters = _.clone(this.filters)
      this.loading = true

      axios.get(this.api, {params: params})
          .then(({data}) => {
            this.data = data
            this.loading = false

            this.$emit('loaded')

            setTimeout(() => {
              $('[data-toggle="popover"]').popover()
            }, 100)
          })
    },

    goFilter(e) {
      if (
          (
              typeof e === 'undefined'
              || e.type === 'click'
              || e.keyCode === 13
          )
          && !!this.filters.search
      ) {
        if (!!this.timeout) {
          clearTimeout(this.timeout)
        }

        if (!!this.api) {
          this.page = 1

          this.callApi()
        } else {
          this.filterImportData()
        }
      }
    },

    getValue(datum, h) {
      if (!!h._value) {
        return h._value(_.get(datum, h.value), datum) || '-'
      } else if (!!h.info) {
        return h.info(datum)
      }

      return _.get(datum, h.value) || '-'
    },

    onClick(row, column) {
      if (!!column._onclick) {
        return column._onclick(_.get(row, column.value), row)
      }

      if (!!this.row_click && (typeof column.row_clickable === 'undefined' || column.row_clickable)) {
        return this.row_click(row)
      }

      return () => {
      }
    },

    setupImportData(import_data = null) {
      this.data.import_data = import_data || this.import_data

      this.calculatePaginate()
    },

    calculatePaginate(current_page = 1) {
      const total = this.data.import_data.length
      const per_page = this.per_page
      const last_page = Math.ceil(total / per_page)
      const to = per_page * current_page
      const from = current_page * per_page - (per_page - 1)

      this.data.links = {
        prev: current_page !== 1,
        next: current_page < last_page,
      }

      this.data.meta = {
        from: from,
        to: to > total ? total : to,
        total: total,
        per_page: per_page,
        current_page: current_page,
        last_page: Math.ceil(total / per_page),
      }

      this.data.data = this.data.import_data.slice(from - 1, to)

      setTimeout(() => {
        $('[data-toggle="popover"]').popover()
      }, 100)
    },

    filterImportData() {
      this.data.import_data = this.import_data.filter(datum => {
        let match = false

        if (!!this.filters.search) {
          this.headers.forEach(header => {
            match |= _.get(datum, header.value)
                .toString()
                .includes(this.filters.search)
          })
        } else {
          match = true
        }

        return match
      })

      this.calculatePaginate()
    },

    showConfirmDelete(delete_url, row) {
      this.destroy_url = delete_url.replace(':id', row.id)
      $(`#confirm_delete_modal`).modal('show')
    },

    destroy() {
      this.loading = true

      return axios.delete(this.destroy_url)
          .then(res => {
            this.callApi()

            return Promise.resolve(res)
          })
          .catch(error => {
            window.sweetAlert(error)

            return Promise.reject(error)
          })
          .finally(() => {
            $(`#confirm_delete_modal`).modal('hide')

            this.loading = false
          })
    },
  },

  watch: {
    filters: {
      deep: true,
      handler: function (new_val) {
        if (!!this.api) {
          if (!!this.timeout) {
            clearTimeout(this.timeout)
          }

          if (new_val.search !== this.old_filters.search) {
            this.timeout = setTimeout(() => {
              this.page = 1

              this.callApi()
            }, 1000)
          } else if (!(
              new_val.sort !== this.old_filters.sort
              || new_val.sort_desc !== this.old_filters.sort_desc
          )) {
            this.timeout = setTimeout(() => {
              this.page = 1

              this.callApi()
            }, 100)
          }
        } else {
          this.filterImportData()
        }

        this.old_filters = _.clone(new_val)
      },
    },

    import_data: {
      deep: true,
      handler: function () {
        this.setupImportData()
      },
    },

    per_page: function () {
      this.timeout = setTimeout(() => {
        this.page = 1

        this.callApi()
      }, 100)
    },
  },
}

</script>

<style lang="scss">

.sort-column {
  cursor: pointer;

  & i {
    color: #e5e5e5;

    &.sorted {
      color: gray;
    }
  }

  &:hover {
    & i {
      color: gray;
    }
  }
}

.table-striped tbody tr:nth-of-type(2n + 1) {
  background-color: #f9f9f9;
}

.table-hover tbody tr:hover {
  background-color: #f2f2f2;
}

.table-loading {
  position: absolute;
  margin-top: 55px;
  width: 50%;
}

.per-page-section {
  display: flex;
  align-items: center;
  color: #121212;

  & label {
    margin: 0;
  }

  & select {
    margin: 0 5px;
    width: 150px;
  }
}

.input-group {
  & input {
    border-right: none !important;
  }

  & .btn {
    border: 1px solid #c8c7cc;
    border-left: none !important;
    color: #c8c7cc;
  }
}

.action-column {
  & .btn {
    color: #A4A4A4;
  }
}

</style>
