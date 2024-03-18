<script>
import { ref, onMounted, onBeforeUnmount,watch, h, inject} from "vue";


export default {
  props: {
    options: Object, // ECharts的配置项
    height: Number | String,
    width:  Number | String,
  },
  setup(props) {

    const echarts = inject("echarts");
    console.log('===============================',props, echarts);
    
    const echartsContainer = ref(null);
    let chart = null;
    let resizeObserver = null;

    onMounted(() => {

      chart = echarts.init(echartsContainer.value);

      chart.setOption(props.options);

      resizeObserver = new ResizeObserver(resetChartSize);
      resizeObserver.observe(echartsContainer.value);
    });

    watch(() => props.options, () => {
      if (chart) {
        chart.setOption(props.options);
      }
    });

    const resetChartSize = () => {
      if (chart) {
        chart.resize();
      }
    };

    onBeforeUnmount(() => {
      if (chart) {
        chart.dispose();
      }
      if (resizeObserver) {
        resizeObserver.unobserve(echartsContainer.value);
        resizeObserver.disconnect();
      }
    });

    return () => h("div", { ref: echartsContainer, style: { width: props.width || "100%", height: props.height || "400px" } });
  },
  
};
</script>
