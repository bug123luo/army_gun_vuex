import Login from '@/components/Login'

import Elements from '@/components/main/other/Elements'
import Tables from '@/components/main/other/Tables'
import GunList from '@/components/main/other/GunList'
import DeliveryWarehouse from "@/components/main/other/DeliveryWarehouse"
import AllocationGun from "@/components/main/other/AllocationGun"
import StorageWarehouse from "@/components/main/other/StorageWarehouse"
import DistributionStorage from "@/components/main/other/DistributionStorage"
import Predistribution from "@/components/main/other/Predistribution"
import FinalStorage from "@/components/main/other/FinalStorage"
import Map from "@/components/main/Map"
import Home from "@/components/main/Home"
import Notifications from "@/components/main/other/Notifications"


export const routes = [
  { path: '/login', name: 'Login', component: Login },
    
  { path: '/', name: 'Home', component: Home, children:
   [
      { path: "", name: "map", component:Map },
      { path: "map", name: "", component: Map },
      { path: "/elements", name: "elements", component: Elements },
      { path: "/tables", name: "tables", component: Tables },
      { path: "/gunList", name: "gunList", component: GunList },
      { path: "/deliveryWarehouse", name: "deliveryWarehouse", component: DeliveryWarehouse },
      { path: "/allocationGun", name: "allocationGun", component: AllocationGun },
      { path: "/storageWarehouse", name: "storageWarehouse", component: StorageWarehouse },
      { path: "/distributionStorage", name: "distributionStorage", component: DistributionStorage },
      { path: "/predistribution", name: "predistribution", component: Predistribution },
      { path: "/finalStorage", name: "finalStorage", component: FinalStorage },
      { path: "/notifications", name: "notifications", component: Notifications },
      { path: "/*", redirect: '/map' },//找不到页面的时候，重定向到主页
   ]
  },
  { path: "*", redirect: '/login' },//找不到页面的时候，重定向到主页
   
  ]
