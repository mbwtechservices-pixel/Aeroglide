<?php 
    include('include/db.php');
    $response=array();
    if (isset($_POST['delete'])) {
        $id = $_POST['id'];
        if ($id) {
            $query=mysqli_query($connect,"DELETE FROM `contact` where id='$id'");
            if ($query) {
                $responce['success']=1;
                $responce['message']='Contact enquiry deleted successfully';
            }else{
                $responce['success']=0;
                $responce['message']='Course enquiry not deleted ';
            }
        }else{
            $responce['success']=0;
            $responce['message']='Invalid delete request';
        }
    }else{
        $responce['success']=0;
        $responce['message']='Invalid request';
    }
    echo json_encode($responce);
?>