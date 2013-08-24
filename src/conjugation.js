
var s = document.createElement('style');
s.setAttribute('type', 'text/css');
s.innerText =
  'table {'+
  '  margin-left : -10000px;'+
  '}';
(document.head||document.documentElement).appendChild(s);


function buildQuizForm(pairs) {
  return $(
    '<form id="present">'+
    '  <table>'+
      _(" <% _(pairs).each(function (pair) { %>"+
      " <tr> "+
      "   <td> <%=pair[0]%> </td>"+
      "   <td> <input type=\"text\" name=\"<%=pair[0]%>\"/> </td>"+
      "   <td> <span class=\"correct\" id=\"<%=pair[0]%>\"></span> </td>"+
      " </tr>"+
      " <% }) %>").template({pairs:pairs})+
    '  </table>'+
    '<br/>'+
    '<input type="submit" value="Check"/>'+
    '</form>'
  );
}

$(document).ready(function () {
  var presentSpans = $('span').filter(function () {
    return $(this).text() == "Present";
  });

  //
  // Add curtain to hide the answers
  //
  var curtain = $('<div></div>')
    .attr('id','quizcurtain')
    .css({
      position : 'absolute',
      left : '0px',
      'top' : '0px',
      width : '100%',
      height : '100%',
      background : 'white'
    });

  $('body').append(curtain);

  //
  // Extract verb conjugations for Present
  //
  var conjSpans = $(presentSpans[0]).parent()
    .find('span[class="conjuguaison"]')

  var conjParts = _(conjSpans).map(function (conjspan) {
    var sentence = $(conjspan.previousSibling).text() + $(conjspan).text();
    return sentence.trim().split(/\s+/);
  });


  var quizForm = buildQuizForm(conjParts);
  quizForm.find('table').css({
    'margin-left' : '0px'
  });
  var conjMap = {};
  _(conjParts).each(function (part) {
    conjMap[part[0]] = part[1];
  });
  curtain.append(quizForm);

  quizForm.submit(function () {
    try {
      _($(this).find('input[type="text"]')).each(function (elem) {
        var key = $(elem).attr('name');
        var answer = $(elem).val();
        if(conjMap[key] == answer) {
          $(elem).css('background','#aaffaa');
        } else {
          $(elem).css('background','#ffaaaa');
          var correctElem = quizForm.find('span.correct[id='+key+']');
          $(correctElem).text(conjMap[key]);
        }
      });
    } catch(e) {
      console.log(e);
    }
    return false;
  });
});
