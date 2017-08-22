<template>
    <div id="app">
        <view-box ref="viewBox">
            <x-header slot="header" class="header">
                <div slot="overwrite-left">直播</div>
                <div>makcoo</div>
                <div slot="right">搜索</div>
            </x-header>

            <sc
                :lock-y="true"
                @touchstart.native.stop=""
                @touchmove.native.stop=""
                @touchend.native.stop=""
                @mousedown.native.stop=""
                @mousemove.native.stop=""
                @mouseup.native.stop=""
                class="sc"
            >
                <div class="wy-tab">
                    <tab>
                        <tab-item
                            v-for="category in categories"
                            :selected="category.key == categoryKey"
                            :key="category.key"
                        >
                            {{category.name}}
                        </tab-item>
                    </tab>
                </div>
            </sc>

            <!-- :on-refresh="refresh"
            :on-infinite="infinite" -->
            <scroller
                class="my-scroller"
                ref="myScroller"
                :on-refresh="refresh"
                :on-infinite="infinite"
            >

                <router-view></router-view>

            </scroller>

            <tabbar slot="bottom">
                <tabbar-item>
                    <img slot="icon" src="./assets/icon_nav_button.png">
                    <span slot="label">Wechat</span>
                </tabbar-item>
                <tabbar-item>
                    <img slot="icon" src="./assets/icon_nav_msg.png">
                    <span slot="label">Message</span>
                </tabbar-item>
                <tabbar-item>
                    <img slot="icon" src="./assets/icon_nav_article.png">
                    <span slot="label">Explore</span>
                </tabbar-item>
                <tabbar-item>
                    <img slot="icon" src="./assets/icon_nav_cell.png">
                    <span slot="label">News</span>
                </tabbar-item>
            </tabbar>

        </view-box>
    </div>
</template>

<script>
import { ViewBox, XHeader, Tab, TabItem, Scroller as Sc, Tabbar, TabbarItem } from 'vux';

const refreshKey = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B010'];
let refreshKeyIndex = 0;
let page =0;
let prepage = 10;
let firstLoaded = false;
let moreLoaded = true;
function getRefreshKey() {
    refreshKeyIndex++;
    if (refreshKeyIndex >= refreshKey.length) {
        refreshKeyIndex = 0;
    }
    return refreshKey[refreshKeyIndex];
}
//let initLoaded = false;

export default {
    name: 'app',
    components: {
        ViewBox,
        XHeader,
        Tab,
        TabItem,
        Sc,
        Tabbar,
        TabbarItem
    },
    mounted() {
        this.$store.dispatch('getTopList').then(() => {
            setTimeout(() => {
                firstLoaded = true;
            }, 300);
        });
    },
    computed: {
        categoryKey() {
            return this.$store.getters.categoryKey;
        },
        categories() {
            return this.$store.getters.categories;
        }
    },
    methods: {
        refresh() {
            setTimeout(() => {
                this.$store.dispatch('refreshTopList', {
                    refreshKey: getRefreshKey()
                })
                .then(n => {
                    this.$refs.myScroller.finishPullToRefresh();
                    // this.$vux.toast.show({
                    //     text: '成功为您推荐10条新内容'
                    // });
                    this.$vux.toast.text(`成功为您推荐${n}条新内容`, 'top');
                })
            }, 1000);
        },
        infinite() {
            if (!firstLoaded) {
                this.$refs.myScroller.finishInfinite();
                return;
            }
            if (!moreLoaded) {
                return;
            }
            // console.log(moreLoaded);
            // console.log('infinite');
            moreLoaded = false;
            page++;
            setTimeout(() => {
                this.$store.dispatch('loadMoreList', {
                    refreshKey: refreshKey[refreshKeyIndex],
                    page,
                    prepage
                })
                .then(() => {
                    this.$refs.myScroller.finishInfinite();
                    // this.$vux.toast.text('加载成功', 'top');
                    moreLoaded = true;
                })
            }, 1000);
        }
    }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

html, body {
   height: 100%;
   width: 100%;
   overflow: hidden;
 }

 #app {
     height: 100%;

     .header {
         width: 100%;
         position: absolute;
         z-index: 9;
         left: 0;
         top: 0;
     }

     .sc {
         margin-top: 46px;
     }

     .wy-tab {
       height: 44px;
       position: relative;
       width: 1110px;
     }

     .my-scroller {
         top: 90px;
     }
 }

</style>
