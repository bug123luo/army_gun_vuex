<template>
  <div class="home">
       <!-- WRAPPER -->
      <div id="wrapper">
            
            <!-- Start LEFT SIDEBAR And Navbar -->
              <app-left-sidebar-navbar></app-left-sidebar-navbar>
            <!-- END   LEFT SIDEBAR And Navbar -->

            <!-- Start MAIN -->
            <div class="main">
              <router-view></router-view>
            </div>  
            <!-- END   MAIN -->

            <!-- Start Footer -->
              <app-footer></app-footer>
            <!-- End   Footer -->
      </div>
 </div>
</template>

<script>
import Footer from "../shelf/Footer"
import LeftSidebarNavbar from "../shelf/LeftSidebarNavbar";
import Navbar from "../shelf/Navbar";

export default {
  name: 'Home',
  components:{
    appFooter:Footer,
    appLeftSidebarNavbar:LeftSidebarNavbar,
    appNavbar:Navbar,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
