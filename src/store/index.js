import Vue from 'vue';
import Vuex from 'vuex';
import VueJsonp from 'vue-jsonp'

Vue.use(Vuex);
Vue.use(VueJsonp);

export default new Vuex.Store({

    state: {
        categoryKey: 'recommend',
        categories: [
            {
                name: '玛酷动态',
                key: 'recommend'
            },
            {
                name: '玛酷视频',
                key: 'game'
            },
            {
                name: '赛事游学',
                key: 'sports'
            },
            {
                name: '玛酷优势',
                key: 'shanghai'
            },
            {
                name: '优惠政策',
                key: 'auto'
            }
        ],
        slideData: [],
        topList: [],
        moreList: []
    },
    getters: {
        categoryKey(state) {
            return state.categoryKey;
        },
        categories(state) {
            return state.categories;
        },
        slideData(state) {
            return state.slideData;
        },
        topList(state) {
            return state.topList;
        },
        moreList(state) {
            return state.moreList;
        }
    },
    mutations: {
        updateSlideData(state, data) {
            state.slideData = data;
        },
        updateTopList(state, data) {
            state.topList = data;
        },
        updateMoreList(state, data) {
            state.moreList = state.moreList.concat(data);
        }
    },
    actions: {
        getTopList(store) {
            Vue.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html').then( data => {
                // console.log(data);
                if (data.code == 200) {
                    let slideData = data.focus.filter( item => {
                        return item.addata == null;
                    } ).map( item => {
                        return {
                            title: item.title,
                            img: item.picInfo[0].url,
                            url: item.link
                        }
                    } );

                    let topList = data.list.filter( item => {
                        return item.addata == null;
                    } ).map( item => {
                        return {
                            title: item.title,
                            src: item.picInfo[0].url,
                            desc: item.category
                        }
                    } );

                    store.commit('updateSlideData', slideData);
                    store.commit('updateTopList', topList);
                }
            } );
        },

        refreshTopList(store, {refreshKey}) {
            return Vue.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html', {
                miss: '00',
                refresh: refreshKey
            })
            .then( data => {
                let topList = data.list.filter( item => {
                    return item.addata == null;
                } ).map( item => {
                    return {
                        title: item.title,
                        src: item.picInfo[0].url,
                        desc: item.category
                    }
                } );

                store.commit('updateTopList', topList);

                return Promise.resolve(topList.length);
            } )
        },

        loadMoreList(store, {refreshKey, page, prepage}) {
            let start = page*prepage;
            let end = start + prepage;
            return Vue.jsonp(`http://3g.163.com/touch/jsonp/sy/recommend/${start}-${end}.html`, {
                miss: '00',
                refresh: refreshKey
            })
            .then( data => {
                // console.log(data);
                let moreList = data.list.filter( item => {
                    return item.addata == null && item.picInfo.length;
                } ).map( item => {
                    return {
                        title: item.title,
                        src: item.picInfo[0].url,
                        desc: item.category
                    }
                } );

                console.log(moreList);

                store.commit('updateMoreList', moreList);

                return Promise.resolve();
            } )
        }
    }

});
