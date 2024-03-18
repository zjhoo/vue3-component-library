<script>
export default {
  name: 'CardWrapper',
  props: {
    checkable: {
      type: Boolean,
      default: false,
    },
    pageType: {
      type: String,
      default: '',
    },
    gridConf: {
      type: Function,
      default: () => ({
        col: 5,
        gap: 10,
        row: 'max-content',
      }),
    },
    dataSource: {
      type: Array,
      default: () => ([]),
    },
    renderFunc: {
      type: Function,
      default: (h) => h('div'),
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      selectItems: [],
      isResized: false,
    }
  },
  computed: {},
  methods: {
    resize([width, height]) {
      this.width = width
      this.height = height
      // const { col } = this.gridConf(this.width, this.height)
      // const size = col * 2
      // this.$emit('on-page-size-change', size)
      this.isResized = true
    },
    emitChanged(row, f) {
      const selectetdData = this.dataSource.filter(d => d._checked)
      if (f) {
        this.$emit('on-select', selectetdData, row)
      } else {
        this.$emit('on-select-cancel', selectetdData, row)
      }
      this.$emit('on-selection-change', selectetdData)
    },
  },
  render: function (h) {
    const { col, gap } = this.gridConf(this.width, this.height)
    return h('div', {
      style: {
        'grid-auto-columns': `minmax(${97 / col}%, ${100 / col}%)`,
        'grid-auto-rows': 'max-content',
        'grid-gap': `${gap}px`,
        'opacity': this.isResized ? 1 : 0,
        // 'padding': `0 0 0 ${gap}px`,
      },
      class: 'wrapper',
      directives: [
        {
          name: 'dom-resize',
          value: this.resize,
        },
      ],
    }, this.dataSource.map((row, index) => {
      const colIndex = (index % col) + 1
      return h('div', {
        class: `card-wrapper ${row._checked && 'card-checked'}`,
        style: {
          gridColumn: colIndex,
        },
      }, [this.renderFunc(h, row), ...(this.checkable ? [h('Checkbox', {
        class: 'card-check-box',
        props: {
          value: row._checked,
          disabled: row._disabled,
        },
        on: {
          'on-change': (f) => {
            row._checked = f
            console.log(row, f, 'row--------------')
            this.emitChanged(row, f)
          },
        },
      })] : [])])

    }))
  },
}
</script>

<style lang="scss" scoped>
.wrapper{
  position: relative;
  display: grid;
  margin: 10px 0;
  flex: 1;
  /* overflow-y: auto; */
  .card-wrapper{
    border:  1px solid transparent;
    position: relative;
    .card-check-box{
      position: absolute;
      top: 10px;
      left: 10px;
    }
  }
  .card-checked{
    border:  1px solid rgba(71,148,255,1);
    background-color: rgba(246,250,255,1);
  }
}
</style>
