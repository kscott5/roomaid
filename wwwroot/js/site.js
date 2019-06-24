// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

document.onreadystatechange = function() {

    if(document.readyState === 'complete') {
        var app = new Vue({
            el: '#app',
            data: {
                message: 'Vue app initialized'
            }
        });
    }
};