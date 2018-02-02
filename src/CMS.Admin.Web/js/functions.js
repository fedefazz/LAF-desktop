function checkInputs() {
    $('.form-control').each(function () {
        if ($(this).prop('disabled') == true) {
            $(this).prop('disabled', false);
            $(this).trigger('focus');
            $(this).prop('disabled', true);
        } else {
            $(this).trigger('focus');
        }
    });
    $('.focus').trigger('focus');
}

function loadImages() {
    $('.lazy:not(.loaded)').each(function( index, value ) {
        var imageUrl = $(this).attr('data-url');
        $(this)
            .css("background-image", "url("+imageUrl+")")
            .addClass('loaded');
    });
}

function ReloadImages() {
    $('a.image').each(function (index, value) {
        var imageUrl = $(this).attr('href');
        if (imageUrl != $(this).children('img').attr('src')) {
            $(this).children('img').attr('src', imageUrl);
        }
    });
}

$(function () {
    $('.navbar-toggle').click(function () {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
        $('#search').removeClass('in').addClass('collapse').slideUp(200);
    });

    $('#search-trigger').click(function () {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');
    });

    $('.tool').tooltip();

/*
    $('.form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    });
*/
    $("body").on('DOMSubtreeModified', "#TemplateEditor", function () {
        loadImages();
    });

    //checkInputs();

});
