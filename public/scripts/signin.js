$('form#signIn').submit(function (e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();


    $.post('/auth/login',
        {
            email: email,
            password: password,
        })
        .done(function (data) {
            console.log(data);
            window.location.href = "/";

        })
        .fail(function (data) {
            if (data.status === 400) {
                if (data.responseJSON.errors){
                    console.error(1111, data.responseJSON.errors);
                    const errors = data.responseJSON.errors.filter(function (element, index) {
                        return data.responseJSON.errors.findIndex(i => i.param === element.param) === index;
                    });

                    console.error(2222, errors);
                    for (var i = 0; i < errors.length; i++) {
                        $(`#${errors[i].param}`).parent().find('.error').text(errors[i].msg);
                    }
                }
                if (data.responseJSON.error){
                    $('#errorAuth').text(data.responseJSON.error);
                }
            }
        });
});