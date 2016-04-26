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
                html+='<h4>'+jsonParse[i].user+' ������ '+jsonParse[i].date+'</h4><h3>' +
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

    //��ť
    $('#search_button').button({
        icons:{//ѡ��ť�ϵ�Сͼ��,�ɴ�API�в�ѯ
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
    //�����ύ�С���
    $('#loading').dialog({
        modal:true,
        resizable:false,
        draggable:false,
        closeOnEscape:false,//��Esc�����˳�
        width:180,
        height:50,
        autoOpen:false
    }).parent().find('.ui-widget-header').hide();
    //�Ի���
    $('#publish').dialog({
        autoOpen:false,
        modal:true,
        width:500,
        resizable:false,
        title:'��������',
        buttons:{
            '����':function(){
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
                            $('#loading').css('background','url(img/success.gif) no-repeat 20px center').html('�����ɹ���');
                            $('#publish').dialog('widget').find('button').eq(1).button('enable');
                            setTimeout(function(){
                                $('#loading').dialog('close').css('background','url(img/loading.gif) no-repeat 20px center').html('�����ύ�С���');
                                $('#publish').dialog('close').resetForm();
                            },2000);
                        }
                    });
            },
            'ȡ��':function(){
                $(this).dialog('close');
                $(this).resetForm();
            }
        }
    });

    //ע��
    $('#reg').dialog({
        autoOpen:false,
        modal:true,
        width:320,
        resizable:false,
        title:'ע��',
        buttons:{
            '�ύ':function(){
                $(this).submit();
            },
            'ȡ��':function(){
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
                    $('#loading').css('background','url(img/success.gif) no-repeat 20px center').html('ע��ɹ���');
                    $('#reg').dialog('widget').find('button').eq(1).button('enable');
                    $.cookie('user',$('#user').val());
                    setTimeout(function(){
                        $('#loading').dialog('close');
                        $('#loading').css('background','url(img/loading.gif) no-repeat 20px center').html('�����ύ�С���');
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
                required:'�˺Ų���Ϊ��',
                minlength:jQuery.format('�˺Ų���С��{0}λ')
            },
            pass:{
                required:'���벻��Ϊ��',
                minlength:jQuery.format('���벻��С��{0}λ')
            },
            email:{
                required:'���䲻��Ϊ��',
                email:'��������ȷ�������ַ'
            }
        }
    });
    $('#reg_a').click(function(){
        $('#reg').dialog('open');
    });
    //��¼
    $('#login').dialog({
        autoOpen:false,
        modal:true,
        width:320,
        resizable:false,
        title:'��¼',
        buttons:{
            '��¼':function(){
                $(this).submit();
            },
            'ȡ��':function(){
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
                        $('#loading').css('background','url(img/success.gif) no-repeat 20px center').html('��¼�ɹ���');
                        $.cookie('user',$('#login_user').val());
                        setTimeout(function(){
                            $('#loading').dialog('close');
                            $('#loading').css('background','url(img/loading.gif) no-repeat 20px center').html('�����ύ�С���');
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
                        $('#login_errors').html('<li>�˺Ż��������</li>').show();
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
                required:'�˺Ų���Ϊ��'
            },
            login_pass:{
                required:'���벻��Ϊ��'
            }
        }
    });
    $('#login_a').click(function(){
        $('#login').dialog('open');
    });
    //��ť��
    $('#radio').buttonset();

    //�Զ���ȫ
    $('#email').autocomplete({
        autoFocus:true,
        delay:0,
        source:function(request,response){
            var hosts=['qq.com','163.com', '126.com', 'gmail.com'],
                term=request.term, //��ȡ����ֵ
                ix=term.indexOf('@'), //@
                name=term, //�û���
                host= '', //����
                result=[]; //���
            //�����һ�����Լ�����
            result.push(term);
            if(ix>-1){ //�����@��ʱ��
                name=term.slice(0, ix); //�õ��û���
                host= term.slice(ix+ 1); //�õ�����
            }
            if(name) {
                //�õ��ҵ�������
                var findedHosts= (host?$.grep(hosts,function(value,index){
                        return value.indexOf(host) >-1;
                    }):hosts), //�����б������
                    findedResults=$.map(findedHosts,function(value,index){
                        return name +'@'+value;
                    });
                //����һ����������
                result=result.concat(findedResults);
            }
            response(result);
        }
    });
    //��ǩ�л�
    $('#tabs').tabs();
    //�۵��˵�
    $('#accordion').accordion({
        collapsible:true,
        heightStyle:'content'
    });
});