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
import RoleManage from "@/components/manage/RoleManage"
import SosMessage from "@/components/main/other/SosMessage"
import FindMap from "@/components/main/other/FindMap"
import Mission from "@/components/main/other/Mission"
import Device from "@/components/main/other/Device"
import DataStatistics from "@/components/main/other/DataStatistics"
import ProjectileBase from "@/components/main/other/ProjectileBase"




export const routes = [
  { path: '/login', name: 'Login', component: Login },
    
  { path: '/home', name: 'Home', component: Home, children:
   [
      { path: "", name: "map", component:Map },
      { path: "/map", name: "", component: Map },
      { path: "/elements", name: "elements",component: Elements },
      { path: "/tables", name: "tables", component: Tables },
      { path: "/dataStatistics", name: "数据统计", component: DataStatistics },
      { path: "/projectileBase", name: "射弹基数", component: ProjectileBase },
      { path: "/gunList", name: "枪支列表", component: GunList },
      { path: "/device", name: "设备列表", component: Device },
      { path: "/deliveryWarehouse", name: "deliveryWarehouse", component: DeliveryWarehouse },
      { path: "/allocationGun", name: "allocationGun", component: AllocationGun },
      { path: "/storageWarehouse", name: "枪支入库操作", component: StorageWarehouse },
      { path: "/distributionStorage", name: "枪支分配",  component: DistributionStorage },
      { path: "/predistribution", name: "枪支预出库操作", component: Predistribution },
      { path: "/finalStorage", name: "枪支出库操作", component: FinalStorage },
      { path: "/notifications", name: "notifications", component: Notifications },
      { path: "/sosMessage", name: "警告信息", component: SosMessage },
      { path: "/findMap", name: "findMap", component: FindMap },
      { path: "/mission", name: "离位启停", component: Mission },
      { path: "/system/roleManage", name: "角色管理", component: RoleManage },
        { path: "/*", redirect: '/home' },//找不到页面的时候，重定向到主页
        { path: "/*/**", redirect: '/home' },//找不到页面的时候，重定向到主页
   ]
  },
  { path: "*", redirect: '/login' },//找不到页面的时候，重定向到主页
   
  ]
