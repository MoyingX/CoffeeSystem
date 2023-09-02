import { showToast  } from "vant";

function valueFrom(o) {
    for(let key in o){
        if(!o[key].reg.test(o[key].value)){
            showToast(o[key].errMsg);
            return false;
        }
    }
    return true
}

export{
    valueFrom
}