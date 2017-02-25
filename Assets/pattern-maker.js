// Author: Shelby Kauth //
// Copyright: Feb 2017 //
// Version: 0.1 //
// Time Taken: 1 Night of Insomnia //
// Yes I am aware of the spaghetti code, especially around the menu creation. //
// But the whole thing is cool anyways. //

function PatternMaker(container) {
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
        if (isNaN(size) || size==0) size = ctx.canvas.height / 10;
        if (!colors || !colors.length) colors = [bgColor];
        if (!orientation) orientation = 0;
        
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
        if (id) colorPresets.Custom.splice(id,1);
        colorPresets.Custom.sort();
        var options = "<option disabled selected value=0>-----------</option>";
        for (var i in colorPresets.Custom) {
            options += "<option value="+i+">"+colorPresets.Custom[i]+"</option>";
        }
        colorRemove.empty().append(options);
    }
    function makePattern() {
        colors = colorPresets[selColorPresets.val()];
        patterns[selPattern.val()](ctx, sizeRange.val(), colors);
    }
    
    var lineColor = "black";
    var bgColor = "white";
    var mixedColors = ["purple","green","green","green","green","#333"];
    var colorPresets = {
        "Custom": ["purple","green","green","green","green","#333"]
       ,"Green_and_Purple":["purple", "green", "green", "green", "green", "#333"]
       ,"Pink_and_Purple":["#f55", "#333", "purple"]
       ,"Red_and_Gold":["red","gold","#222"]
    }
    
    container = $(container);
    var contWidth = container.width();
    var contHeight = container.height();
    var canvasWidth = contWidth;
    var canvasHeight = contHeight;
    var addColorInput = $("<input value='#f00'>").on("input",makePattern);
    var btn1 = $("<button>Add Color</button>").click(function() {
        colorPresets.Custom.push(addColorInput.val());
        sortColors();
        selColorPresets.val("Custom");
        makePattern();
    });
    var colorRemove = $("<select>").change(function() {
        addColorInput.val(colorPresets.Custom[this.value]);
        sortColors(this.value);
        selColorPresets.val("Custom");
        makePattern();
    });
    var selPattern = $("<select>").click(makePattern);
    for (var i in patterns) {
        selPattern.append("<option value="+i+">"+i+"</option>");
    }
    var sizeRange = $("<input type='range' min=0 max="+contHeight/5+" step="+contHeight/50+">")
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
    var menu = $("<div class='pattern-maker'></div>")
               .append(addColorInput
                     , btn1
                     , "Remove Color:"
                     , colorRemove
                     , selPattern
                     , "Size"
                     , sizeRange
                     , "Color Presets:"
                     , selColorPresets);
    var canvas = $("<canvas width="+canvasWidth+" height="+canvasHeight+">")
                 .click(makePattern);
    var ctx = canvas[0].getContext("2d");
    container.empty().append(menu, canvas);
    var cutoff = $("body").height() - window.innerHeight + $("p").height();
    canvasHeight = Math.max(canvasHeight-cutoff, 300);
    canvas.attr("height",  canvasHeight);
    
    canvas.click();
    sortColors();
}
$(document).ready(function(){
    PatternMaker("article");
});
