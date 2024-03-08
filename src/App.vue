<template>
  <el-config-provider :locale="locale" :size="size">
	<!-- 开启水印 -->
	<el-watermark 
		v-if="watermarkEnabled"
		:font="{color: fontColor, fontSize: '20px'}"
		:content="defaultSettings.watermarkContent"
		class="wh-full" 
	>
		<router-view />
	</el-watermark>
	<!-- 关闭水印 -->
	<router-view v-else />
  </el-config-provider>

  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  {{ $t('greeting.hi') }}
</template>

<script lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { useAppStore, useSettingsStore, } from '@/store';
import { ThemeEnum } from './enums/ThemeEnum';
import defaultSettings from './settings';

@Component({
  components: {
    HelloWorld,
  },
  setup() {
	return {
		appStore: useAppStore(),	// store 实例化
		settingsStore: useSettingsStore(),	// store 实例化
	}
  }
})
class App extends Vue {
	// app.privode() 提供的值
	// @Inject
	// readonly i18n: any;

	appStore!: any;
	settingsStore!: any;
	get defaultSettings(){return defaultSettings;} 

	// This is a vue component lifecycle hook.
	mounted(){
		// console.log("注入的值：", this.i18n);
		// this.$i18n.locale = this.appStore.language;
		console.log("i18n", this.$i18n);
	}

	get locale() {
		return this.appStore.locale;
	}
	get size() {
		return this.appStore.size;
	}
	get watermarkEnabled() {
		return this.settingsStore.watermarkEnabled;
	}

	get fontColor() {
		return this.settingsStore.theme === ThemeEnum.DARK 
			? 'rgba(255, 255, 255, .15)' 
			: 'rgba(0, 0, 0, .15)';
	}
}
export default toNative(App);
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
