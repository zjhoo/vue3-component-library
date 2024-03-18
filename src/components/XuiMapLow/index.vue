<script>
  import {h, ref, onMounted, onUnmounted, nextTick } from 'vue';
  
  export default {
    props: {
      id: String,
      lng: Number,
      lat: Number,
    },
    setup(props,{ attrs }) {
      const mapRef = ref(null); // 地图实例的引用
      const layerRef = ref(null)
      const markerRef = ref(null);
      console.log('-------------',mars2d);
      const createMap = mars2d.Map
      const mapId = props?.id || 'mars2dId'
  
      nextTick(() => {
        const mapOptions = {
            zoom: 13, //地图层级
            center: { lng: props.lng, lat: props.lat }, //地图中心点
            basemaps: [
                { name: "高德地图", type: "gaode", layer: "vec", show: true }, //底图
            ],
        }
        mapRef.value = new createMap(mapId,mapOptions);
  
        layerRef.value = new mars2d.layer.GraphicLayer()
        mapRef.value.addLayer(layerRef.value)
        // 创建标记
        var graphic = new mars2d.graphic.Marker({
          latlng: [props.lat, props.lng],
          style: {
            color: "#0081c2",
            font_size: 25,
            font_family: "楷体",
          },
        });
        markerRef.value = graphic
        layerRef.value.addGraphic(graphic); 

        markerRef.value.on(mars2d.EventType.click, onMarkerClick, this);

      });

      const onMarkerClick = (event)=>{
        console.log('marker click ', event);
        bindLayerPopup(event)
      }

      function bindLayerPopup() {
        layerRef.value.bindPopup(function (event) {
          const attr = event?.attr || {}
          attr["类型"] = event.type
          attr["来源"] = "信息1"
          attr["备注"] = "信息2"

          return mars2d.Util.getTemplateHtml({ title: "Popup展示", template: "all", attr: attr })
        })
      }
  
      // 在组件卸载时销毁地图和标记
      onUnmounted(() => {
        if (mapRef.value) {
          mapRef.value.destroy();
        }
      });
  

      return () => h("div", { ...attrs, id: mapId, style: { width: attrs?.width || "100%", height: attrs?.height || "400px" } });
    },
  };
  </script>
  