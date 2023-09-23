import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'


//引入vant样式
import { ConfigProvider,Button,Field,Tabbar,TabbarItem,Swipe,
    SwipeItem,Image as VanImage,Popup,CellGroup,
    Search,Toast,Form,NavBar,Divider,Stepper,
    ActionBar, ActionBarIcon, ActionBarButton,
    Sidebar, SidebarItem,Loading,Icon,Cell,Dialog,
    Notify,Empty,SwipeCell,Card,Checkbox, CheckboxGroup,
    SubmitBar,RadioGroup,Radio,Tab,Tabs,Overlay,Uploader,
    Area,Switch 

} from 'vant'
import 'vant/lib/index.css';
const app = createApp(App)

app.use(router)
.use(store)
.use(ConfigProvider)
.use(Button)
.use(Field)
.use(Tabbar)
.use(TabbarItem)
.use(Swipe)
.use(SwipeItem)
.use(VanImage)
.use(Popup)
.use(CellGroup)
.use(Search)
.use(Toast)
.use(Form)
.use(NavBar)
.use(Divider)
.use(Stepper)
.use(ActionBar)
.use(ActionBarIcon)
.use(ActionBarButton)
.use(Sidebar)
.use(SidebarItem)
.use(Loading)
.use(Icon)
.use(Cell)
.use(Dialog)
.use(Notify)
.use(Empty)
.use(SwipeCell)
.use(Card)
.use(Checkbox)
.use(CheckboxGroup)
.use(SubmitBar)
.use(Radio)
.use(RadioGroup)
.use(Tab)
.use(Tabs)
.use(Overlay)
.use(Uploader)
.use(Area)
.use(Switch)
.mount('#app')