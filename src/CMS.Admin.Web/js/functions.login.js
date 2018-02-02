$(document).ready(function () {

    $('body.logout .form-control').on('keyup', function(){
        $(this).attr('value', $(this).val() );
    });

/* Login */
    $('#Logon').formValidation({
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'The username is required'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    }
                }
            }
        }
    });


/* Forgot Password */
    $('#ForgotPassword').formValidation({
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'The email is required'
                    },
                    emailAddress: {
                       message: 'The email is not a valid email address'
                    }
                }
            }
        }
    });

/* Confirm User Request */
    $('#ConfirmUserRequestForm').formValidation({
        message: 'This value is not valid',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            firstname: {
                validators: {
                    notEmpty: {
                        message: 'The first name is required'
                    }
                }
            },
            lastname: {
                validators: {
                    notEmpty: {
                        message: 'The last name is required'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    stringLength: {
                        min: 8,
                        message: 'Password must be 8-12 characters long'
                    },
                    identical: {
                        field: 'confirmPassword',
                        message: 'The password and its confirm are not the same'
                    },
                    regexp: {
                        regexp: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@@#$%^&*()_+]{8,12}$/,
                        message: 'Password must include at least 1 capital letter, 1 lower case letter, 1 number and 1 special character'
                    }
                }
            },
            confirmpassword: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }
    });



/* Reset Password */
    $('#ResetPassword').formValidation({
        message: 'This value is not valid',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    stringLength: {
                        min: 8,
                        max:12,
                        message: "The password doesn't meet validation criteria"
                    },
                    identical: {
                        field: 'confirmPassword',
                        message: 'The password and its confirm are not the same'
                    },
                    regexp: {
                        regexp: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@@#$%^&*()_+]{8,12}$/,
                        message: "The password doesn't meet validation criteria"
                    }
                }
            },
            confirmpassword: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }
    });
});
