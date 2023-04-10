function tabAction(n, _self){
    $('.col-md-trig-mode.setting .option').removeClass('active');
        $(_self).addClass("active")
    $('.col-md-trig-mode.content .col-md').removeClass('active_tab')
    $('.col-md-trig-mode.content .col-md').eq(n-1).addClass('active_tab')
   
}

$(document).ready(function(){

    

    $(".openai").click(function(){
        $('.content-openai').show();
        $(this).addClass("active");
        $('.content-openai').addClass('active'); 
        $(".content-webapp").hide()    
        $(".webapp, .content-webapp").removeClass('active')
    });

    $(".webapp").click(function(){
        $('.content-webapp').show();  
        $(this).addClass("active"); 
        $('.content-webapp').addClass('active');    
        $(".content-openai").hide()
        $(".openai, .content-openai").removeClass('active')
    });
    
    $(".chatsetting").click(function(){
        let setting = $(this).data("id")
        if(setting === 'webapp'){
            chrome.storage.local.get(['accessToken'], function (response){
                if (response.accessToken != undefined){
                    if (response.accessToken != 'fail'){
                        $('.content-webapp button').text('Connected'); 
                        $('.content-openai button').text('Connect');  
                        getCurrentTab('webapp')
                    } else {
                        connectToChatGPT('webapp')
                    }
                } else {
                    connectToChatGPT('webapp')
                }
            })
        } else if (setting === 'openai'){
            $('.content-webapp button').text('Connect');  
            $('.content-openai button').text('Connected');  
            getCurrentTab('openai')
        }
        chrome.storage.local.set({'chatsetting':setting})
    }) 

    $(".querysetting").click(function(){
        let setting = $(this).data("id")
        chrome.storage.local.set({'querysetting':setting})
        changeQuerysetting(setting)
    }) 

    chrome.storage.local.get(['chatsetting','accessToken'], function (response){
        if (response.chatsetting == undefined){
            $('.content-webapp button').text('Connect'); 
            $('.content-openai button').text('Connect');
            chrome.storage.local.set({'chatsetting':'webapp'})
        } else if (response.chatsetting === 'webapp'){
            $(".content-webapp").show()
            $('.content-openai').hide(); 
            $('.webapp, .content-webapp').addClass("active");  
            $('.openai, .content-openai').removeClass('active')
            if (response.accessToken != undefined && response.accessToken != 'fail'){
                $('.content-webapp button').text('Connected'); 
                $('.content-openai button').text('Connect');
            }
        } else if (response.chatsetting === 'openai' ){
            $(".content-webapp").hide()
            $('.content-openai').show(); 
            $('.openai, .content-openai').addClass('active')
            $('.webapp, .content-webapp').removeClass("active"); 
            $('.content-openai button').text('Connected');  
            $('.content-webapp button').text('Connect');  
        }
    })

    chrome.storage.local.get(['querysetting'], function (response){
        let value  = 'always'
        if (response.querysetting == undefined){
            chrome.storage.local.set({'querysetting':'mark'})
            value  = 'mark'
        } else {
            value = response.querysetting
        }
        
        document.querySelector(`input[value=${value}]`).checked = true;
    })
});

async function getCurrentTab(chatsetting) {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    chrome.tabs.sendMessage(tab.id, {action: 'CHANGE_CHAT_SETTING',chatsetting: chatsetting});
}

async function changeQuerysetting(setting) {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    chrome.tabs.sendMessage(tab.id, {action: 'CHANGE_QUERY_SETTING',querysetting: setting});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "CHECK_ACCESS_TOKEN_SEND_TO_POPUP"){
                chrome.storage.local.get(['chatsetting'], function (response){
                    if (response.chatsetting == 'webapp'){
                        if (request.data == 200){
                            $('.content-webapp button').text('Connected'); 
                            $('.content-openai button').text('Connect');  
                        }
                    }
                })
        } 
    }
);


async function connectToChatGPT(setting) {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    chrome.tabs.sendMessage(tab.id, {action: 'CONNECT_CHATGPT_TO_CONTENT_SCRIPT',querysetting: setting});
}

