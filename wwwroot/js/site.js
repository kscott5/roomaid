// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

Vue.prototype.$http = axios;

/*
Pull localization data from server
*/
const locales = {
    labels: {
        "en-US": {
            save: 'Save',
            edit: 'Edit',
            name: 'Enter room name',
            description: 'Enter room description',
            page: 'Pages',
            search: {
                count: 'Display'
            },
            headers: {
                name: 'Name',
                description: 'Description',
            }
        }
    }
};

const site_navigation_template = `
<div>
    <router-link to="/">
        <i class="fas fa-home"></i>&nbsp;<label class="is-hidden-mobile">Home</label>        
    </router-link>
    <router-link to="/room/new">
        <i class="fas fa-cloud-upload-alt"></i>&nbsp;<label class="is-hidden-mobile">New Room</label>
    </router-link>
    </div>

    <div>
    <input type="text" class="input is-rounded" v-model:text="searchOptions.phrase">
    </input>
    <a class="icon" v-on:click="search()">
        <i class="fas fa-search"></i>
    </a>
</div>`;

const list_room_navigation_template = `
<tr>
    <th>
       {{labels.headers.name}}
    </th>
    <th>
       {{labels.headers.description}}
    </th>
    <th>
        <div class="tags is-medium">
            <div class="tag is-white is-hidden-mobile">
                <label>{{labels.search.count}}</label>
            </div>
            <div class="tag is-white">
                <div class="select is-rounded">
                    <select v-model="pagination.limit" size="1" v-on:change="getRooms();">
                        <option value="5" default>5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
            </div>
        </div>
    </th>
</tr>`;

const list_room_template = `
<div>
    ${site_navigation_template}
    <table class="table">
        <thead>
            ${list_room_navigation_template}
        </thead>
        <tfoot>
            ${list_room_navigation_template}
        </tfoot>
        <tbody>
            <tr v-for="room in pagination.documents" v-bind:key="room.id" v-bind:id="room.id"
                v-on:click="editRoom(room)" v-on:mouseover="toggle(room)" v-on:mouseout="toggle(room)">
                <td>
                    {{room.name}}
                </td>
                <td>
                    {{room.description}}                        
                </td>
                <td>                    
                    <div>                        
                        <a class="icon is-hidden-desktop" v-on:click="editRoom(room)">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="button is-rounded is-hidden-mobile">{{labels.edit}}</button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>`;


const edit_room_template = `
<div>
    ${site_navigation_template}
    <form id="editRoom">
        <div class="field">
            <div class="control">
                <input type="textbox" required v-model="room.name" :placeholder="labels.name"/>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <input type="textarea" v-model="room.description" :placeholder="labels.description" multiple="5"/>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <input type="number" v-model="room.edges" min="3" max="10" />
            </div>
        </div>

        <div class="field">
            <div class="control">
                <input type="number" v-model="room.length" min="0" max="10"/>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <input type="number" v-model="room.height" min="0" max="10"/>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <input type="number" v-model="room.width" min="0" max="10"/>
            </div>
        </div>

        <div class="field">
            <button class="button icon no-border is-hidden-desktop" v-on:click="saveData">
                <i class="fas fa-cloud-upload-alt"></i>            
            </button>
            <button v-on:click="saveData" class="button is-rounded is-hidden-mobile">{{labels.save}}</button>
        </div>
    </form>
</div>`;

const navigationMixins = {
    data: function() {
        return {
            searchOptions: {
                phrase: '',
                sort: ''
            }
        };
    },
    methods: {
        search: function() {                        
            var query = this.$data.searchOptions;

            ('getRooms' in this)? this.getRooms() :
            this.$router.push({path: '/search', query: { phrase: `${query.phrase}`, sort: `${query.sort}`}});
        }
    }
};

const editRoomMixin = {
    template: edit_room_template,
    data: function() {
        return {
            labels: locales.labels["en-US"],
            room: {name:'',description:'',edges:'',length:'',width:'',height:''}
        };
    },
    methods: {
        clearData: function() {
            this.$data.room = {name:'',description:'',edges:'',length:'',width:'',height:''};
        },
        routeHome: function() {
            this.$router.push({name: `home`});
        },
        saveRoomData: function(url) {
            if(!document.querySelector("#editRoom").checkValidity())
                return;

            var routeHome = this.routeHome;
            this.$http.post(url, this.$data.room)
                .then(function(response){                    
                    routeHome();
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
};

const editroom = Vue.component('editRooms', {
    mixins: [navigationMixins, editRoomMixin],
    props: ["id"],
    methods: {
        saveData: function() {
            this.saveRoomData(`/api/room/update`);
        }
    },
    created: function() {
        var data = this.$data;
        var props = this.$props;

        this.$http.get(`/api/room/${props.id}`)
            .then(function(response) {                    
                data.room = response.data;
            });
    }
});

const newroom = Vue.component('newRooms', {
    mixins: [navigationMixins, editRoomMixin],
    methods: {
        saveData: function() {
            this.saveRoomData(`/api/room`);
        }
    }
});

const listRoomMixin = {
    data: function() {
        return {
            labels: locales.labels["en-US"],
            pagination: {
                documents: {},
                limit: 5,
                pages: 1,
                page: 1
            }
        };
    },
    created: function() {
        var query = this.$data.searchOptions = this.$route.query;
        var phrase = ("phrase" in query)? query.phrase: '';
        var sort = ("sort" in query)? query.sort: '';

        this.getRooms({page: 1, limit: 5, phrase: `${phrase}`, sort: `${sort}` });
    },
    methods: {
        toggle: function(room) {
            var data = this.$data;
            var el = document.querySelector(`tr[id='${room.id}']`);
            
            if(el.classList.contains('is-selected')) {
                el.classList.remove('is-selected');
            } else {
                el.classList.add('is-selected');
            }
        },
        getRooms: function(options) {                
            var data = this.$data;

            var params = {
                page: (options && options.page)? options.page: data.pagination.page,
                limit: (options && options.limit)? options.limit: data.pagination.limit,
                phrase: (options && options.phrase)? options.phrase: data.searchOptions.phrase, //Mixin
                sort: (options && options.sort)? options.sort: data.searchOptions.sort, // Mixin
            };
            
            this.$http.get('/api/room', {params: params})
                .then(function(response) {
                    data.pagination = response.data;
                });

        },
        editRoom: function(room) {
            this.$router.push({path: `/room/edit/${room.id}`});
        },
        showPagination: function(pageIndex) {
            var data = this.$data;
            console.log(pageIndex);

            if(pageIndex >= data.pagination.pageIndex 
                && pageIndex <= data.pagination.pageCount) {
                        
            }
        }
    }
};

const listrooms = Vue.component('listRooms', {
    mixins: [navigationMixins, listRoomMixin],
    template: list_room_template
});

const searchrooms = Vue.component('searchRooms', {
    mixins: [navigationMixins, listRoomMixin],
    template: list_room_template
});

const routes = [
    {
        path: "/", 
        name: "home",
        component: listrooms
    },
    {
        path: "/search", 
        name: "search",
        component: searchrooms
    },
    {
        path: "/room/new",
        name: 'newroom',
        component: newroom,
    },
    {
        path: "/room/edit/:id",
        name: "editroom",
        component: editroom,
        props: true
    }
];

const router = new VueRouter({
    routes
});

// Write your Javascript code.
document.onreadystatechange = function() {    
    if(document.readyState === 'complete') {
        var app = new Vue({
            router
        }).$mount("#app");
    }
};