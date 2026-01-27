<?php include('admin/include/db.php');
    session_start();
    ob_start();
    error_reporting(E_ALL ^ E_NOTICE);
?>
<?php
    if(isset($_GET['submit'])){
        $name=$_GET['name'];
        //$_SESSION['name']=$name;
        $email=$_GET['email'];
        $phone=$_GET['phone'];
        $heading=$_GET['heading'];
        $msg=$_GET['msg'];
        date_default_timezone_set('Asia/Kolkata');
        $created_at=date("Y-m-d h:i:sa");
        
        $to = "aeroglide.ad@gmail.com";
        $subject = "Contact Enquiry";
        $body = '<html>
            <body>
                <div class="container" style="margin-top: 2em;border: 2px solid #ddd;">
                    <div style="padding: 2em;">
                        <table style="border-collapse:collapse;width:100%;border-top:1px solid #dddddd;border-left:1px solid #dddddd;margin-bottom:20px">
                            <tr>
                                <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px"><img src="https://aeroglide.in/assets/img/logo/logo1.png" alt="AeroGlide logo"></td>
                                                
                                <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px"><b>Date:</b>'.$created_at.'<br></td>
                                        
                            </tr>
                        </table>
                        <br>
                        <div class="blog-detail-content">
                            <h4>Dear Sir/Madam</h4>
                            <p>'.$msg.'</p>
                        </div>
                        <div class="row">
                            <table style="border-collapse:collapse;width:100%;border-top:1px solid #dddddd;border-left:1px solid #dddddd;margin-bottom:20px">
                                <thead>
                                    <tr>
                                        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:left;padding:7px;color:#222222" colspan="3"> 
                                            <div class="heading text-align-left">
                                                <h4 class="title-style-1">Contact Details</h4>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><br></td>
                                        <td style="font-size:15px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px"><b>Name.</b>'.$name.'<br>
                                            <b>E-mail:</b>'.$email.'<br>
                                            <b>Phone:</b>'.$phone.'<br>
                                            <b>Service:</b>'.$heading.'<br>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>                
                        </div>
                    </div>
                </div>
            </body>
        </html>';
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        // More headers
        $headers .= 'From: <enquiry@dotskale.in>' . "\r\n";
        $headers .= 'Cc: ' . "\r\n";
        $respons=mail($to,$subject,$body,$headers);
        $result=mysqli_query($connect,"INSERT INTO enqueiry(name,email,phone,heading,msg,created_at,status)VALUES('$name','$email','$phone','$heading','$msg','$created_at','1')");
        /*print_r($result);exit;*/
        if($result){
            echo "<script>window.location.href='thankyou.php';</script>";
            exit;
        }
        else
        { echo "error"; }
    }?>