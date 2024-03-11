<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot />
    </component>
</template>

<script lang="ts">
import { isExternal } from '@/utils';
import { Prop } from 'vue-facing-decorator';

/**
 * 超级连接组件 
 */
@Component({
    name: 'AppLink',
    inheritAttrs: false,
})
class AppLink extends Vue {
    @Prop({ type: String, required: true })
    to!: string;

    get IsExternalLink() {
        return isExternal(this.to);
    }

    get type(){
        return this.IsExternalLink ? 'a' : 'router-link';
    }

    linkProps(to: string) {
        if(this.IsExternalLink) {
            return {
                href: to,
                target: '_blank',
                rel: 'noopener noreferrer',
            };
        }
        return {
            to,
        };
    }
}
export default toNative(AppLink);

</script>