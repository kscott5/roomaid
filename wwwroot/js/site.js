// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

Vue.prototype.$http = axios;

const newroom = Vue.component('new-room', {
    template: `
        <div>
            <input type="textbox"  v-model="room.name" placeholder="Enter room name"/>
            <input type="textarea" v-model="room.description" placeholder="Enter room decription" multiple="5"/>
            <input type="number" v-model="room.edges" min="3" max="10" />
            <input type="number" v-model="room.length" min="0" max="10"/>
            <input type="number" v-model="room.height" min="0" max="10"/>
            <input type="number" v-model="room.width" min="0" max="10"/>
            <button on-click="saveData">{{labels.save}}</button>
        </div>`,
    data: function() {
        return {
            labels: {save: 'Save'},
            room: {}
        }
    },
    methods: {
        saveData: function(event) {
            console.log("Saving new room data" + this.data.room);
        }}
});

const listrooms = Vue.component('list-rooms', {
    template:`
        <table class="table">
            <tbody>
                <tr v-for="room in rooms" v-bind:key="room.id" v-on:mouseover="toggle(room)" class="room.selected">
                    <td>
                        {{room.name}}
                    </td>
                    <td>
                        {{room.description}}                        
                    </td>
                    <td>
                        <button v-on:click="editRoom(room.id)">{{labels.edit}}</button>
                    </td>
                </tr>
            </tbody>
        </table>`,
        data: function() {
            return {
                message: 'Hello Vue',
                labels: {edit: 'Edit'},
                rooms: {}
            }
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
                console.log('toggling');
                if(room.selected == '')
                    room.selected = 'is-selected';
                else
                    room.selected = '';
            },
            editRoom: function(id) {
                console.log(id);
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