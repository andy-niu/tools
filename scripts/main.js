(function () {
    $('#replace').on('click', () => {
        var code = $('#code').val().replace(/\n/gi, '').replace(/  /gi, '')
        console.log(code);
        $('#coderesult').val(code);
    });
    $('#clear').on('click', () => {
        $('#code').val('')
        $('#coderesult').val('');
    });
    $('#convert2html').on('click', function () {
        var code = $('#code').val()
        var result = code.split('\n').filter(function (item) { return item != '' }).map(function (item) { return '<p>' + item.replace(/(^\s*)|(\s*$)/gi, '') + '</p>' }).join('\n')

        $('#coderesult').val(result);
    });

    var lCSSCoder = {
        format: function (s) { //格式化代码
            s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
            s = s.replace(/;\s*;/g, ";"); //清除连续分号
            s = s.replace(/\,[\s\.\#\d]*{/g, "{");
            s = s.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
            s = s.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
            s = s.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
            return s;
        },
        pack: function (s) { //压缩代码
            s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
            s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
            s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
            s = s.replace(/;\s*;/g, ";"); //清除连续分号
            s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
            return (s == null) ? "" : s[1];
        }
    };
    //样式格式化
    $('#fromart_button').on('click', () => {        
        $('#coderesult').val(lCSSCoder.format($('#code').val()));
    });
    //样式压缩
    $('#pack_button').on('click', () => {
        $('#coderesult').val(lCSSCoder.pack($('#code').val()));
    });
    //\n替换逗号
    $('#replace_button').on('click', () => {
        var code = $('#code').val()
        let array = code.split('\n').filter(function (item) { return item.replace(/(^\s*)|(\s*$)/gi, '') != '' }).map(function (item) { return item.replace(/(^\s*)|(\s*$)/gi, '') })
        $('#coderesult').val(array.join(','));
    });
    //UrlEncode
    $('#encode_button').on('click', () => {
        $('#coderesult').val(encodeURIComponent($('#code').val()).replace(/'/g, "%27").replace(/"/g, "%22"));
        ;
    });
    //UrlDecode
    $('#decode_button').on('click', () => {
        $('#coderesult').val(decodeURIComponent($('#code').val().replace(/\+/g, " ")));
    });

    $('#coderesult')[0].addEventListener("dragenter", function(event) { event.preventDefault(); }, false);
    $('#coderesult')[0].addEventListener("dragover", function(event) { event.preventDefault(); }, false);
    $('#coderesult')[0].addEventListener("drop", function(event) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#coderesult')[0].innerHTML = e.target.result;
        };
        reader.readAsDataURL(event.dataTransfer.files[0]);
        event.preventDefault();
    }, false);

    var tips = function(msg){
        $('.copyresult').show().text(msg).addClass('active');
        var t = setTimeout(()=>{$('.copyresult').removeClass('active');clearTimeout(t); setTimeout(()=>{$('.copyresult').hide('active');},500) },1500);
    }

    $('#coderesult').on('dblclick ',function(){
        if(this.value.replace(/(^\s*)|(\s*$)/gi, '') == '') return
        var textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = $('#coderesult').val();
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            //alert(msg);
            tips(msg)
        } catch (err) {
            tips('该浏览器不支持点击复制到剪贴板')
        }
        document.body.removeChild(textArea);
    })

})($, window);