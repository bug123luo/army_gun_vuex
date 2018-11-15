import Login from '@/components/Login'
import Index from '@/components/Index'

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


export const routes = [
    { path: '/', name: 'Login', component: Login },
    
  { path: '/home', name: 'Home', component: Home, children: [
    { path: "/map", name: "Map", components: { default: Map, } },
    { path: "/elements", name: "Elements", component: Elements },
    { path: "/tables", name: "Tables", component: Tables },
    { path: "/gunList", name: "GunList", component: GunList },
    { path: "/deliveryWarehouse", name: "DeliveryWarehouse", component: DeliveryWarehouse },
    { path: "/allocationGun", name: "AllocationGun", component: AllocationGun },
    { path: "/storageWarehouse", name: "StorageWarehouse", component: StorageWarehouse },
    { path: "/distributionStorage", name: "DistributionStorage", component: DistributionStorage },
    { path: "/predistribution", name: "Predistribution", component: Predistribution },
    { path: "/finalStorage", name: "FinalStorage", component: FinalStorage },
  ]},
  
    { path: "*", redirect: '/' },//找不到页面的时候，重定向到主页
  ]
