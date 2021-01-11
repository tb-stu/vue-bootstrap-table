<template>
  <button :type="type" :disabled="disabled_btn" @click="callFn" class="btn btn-success text-white">
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm mb-1"
      role="status"
      aria-hidden="true"
    />
     <i v-else-if="!!icon" :class="icon"></i>
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'v-btn-loading',

    props: {
      icon: {
        type: String,
        require: false,
        default: null,
      },
      disabled: {
        type: Boolean,
        require: false,
        default: false,
      },
      fn: {
        type: Function,
        require: false,
        default: null,
      },
      type: {
        type: String,
        require: false,
        default: 'submit',
      },
      stopSpin: {
        type: Boolean,
        require: false,
        default: false,
      }
    },

    data () {
      return {
        loading: false,
        disabled_btn: this.disabled,
      }
    },

    methods: {
      callFn () {
        this.loading = true
        this.disabled_btn = true

        if (!!this.fn) {
          try {
            this.fn()
              .then(() => {
                this.stopLoading()
              })
              .catch(() => this.stopLoading(false))
          } catch (e) {
            // this.stopLoading()
          }
        } else {
          this.$parent.save()
            .then(() => {
              this.stopLoading()
            })
            .catch(() => this.stopLoading(false))
        }
      },

      stopLoading (success = true) {
        if ((this.stopSpin && success) || !success) {
          this.loading = false
          this.disabled_btn = false
        }

        this.$emit('success')
      },
    },

    watch: {
      disabled: function (disabled) {
        this.disabled_btn = disabled
      },
    },
  }
</script>

<style scoped>

</style>
