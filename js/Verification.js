$(document).ready(function () {
    $("#LastName").keyup(function () {
        var nombreMots = jQuery.trim($(this).val()).split(" ").length;
        if ($(this).val() === "") {
            nombreMots = 0;
        }
        if (nombreMots > 1) {
            $("small#output_LastName").show();
            $("#LastName").removeClass("is-valid");
            $("#LastName").addClass("is-invalid");
            $("#output_LastName")
                .css("color", "red")
                .html("Can't have more than one words for a LastName");
        } else {
            $("small#output_LastName").hide();
            $("#LastName").removeClass("is-invalid");
            $("#LastName").addClass("is-valid");
        }
        verifier_classes();
    });
    $("#FirstName").keyup(function () {
        var nombreMots = jQuery.trim($(this).val()).split(" ").length;
        if ($(this).val() === "") {
            nombreMots = 0;
        }
        if (nombreMots > 2) {
            $("small#output_FirstName").show();
            $("#FirstName").removeClass("is-valid");
            $("#FirstName").addClass("is-invalid");
            $("#output_FirstName")
                .css("color", "red")
                .html("Can't have more than two words for a FirstName");
        } else {
            $("small#output_FirstName").hide();
            $("#FirstName").removeClass("is-invalid");
            $("#FirstName").addClass("is-valid");
        }
        verifier_classes();
    });

    $("#Username").keyup(function () {
        if (
            $(this)
                .val()
                .match(/^[a-zA-Z0-9]/)
        ) {
            verifier_Username();
        } else {
            $("#Username").removeClass("is-valid");
            $("#Username").addClass("is-invalid");
            $("small#output_Username").show();
            $("#output_Username")
                .css("color", "red")
                .html("You only allowed to use numbers and letters");
        }
    });
    function verifier_Username() {
        $.ajax({
            type: "post",
            url: "../php/checkUser.php",
            data: {
                Username_check: $("#Username").val(),
            },
            success: function (data) {
                if (data == "success") {
                    $("#Username").removeClass("is-invalid");
                    $("#Username").addClass("is-valid");
                    $("small#output_Username").hide();
                    return true;
                } else {
                    $("#Username").removeClass("is-valid");
                    $("#Username").addClass("is-invalid");
                    $("small#output_Username").show();
                    $("#output_Username").css("color", "red").html(data);
                }
            },
        });
        verifier_classes();
    }
    $("#email").keyup(function () {
        verifier_email();
        verifier_classes();
    });
    function verifier_email() {
        $.ajax({
            type: "post",
            url: "../php/checkUser.php",
            data: {
                email_check: $("#email").val(),
            },
            success: function (data) {
                if (data == "success") {
                    $("#email").removeClass("is-invalid");
                    $("#email").addClass("is-valid");
                    $("small#output_email").hide();
                } else {
                    $("#email").removeClass("is-valid");
                    $("#email").addClass("is-invalid");
                    $("small#output_email").show();
                    $("#output_email").css("color", "red").html(data);
                }
            },
        });
    }
    $("#Password").keyup(function () {
        if (
            true
            /**$(this)
                .val()
                .match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/)*/
        ) {
            if ($(this).val().length < 8) {
                if ($(this).val().length != 0) {
                    $("#output_pass1")
                        .css("color", "red")
                        .html("Too short (8 characters minimum)");
                    $("small#output_pass1").show();
                    $("#Password").removeClass("is-valid");
                    $("#Password").addClass("is-invalid");
                } else {
                    $("small#output_pass1").hide();
                    $("#Password").removeClass("is-valid");
                    $("#Password").addClass("is-invalid");
                }
            } else if (
                $("#ConfirmPassword").val() != "" &&
                $("#ConfirmPassword").val() != $("#Password").val()
            ) {
                $("small#output_pass1").show();
                $("#output_pass1")
                    .css("color", "red")
                    .html("The two passwords are different");
                $("#output_pass2")
                    .css("color", "red")
                    .html("The two passwords are different");
            } else {
                $("#Password").removeClass("is-invalid");
                $("#Password").addClass("is-valid");
                $("small#output_pass1").hide();
            }
        } else {
            if ($(this).val().length != 0) {
                $("#output_pass1")
                    .css("color", "red")
                    .html("Password too weak");
                $("small#output_pass1").show();
                $("#Password").removeClass("is-valid");
                $("#Password").addClass("is-invalid");
            } else {
                $("small#output_pass1").hide();
                $("#Password").removeClass("is-valid");
                $("#Password").addClass("is-invalid");
            }
        }
        verifier_classes();
    });
    $("#ConfirmPassword").keyup(function () {
        if (
            $("#ConfirmPassword").val() != "" &&
            $("#ConfirmPassword").val() != $("#Password").val()
        ) {
            $("small#output_pass2").show();
            $("#output_pass2")
                .css("color", "red")
                .html("The two passwords are different");
            $("#ConfirmPassword").removeClass("is-valid");
            $("#ConfirmPassword").addClass("is-invalid");
            $("small#output_pass1").hide();
        } else {
            $("#ConfirmPassword").removeClass("is-invalid");
            $("#ConfirmPassword").addClass("is-valid");
            $("small#output_pass1").hide();
            verifier_password();
        }
        verifier_classes();
    });
    function verifier_password() {
        $.ajax({
            type: "post",
            url: "../php/checkUser.php",
            data: {
                pass1_check: $("#Password").val(),
                pass2_check: $("#ConfirmPassword").val(),
            },
            success: function (data) {
                if (data == "success") {
                    $("#ConfirmPassword").removeClass("is-invalid");
                    $("#ConfirmPassword").addClass("is-valid");
                    $("small#output_pass2").hide();
                } else {
                    $("#ConfirmPassword").removeClass("is-valid");
                    $("#ConfirmPassword").addClass("is-invalid");
                    $("small#output_pass2").show();
                    $("#output_pass2").css("color", "red").html(data);
                }
            },
        });
    }
    function verifier_classes() {
        if (
            $("#LastName").hasClass("is-valid") == true &&
            $("#Username").hasClass("is-valid") == true &&
            $("#email").hasClass("is-valid") == true &&
            $("#Password").hasClass("is-valid") == true &&
            $("#ConfirmPassword").hasClass("is-valid") == true
        ) {
            $("#etatgeneral").removeClass("is-invalid");
            $("#etatgeneral").addClass("is-valid");
            $("#etatgeneral")
                .css("color", "green")
                .html("You can send your form");
            $("#btnEnvoyer").attr("disabled", false);
        } else {
            $("#etatgeneral").removeClass("is-valid");
            $("#etatgeneral").addClass("is-invalid");
            $("#etatgeneral")
                .css("color", "red")
                .html("Please fill in every spaces");
            $("#btnEnvoyer").attr("disabled", true);
        }
    }
    $("#form_inscription").submit(function () {
        var LastName = $("#LastName").val();
        var FirstName = $("#FirstName").val();
        var Username = $("#Username").val();
        var email = $("#email").val();
        var pass1 = $("#Password").val();
        var pass2 = $("#ConfirmPassword").val();
        $.ajax({
            type: "post",
            url: "../php/checkUser.php",
            asynch: false,
            data: {
                LastName: LastName,
                FirstName: FirstName,
                Username: Username,
                email: email,
                pass1: pass1,
                pass2: pass2,
            },
            success: function (data) {
                if (data != "register_success") {
                    $("#etatgeneral").css("color", "red").html(data);
                } else {
                    $("#etatgeneral")
                        .css("color", "green")
                        .html("Data registered successfully");
                }
            },
        });
    });
});
