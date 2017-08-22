<template>
    <div class="main">
        <swiper
            :list="slideData"
            v-model="slideIndex"
            :loop="true"
            @touchstart.native.stop=""
            @touchmove.native.stop=""
            @touchend.native.stop=""
            @mousedown.native.stop=""
            @mousemove.native.stop=""
            @mouseup.native.stop=""
        >
        </swiper>

        <marquee class="my-marquee">
            <marquee-item class="my-marquee-item" v-for="data, i in slideData" :key="i">{{data.title}}</marquee-item>
        </marquee>

        <panel
            :list="topList"
        ></panel>

        <panel
            v-if="moreList.length"
            :list="moreList"
            type="1"
        ></panel>
    </div>
</template>

<script>
import { Swiper, Panel, Marquee, MarqueeItem } from 'vux';

export default {
    name: 'Main',
    components: {
        Swiper,
        Panel,
        Marquee,
        MarqueeItem
    },
    data() {
        return {
            slideIndex: 0
        }
    },
    computed: {
        slideData() {
            return this.$store.getters.slideData;
        },
        topList() {
            return this.$store.getters.topList;
        },
        moreList() {
            return this.$store.getters.moreList;
        }
    },
    methods: {
    }
}
</script>

<style lang="less">
#app {
    .my-marquee {
        margin: 10px;
    }
    .my-marquee-item {
        color: #aaa;
        text-align: left;
    }

    .weui-media-box__hd,  .weui-media-box__hd img {
        width: 102px;
        height: 78px;
    }

    .weui-media-box__bd {
       height: 78px;
    }

    .weui-media-box__title {
       white-space: normal;
    }

    .loading-layer {
       padding-bottom: 80px;
    }
}
</style>
