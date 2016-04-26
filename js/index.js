/**
 * Created by Changmin on 2016/4/17.
 */

$(function(){
    function loadText(url,tab){
    $.ajax({
        url:url,
        type:'GET',
        data:{tab:tab},
        success:function(response,status,xhr){
            //alert(response);
          //  var jsonParse=$.parseJSON(response);
           // alert(jsonParse);
            var jsonParse=response;
            var html='';
            for(var i=0;i<jsonParse.length;i++){
                html+='<h4>'+jsonParse[i].user+' 发表于 '+jsonParse[i].date+'</h4><h3>' +
                jsonParse[i].title+'</h3><div class="editor">'+jsonParse[i].content + '</div>'+
                    '<hr size="1" noshade="noshade"/>';
            }
            //$('#tab1').append(html);
            switch (tab){
                case 1:
                    $('#tab1').append(html);
                    break;
                case 2:
                    $('#tab2').append(html);
                    break;
                case 3:
                    $('#tab3').append(html);
                    break;
                default :
                    break;
            };
        }
    });
    }
    loadText('info1.json',1);
    loadText('info2.json',2);
    loadText('info3.json',3);
    $('#member_a, #logout_a').hide();
    if($.cookie('user')){
        $('#member_a, #logout_a').show();
        $('#reg_a, #login_a').hide();
        $('#member_a').html($.cookie('user'));
    }else{
        $('#member_a, #logout_a').hide();
        $('#reg_a, #login_a').show();
    }
    $('#logout_a').click(function(){
        $.removeCookie('user');
        window.location.href='/zhiwen/';
    });

    //按钮
    $('#search_button').button({
        icons:{//选择按钮上的小图标,可从API中查询
            primary:'ui-icon-search',
            //secondary:
        }
    });
    $('#publish_button').button({
        icons:{
            primary:'ui-icon-circle-plus',
            //secondary:
        }
    }).click(function(){
        if($.cookie('user')){
            $('#publish').dialog('open');
        }else{
            $('#login').dialog('open');
        }
    });
    //数据提交中……
    $('#loading').dialog({
        modal:true,
        resizable:false,
        draggable:false,
        closeOnEscape:false,//按Esc键不退出
        width:180,
        height:50,
        autoOpen:false
    }).parent().find('.ui-widget-header').hide();
    //对话框
    $('#publish').dialog({
        autoOpen:false,
        modal:true,
        width:500,
        resizable:false,
        title:'发布短文',
        buttons:{
            '发布':function(){
                    $(this).ajaxSubmit({
                        url:'publish.php',
                        type:'POST',
                        data:{
                            user: $.cookie('user')
                        },
                        beforeSubmit : function(){
                            $('#loading').dialog('open');
                            $('#publish').dialog('widget').find('button').eq(1).button('disable');
                        },
                        success : function(){
                            $('#loading').css('background','url(img/success.gif) no-repeat 20px center').html('发布成功！');
                            $('#publish').dialog('widget').find('button').eq(1).button('enable');
                            setTimeout(function(){
                                $('#loading').dialog('close').css('background','url(img/loading.gif) no-repeat 20px center').html('数据提交中……');
                                $('#publish').dialog('close').resetForm();
                            },2000);
                        }
                    });
            },
            '取消':function(){
                $(this).dialog('close');
                $(this).resetForm();
            }
        }
    });

    //注册
    $('#reg').dialog({
        autoOpen:false,
        modal:true,
        width:320,
        resizable:false,
        title:'注册',
        buttons:{
            '提交':function(){
                $(this).submit();
            },
            '取消':function(){
                $(this).dialog('close');
                $(this).resetForm();
                $(this).find('span.star').removeClass('succ').html('*');
                $(this).find('.reg_errors').html('');
            }
        }
    }).validate({
        submitHandler:function(form){
            $(form).ajaxSubmit({
                url : 'reg.php',
                type : 'POST',
                beforeSubmit : function(){
                    $('#loading').dialog('open');
                    $('#reg').dialog('widget').find('button').eq(1).button('disable');
                },
                success : function(){
                    $('#loading').css('background','url(img/success.gif) no-repeat 20px center').html('注册成功！');
                    $('#reg').dialog('widget').find('button').eq(1).button('enable');
                    $.cookie('user',$('#user').val());
                    setTimeout(function(){
                        $('#loading').dialog('close');
                        $('#loading').css('background','url(img/loading.gif) no-repeat 20px center').html('数据提交中……');
                        $('#reg').dialog('close');
                        $('#reg').resetForm();
                        $('#reg span.star').removeClass('succ').html('*');
                        $('#member_a, #logout_a').show();
                        $('#reg_a, #login_a').hide();
                        $('#member_a').html($.cookie('user'));
                    },2000);
                }
            });
        },
        //showErrors:function(){
        //    this.defaultShowErrors();
        //},
        highlight:function(element,errorClass){
            $(element).parent().find('span').html('*').removeClass('succ');
        },
        unhighlight:function(element,errorClass){
            $(element).parent().find('span').html('&nbsp;').addClass('succ');
        },

        errorLabelContainer:'ol.reg_errors',
        wrapper:'li',

        rules:{
            user:{
                required:true,
                minlength:2
            },
            pass:{
                required:true,
                minlength:6
            },
            email:{
                required:true,
                email:true
            }
        },
        messages:{
            user:{
                required:'账号不得为空',
                minlength:jQuery.format('账号不得小于{0}位')
            },
            pass:{
                required:'密码不得为空',
                minlength:jQuery.format('密码不得小于{0}位')
            },
            email:{
                required:'邮箱不得为空',
                email:'请输入正确的邮箱地址'
            }
        }
    });
    $('#reg_a').click(function(){
        $('#reg').dialog('open');
    });
    //登录
    $('#login').dialog({
        autoOpen:false,
        modal:true,
        width:320,
        resizable:false,
        title:'登录',
        buttons:{
            '登录':function(){
                $(this).submit();
            },
            '取消':function(){
                $(this).dialog('close');
                $(this).resetForm();
                //$(this).find('span.star').removeClass('succ').html('*');
                $(this).find('.login_errors').html('');
            }
        }
    }).validate({
        submitHandler:function(form){
            $(form).ajaxSubmit({
                url : 'login.php',
                type : 'POST',
                beforeSubmit : function(){
                    $('#loading').dialog('open');
                    $('#login').dialog('widget').find('button').eq(1).button('disable');
                },
                success : function(responseText){
                    $('#login').dialog('widget').find('button').eq(1).button('enable');
                    if(responseText=='true'){
                        $('#loading').css('background','url(img/success.gif) no-repeat 20px center').html('登录成功！');
                        $.cookie('user',$('#login_user').val());
                        setTimeout(function(){
                            $('#loading').dialog('close');
                            $('#loading').css('background','url(img/loading.gif) no-repeat 20px center').html('数据提交中……');
                            $('#login').dialog('close');
                            $('#login').resetForm();
                            //$('#login span.star').removeClass('succ').html('*');
                            $('#member_a, #logout_a').show();
                            $('#reg_a, #login_a').hide();
                            $('#member_a').html($.cookie('user'));
                        },2000);
                    }
                    else{
                        $('#loading').dialog('close');
                        $('#login_errors').html('<li>账号或密码错误</li>').show();
                    }

                }
            });
        },
        showErrors:function(){
            this.defaultShowErrors();
        },
        onkeyup:false,
        errorLabelContainer:'ol.login_errors',
        wrapper:'li',

        rules:{
            login_user:{
                required:true
            },
            login_pass:{
                required:true
            }
        },
        messages:{
            login_user:{
                required:'账号不得为空'
            },
            login_pass:{
                required:'密码不得为空'
            }
        }
    });
    $('#login_a').click(function(){
        $('#login').dialog('open');
    });
    //按钮组
    $('#radio').buttonset();

    //自动补全
    $('#email').autocomplete({
        autoFocus:true,
        delay:0,
        source:function(request,response){
            var hosts=['qq.com','163.com', '126.com', 'gmail.com'],
                term=request.term, //获取输入值
                ix=term.indexOf('@'), //@
                name=term, //用户名
                host= '', //域名
                result=[]; //结果
            //结果第一条是自己输入
            result.push(term);
            if(ix>-1){ //如果有@的时候
                name=term.slice(0, ix); //得到用户名
                host= term.slice(ix+ 1); //得到域名
            }
            if(name) {
                //得到找到的域名
                var findedHosts= (host?$.grep(hosts,function(value,index){
                        return value.indexOf(host) >-1;
                    }):hosts), //最终列表的邮箱
                    findedResults=$.map(findedHosts,function(value,index){
                        return name +'@'+value;
                    });
                //增加一个自我输入
                result=result.concat(findedResults);
            }
            response(result);
        }
    });
    //标签切换
    $('#tabs').tabs();
    //折叠菜单
    $('#accordion').accordion({
        collapsible:true,
        heightStyle:'content'
    });
});