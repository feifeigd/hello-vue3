import routes from './routes';
import {Vue} from 'vue-class-component';
import {h} from 'vue';

export default class extends Vue{
    currentRoute = window.location.pathname;

    created(){
        window.addEventListener('popstate', ()=>{
            this.currentRoute = window.location.pathname;
        });
    }

    render(){
        return h(this.ViewComponent());
    }
    
    ViewComponent(){
        const matchingPage = routes[this.currentRoute] || '404';
        console.log(matchingPage);
        return require(`./page/${matchingPage}.vue`).default;
    }

}
