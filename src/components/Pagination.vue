<template>
  <div class="row">
    <div class="col-md-auto">
      <div class="per-page-section">
        <label for="per_page">ข้อมูล</label>
        <select v-model="per_page" id="per_page" class="custom-select">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <label for="per_page">รายการ</label>
      </div>
    </div>

    <div :class="text_class" class="text-gray mb-3 mb-md-0 px-0">
      (แสดง {{ meta.from || 0 }} ถึง {{ meta.to || 0 }} จาก {{ meta.total }} รายการ)
    </div>

    <div class="col-md" v-if="meta.total > meta.per_page">
      <div :class="paginate_justify_class" class="d-flex">
        <nav aria-label="Page navigation">
          <ul class="pagination mb-0">
            <li
                class="page-item"
                :class="{ 'disabled': !has_prev }"
                @click="has_prev ? gotoPage(1) : null"
            >
              <a class="page-link">
                <i class="fas fa-angle-double-left"></i>
              </a>
            </li>

            <li
                class="page-item"
                :class="{ 'disabled': !has_prev }"
                @click="has_prev ? gotoPage(meta.current_page - 1) : null"
            >
              <a class="page-link">
                <i class="fas fa-angle-left"></i>
              </a>
            </li>

            <li
                class="page-item"
                v-for="(page,key) in pages"
                :class="{ 'active': page === meta.current_page }"
                @click="page !== meta.current_page ? gotoPage(page) : null"
                :key=key
            >
              <a class="page-link">{{ page }}</a>
            </li>

            <li
                class="page-item"
                :class="{ 'disabled': !has_next }"
                @click="has_next ? gotoPage(meta.current_page + 1) : null"
            >
              <a class="page-link">
                <i class="fas fa-angle-right"></i>
              </a>
            </li>

            <li
                class="page-item"
                :class="{ 'disabled': !has_next }"
                @click="has_next ? gotoPage(meta.last_page) : null"
            >
              <a class="page-link">
                <i class="fas fa-angle-double-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-pagination',

  props: {
    links: {
      type: Object,
      require: true,
    },
    meta: {
      type: Object,
      require: true,
    },
    text_class: {
      type: String | Object,
      require: false,
      default: 'col-md-auto d-flex justify-content-center justify-content-md-start align-items-center',
    },
    paginate_justify_class: {
      type: String | Object,
      require: false,
      default: 'justify-content-center justify-content-md-end',
    },
  },

  data() {
    return {
      per_page: 10,
    }
  },

  computed: {
    has_prev() {
      return !!this.links.prev
    },

    has_next() {
      return !!this.links.next
    },

    pages() {
      let pages = []

      let prev_page = this.meta.current_page

      if (prev_page > 1) {
        while (true) {
          prev_page--

          if (this.meta.current_page - prev_page === 2 || prev_page <= 1) {
            break
          }
        }
      }

      for (let i = this.meta.current_page - 1; i >= prev_page; i--) {
        pages.push(i)
      }

      pages.reverse()
      pages.push(this.meta.current_page)

      let next_page = this.meta.current_page

      if (next_page < this.meta.last_page) {
        while (true) {
          next_page++

          if (
              next_page - this.meta.current_page === 2
              || next_page >= this.meta.last_page
          ) {
            break
          }
        }
      }

      for (let i = this.meta.current_page + 1; i <= next_page; i++) {
        pages.push(i)
      }

      return pages
    },
  },

  methods: {
    gotoPage(page) {
      if (page) {
        this.$emit('gotoPage', page)
      }
    },
  },

  watch: {
    per_page: function (per_page) {
      this.$emit('changePerPage', per_page)
    },
  },
}
</script>

<style lang="scss">
.per-page-section {
  display: flex;
  justify-content: center;
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

a.page-link {
  cursor: pointer;
  min-width: 40px;
  text-align: center;
}

#per_page {
  width: 65px;
  padding: 6px;
}
</style>
