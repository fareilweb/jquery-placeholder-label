/* 
Base Plugin: http://www.jqueryscript.net/form/jQuery-Floating-Placeholder-Text-Plugin-Placeholder-Label.html 
Improved Version: https://github.com/fareilweb/jquery-placeholder-label
*/

(function ($) {
    $.fn.placeholderLabel = function(options) {

        var settings = $.extend({
            // These are the defaults.
            placeholderColor: "#898989",
            labelColor: "#4AA2CC",
            labelSize: this.css('font-size'),
            labelHeight: '22px',
            useBorderColor: true,
            inInput: false,
            timeMove: 200
        }, options);

        var BindOnData = function (label, input, paddingTop){
            if (input.status === false) {
                input.status = true;
                var labelHeight = Number(settings.labelHeight.replace('px', ''));
                var difference = input.height() > labelHeight ? (input.height() - labelHeight) : 0;
                var mtm = Number(paddingTop.replace('px', '')) + difference + (labelHeight / 2);
                if(!settings.inInput){
                    mtm += labelHeight/2;
                    label.css('background-color','');
                }
                label.animate({
                    marginTop: "-="+mtm,
                    fontSize: settings.labelSize,
                }, settings.timeMove);
                input.keyup();
            }
        }
        //Work
        $(this).each(function (i,e){
            var self = $(e);
            self.status = false;
            var ep          = self.position().left;
            var paddingTop  = self.css('padding-top');
            var paddingLeft = self.css('padding-left');
            var marginTop   = self.css('margin-top');
            var marginLeft  = self.css('margin-left');

            if(self.attr('bind-placeholder-label') != undefined){
                BindOnData(self.prev(), self, paddingTop);
            }

            var currentBorderColor = self.css('border-color');
            var currentPlaceholderSize = self.css('font-size');

            if(self.attr('placeholder')){
                var label = $('<label></label>');
                label.css('position', 'absolute');
                label.css('cursor', 'initial');
                label.css('color', settings.placeholderColor);
                label.css('font-size', currentPlaceholderSize);
                label.css('height', settings.labelHeight);
                label.css('line-height', settings.labelHeight);
                label.css('z-index', 1);
                var labelHeight = Number(settings.labelHeight.replace('px', ''));
                var difference = self.height() > labelHeight ? (self.height() - labelHeight) : 0;
                var mtm = Number(paddingTop.replace('px', '')) + difference + (labelHeight / 2);

                label.moveOut = function () {
                    self.status = true;
                    if (!settings.inInput) {
                        mtm += labelHeight / 2;
                        label.css('background-color', '');
                    };
                    label.animate({
                        marginTop: '-=' + mtm + 'px',
                        fontSize: settings.labelSize,
                    }, settings.timeMove, function () {

                    });
                };

                label.moveIn = function () {
                    self.status = false;
                    if (!settings.inInput) {
                        mtm += labelHeight / 2;
                        label.css('background-color', '');
                    };
                    label.animate({
                        marginTop: '+=' + mtm + 'px',
                        fontSize: currentPlaceholderSize
                    }, settings.timeMove, function () {

                    });
                };

                var text = self.attr('placeholder');
                self.removeAttr('placeholder');
                label.text(text);
                label.css('margin-top', Number(paddingTop.replace('px','')) + Number(marginTop.replace('px','')) + difference);
                label.css('margin-left', (Number(paddingLeft.replace('px','')) - 5) + Number(marginLeft.replace('px','')));
                label.css('padding-left','5px');
                label.css('padding-right','5px');
                label.css('background-color', self.css('background-color'));

                //Event
                var self = self;
                label.on("click", function (){
                    self.trigger("focus");
                });
                self.on("change", function () {
                    if (settings.useBorderColor) {
                        self.css('border-color', settings.labelColor);
                    }
                    label.css('color', settings.labelColor);
                    if (self.status === false) {
                        label.moveOut();
                    }
                });
                self.on("focus", function(){
                    if(settings.useBorderColor){
                        self.css('border-color',settings.labelColor);
                    }
                    label.css('color', settings.labelColor);
                    if (self.status === false) {
                        label.moveOut();
                    }
                });
                self.on("blur", function(){
                    if(settings.useBorderColor){
                        self.css('border-color',currentBorderColor);
                    }
                    label.css('color', settings.placeholderColor);

                    if (!self.val().length && self.status === true) {
                        label.moveIn();
                    }
                });
                self.on("moveInLabel", function () {
                    if (self.status)
                        label.moveIn();
                })
                self.on("moveOutLabel", function () {
                    if (self.status == false)
                        label.moveOut();
                })
                if(self.attr('alt')){
                    var textLabel = self.attr('alt');
                    var textLabelOld = label.text();
                    self.removeAttr('alt');
                    self.keyup(function (){
                        if(self.val().length){
                            label.text(textLabel);
                        } else {
                            label.text(textLabelOld);
                        }
                    });
                }
                self.before(label);
                if(self.val().length){
                    BindOnData(label, self, paddingTop);
                }

                return self.attr('bind-placeholder-label','true');
            } else {
                return null;
            }
        });
    };
}(jQuery));