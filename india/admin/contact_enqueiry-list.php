<?php include('include/header.php') ?>
<?php include('include/top.php') ?>
<?php include('include/left.php') ?>
<?php 
  $query=mysqli_query($connect,"SELECT * FROM contact  ORDER BY id desc ");
?>



  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Contact 
              <!-- <a href="exam-add.php"><button type="button" class="btn btn-primary btn-flat"><i class="fas fa-plus-circle"></i>  Add New</button></a> -->
            </h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active"> Contact Enquiry</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        
        <!-- /.row -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body p-0" >
                <table class="table table-striped projects" id="myTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php if(mysqli_num_rows($query)){
                      while ($val=mysqli_fetch_assoc($query)) { ?>
                        <tr>
                          <td><?=$val['name']?></td>
                          <td><?=$val['email']?></td>
                          <td><?=$val['phone']?></td>
                          <td><?=$val['subjects']?></td>
                          <td><?=$val['msg']?></td>
                          <td><?=$val['created_at']?></td>
                          <td>
                            <a href="javascript:void(0)" class="delete-contact" data-id="<?=$val['id']?>"> <i class="fas fa-trash"></i> </a>
                          </td>
                        </tr>
                      <?php } ?>
                    <?php }else{?>
                        <tr>
                          <td colspan="7"><center>No record found</center></td>
                        </tr>
                      <?php } ?>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            <!-- /.card -->
          </div>
        </div>
        <!-- /.row -->

    </section>
    <!-- /.content -->
  </div>
  
<?php include('include/footer.php') ?>
<script>
   $(document).ready(function() {
    $(".delete-contact").click(function () {
      if (!confirm("Are you soure want ro delete")) {
        return false;
      }
      var id= $(this).attr("data-id");
      $.ajax({
        url: 'contact_enqueiry-delete.php',
        data: { 'id': id, 'delete':'delete'},
        dataType:'json',
        type: 'POST',
        beforeSubmit: function() {

        },
        success: function(data) {
          if (data.success==1) {
            toastr.success(data.message);
            //window.reload();
          }else{
            toastr.error(data.message);
          } 
        },
        erroe:function(){
          toastr.success('Server error try again');
        },
        complete:function(){
          window.location.reload();
        }
      });
    });
  });
</script>
  <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css">
   <script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"></script>
<script>
    $(document).ready(function(){
        $('#myTable').DataTable();
    });
    
  window.onload = function() {
    document.getElementById("contact").className = "nav-link active";
    document.getElementById("enqueiry").className = "nav-item has-treeview menu-open";
    document.getElementById("enqueiry-menu").className = "nav-link active";
  };
</script>