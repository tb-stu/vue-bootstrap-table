<template>
  <date-picker
    v-model="new_value"
    :placeholder="placeholder"
    :format="format"
    :disabled-date="disabledDate"
    :editable="false"
    :show-be-year="true"
    input-class="form-control bg-white"
  >
    <template slot="icon-calendar">
      <i class="fas fa-calendar-alt"></i>
    </template>
  </date-picker>
</template>

<script>
  import DatePicker from '../../date-picker'

  var locale = {
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
    monthsShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    weekdays: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
    weekdaysShort: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'],
    weekdaysMin: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    firstDayOfWeek: 0,
    firstWeekContainsDate: 6
  }

  var lang = {
    formatLocale: locale,
    yearFormat: 'YYYY',
    monthFormat: 'MMM',
    monthBeforeYear: true
  }
  DatePicker.locale('th', lang)

  export default {
    name: 'v-datepicker',

    components: {
      'date-picker': DatePicker,
    },

    props: {
      value: {
        require: true,
      },
      placeholder: {
        type: String,
        require: false,
        default: null,
      },
      format: {
        type: String,
        require: false,
        default: 'DD/MM/YYYY',
      },
      disabledDate: {
        type: Function,
        require: false,
        default: () => { return false },
      },
    },

    data () {
      return {
        new_value: this.value,
      }
    },

    watch: {
      value: function (val) {
        this.new_value = val
      },

      new_value: function (val) {
        this.$emit('input', val)
      },
    },
  }
</script>

