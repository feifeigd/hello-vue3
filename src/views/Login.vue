
<template>
    <div class="login-container">
        <!-- 顶部 -->
        <div class="absolute-lt flex-x-end p-3 w-full">
            <!-- 切换夜间模式 -->
            <el-switch 
                v-model="isDark"
                inline-prompt
                :active-icon="Moon"
                :inactive-icon="Sunny"
                @change="toggleTheme"
            />
            <LangSelect class="ml-2 cursor-pointer"></LangSelect>                
        </div>
        <!-- 登录表单 -->
        <el-card class="!border-none !bg-transparent !rounded-4% w-100 <sm:w-85">
            <div class="text-center relative">
                <h2>{{ defaultSettings.title }}</h2>
                <el-tag class="ml-2 absolute-rt">{{ defaultSettings.version }}</el-tag>
            </div>
            <el-form
                ref="loginFormRef"
                class="login-form"
                :model="loginData"
                :rules="loginDataRules"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <div class="flex-y-center w-full">
                        <SvgIcon icon-class="user" class="mx-2" />
                        <el-input
                            ref="usernameRef"
                            v-model="loginData.username"
                            prefix-icon="el-icon-user-solid"
                            :placeholder="$t('login.username')"
                            name="username"
                            size="large"
                            class="h-[48px]"
                            @keyup="isCapsLock = $event.getModifierState('CapsLock')"
                        />
                        <!-- <el-tooltip
                            v-if="isCapsLock"
                            effect="dark"
                            content="Caps Lock is On"
                            placement="top"
                        >
                            <i class="el-icon-warning text-red-500">大写</i>
                        </el-tooltip> -->
                    </div>
                </el-form-item>

                <!-- 密码 -->
                <el-tooltip
                    :visible="isCapsLock"
                    effect="dark"
                    content="Caps Lock is On"
                    placement="right"
                >
                    <el-form-item prop="password">
                        <div class="flex-y-center w-full">
                            <el-icon class="mx-2" name="lock" >
                                <!-- @element-plus/icons-vue -->
                                <Lock />
                            </el-icon>
                            <el-input
                                ref="passwordRef"
                                v-model="loginData.password"
                                :placeholder="$t('login.password')"
                                name="password"
                                size="large"
                                class="h-[48px] pr-2"
                                type="password"
                                @keyup="checkCapsLock"
                                @keyup.enter="handleLogin"
                                show-password
                            />
                        </div>
                    </el-form-item>
                </el-tooltip>
            
                <!-- 验证码 -->
                <el-form-item prop="captchaCode">
                    <div class="flex-y-center w-full">
                        <SvgIcon icon-class="captcha" class="mx-2" />
                        <el-input
                            ref="captchaCodeRef"
                            v-model="loginData.captchaCode"
                            autocomplete="off"
                            :placeholder="$t('login.captchaCode')"
                            name="captchaCode"
                            size="large"
                            class="flex-1"
                            @keyup.enter="handleLogin"
                        />
                        <el-image
                            class="rounded-tr-md rounded-br-md cursor-pointer h-[48px] "
                            :src="captchaBase64"
                            @click="getCaptcha"
                        />
                    </div>
                </el-form-item>

                <!-- 登录按钮 -->
                <el-button
                    type="primary"
                    class="w-full"
                    :loading="loading"
                    size="large"
                    @click.prevent="handleLogin"
                >
                    {{ $t('login.login') }}
                </el-button>

                <!-- 账号密码提示 -->
                <div class="mt-10 text-sm">
                    <span>{{ $t("login.username") }}: admin</span>
                    <span class="ml-4">{{ $t("login.password") }}: 123456</span>
                </div>
            </el-form>
        </el-card>

        <!-- ICP 备案号 -->
        <div v-show="icpVisible" class="absolute bottom-1 text-[10px] text-center">
            <p>Copyright © 2012 ~ precent d7kj All Right Reserved. 第七空间</p>
            <p><a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备12018578号</a></p>
        </div>
    </div>
</template>

<script lang="ts">
import {  LoginData } from '@/api/auth/types';
import { ThemeEnum } from '@/enums/ThemeEnum';
import defaultSettings from '@/settings';
import { useAppStore, useSettingsStore, useUserStore, } from '@/store';
import {Moon, Sunny} from '@element-plus/icons-vue';
import {ElForm} from 'element-plus/es';
import {getCaptchaApi} from '@/api/auth';

const settingsStore = useSettingsStore();
const userStore = useUserStore();

@Component({
    setup() {
        const appStore = useAppStore();
        const loginFormRef = ref(ElForm);
        const {height} = useWindowSize();
        let icpVisible = ref(false);

        // 监听窗口高度变化, 拖拉窗口大小会改变高度
        watchEffect(()=>{
            icpVisible.value = (height.value >= 600);
        });

        // 注入属性到 class，如果在class的函数里面使用，需要在class里面再声明一次
        // 如果只是 template里面用到，则vscode会爆红，但是不影响运行，这个还不知道这么解决
        return {
            appStore,
            height,
            icpVisible,
            loginFormRef,
            defaultSettings,
            Moon, Sunny,
        };
    },
})
class Login extends Vue{
    // Moon = markRaw(Moon);
    // Sunny = markRaw(Sunny);
    Moon!: any;
    Sunny!: any;

    // setup 注入
    readonly appStore!: any;
    readonly loginFormRef!: typeof ElForm;
    readonly height!: number;

    captchaBase64 = ''; // 验证码图片的base64字符串

    icpVisible = false;
    isCapsLock = false;
    readonly isDark = settingsStore.theme === ThemeEnum.DARK;
    loading = false;

    loginData: LoginData = {
        username: 'admin',
        password: '123456',
    };

    get loginDataRules() {
        const prefix = this.appStore.language === 'zh-cn' ? '请输入' : 'Please enter';
        const t = this.$t;  // i18n
        return {
            username: [
                { required: true, message: `${prefix}${t("login.username")}`, trigger: 'blur' },
            ],
            password: [
                { required: true, message: `${prefix}${t("login.password")}`, trigger: 'blur',
                    validator: (rule: any, value: string, callback: any) => {
                        if (value.length < 6) {
                            console.log('密码长度不能小于6位');
                            callback(new Error('密码长度不能小于6位'));
                        } else {
                            callback();
                        }
                    },
                },
            ],
            captchaCode: [
                { required: true, message: `${prefix}${t("login.captchaCode")}`, trigger: 'blur' },
            ],
        };
    }

    get defaultSettings() {
        return defaultSettings;
    }
    checkCapsLock(event: KeyboardEvent) {
        this.isCapsLock = event.getModifierState('CapsLock');
    }

    getCaptcha() {
        getCaptchaApi().then(({data }: any) => {    // CaptchaResult
            this.loginData.captchaKey = data.captchaKey
            this.captchaBase64 = data.captchaBase64;
        });
    }

    handleLogin() {
        console.log(this.loginFormRef);
        this.loginFormRef.validate((valid: boolean) => {
            console.log('valid', valid);
            if (valid) {
                this.loading = true;    // 旋转加载图标
                userStore.login(this.loginData).then(() => {
                    const query = this.$route.query;
                    const redirect = (query.redirect as string) ?? '/'; // 从哪里来，回哪里去
                    console.log('登录成功', query);
                    const otherQueryParams = Object.keys(query).reduce((pre, key) => {
                        if (key !== 'redirect') {   // 排除 redirect 参数
                            pre[key] = query[key];
                        }
                        return pre;
                    }, {} as Record<string, any>);
                    this.$router.push({ path: redirect, query: otherQueryParams });
                }).catch(() => {
                    this.getCaptcha();
                }).finally(() => {
                    this.loading = false;
                });
            }
        });
    }

    mounted() {
        this.getCaptcha();
    }

    toggleTheme() {
        const newTheme = settingsStore.theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
        settingsStore.changeTheme(newTheme);
    }

    
}
export default toNative(Login);
</script>

<style lang="scss" scoped>
// 暗黑模式
html.dark .login-container {
    background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.login-container {
    overflow-y: auto;
    background: url("@/assets/images/login-bg.jpg") no-repeat center right;

    @apply wh-full flex-center;

    .login-form {
        padding: 30px 10px;
            
    }
}

.el-form-item {
    background: var(--el-input-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 5px;

    :deep(.el-input) {
        .el-input__wrapper{
            padding: 0;
            background-color: transparent;
            box-shadow: none;

            &.is-focus, &:hover {
                box-shadow: none !important;
            }

            input:-webkit-autofill {
                // 通过延时渲染背景色变相除去背景颜色
                transition: background-color 1000s ease-in-out 0s;
            }
        }
    }
}
</style>
