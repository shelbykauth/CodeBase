// Author: Shelby Kauth //
// Copyright: Feb 2017 //
// Version: 0.1.1 //
// Time Taken: 1 Night of Insomnia
//            +1 Day of Debugging
//
// Yes I am aware of the spaghetti code, especially around the menu creation. //
// But the whole thing is cool anyways. //

function PatternMaker(container) {
    var publicData = this;
    function rgn(max, min) {
        max = max || 10;
        min = min || 0;
        return Math.floor(Math.random()*(max-min)) + min;
    }
    function pickRandom (arr) {
        var list = [];
        for (var i in arr) {
            list.push(i);
        }
        return arr[list[rgn(list.length)]];
    }
    var patterns = {};
    patterns.DragonScale = function(ctx, size, colors, orientation) {
        if (!ctx || !ctx.canvas) return false;
        if (isNaN(size) || size==0) size = 1 / 10;
        if (!colors || !colors.length) colors = [bgColor];
        if (!orientation) orientation = 0;
        size *= ctx.canvas.height;
        ctx.strokeStyle = lineColor;
        ctx.fillStyle = bgColor;
        var r = size;
        var iLimit = ctx.canvas.width / size / 2 + 1;
        var jLimit = ctx.canvas.height / size + 1;
        for (var j = 0; j < jLimit; j++) {
            for (var i = 0; i < iLimit; i++) {
                ctx.fillStyle = pickRandom(colors);
                var x = (i*2 + j%2) * r;
                var y = (jLimit-j-1)*size;
                ctx.beginPath();
                ctx.arc(x,y,r,0,2*Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
    function sortColors(id) {
        //if (id) colorPresets.Custom.splice(id,1);
        var colorList = [];
        for (var color in colorPresets.Custom) {
            colorList.push(color);
        }
        colorList.sort();
        var options = "<option disabled selected value=0>Existing Color List</option>";
        for (var i in colorList) {
            var color = colorList[i];
            var count = colorPresets.Custom[color];
            options += "<option value="+color+">"+color+" - "+count+"</option>";
        }
        selColorEdit.empty().append(options);
    }
    function editColor() {
        var color = inputColor.val();
        var count = parseInt(inputCount.val());
        colorPresets.Custom[inputColor.val()] = parseInt(inputCount.val());
        if (count < 0) {
            delete colorPresets.Custom[color];
        } else if (count != inputCount.val()) { //Not an Integer
            return;
        }
        sortColors();
        selColorPresets.val("Custom");
        makePattern();
    }
    function makePattern() {
        //colors = colorPresets[selColorPresets.val()];
        var colors = [];
        for (var color in colorPresets.Custom) {
            for (var i = 0; i < colorPresets.Custom[color]; i++) {
                colors.push(color);
            }
        }
        patterns[selPattern.val()](ctx, rangeSize.val(), colors);
    }
    publicData.resize = function(w, h){
        container.outerWidth(w);
        container.outerHeight(h);
        menu.outerWidth(container.innerWidth());
        canvas.outerWidth(container.innerWidth());
        canvas.outerHeight(container.innerHeight() - menu.outerHeight());
        canvas.attr("width", container.innerWidth());
        canvas.attr("height", container.innerHeight() - menu.outerHeight());
        makePattern();
    }
    
    var lineColor = "black";
    var bgColor = "white";
    var colorPresets = {
         "Custom": {"purple":1, "green":4, "#333": 1}
        ,"Rainbow": {
            "red":1, "orange":1, "yellow":1, "green":1,
            "blue":1, "indigo":1, "violet":1
        }
        ,"Computer_Rainbow": {
            "red":1, "green":1, "blue":1,
            "yellow":1, "magenta":1, "cyan":1
        }
        ,"Green_and_Purple": {"purple":1, "green":4, "#333": 1}
        ,"Pink_and_Purple": {"purple":1, "#f58":1, "#333": 1}
        ,"Red_and_Gold": {"red":1, "gold":2, "#222": 1}
    }
    container = $(container);
    var inputColor = $("<input value='#f58'>").on("input",makePattern);
    var inputCount = $("<input type='number' value=1 min=-1 max=100 step=1>")
                     .change(editColor);
    var selColorEdit = $("<select>").change(function() {
        selColorPresets.val("Custom");
        var color = this.value;
        var count = colorPresets.Custom[color];
        inputColor.val(color);
        inputCount.val(count);
        sortColors();
        makePattern();
    });
    var selPattern = $("<select>").click(makePattern);
    for (var i in patterns) {
        selPattern.append("<option value="+i+">"+i+"</option>");
    }
    var rangeSize = $("<input type='range' min=0 max="+1/5+" step="+1/50+">")
                    .change(makePattern);
    var selColorPresets = $("<select></select>")
                          .click(makePattern)
                          .change(function(){
                              var i = this.value;
                              colorPresets.Custom = Object.assign([],colorPresets[i]);
                              sortColors();
                              makePattern();
                          });
    for (var i in colorPresets) {
        selColorPresets.append("<option value="+i+">"+i+"</option>");
    }
    var menu = $("<div class='pattern-maker-menu'></div>")
               .append(
                       selColorEdit
                     , inputColor
                     , inputCount
                     , selPattern
                     , "Size:"
                     , rangeSize
                     , "Color Presets:"
                     , selColorPresets);
    var canvas = $("<canvas>")
                 .click(makePattern);
    var ctx = canvas[0].getContext("2d");
    container.empty().append(menu, canvas);
    sortColors();
    return publicData;
}
$(document).ready(function(){
    var maker = PatternMaker("article#pattern_maker");
    function resize() {
        var difference = $("body").outerHeight(true) + 20 - window.innerHeight;
        var w = $("body").innerWidth();
        var h = $("article#pattern_maker").outerHeight(true) - difference;
        maker.resize(w, h);
    }
    $("article.hidden").on("click", function() {
        $(this).parent().find("p").toggle();
        resize();
    });
    $(window).on("resize",resize);
    resize();
});