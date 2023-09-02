<template>
  <!-- 登录页面 -->
  <div class="login">
    <!-- 头部 -->
    <div class="header">
        <div class="headerText">
            <img src="../assets/images/home_active.png" alt="">
            Luckin Coffee
        </div>
        <div class="headerIndex" @click="goIndex">
            首页
        </div>
    </div>


    <!-- 中间部分 -->
    <div class="contect"> 
        <!-- 中间部分标题 -->
        <div class="contentTitle">
            <span class="cnTitle">欢迎回来！</span><br><br>
            <span class="enTitle">Please login to your accounts</span>
        </div>



        <van-form>
        <van-cell-group inset>
            <van-field
            v-model="state.loginInfo.phone"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            />
            <van-field
            v-model="state.loginInfo.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            />
        </van-cell-group>

        <div class="forget">
            忘记密码？
        </div>

        <div style="margin:50px auto;width: 95%;">
            <van-button
            @click="getLogin"
            round
            block
            type="primary"
            native-type="submit"
            color="rgb(12,52,186)"
            >
            登录
            </van-button>
            <van-button
            @click="state.show = !state.show"
            round
            block
            plain
            type="primary"
            native-type="submit"
            color='rgb(230,230,230)'
            style="margin-top: 55px;color: black;"
            >
            注册
            </van-button>
        </div>
        </van-form>
        
    </div>


    <!-- 注册弹窗框 -->
    <van-popup
      closeable
      v-model:show="state.show"
      position="bottom"
      :style="{ height: '45%' }"
      class="register"
    >
      <van-form>
        <div class="registerTitle">
            注册
        </div>
        <div class="registerContent">
            <div>
                <van-cell-group inset>
                <van-field
                    v-model="state.registerInfo.phone"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                />
                <van-field
                    v-model="state.registerInfo.password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                />
                <van-field
                    v-model="state.registerInfo.nickName"
                    name="昵称"
                    label="昵称"
                    placeholder="昵称"
                />
                </van-cell-group>
            </div>
            <div style="margin:0 auto;width: 95%;">
            <van-button
                color="rgb(12,52,186)"
                @click="getRegister"
                round
                block
                type="primary"
                native-type="submit"
            >
                注册
            </van-button>
            </div>
        </div>
      </van-form>
    </van-popup>


  </div>
</template>

<script setup>
import {reactive} from 'vue';
import {useRouter} from 'vue-router';
import {Login,Register} from '@/api/api'
import {valueFrom} from '@/utils/utils'
import {showFailToast,showSuccessToast} from 'vant';
import {useStore} from 'vuex'

const store = useStore()
const router = useRouter()
    const state = reactive({
        // 登录页面的手机号和密码
        loginInfo:{
            phone:'',
            password:''
        },

        registerInfo: {
            phone:'',
            password:'',
            nickName:''
        },

        //  控制注册页面和打开
        show:false
    })
    

    // 跳转到首页
    const goIndex = function(){
        router.push('/home')
    }

    // 登录功能
    const getLogin = async()=>{
        let o = {
            phone: {
                // 验证的值
                value: state.loginInfo.phone,
                // 正则
                reg: /^[1][3,4,5,7,8][0-9]{9}$/,
                // 正则不同通过的提示
                errMsg: "手机号不正确",
            },
            password: {
                // 验证的值
                value: state.loginInfo.password,
                // 正则 6-14
                reg: /^[A-Za-z]\w{5,15}$/,
                // 正则不同通过的提示
                errMsg: "密码是首字母开头（6-14位）",
            },
        };

        if (!valueFrom(o)) {
            return;
        }

        const { data } = await Login({
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            password: state.loginInfo.password,
            phone: state.loginInfo.phone,
        });
        if(data.code != 200) return showFailToast(data.msg);
        showSuccessToast(data.msg)
        // 保存token
        localStorage.setItem('tokenString',data.token);
        store.commit('useLogin',1)
        router.push('/')
    };

    // 注册功能
    const getRegister = async () => {
        // 记录要验证的数据
        let o = {
                phone: {
                // 验证的值
                value: state.registerInfo.phone,
                // 正则
                reg: /^[1][3,4,5,7,8][0-9]{9}$/,
                // 正则不同通过的提示
                errMsg: "手机号不正确",
            },
            password: {
                // 验证的值
                value: state.registerInfo.password,
                // 正则 6-14
                reg: /^[A-Za-z]\w{5,15}$/,
                // 正则不同通过的提示
                errMsg: "密码是首字母开头（6-14位）",
            },
            nickname: {
                // 验证的值
                value: state.registerInfo.nickName,
                // 正则 6-14
                reg: /^[\u4e00-\u9fa5A-Za-z0-9]{2,10}$/,
                // 正则不同通过的提示
                errMsg: "用户支持汉字字母数字在组合(2-9)",
            },
        };

        if (!valueFrom(o)) {
            return;
        }

        const { data } = await Register({
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            password: state.registerInfo.password,
            phone: state.registerInfo.phone,
            nickName:state.registerInfo.nickName
        });
        if(data.code != 100) return showFailToast(data.msg);
        // 关闭弹出框
        state.show = false;
        // 清空注册的信息
        // state.registerInfo =   {
        //     nickName: "",
        //     password: "",
        //     phone: "",
        // }
        // 弹出提示
        showSuccessToast(data.msg)
    };
</script>

<style lang="less" scoped>
.login{
    .header{
        height: 48px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgb(241, 241, 241);
        .headerText{
            margin-left: 15px;
            img{
                margin-right: 12px;
                width: 36px;
            }
            display: flex;
            align-items: center;
            font-size: 15px;
            font-weight: bold;
        }
        .headerIndex{
            margin-right: 20px;
            line-height: 48px;
            color: rgb(12, 52, 186);
            font-weight: bold;
            font-size: 15px;
        }
    }
    .contect{
        text-align: left;
        .contentTitle{
            margin:90px 0 50px 10px;

            .cnTitle{
                font-size: 30px;
            }
            .enTitle{
                font-size: 18px;
                color: rgb(166, 166, 166);
            }
        }

        .forget{
            margin-top: 10px;
            text-align: right;
            margin-right: 10px;
            color: rgb(98, 98, 98);
            font-size: 15px;
        }
        
    }
    .register{
        margin: 0 auto;
        width: 95%;
        height: 100%;
        .registerTitle{
            margin: 10px 0 20px 10px;
            text-align: left;
            font-size: 26px;
        }
        .registerContent{
            height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}
</style>