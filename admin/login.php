<?php include('include/header.php') ?>
<?php 
    if (isset($_SESSION['phone'])) {
       echo "<script>window.location.href='profile.php';</script>";
    } 
    $query=mysqli_query($connect,"SELECT * FROM class ORDER BY id desc ");
?>
<style>
    .error{
        color: #b43234;
    }
</style>
        <!-- ******CONTENT****** --> 
        <div class="content container">
            <div class="page-wrapper">
                <header class="page-heading clearfix">
                    <h1 class="heading-title float-left">Login/Register</h1>
                    <div class="breadcrumbs float-right">
                        <ul class="breadcrumbs-list">
                            <li class="breadcrumbs-label">You are here:</li>
                            <li><a href="index.php">Home</a><i class="fas fa-angle-right"></i></li>
                            <li class="current">Login/Register</li>
                        </ul>
                    </div>
                </header> 
                <div class="page-content">
                    <div class="row">
                        <article class="contact-form col-lg-8 col-md-7 col-12 page-row" id="register-section">               
                            <div class="row">
                                <div class="col-md-6" style="padding-right: 0px">
                                   <button class="btn btn-block btn-primary" id="register-form-link">Register</button> 
                                </div>
                                <div class="col-md-6"  style="padding-left: 0px">
                                    <button class="btn btn-block btn-secondary" id="login-form-link">login</button> 
                                </div>
                                
                            </div>             
                            
                            <form id="register-form" method="POST">
                                <div class="form-group name">
                                    <label for="name">Name <span class="required">*</span></label>
                                    <input id="name" name="name" type="text" class="form-control" placeholder="Enter your name">
                                </div>
                                <div class="form-group class">
                                    <label for="class">Class <span class="required">*</span></label>
                                    <select class="form-control" name="class_id">
                                        <option value="">Select</option>
                                        <?php while ($val=mysqli_fetch_assoc($query)) { ?>
                                            <option value="<?=$val['id']?>"><?=$val['name']?></option>
                                        <?php } ?>
                                    </select>
                                </div>
                                <div class="form-group phone">
                                    <label for="phone">Phone <span class="required">*</span></label>
                                    <input id="phone" name="phone" type="tel" class="form-control" placeholder="Enter your contact number">
                                </div>
                                <div class="form-group password">
                                    <label for="password">Password <span class="required">*</span></label>
                                    <input id="password" name="password" type="password" class="form-control" placeholder="Enter your password">
                                </div>
                                <button type="submit" name="register" class="btn btn-theme" id="rg-active">Register</button>
                                <button type="submit" class="btn btn-theme" id="rg-deactive" style="display: none;" disabled>Registering....</button>
                            </form>   
                            <form id="login-form" method="POST" style="display: none;">
                                <div class="form-group phone">
                                    <label for="phone">Phone <span class="required">*</span></label>
                                    <input id="phone" type="tel" name="phone" class="form-control" placeholder="Enter your contact number">
                                </div>
                                <div class="form-group password">
                                    <label for="password">Password <span class="required">*</span></label>
                                    <input id="password" name="password" type="password" class="form-control" placeholder="Enter your password">
                                </div>
                                <button type="submit" name="login" class="btn btn-theme">Login</button>
                            </form>                 
                        </article>



                        <aside class="page-sidebar  col-lg-3 offset-lg-1 col-md-4 offset-md-1">
                        
                            
                            <section class="widget has-divider">
                                <h3 class="title">Postal Address</h3>
                                <p class="adr">
                                    <span class="adr-group">       
                                        <span class="street-address">St. Peter's School</span><br>
                                        <span class="region">B.T Sarkar Road,</span><br>
                                        <span class="postal-code">Purulia, West Bengal 723101</span><br>
                                        <span class="country-name">India</span>
                                    </span>
                                </p>
                            </section>
                            <section class="widget">
                                <h3 class="title">All Enquiries</h3>
                                <p class="tel"><i class="fas fa-phone"></i>Tel: 8509937802 / 8942843181</p>
                                <p class="email"><i class="fas fa-envelope"></i>Email: <a href="#">spsprl.off@gmail</a></p>
                            </section>   
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script>
    $(document).ready(function() {

        $('#login-form-link').click(function(e) {
            console.log('log')
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#login-form-link').removeClass('btn-secondary');
            $('#login-form-link').addClass(' btn-primary');
            $('#register-form-link').removeClass('btn-primary');
            $('#register-form-link').addClass('btn-secondary');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#register-form-link').removeClass('btn-secondary');
            $('#register-form-link').addClass(' btn-primary');
            $('#login-form-link').removeClass('btn-primary');
            $('#login-form-link').addClass('btn-secondary');
            e.preventDefault();
        });

    });
    window.onload = function() {
        //document.getElementById("contact-menu").className = "nav-link active";
    };
    $(document).ready(function() {
        $("#register-form").validate({
            debug: true,
            errorElement: 'span',
            errorClass: 'error',
            rules: {
                name:       { required: true},
                class_id:   { required: true},
                phone:      { required: true},
                password:   { required: true}
            },
            messages: {
                name:       { required: "Please enter a name" },
                class_id:   { required: "Please choose a class" },
                phone:      { required: "Please enter a phone number" },
                password:   { required: "Please enter a password" }
            },
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    url: 'validate.php',
                    target: 'validate',
                    dataType:'json',
                    beforeSubmit: function() {
                        $('#rg-active').hide();
                        $('#rg-deactive').show();
                    },
                    success: function(data) {
                        if (data.success==1) {
                            toastr.success(data.message);
                            $('#register-form').trigger("reset");
                        }else{
                            toastr.error(data.message);
                        }
                        
                    },
                    erroe:function(){
                        toastr.success('Server error try again');
                    },
                    complete:function(){
                        $('#rg-active').show();
                        $('#rg-deactive').hide();
                    }
                });
            }
        });
    });
    $(document).ready(function() {
        $("#login-form").validate({
            debug: true,
            errorElement: 'span',
            errorClass: 'error',
            rules: {
                phone:      { required: true},
                password:   { required: true}
            },
            messages: {
                phone:      { required: "Please enter a phone number" },
                password:   { required: "Please enter a password" }
            },
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    url: 'validate.php',
                    target: 'validate',
                    dataType:'json',
                    beforeSubmit: function() {
                        $('#rg-active').hide();
                        $('#rg-deactive').show();
                    },
                    success: function(data) {
                        if (data.success==1) {
                            toastr.success(data.message);
                             setTimeout('', 5000);
                            window.location.href = 'profile.php';
                        }else{
                            toastr.error(data.message);
                        }
                        
                    },
                    erroe:function(){
                        toastr.success('Server error try again');
                    },
                    complete:function(){
                        $('#rg-active').show();
                        $('#rg-deactive').hide();
                    }
                });
            }
        });
    });
</script>
<script>
    window.onload = function() {
        document.getElementById("exam-menu").className = "nav-link active";
    };
</script> 
<?php include('include/footer.php') ?>