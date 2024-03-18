<script>
import { ref,toRefs , onMounted, h, onUnmounted } from 'vue'
import { ElIcon, ElInput, ElPopover, ElButton, ElDialog, ElMessageBox } from 'element-plus';
import { LocationInformation, Search, FullScreen } from "@element-plus/icons-vue"
const xuiFormItemMapPosition = {
  props: {
    // apiKey: String,
    // vals: Array || null,
    city: String,
    default: Array, // [longitude, latitude]
    valueArr: Array,
  },
  emits:['change'],
  setup(props, { emit, attrs }) {
    // const { vals } = props
    const { showLngLat } = toRefs(attrs)
    // console.log('map position-----------------------------------', props.default, props.valueArr );
    const MAPKEY = '123123'
    const markerBox = ref()
    const MAP = ref()
    
    const coordinates= ref(props?.default || [] )
    const addressStr = ref('')
    const addressQuery=ref('')
    const geocoder = ref('')
    const myCity =  props.city || '中山市'
    const {valueArr} = toRefs(props)
    const lnglatAddr = ref([])
    const cptMapPopover = ref(null)
    let poiPicker = null

    const mapContainer= ref(null)

    const visibleDialog = ref(false)
    const fullDialog= ref(false)


    // const loadMapScript = () => {
    //   //
    //   return new Promise((resolve, reject) => {
    //     const script = document.createElement('script');
    //     script.type = 'text/javascript';
    //     script.src = `https://webapi.amap.com/maps?v=2.0&key=${MAPKEY}`;
    //     script.onerror = reject;
    //     script.onload = resolve;
    //     document.head.appendChild(script);

    //     const script2 = document.createElement('script');
    //     script2.type = 'text/javascript';
    //     script2.src = `https://webapi.amap.com/ui/1.1/main.js?v=1.1.1`;
    //     script2.onerror = reject;
    //     script2.onload = resolve;
    //     document.head.appendChild(script2);
    //   });
    // }
   
    const initMap = () => {
      // console.log('init map---------------------------------------');
      const AMap = window.AMap;
      MAP.value = new AMap.Map(mapContainer.value, {
        zoom: 12,
        willReadFrequently: true,
        center:[113.494468, 22.553556]
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

      // if (coordinates.value.length === 2 && valueArr.value?.length<1 ) {
       
      // }
      // console.log(555555555555555555555, coordinates.value, valueArr.value);
      // if(coordinates.value.length>=2){
      //   MAP.value.setCenter(coordinates.value);
      // }
      if (valueArr.value?.length >= 2) {
        const [ lng, lat ] = valueArr.value
        const timer = setTimeout(()=>{
          markerBox.value = new AMap.Marker({
            position: [lng, lat],
            map: MAP.value,
          });
          MAP.value.setCenter([lng, lat]);
          console.log(2222222222222, MAP.value, lng, lat);
          clearTimeout(timer)
        },500)
      }else{
        showMarkerCenter(coordinates.value)
      }

      
      MAP.value.on('click', (e) => {
        // console.log(333333333, e);
        const clickedCoordinates = [e.lnglat.lng, e.lnglat.lat];
        coordinates.value = clickedCoordinates;

        // console.log(e.lnglat.lng, e.lnglat.lat);
        // emit("change", [e.lnglat.lng, e.lnglat.lat, addressStr.value ] );
        lnglatAddr.value = [e.lnglat.lng, e.lnglat.lat, addressStr.value ] 

        geocoder.value?.getAddress(clickedCoordinates, function(status, result) {
          // console.log(3333333,status, result);
            if (status === 'complete'&&result.regeocode) {
                var str = result.regeocode.formattedAddress;
                // console.log('-------------', str);
                addressStr.value=str
                lnglatAddr.value[2]= str
                // document.getElementById('address').value = address;
            }else{
                console.error('根据经纬度查询地址失败')
            }
        });
        showMarkerCenter(clickedCoordinates)
       
      });
    }

    const poiPickerReady=(poiPicker)=>{
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
          addressStr.value = poi.address
          lnglatAddr.value = [poi.location.lng, poi.location.lat, poi.address]

          // markerBox.setMap(MAP.value);
          // infoWindow.setMap(MAP.value);
          showMarkerCenter([poi.location.lng, poi.location.lat])
          // infoWindow.setPosition(poi.location);
          // infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
          // infoWindow.open(MAP.value, markerBox.getPosition());

          // MAP.value.setCenter(markerBox.value.getPosition());
        });
        poiPicker.onCityReady(function() {
            poiPicker.suggest('');
        });
      }

    const showMarkerCenter = (lnglat)=>{
      // Clear existing marker
      if (markerBox.value) {
        markerBox.value.remove();
      }
      // console.log(55555555, lnglat);
      if(!Array.isArray(lnglat) || lnglat.length<2) return
      // Add new marker
      markerBox.value = new AMap.Marker({
        position: lnglat,
        map: MAP.value,
      });
      // Update center
      MAP.value.setCenter(lnglat);
    }
   
     
    

    onMounted(()=>{
      
      
      // !MAP.value && initMap()

      // if(window?.AMap && window?.AMapUI){
      // }
      // {
      //   loadMapScript().then(() => {
      //     initMap();
      //   });
      // }
      
    })
    onUnmounted(()=>{
      MAP.value && MAP.value.destroy();
      window.poiPicker = null
    })

    const handleClose = (status, done) => {
      const des = {'confirm':`请确认经纬度 并 关闭地图`, 'cancel':'确定关闭地图吗？'}
      ElMessageBox.confirm(des[status])
        .then(() => {
          mapFullScreen()
          visibleDialog.value=false
          done && done()
        })
        .catch(() => {
          // catch error
        })
    }

    const confirm = () => {
      if(fullDialog.value){
        handleClose('confirm',()=>{
          emit("change", lnglatAddr.value );
        })
      }else{
        emit("change", lnglatAddr.value );
        visibleDialog.value=false
      }
    }
    const myCancel = () => {
      if(fullDialog.value){
        handleClose('cancel')
      }else{
        visibleDialog.value=false
      }
    }
    const showMapDia = () =>{
      visibleDialog.value = !visibleDialog.value
      console.log(mapContainer.value);
      if(visibleDialog.value){
        const timer=setTimeout(()=>{
          initMap()
          clearTimeout(timer)
        },200)
      } 
    }
    const mapFullScreen = ()=>{
      fullDialog.value=!fullDialog.value
    }

    return {
      mapContainer,
      addressQuery,
      addressStr,
      lnglatAddr,
      confirm,
      myCancel,
      cptMapPopover,

      visibleDialog,
      showMapDia,
      mapFullScreen,
      fullDialog,
      valueArr,
      coordinates,
      MAP,
      markerBox,
      showLngLat,//显示经纬度的框
    }
    
  },
  render(){
    // console.log('=====================================================',this.lnglatAddr, this.valueArr);
    

    return h('div',{
      style:{ marginLeft:'6px' }
    },[
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
          },
          onClick:this.showMapDia
        },
      ),
      h(ElDialog,{
        showClose:false,
        draggable:true,
        // fullscreen:true,
        modelValue:this.visibleDialog,
        width:'70vw',
        'destroy-on-close':true,
        fullscreen:this.fullDialog,
        // height:this.fullDialog?'100%':600,
        class:'map-position-dia-box',
        onOpen:()=>{
          this.addressQuery =''
          this.lnglatAddr = this.valueArr
          // this.coordinates = this.valueArr
          // if (this.valueArr?.length >= 2) {
          //   const [ lng, lat ] = this.valueArr
          //   const timer = setTimeout(()=>{
          //     this.markerBox = new AMap.Marker({
          //       position: [lng, lat],
          //       map: this.MAP,
          //     });
          //     this.MAP.setCenter([lng, lat]);
          //     // console.log(2222222222222, this.MAP, lng, lat);
          //     clearTimeout(timer)
          //   },500)
          // }
        },
        onClose:()=>{
          this.visibleDialog=false
        }
      },{
        default:()=>[
          h('div',{ 
            ref:'mapContainer',
            style:{
              height:this.fullDialog ? '90vh' : '540px',
              width:'102%'
            }
          }),
          h(
            'div',
            {
              class:'query-box'
            },
            [
              h('div',{ class:'pickerBox'},[
                h(ElInput,{
                  id:'mapPickerInput',
                  class:['map-query-input','cptMapPickerInput'],
                  placeholder:'搜索关键字',
                  modelValue: this.addressQuery,
                  prefixIcon: Search,
                  // disabled: !this.addressStr,
                  onInput:(val)=>{
                    this.addressQuery = val
                  }
                },{
                  // prepend:()=>"地址搜索"
                }),
                h('div',{ class:'poiInfo' })
              ]),

              
            ]
          ),

          h(
            'div',
            {class: 'checked-msg-box'},
            [
              this.lnglatAddr?.length>0 ? h('div',{
                  class:'checked-box',
                  style:{
                    height:this.showLngLat?'70px':'38px'
                  }
                },[
                  this.showLngLat && h('div',{},[
                    h('span',{ class:'checked-tag-box' },[
                      h('span',{ class:'checked-tag' }, '经度:'),
                      h('span', this.lnglatAddr[0])
                    ]),
                    h('span',{ class:'checked-tag-box' },[
                      h('span',{ class:'checked-tag' }, '纬度:'),
                      h('span', this.lnglatAddr[1])
                    ]),
                  ]),
                  h('div',{
                    style:{'flex-basis': this.fullDialog?'600px':'340px'},
                    class:'checked-tag-box-input'
                  },[
                    h('span',{ class:'checked-tag' }, '地址:'),
                    h(ElInput,{
                      modelValue: this.addressStr,
                      onInput:(val)=>{
                        this.addressStr = val
                      }
                    })
                  ])
                ]
              ) : h('span', {
                style:{color:'#999'} 
              },'选择地图上的选点'),
              
              h('span',{}),
              h('span',{
                style:{ padding:'6px' }
              },[
                h(ElButton,{
                  type:'primary',
                  onClick: this.confirm
                },()=>`确定`),
                h(ElButton,{
                  onClick: this.myCancel
                },()=>`取消`)
              ])
            ]
            
          )        
        ],

        header:()=>[
          h('div',{
            style:{
              height:'30px'
            }
          })
        
        
          // h(FullScreen,{
          //   class: 'opt-map-full-btn',
          //   onClick: this.mapFullScreen
          // }),
        ]

      })
    ])
      

  }
};
export default xuiFormItemMapPosition
</script>
<style>
.pickerBox {
  /* position: absolute; */
  z-index: 9999;
  /* top: 18px; */
  /* left: 25px; */
  width: 400px;
}

.cptMapPickerInput {
  width: 100%;
  padding: 5px 5px;
}

.poiInfo {
    background: #fff;
}

.amap_lib_placeSearch .poibox.highlight {
    background-color: #CAE1FF;
}

/* .amap_lib_placeSearch .poi-more {
    display: none!important;
}
.amap_lib_placeSearch .poibox.highlight {
    background-color: #CAE1FF;
}

.amap_lib_placeSearch .poi-more {
    display: none!important;
} */
</style>
<style scoped>
.opt-map-full-btn{
  position: absolute;
  right: 20px;
  top:14px;
  z-index: 1000;
  width:20px;
  height: 20px;
  margin-left: 12px;
  padding:6px;
  border-radius: 30px;
  background-color: #fff;
  transition: all .3s;
  box-shadow: 0 0 20px #bababa;
  &:hover{
    color:#528fff;
    cursor: pointer;
    box-shadow: 0 0 30px #528fff;
  }
}
.map-query-input{
  /* position: relative; */
  /* flex:1; */
  margin-right:6px
  /* top:-30px; */
  /* z-index: 888; */
  /* left:10px; */
  /* border:1px solid tomato; */
}
.query-box{
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  z-index: 9999;
  position: absolute;
  top:0px;
}
.checked-msg-box{
  position: relative;
  /* width: 97%; */
  display: flex;
  justify-content: space-between;
  padding-top: 6px;
}
.checked-box{
  /* border:1px solid tomato; */
  position: absolute;
  bottom: 0px;
  /* left: -16px; */
  z-index: 999;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 20px;
  background-color: #fff;
  width: 400px;
  height: 70px;
  padding:6px;
  border-radius: 2px;

  /* border:1px solid tomato; */
  .checked-tag-box-input{
    display: flex;
    flex:1;
    border-radius: 4px;
    overflow: hidden;
    .checked-tag{
      color:#999;
      width: 40px;
      /* background-color: #f5f7fa; */
      padding:0 10px;
      margin-right: 2px;
      display: inline-block;
    }
  }
  .checked-tag-box{
    border-radius: 4px;
    /* padding:0 16px; */
    padding-right: 6px;
    margin-right: 6px;
    /* margin-top: 2px; */
    /* overflow: hidden; */
    /* height: 28px; */
    /* line-height: 24px; */
    /* border:1px solid rgb(224, 224, 224); */
    /* background-color: #fff; */
    display: inline-block;
    .checked-tag{
      color:#999;
      /* background-color: #f5f7fa; */
      padding:0 6px 0 12px;
      height: 100%;
      width: 36px;
      margin-right: 2px;
      display: inline-block;
    }
  }
}
</style>
