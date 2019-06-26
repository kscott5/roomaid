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
            theaders: {
                name: 'Name',
                description: 'Description',
            }
        }
    }
};

const list_room_template = `
<div>
    <label>{{labels.search.count}}</label>
    <div class="select is-rounded">
        <select id="viewCount" size="1">
            <option value="5 default">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
        </select>
    </div>
    <table class="table">
        <thead>
            <th>{{labels.theaders.name}}</th>
            <th>{{labels.theaders.description}}</th>
            <th>&nbsp;</th>
        </thead>
        <tbody>
            <tr v-for="room in pagination.documents" v-bind:key="room.id" v-on:mouseover="toggle(room)" v-on:mouseout="toggle(room)" v-bind:id="room.id">
                <td>
                    {{room.name}}
                </td>
                <td>
                    {{room.description}}                        
                </td>
                <td>
                    <button class="button is-rounded" v-on:click="editRoom(room)">{{labels.edit}}</button>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-show="pagination.pageCount > 0">
        <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
            <p>{{labels.page}} {{pagination.pageIndex}} of {{pagination.pageCount}}.
            <a class="pagination-previous" v-on:click="showPagination(pagination.pageIndex-1)">Previous</a>
            <a class="pagination-next" v-on:click="showPagination(pagination.pageIndex+1)">Next page</a>
            <!--input class="input is-rounded" type="number" v-bind:min="1" v-bind:value="pagination.pageIndex" v-bind:max="pagination.pageCount"-->
        </nav>
    </div>
</div>`;


const edit_room_template = `
<form>
    <div class="field">
        <div class="control">
            <input type="textbox"  v-model="room.name" :placeholder="labels.name"/>
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
        <p class="control">
             <button v-on:click="saveData" class="button is-success">{{labels.save}}</button>
        </p>
    </div>
</form>`;

const newroom = Vue.component('new-room', {
    template: edit_room_template,
    data: function() {
        return {
            labels: locales.labels["en-US"],
            room: {name:'',description:'',edges:'',length:'',width:'',height:''}
        };
    },
    methods: {
        saveData: function() {
            var data = this.$data;
            this.$http.post(`api/room/`, data.room)
                .then(function(response) {
                    console.log(response);
                    if(response.status == 200) {
                        this.$router.push({path: `/`});
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }}
});

const editroom = Vue.component('edit-room', {
    props: ["id"],
    template: edit_room_template,
    data: function() {
        return {
            labels: locales.labels["en-US"],
            room: {}
        };
    },
    methods: {
        saveData: function(event) {
            var data = this.$data;
            this.$http.post(`api/room/update`, data.room)
                .then(function(response){
                    console.log(response)
                    if(response.status == 200) {
                        this.$router.push({path: `/`});
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    created: function() {
        var data = this.$data;
        var props = this.$props;

        this.$http.get(`/api/room/${props.id}`)
            .then(function(response) {
                console.log(response);
                data.room = response.data;
            }); 
    }
});

const listrooms = Vue.component('list-rooms', {
    template: list_room_template,
        data: function() {
            return {
                labels: locales.labels["en-US"],                
                pagination: {
                    documents: {},
                    pageCount: 0,
                    pageIndex: 0
                }
            };
        },
        created: function() {
            var data = this.$data;

            this.$http.get("/api/room")
                .then(function(response) {
                    console.log(response);
                    data.pagination = response.data;
                });
        },
        methods: {
            toggle: function(room) {
                var el = document.querySelector(`[id='${room.id}']`);

                if(el.classList.contains('is-selected'))
                    el.classList.remove('is-selected');
                else
                    el.classList.add('is-selected');
            },
            editRoom: function(room) {
                this.$router.push({path: `/room/edit/${room.id}`});
            }
        }
});

const routes = [
    {
        path: "/", 
        component: listrooms
    },
    {
        path: "/room/new",
        component: newroom
    },
    {
        path: "/room/edit/:id",
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