<script>
import { ref,toRefs , onMounted, h, onUnmounted } from 'vue'
import { ElIcon, ElInput, ElPopover, ElButton } from 'element-plus';
import { LocationInformation, Search } from "@element-plus/icons-vue"
const xuiFormItemMapPosition = {
  props: {
    // apiKey: String,
    // vals: Array || null,
    city: String,
    default: Array, // [longitude, latitude]
  },
  emits:['change'],
  setup(prop, { emit, attrs }) {
    // console.log('map position-----------------------------------', prop);
    // const { vals } = prop
    const MAPKEY = '123123'
    let MAP, markerBox
    
    const coordinates= ref( prop?.default || [113.38751547014657,22.518689200547833] )
    const addressStr = ref('')
    const geocoder = ref('')
    const myCity =  prop.city || '中山市'
    let poiPicker = null

    const mapContainer= ref(null)


    const loadMapScript = () => {
      //
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${MAPKEY}`;
        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);

        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = `https://webapi.amap.com/ui/1.1/main.js?v=1.1.1`;
        script2.onerror = reject;
        script2.onload = resolve;
        document.head.appendChild(script2);
      });
    }
   
    const initMap = () => {
      // console.log('init map---------------------------------------');
      const AMap = window.AMap;
      MAP = new AMap.Map(mapContainer.value, {
        zoom: 12,
        willReadFrequently: true, 
      });

      const AMapUI = window.AMapUI
      AMapUI?.loadUI(['misc/PoiPicker'], function(PoiPicker) {
        poiPicker = new PoiPicker({
            city: myCity,
            input: 'mapPickerInput'
        });
        //初始化poiPicker
        poiPickerReady(poiPicker);
      });
      
      // console.log(444444555, AMap, MAP, AMapUI);

      AMap.plugin('AMap.Geocoder', ()=>{
        geocoder.value = new AMap.Geocoder({
          city: myCity, //城市设为北京，默认：“全国”
          radius: 1000 //范围，默认：500
        });
        // console.log('-----------------',geocoder.value);
      })

      


      function poiPickerReady(poiPicker) {
        window.poiPicker = poiPicker;
        // var infoWindow = new AMap.InfoWindow({
        //     offset: new AMap.Pixel(0, -20)
        // });

        //选取了某个POI
        poiPicker.on('poiPicked', function(poiResult) {
          // console.log(55555555, poiResult);

          // var source = poiResult.source,
          let poi = poiResult.item
          // info = {
          //     // source: source,
          //     // id: poi.id,
          //     name: poi.name,
          //     location: poi.location.toString(),
          //     address: poi.address
          // };

          // console.log('----------', poi);
          emit("change", [poi.location.lng, poi.location.lat, addressStr.value] );

          // markerBox.setMap(MAP);
          // infoWindow.setMap(MAP);

          markerBox.setPosition(poi.location);
          // infoWindow.setPosition(poi.location);
          // infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
          // infoWindow.open(MAP, markerBox.getPosition());

          MAP.setCenter(markerBox.getPosition());
        });
        poiPicker.onCityReady(function() {
            poiPicker.suggest('');
        });
      }
      if (coordinates.value.length === 2) {
        markerBox = new AMap.Marker({
          position: coordinates.value,
          map: MAP,
        });
        MAP.setCenter(coordinates.value);
      }

      MAP.on('click', (e) => {
        // Clear existing marker
        if (markerBox) {
          markerBox.setMap(null);
        }
        // console.log(333333333, e);
        const clickedCoordinates = [e.lnglat.lng, e.lnglat.lat];
        coordinates.value = clickedCoordinates;

        // console.log(e.lnglat.lng, e.lnglat.lat);
        emit("change", [e.lnglat.lng, e.lnglat.lat, addressStr.value ] );

        geocoder.value?.getAddress(clickedCoordinates, function(status, result) {
          // console.log(3333333,status, result);
            if (status === 'complete'&&result.regeocode) {
                var str = result.regeocode.formattedAddress;
                // console.log('-------------', str);
                addressStr.value=str
                // document.getElementById('address').value = address;
            }else{
                console.error('根据经纬度查询地址失败')
            }
        });
       
        // Add new marker
        markerBox = new AMap.Marker({
          position: clickedCoordinates,
          map: MAP,
        });

        // Update center
        MAP.setCenter(clickedCoordinates);
      });
    }
   
     
    

    onMounted(()=>{
      
      
      !MAP && initMap()

      // if(window?.AMap && window?.AMapUI){
      // }
      // {
      //   loadMapScript().then(() => {
      //     initMap();
      //   });
      // }
      
    })
    onUnmounted(()=>{
      MAP && MAP.destroy();
      window.poiPicker = null
    })

    return {
      mapContainer,
      addressStr,
    }
    
  },
  render(){
    // console.log('=====================================================');

    return h(
      ElPopover,
      {
        width:780,
        trigger:'click',
        // placement:'bottom-start'
        style:{ position:'relative' }
      },
      {
        reference: ()=> h(
          'div',
          {
            style:{ marginLeft:'6px' }
          },
          h(
            ElButton,
            {
              icon:LocationInformation,
              bg:true,
              type: 'primary',
              // text: true,
              plain: true,
              style:{
                width: '32px',
                fontSize: 'larger',
                cursor:'pointer'
              }
            },
            ),
        ) ,
        default:()=>[
          h('div',{ 
            ref:'mapContainer',
            style:{
              height:'500px',
              width:'760px'
            }
          }),
          h(ElInput,{
            id:'mapPickerInput',
            class:'map-query-input',
            placeholder:'选取地点或搜索关键字',
            modelValue: this.addressStr,
            prefixIcon: Search,
            // disabled: !this.addressStr,
            onInput:(val)=>{
              this.addressStr = val
            }
          })
        ]
      }
    )
      

  }
};
export default xuiFormItemMapPosition
</script>
<style scoped>
.map-query-input{
  position: relative;
  /* top:-30px; */
  /* z-index: 888; */
  /* left:10px; */
  /* border:1px solid tomato; */
}
</style>
