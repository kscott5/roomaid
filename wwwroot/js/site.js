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
                    <select v-model="pagination.limit" size="1" v-on:change="getRooms(pagination.page, pagination.limit);">
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
</form>`;

const editnewroom = Vue.component('edit-new-room', {
    props: ["id"],
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
        saveData: function() {
            if(!document.querySelector("#editRoom").checkValidity())
                return;

            var url = `/api/room/update`;
            if(this.$route.name == 'newroom')
                url = `/api/room`;
            
            var routeHome = this.routeHome;
            this.$http.post(url, this.$data.room)
                .then(function(response){                    
                    routeHome();
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        routeHome: function() {
            this.$router.push({path: `/`});
        }
    },
    watch: {
        // Usable component
        '$route'(to, from){
            if(to.name == 'newroom') {
                this.clearData();
            }
        }
    },
    created: function() {
        var data = this.$data;
        var props = this.$props;

        if(this.$route.name == `editroom`) {   
            this.$http.get(`/api/room/${props.id}`)
                .then(function(response) {                    
                    data.room = response.data;
                });
        }
    }
});

const listrooms = Vue.component('list-rooms', {
    template: list_room_template,
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
            this.getRooms(1,5);
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
            getRooms: function(page, limit) {
                var data = this.$data;

                this.$http.get(`/api/room?page=${page}&limit=${limit}`)
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
});

const routes = [
    {
        path: "/", 
        name: "home",
        component: listrooms
    },
    {
        path: "/room/new",
        name: 'newroom',
        component: editnewroom,
    },
    {
        path: "/room/edit/:id",
        name: "editroom",
        component: editnewroom,
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