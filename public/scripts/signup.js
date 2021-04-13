$('form#signUp').submit(function (e) {
    e.preventDefault();
    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var passwordRepeat = $('#passwordRepeat').val();

    $.post('/auth/register',
        {
            name: name,
            email: email,
            password: password,
            passwordRepeat: passwordRepeat
        })
        .done(function (data) {
            console.log(data);
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