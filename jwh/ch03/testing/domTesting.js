
// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('testNodeName');
//     JWH.log.write('nodeName is: ' + document.getElementById('firefox').nodeName);
//     // JWH.log.write('Element.nodeName is:' + document.Element);
// });


// JWH.addEvent(window,'load',function () {
//     JWH.log.header('The node value of the anchor');
//     JWH.log.write('nodeValue is: ' + document.getElementById('firefox').nodeValue);
// });

// JWH.addEvent(window,'load', function  () {
//     JWH.log.header('Testing nodeType');
//     JWH.log.write('nodeType is: ' + document.getElementById('firefox').nodeType);
// });

// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('List child nodes of the document body');
//     for( var i = 0 ; i < document.body.childNodes.length ; i++ ) {
//         JWH.log.write(document.body.childNodes.item(i).nodeName);
//     }
// });

// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('Testing Attributes');
//     var firefoxAnchor = document.getElementById('firefox');
//     for(var i=0 ; i < firefoxAnchor.attributes.length ; i++) {
//         JWH.log.write(
//             firefoxAnchor.attributes.item(i).nodeName
//                 + ' = '
//                 + firefoxAnchor.attributes.item(i).nodeValue
//         );
//     }
// });

// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('Attributes And ChildNodes');

//     var h2 = document.getElementsByTagName('H2')[0];

//     JWH.log.write(h2.nodeName);
//     JWH.log.write(h2.nodeName + ' hasChildNodes: ' + h2.hasChildNodes());
//     JWH.log.write(h2.nodeName + ' childNodes: ' + h2.childNodes);
//     JWH.log.write(h2.nodeName + ' number of childNodes: ' + h2.childNodes.length);
    
//     JWH.log.write(h2.nodeName + ' attributes: ' + h2.attributes);
//     JWH.log.write(h2.nodeName + ' number of attributes: ' + h2.attributes.length);
    
//     // This line will error in MSIE
//     JWH.log.write(h2.nodeName + ' hasAttributes: ' + h2.hasAttributes());
// });

// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('Append Child');
//     var newChild = document.createElement('LI')
//     newChild.appendChild(document.createTextNode('A new list item!'));	
//     var list = document.getElementById('browserList');
//     list.appendChild(newChild);
// });


// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('Insert Before');
//     var newChild = document.createElement('LI')
//     newChild.appendChild(document.createTextNode('A new list item!'));
//     var list = document.getElementById('browserList');
//     list.insertBefore(newChild,list.lastChild);
// });



// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('Replace a node');
//     var newChild = document.createElement('LI')
//     newChild.appendChild(document.createTextNode('A new list item!'));
//     var firefoxLi = document.getElementById('opera');
//     firefoxLi.parentNode.replaceChild(newChild,firefoxLi);
// });

// JWH.addEvent(window, 'load', function() {
//     JWH.log.header('Remove a node');
//     var firefoxLi = document.getElementById('msie');
//     firefoxLi.parentNode.removeChild(firefoxLi);
// });

JWH.addEvent(window, 'load', function() {
    //JWH.log.header('Clone and Move a Node');
    var firefoxLi = document.getElementById('firefoxListItem');
    var firefoxLiClone = firefoxLi.cloneNode(true);
    var unorderedList = firefoxLi.parentNode;

    // Apped to the list
    unorderedList.appendChild(firefoxLi);
    // Append to the list
    unorderedList.appendChild(firefoxLiClone);
});

// JWH.addEvent(window,'load',function() {
//     JWH.log.header('Get Safari href attribute');
//     var safariAnchor = document.getElementById('safari');
//     var href = safariAnchor.getAttribute('href');
//     JWH.log.write(href);
// });

// JWH.addEvent(window,'load',function() {
//     JWH.log.header('Set Safari title attribute');
//     var safariAnchor = document.getElementById('safari');
//     safariAnchor.setAttribute('title','Safari is for Mac OS X');
// });

// JWH.addEvent(window,'load',function() {
//     JWH.log.header('Remove Firefox title attribute');
//     var firefox = document.getElementById('firefoxListItem');
//     firefox.removeAttribute('title');
// });

// JWH.addEvent(window,'load',function() {
//     JWH.log.header('Get all browserList elements by tag name');
//     var list = document.getElementById('browserList');
//     var ancestors = list.getElementsByTagName('*');
//     for(i = 0 ; i < ancestors.length ; i++ ) {
//         JWH.log.write(ancestors.item(i).nodeName);
//     }
// });

