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
            description: 'Enter room description'
        }
    }
};

const newroom = Vue.component('new-room', {
    template: `
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
            <div>

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
        </form>`,
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
                        router.push({path: `/`});
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }}
});

const editroom = Vue.component('edit-room', {
    props: ["id"],
    template: `
        <form>
            <input type="textbox"  v-model="room.name" :placeholder="labels.name"/>
            <input type="textarea" v-model="room.description" :placeholder="labels.description" multiple="5"/>
            <input type="number" v-model="room.edges" min="3" max="10" />
            <input type="number" v-model="room.length" min="0" max="10"/>
            <input type="number" v-model="room.height" min="0" max="10"/>
            <input type="number" v-model="room.width" min="0" max="10"/>
            <button v-on:click="saveData">{{labels.save}}</button>
        </form>`,
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
                        router.push({path: `/`});
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
    template:`
        <table class="table">
            <tbody>
                <tr v-for="room in rooms" v-bind:key="room.id" v-on:mouseover="toggle(room)" v-on:mouseout="toggle(room)" v-bind:id="room.id">
                    <td>
                        {{room.name}}
                    </td>
                    <td>
                        {{room.description}}                        
                    </td>
                    <td>
                        <button v-on:click="editRoom(room)">{{labels.edit}}</button>
                    </td>
                </tr>
            </tbody>
        </table>`,
        data: function() {
            return {
                labels: locales.labels["en-US"],
                rooms: {}
            };
        },
        created: function() {
            var vm = this.$data;

            this.$http.get("/api/room")
                .then(function(response) {
                    console.log(response);
                    vm.rooms = response.data;
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
                router.push({path: `/room/edit/${room.id}`});
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