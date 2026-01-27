<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>VTP Realty | Log in</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="dist/css/adminlte.min.css">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
</head>
<style type="text/css">
    .error{
        color: red;
    }
    button{background-color: darkslategrey;color: white;border: 0;font-size: 18px;font-weight: 500;border-radius: 7px;padding: 10px 10px;cursor: pointer;white-space: nowrap;}
    #success{background: green;}
    #error{background: red;}
    #warning{background: coral;}
    #info{background: cornflowerblue;}
    #question{background: grey;}
</style>
<body class="hold-transition login-page">
    <div class="login-box">
        <div class="login-logo">
            <a href=""><b>VTP Realty </b></a>
        </div>
        <!-- /.login-logo -->
        <div class="card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Sign in to start your session</p>

                <form action="validation.php" method="post" id="loginForm" name="loginForm">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="User name" name="username" pattern="[A-Za-z]{3,32}">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-user"></span>
                            </div>
                        </div>
                    </div>
                    <span for="username" class="error"></span>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" placeholder="Password" name="password" pattern="/^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                        <span for="password" class="error"></span>
                    <div class="input-group mb-3">
                        <select class="form-control" name="type">
                            <option value="">User Type</option>
                            <option value="0">Admin</option>
                        </select>
                    </div>
                        <span for="type" class="error"></span>
                    <div class="row">
                        <div class="col-8">
                            <div class="icheck-primary">
                                <input type="checkbox" id="remember" name="remember">
                                <label for="remember">
                                    Remember Me
                                </label>
                            </div>
                        </div>
                        <!-- /.col -->
                        <div class="col-4">
                            <button type="submit" name="login" class="btn btn-primary btn-block"><i class="fa fa-spinner fa-spin loading" style="display: none;"></i>Sign In</button>
                        </div>
                        <!-- /.col -->
                    </div>
                </form>

                <p class="mb-1">
                    <a href="">I forgot my password</a>
                </p>
            </div>
            <!-- /.login-card-body -->
        </div>
    </div>
    <!-- jQuery -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- AdminLTE App -->
    <script src="dist/js/adminlte.min.js"></script>
     <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
     <script src="dist/jquery.form.js"></script> 
    <script>
        $(document).ready(function() {
            $("#loginForm").validate({
                debug: true,
                errorElement: 'span',
                errorClass: 'error',
                rules: {
                    username: { required: true},
                    password: { required: true },
                    type: { required: true }
                },
                messages: {
                    username: { required: "Please enter a username" },
                    password: {  required: "Please enter a password" },
                    type: "Please choose a login type"
                },
                submitHandler: function(form) {
                    $(form).ajaxSubmit({
                        url: 'validation.php',
                        target: 'result',
                        dataType:'json',
                        beforeSubmit: function() {
                            $('.loading').show();
                        },
                        success: function(data) {
                            if (data.success==1) {
                                toastr.success('Login successfully');
                                window.location.href = "home.php";
                            }else{
                                toastr.error('Invalid username or password');
                            }
                            
                        },
                        erroe:function(){
                            toastr.success('Server error try again');
                        },
                        complete:function(){
                            $('.loading').hide();
                        }
                    });
                }
            });
        });
    </script>


    <script type="text/javascript">
    // Default Configuration
        $(document).ready(function() {
            toastr.options = {
                'closeButton': true,
                'debug': false,
                'newestOnTop': false,
                'progressBar': false,
                'positionClass': 'toast-top-right',
                'preventDuplicates': false,
                'showDuration': '1000',
                'hideDuration': '1000',
                'timeOut': '5000',
                'extendedTimeOut': '1000',
                'showEasing': 'swing',
                'hideEasing': 'linear',
                'showMethod': 'fadeIn',
                'hideMethod': 'fadeOut',
            }
        });
    </script>
    <!-- <script src="//code.jquery.com/jquery-1.11.1.min.js"></script> -->
    <script type="">
        $(document).bind("contextmenu",function(e){
          return false;
        });
    </script>
    <!-- End Disable right click menu -->
</body>
</html>
