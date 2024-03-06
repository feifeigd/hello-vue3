
// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ 
    // 动画方式
    easing: 'ease',
    // 初始化时的最小百分比
    minimum: 0.3,
    // 是否显示加载 ico
    showSpinner: false,
    // 递增进度条速度
    speed: 500,
    // 自动递增间隔
    trickleSpeed: 200,
});

export default NProgress;
