'use strict';

$(function(){
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip()

        $('a[href=""]').click((e) => {
            e.preventDefault();
        });
    });
});