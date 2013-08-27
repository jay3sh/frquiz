
//
// Hide all the answers out of the visible space
//
var disable = false;

if(!disable) {
  var s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  s.innerText =
    'table {'+
    '  margin-left : -10000px;'+
    '}';
  (document.head||document.documentElement).appendChild(s);
}


function buildQuizForm(pairs) {
  return $(
    '<form id="present">'+
    '  <h3>Present</h3>'+
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
    '<a href="#" class="actionButton" id="checkConj">Check</a>'+
    '</form>'
  );
}

$(document).ready(function () {
  if(disable) { return; }
  var presentSpans = $('span').filter(function () {
    return $(this).text() == "Present";
  });

  var verbTitlePrefix = $('span').filter(function () {
    return /.*CONJUGATION OF VERB.*/.test($(this).text());
  });
  var verbString = $(verbTitlePrefix).parent().text().replace(/[\r\n]/g,'');
  var mainVerb = verbString.split(':')[1];

  //
  // Add curtain to hide the answers
  //
  var curtain = $('<div></div>')
    .attr('id','quizcurtain')
    .css({
      position   : 'absolute',
      left       : '0px',
      'top'      : '0px',
      width      : '100%',
      height     : '100%',
      background : 'white'
    });

  curtain.append($(
    '<div class="github-fork-ribbon-wrapper right">'+
    ' <div class="github-fork-ribbon">'+
    '   <a href="#">Fr Quiz</a>'+
    ' </div>'+
    '</div>'));

  $('body').append(curtain);

  //
  // Add main verb to title
  //
  curtain.append($('<h2>'+mainVerb+'</h2>'));

  //
  // Extract verb conjugations for Present
  //
  var conjSpans = $(presentSpans[0]).parent()
    .find('span[class="conjuguaison"]')

  var conjParts = _(conjSpans).map(function (conjspan) {
    var sentence = $(conjspan.previousSibling).text() + $(conjspan).text();
    return sentence.trim().split(/\s+/);
  });


  // Add Quiz form to curtain
  var quizForm = buildQuizForm(conjParts);
  var conjMap = {};
  _(conjParts).each(function (part) {
    conjMap[part[0]] = part[1];
  });
  curtain.append(quizForm);

  curtain.find('#checkConj').data('state','check');

  curtain.find('#checkConj').click(function () {
    if($(this).data('state') == 'check') {
      try {
        _(quizForm.find('input[type="text"]')).each(function (elem) {
          var key = $(elem).attr('name').toLowerCase();
          var answer = $(elem).val().toLowerCase();
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
      $(this).data('state','next');
      $(this).text('Next');
    } else if($(this).data('state') == 'next') {
      var randomIndex = Math.round(Math.random() * COMMON_VERB_LIST.length);
      var randomVerb = COMMON_VERB_LIST[randomIndex]
      window.location.href =
        'http://www.conjugation-fr.com/conjugate.php?verb='+randomVerb;
    }
  });

  // Add restore-original-webpage link to curtain
  /*
  var restore = $('<a href="#" id="restore">Original Webpage</a>');
  curtain.append(restore);
  restore.click(function () {
    curtain.hide();
    $('body table').css('margin-left','0px');
  });

  curtain.append($('<br/><br/>'));
  */

  // Add link to new random verb
  /*
  var randomIndex = Math.round(Math.random() * COMMON_VERB_LIST.length);
  var randomVerb = COMMON_VERB_LIST[randomIndex]
  var randomVerbHtml =
    $('<a href="http://www.conjugation-fr.com/conjugate.php?verb='+
    randomVerb + '" class="actionButton" id="newverb">Next</a>');
  curtain.append(randomVerbHtml);
  */

});
