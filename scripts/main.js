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
        var result = code.split('\n').filter(function (item) {
            return item != ''
        }).map(function (item) {
            return '<p>' + item.replace(/(^\s*)|(\s*$)/gi, '') + '</p>'
        }).join('\n')

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
        let array = code.split('\n').filter(function (item) {
            return item.replace(/(^\s*)|(\s*$)/gi, '') != ''
        }).map(function (item) {
            return item.replace(/(^\s*)|(\s*$)/gi, '')
        })
        $('#coderesult').val(array.join(','));
    });
    //UrlEncode
    $('#encode_button').on('click', () => {
        $('#coderesult').val(encodeURIComponent($('#code').val()).replace(/'/g, "%27").replace(/"/g, "%22"));;
    });
    //UrlDecode
    $('#decode_button').on('click', () => {
        $('#coderesult').val(decodeURIComponent($('#code').val().replace(/\+/g, " ")));
    });

    //Base64 Encode
    $('#bencode_button').on('click', () => {
        let base64 = new Base64();
        $('#coderesult').val(base64.encode($('#code').val()));
    });
    //Base64 Decode
    $('#bdecode_button').on('click', () => {
        let base64 = new Base64();
        $('#coderesult').val(base64.decode($('#code').val()));
    });

    $('#coderesult')[0].addEventListener("dragenter", function (event) {
        event.preventDefault();
    }, false);
    $('#coderesult')[0].addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);
    $('#coderesult')[0].addEventListener("drop", function (event) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#coderesult')[0].innerHTML = e.target.result;
        };
        reader.readAsDataURL(event.dataTransfer.files[0]);
        event.preventDefault();
    }, false);

    var tips = function (msg) {
        $('.copyresult').show().text(msg).addClass('active');
        var t = setTimeout(() => {
            $('.copyresult').removeClass('active');
            clearTimeout(t);
            setTimeout(() => {
                $('.copyresult').hide('active');
            }, 500)
        }, 1500);
    }

    $('#coderesult').on('dblclick ', function () {
        if (this.value.replace(/(^\s*)|(\s*$)/gi, '') == '') return
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
    });

    function Base64() {

        // private property
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        // public method for encoding
        this.encode = function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = _utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        }

        // public method for decoding
        this.decode = function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        }

        // private method for UTF-8 encoding
        _utf8_encode = function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        }

        // private method for UTF-8 decoding
        _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }

})($, window);