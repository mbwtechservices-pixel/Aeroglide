  <!-- Main Sidebar Container -->

  <aside class="main-sidebar sidebar-dark-primary elevation-4">

    <!-- Brand Logo -->

    <a href="home.php" class="brand-link">

      <img src="../images/logo-vtp.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"

           style="opacity: .8">

      <span class="brand-text font-weight-light">Riverdale Residences</span>

    </a>



    <!-- Sidebar -->

    <div class="sidebar">

      <!-- Sidebar user panel (optional) -->

      <div class="user-panel mt-3 pb-3 mb-3 d-flex">

        <div class="image">

          <img src="dist/img/<?=$l_image;?>" class="img-circle elevation-2" alt="User Image">

        </div>

        <div class="info">

          <a href="#" class="d-block"><?=$l_name;?></a>

        </div>

      </div>



      <!-- Sidebar Menu -->

      <nav class="mt-2">

        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

          <!-- Add icons to the links using the .nav-icon class

               with font-awesome or any other icon font library -->

          <?php if($result['type']==0) { ?>
          <li class="nav-item has-treeview" id="enqueiry">
            <a href="#" class="nav-link" id="enqueiry-menu">
              <i class="nav-icon fas fa-user"></i>
              <p>Online Enquiry <i class="fas fa-angle-left right"></i> </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="enqueiry-list.php" class="nav-link" id="generalenqueiry">
                  <i class="far fa-circle nav-icon"></i><p>Enquiry </p>
                </a>
              </li>
              <li class="nav-item">
                <a href="contact_enqueiry-list.php" class="nav-link" id="contact">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Contact Enquiry </p>
                </a>
              </li>
            </ul>
          </li>
          <?php }else{ ?>
            <?php } ?>
          </ul>
        </nav>
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>