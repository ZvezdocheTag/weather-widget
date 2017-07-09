(function() {
    var ready = function() {
        var widget_block = document.querySelector('.widget-weather');
        var iframe = document.createElement('iframe');
        //link
        iframe.setAttribute('src', widget_block.href + "/widget.html");
        iframe.setAttribute('width', '300');
        iframe.setAttribute('height', '240');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');

        // check actual
        widget_block.parentNode.replaceChild(iframe, widget_block);
    }
    document.addEventListener("DOMContentLoaded", ready);
})