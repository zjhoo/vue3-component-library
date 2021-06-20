<template>
    <div id="app">
		   <router-view></router-view>
    </div>
</template>

<script>
    export default {
    	name:'App'
    }
</script>

<style lang="less">
    @import './assets/style/variables';
	@import './assets/style/element-ui';
	@import './assets/style/common';
    @import './assets/style/scrollBar';
</style>
