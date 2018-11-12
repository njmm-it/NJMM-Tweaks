   if (typeof Cookies.get('hidepreheader') == 'undefined') {
    var node = document.createElement('style');
    node.innerHTML = "#preheader {display:block !important;}";
    node.id = "preheadershow";
    document.body.appendChild(node);
  }
  
  if (typeof Cookies.get('hidechangenotify') == 'undefined') {
    var node = document.createElement('style');
    node.innerHTML = "#changenotify {display:block !important;}";
    node.id = "changenotifyshow";
    document.body.appendChild(node);
  }