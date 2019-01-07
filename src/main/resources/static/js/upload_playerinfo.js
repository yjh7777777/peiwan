var accessid = '';
var accesskey = '';
var host = '';
var policyBase64 = '';
var signature = '';
var callbackbody = '';
var filename = '';
var key = '';
var expire = 0;
var g_object_name = '';
var g_object_name_type = '';
var now = timestamp = Date.parse(new Date()) / 1000; 

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        serverUrl = '/getplayerinfo/';
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText;
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
}

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length ; i++ )
    {
        if(tt[i].checked)
        {
            g_object_name_type = tt[i].value;
            break;
        }
    }
}

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    if (expire < now + 3600)
    {
        body = send_request();
        var obj = eval ("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'];
        key = obj['dir'];
        return true;
    }
    return false;
}

function random_string(len) {
	len = len || 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos != -1) {
        suffix = filename.substring(pos);
    }
    return suffix;
}

function calculate_object_name(filename)
{
    if (g_object_name_type == 'local_name')
    {
        g_object_name += "${filename}";
    }
    else if (g_object_name_type == 'random_name')
    {
        suffix = get_suffix(filename);
        g_object_name = key + random_string(10) + suffix;
    }
    return '';
}

function get_uploaded_object_name(filename)
{
    if (g_object_name_type == 'local_name')
    {
        tmp_name = g_object_name;
        tmp_name = tmp_name.replace("${filename}", filename);
       return tmp_name;
    }
    else if(g_object_name_type == 'random_name')
    {
        return g_object_name;
    }
}

function set_upload_param(up, filename, ret)
{
    if (ret == false)
    {
        ret = get_signature();
    }
    g_object_name = key;
    if (filename != '') { 
	suffix = get_suffix(filename);
        calculate_object_name(filename);
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,html4',
	browse_button : 'selectfiles', 
    //multi_selection: false,
    container: document.getElementById('container'),
    flash_swf_url : '/js/Moxie.swf',
//  silverlight_xap_url : 'http://static.tuwan.com/templet/teach/admin/oss/lib/plupload-2.1.2/js/Moxie.xap',
    url : 'http://oss.aliyuncs.com',
    filters: {
        mime_types : [ //只允许上传图片和zip文件
            { title : "视频文件", extensions : "MP4,AVI,FLV" }
        ],                          
        max_file_size : '10mb', //最大只能上传10mb的文件
        prevent_duplicates : false //不允许选取重复文件
    },
	init: {
		PostInit: function() {
			document.getElementById('ossfile').innerHTML = '';
			// document.getElementById('video').onchange = function() {
   //              if($('#video').val() == ''){
   //                  if(subform() == true) $('#form').submit();
   //                  return false;
   //              }
   //              //if(success_msg('title') == false || success_msg('video') == false  || success_msg('remarks') == false) return false;
   //              $('.supervisor').unbind("click"); //移除click
   //              $('.click').unbind("click"); //移除click
   //              $('#Progress').show();  
   //              $('#tishimsg').show();
   //              set_upload_param(uploader, '', false);
   //              return false;
			// };
		},
		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
				document.getElementById('ossfile').innerHTML  = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
                $('#video').val(file.name+ ' (' + plupload.formatSize(file.size) + ')');
                if(uploader.files[1]){//移除file文件
                            uploader.removeFile(uploader.files[0]);
                }
			});
            $('.supervisor').unbind("click"); //移除click
                $('.click').unbind("click"); //移除click
                $('#Progress').show();  
                $('#tishimsg').show();
                set_upload_param(uploader, '', false);
            return false;
		},
		BeforeUpload: function(up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);
        },
		UploadProgress: function(up, file) {
			var d = document.getElementById(file.id);
            if(d !== null){
                d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                var prog = d.getElementsByTagName('div')[0];
                var progBar = prog.getElementsByTagName('div')[0];
                progBar.style.width= 2*file.percent+'px';
                progBar.setAttribute('aria-valuenow', file.percent);
                $('.pop_up_percent').html(file.percent+'%');
                $('.pop_up_hou').css("width",file.percent+'%');
            }else{
                    return false;
            }
			
		},
		FileUploaded: function(up, file, info) {
            if (info.status == 200){
                GetCacheUid();
               // $('.video_error').html('upload to oss success, object name:' + get_uploaded_object_name(file.name) + ' 回调服务器返回的内容是:' + info.response);
                $('#fileurl').val(get_uploaded_object_name(file.name));
                $('.zhengque').html('上传成功');
                $('.pop_up_per').html('');
                //表单提交
                // if(subform() == true) $('#form').submit();
             //   ajax_teach();
            }else{
                 $('.video_error').html(info.response);
            } 
		},
		Error: function(up, err) {
            if (err.code == -600) {
                $('.video_error').html("\n选择的文件太大了");
            }else if (err.code == -601) {
                $('.video_error').html("\n选择的文件不合法");
            }else if (err.code == -602) {
                $('.video_error').html("\n这个文件已经上传过一遍了");
            }else {
                $('.video_error').html('系统错误');
            }
            $('#Progress').hide();
            $('#tishimsg').hide();
		}

	}

});
uploader.init();
