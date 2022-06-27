function initFloatLayer(iframeHeight) {
    var viewportWidth = jQuery(window).width();
    var viewportHeight = jQuery(window).height();
    var documentWidth = 0;
    var documentHeight = 0;
    var viewportLeft = 0;
    var viewportTop = 0;
    if (document.body) {
        documentWidth = document.body.scrollWidth;
        documentHeight = document.body.scrollHeight;
        viewportLeft = document.body.scrollLeft;
        viewportTop = document.body.scrollTop;
    };
    if (document.documentElement) {
        documentWidth = Math.min(documentWidth, document.documentElement.scrollWidth);
        documentHeight = Math.max(documentHeight, document.documentElement.scrollHeight);
        viewportLeft = Math.max(viewportLeft, document.documentElement.scrollLeft);
        viewportTop = Math.max(viewportTop, document.documentElement.scrollTop);
    };
    var shaderWidth = Math.max(documentWidth, viewportWidth);
    var shaderHeight = Math.max(documentHeight, viewportHeight);
    jQuery('#MLCalcShader').css({
        width: shaderWidth,
        height: shaderHeight,
        top: 0,
        left: 0,
        opacity: '0.5'
    }).show().click(function () {
        jQuery('#MLCalcShader').fadeOut(300);
        jQuery('#MLCalcHolder, #MLCalcClose').hide();
        jQuery('#MLCalcFrame').remove();
        showObjects();
    });
    var holderLeft = parseInt((viewportWidth - 680) / 2) + viewportLeft;
    var holderTop = parseInt((viewportHeight - iframeHeight) / 2) + viewportTop;
    if (holderLeft < 0) holderLeft = 0;
    if (holderTop < 0) holderTop = 0;
    hideObjects(holderLeft, holderTop, holderLeft + 680, holderTop + iframeHeight);
    jQuery('#MLCalcHolder').css({
        width: 680,
        height: iframeHeight,
        top: holderTop,
        left: holderLeft
    }).show();
    if (jQuery('#MLCalcHolder #MLCalcFrame').size() < 1) {
        jQuery('#MLCalcHolder').html('<iframe src="#" scrolling="no" id="MLCalcFrame" name="MLCalcFrame" width="0" height="0" frameborder="0" allowtransparency="true" style="background-color: transparent; display: none"></iframe><iframe id="garbageFrame" style="display:none"></iframe>')
    };
    jQuery('#MLCalcHolder').find('#MLCalcFrame').css({
        width: 680,
        height: iframeHeight
    }).load(function () {
        jQuery(this).show();
        jQuery('#MLCalcHolder #garbageFrame').attr('src', '');
        jQuery('#MLCalcClose').show().css({
            height: 25,
            width: 25
        }).css({
            top: holderTop,
            left: holderLeft + jQuery('#MLCalcHolder').width() - 2 - jQuery('#MLCalcClose').width()
        }).click(function () {
            jQuery('#MLCalcShader').fadeOut(300);
            jQuery('#MLCalcHolder, #MLCalcClose').hide();
            jQuery('#MLCalcFrame').remove();
            showObjects();
        }).hover(function () {
            jQuery(this).css({
                background: '#F5F5F5',
                color: '#808080'
            });
        }, function () {
            jQuery(this).css({
                background: '#D5D5D5',
                color: '#F5F5F5'
            });
        });
    });
};

function hideObjects(X1, Y1, X2, Y2) {
    jQuery('OBJECT').each(function () {
        var offset = jQuery(this).offset();
        oX1 = offset.left;
        oY1 = offset.top;
        oX2 = oX1 + jQuery(this).width();
        oY2 = oY1 + jQuery(this).height();
        if (((X1 > oX1 && X1 < oX2) || (X2 > oX1 && X2 < oX2)) && ((Y1 > oY1 && Y1 < oY2) || (Y2 > oY1 && Y2 < oY2)) || ((oX1 > X1 && oX1 < X2) || (oX2 > X1 && oX2 < X2)) && ((oY1 > Y1 && oY1 < Y2) || (oY2 > Y1 && oY2 < Y2))) {
            jQuery(this).attr('originalVisibility', jQuery(this).css('visibility')).css('visibility', 'hidden').attr('hiddenBy', 'MLCalc');
        }
    });
    if (jQuery.browser == 'msie' && jQuery.browser.version < 7) {
        jQuery('SELECT').each(function () {
            jQuery(this).attr('originalVisibility', jQuery(this).css('visibility')).css('visibility', 'hidden').attr('hiddenBy', 'MLCalc');
        });
    };
};

function showObjects() {
    jQuery('OBJECT[hiddenBy=MLCalc]').each(function () {
        jQuery(this).css('visibility', jQuery(this).attr('originalVisibility')).removeAttr('originalVisibility').removeAttr('hiddenBy');
    });
    if (jQuery.browser == 'msie' && jQuery.browser.version < 7) {
        jQuery('SELECT[hiddenBy=MLCalc]').each(function () {
            jQuery(this).css('visibility', jQuery(this).attr('originalVisibility')).removeAttr('originalVisibility').removeAttr('hiddenBy');
        });
    }
};

function mlcalcCalculate(form) {
    console.log("FINISHED CALCULATING");
    if (jQuery('INPUT[name=ma]', form).size()) {
        var mInputs = new Array('ma', 'dp', 'mt', 'ir', 'pt', 'pi', 'mi', 'sm', 'sy', 'wl', 'cr');
        for (i = 0; i < mInputs.length; i++) {
            mInput = mInputs[i];
            jQuery('INPUT[name=' + mInput + ']', '#mlcalcMortgageForm').val(jQuery('*[name=' + mInput + ']', form).val());
        };
        jQuery('INPUT[name=as]', '#mlcalcMortgageForm').val(jQuery('INPUT[name=as]:checked', form).val());
        if (mlcalcLinkPresent()) {
            initFloatLayer(jQuery('INPUT[name=as]:checked', form).val() == 'none' ? 319 : 570);
            jQuery('#mlcalcMortgageForm').attr('target', 'MLCalcFrame');
        }
        jQuery('#mlcalcMortgageForm').submit();
    } else if (jQuery('INPUT[name=la]', form).size()) {
        var mInputs = new Array('la', 'lt', 'ir', 'sm', 'sy', 'wl', 'cr');
        for (i = 0; i < mInputs.length; i++) {
            mInput = mInputs[i];
            jQuery('INPUT[name=' + mInput + ']', '#mlcalcLoanForm').val(jQuery('*[name=' + mInput + ']', form).val());
        };
        jQuery('INPUT[name=as]', '#mlcalcLoanForm').val(jQuery('INPUT[name=as]:checked', form).val());
        if (mlcalcLinkPresent()) {
            initFloatLayer(jQuery('INPUT[name=as]:checked', form).val() == 'none' ? 302 : 550);
            jQuery('#mlcalcLoanForm').attr('target', 'MLCalcFrame');
        }
        jQuery('#mlcalcLoanForm').submit();
    };
    return false;
}

function mlcalcLinkPresent() {
    return true;
}

function processLink(href) {
    if (href.search(/^https:/ / www.mlcalc.com / i) != -1) {
        lang = href.replace(/^.+\/([^\/]{2})\/#.+$/, "$1");
        if (lang.length != 2) lang = 'en';
        href = href.replace(/^.+#(.+)$/, "$1");
        var params = href.split('-');
        switch (params[0]) {
            case 'mortgage':
                var iframeHeight = (params[10] == 'none') ? 319 : 570;
                initFloatLayer(iframeHeight);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=ma]').val(params[1]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=dp]').val(params[2]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=mt]').val(params[3]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=ir]').val(params[4]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=pt]').val(params[5]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=pi]').val(params[6]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=mi]').val(params[7]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=sm]').val(params[8]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=sy]').val(params[9]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=as]').val(params[10]);
                jQuery('#mlcalcMortgageForm').find('INPUT[name=wl]').val(lang);
                jQuery('#mlcalcMortgageForm').attr('target', 'MLCalcFrame');
                jQuery('#mlcalcMortgageForm').submit();
                break;
            case 'loan':
                var iframeHeight = (params[6] == 'none') ? 302 : 550;
                initFloatLayer(iframeHeight);
                jQuery('#mlcalcLoanForm').find('INPUT[name=la]').val(params[1]);
                jQuery('#mlcalcLoanForm').find('INPUT[name=lt]').val(params[2]);
                jQuery('#mlcalcLoanForm').find('INPUT[name=ir]').val(params[3]);
                jQuery('#mlcalcLoanForm').find('INPUT[name=sm]').val(params[4]);
                jQuery('#mlcalcLoanForm').find('INPUT[name=sy]').val(params[5]);
                jQuery('#mlcalcLoanForm').find('INPUT[name=as]').val(params[6]);
                jQuery('#mlcalcLoanForm').find('INPUT[name=wl]').val(lang);
                jQuery('#mlcalcLoanForm').attr('target', 'MLCalcFrame');
                jQuery('#mlcalcLoanForm').submit();
                break;
        };
    };
};
if (typeof mlcalc_jquery_noconflict != "undefined") jQuery.noConflict();
jQuery(document).ready(function () {
    jQuery('body').prepend('<div id="MLCalcHolder" style="background: transparent; display: none; position: absolute; z-index: 10001; margin: 0; padding: 0; background: url(https://www.mlcalc.com/themes/mlcalc/images/ajax-loader.gif); background-repeat: no-repeat; background-position: center; text-align:center;"></div><div id="MLCalcShader" style="background: #000000; display: none; position: absolute; z-index: 10000; margin: 0; padding: 0;"></div><div id="MLCalcClose" style="display: none; color: #F5F5F5; font-size: 18px; font-weight: bold; font-family: Arial; cursor: pointer; position: absolute; background: #D5D5D5; border: 1px solid #D5D5D5; z-index: 10002; text-align: center; padding-top: 1px;">X</div>');
    jQuery('body').prepend('<form action="https://www.mlcalc.com/" method="post" id="mlcalcMortgageForm" style="display:none"><input type="hidden" name="cl" value="true" /><input type="hidden" name="wl" value="en" /><input type="hidden" name="ml" value="mortgage" /><input type="hidden" name="cl" value="true" /><input type="hidden" name="wg" value="widget" /><input type="hidden" name="ma" value="" /><input type="hidden" name="dp" value="" /><input type="hidden" name="mt" value="" /><input type="hidden" name="ir" value="" /><input type="hidden" name="pt" value="" /><input type="hidden" name="pi" value="" /><input type="hidden" name="mi" value="" /><input type="hidden" name="sm" value="" /><input type="hidden" name="sy" value="" /><input type="hidden" name="as" value="" /><input type="hidden" name="mi" value="" /><input type="hidden" name="cr" value="usd" /></form>');
    jQuery('body').prepend('<form action="https://www.mlcalc.com/" method="post" id="mlcalcLoanForm" style="display:none"><input type="hidden" name="cl" value="true" /><input type="hidden" name="wl" value="en" /><input type="hidden" name="ml" value="loan" /><input type="hidden" name="cl" value="true" /><input type="hidden" name="wg" value="widget" /><input type="hidden" name="la" value="" /><input type="hidden" name="lt" value="" /><input type="hidden" name="ir" value="" /><input type="hidden" name="sm" value="" /><input type="hidden" name="sy" value="" /><input type="hidden" name="as" value="" /><input type="hidden" name="cr" value="usd" /></form>');
    jQuery('A[rel=mlcalc]').click(function () {
        processLink(jQuery(this).attr('href'));
        return false;
    });
});
var img1 = new Image(312, 44);
img1.src = "https://www.mlcalc.com/themes/mlcalc/images/ajax-loader.gif";