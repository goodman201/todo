$(function () {
    $(document).on('click', '.delete', function () {
        var taskElement = $(this).parent().parent();
        var id = taskElement.attr('id');

        $.delete(`/task/${id}`).done(function () {
            taskElement.remove();
        });
    });
    $(document).on('click', '.addTaskModal', function () {
        $('#my_modal').show();
    });
    $(document).on('click', '.close_modal_window', function () {
        $('#my_modal').hide();
    });
    $('input[type="checkbox"]').on('change', function() {
        $('input[type="checkbox"]').not(this).prop('checked', false);
    });



        // $('#my_modal').hide();
    $('form#todoAdd').submit(function (data) {
        data.preventDefault();
        var title = $('#title').val();
        var description = $('#description').val();
        var importance = $("input[name='priority']:checked").val();
        var form = this;

        $.post('/task',
            {
                title: title,
                description: description,
                importance: importance
            })
            .done(function (data) {
                var importanceStr = importance;
                if(!importanceStr){
                    importanceStr = '';
                }
                console.log(data);
                $('#TODO').append('<li><article class="title portlet-header"><p>' + title +
                    '</p><i class="collapse rotate"></i></article><div class="description portlet-content"><span class="text-description">' + description +
                    ' </span><i class="delete"></i> </div><span class="priority">'+ importanceStr +'</span> </li>');
                if ($('.list-is-empty').hasClass('hidden') === true) {
                    $('.list-is-empty').addClass('hidden');
                }
                $('.collapse').click(function () {
                    $(this).parent().parent().find('.description').toggleClass('hidden');
                    $(this).toggleClass('rotate');
                });
                form.reset();
            })
            .fail(function (data) {
                if (data.status === 400) {
                    console.error(1111, data.responseJSON.errors);
                    const errors = data.responseJSON.errors.filter(function (element, index) {
                        return data.responseJSON.errors.findIndex(i => i.param === element.param) === index;
                    });
                    console.error(2222, errors);
                    for (var i = 0; i < errors.length; i++) {
                        $(`#${errors[i].param}`).parent().find('.error').text(errors[i].msg);

                    }
                }
            });
        });
        $('.collapse').click(function () {
            $(this).parent().parent().find('.description').toggleClass('hidden');
            $(this).toggleClass('rotate');
        });

        $('#TODO, #IN_PROGRESS, #DONE').sortable({
            connectWith: '.column',
            stop: function (event, ui) {
            console.log(ui);
            var id = $(ui.item).attr('id');
            var status = $(ui.item).parent().attr('id');
            var position = $(ui.item).parent().index(ui.item);

            console.log(position);

            $.post(`/task/${id}/${status}`);

        }
    }).disableSelection();
});

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('hidden')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

window.onclick = function (event) {
    if (event.target == $('#my_modal')[0]) {
        $('#my_modal').hide();
    }
};