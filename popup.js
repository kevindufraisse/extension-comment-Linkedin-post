const PERIOD = 5000;

document.getElementById("autoreply-button").addEventListener("click", function() {
  var message = document.getElementById("message-input").value;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `
      var cursor = document.querySelector('.comments-comments-list__comment-item');
      var count = 0;

      function next() {
        if (count) {
          cursor = cursor.nextElementSibling;
        }
        cursor.style.backgroundColor = "red";
        cursor.scrollIntoView();
        ++count;
      }

      function reply() {
        cursor.querySelector('.reply').click();
        setTimeout(function() {
          var comment_boxes = cursor.querySelectorAll('.editor-content p');
          comment_boxes[0].textContent = "${message}";
          setTimeout(function() {
            cursor.querySelector('.comments-comment-box__submit-button').click();
            next();
          }, ${PERIOD});
        }, ${PERIOD});
      }

      function autoreply() {
        setInterval(reply, ${PERIOD * 3});
      }

      function loadMore() {
        var loadMoreButton = document.querySelector(".comments-comments-list__load-more-comments-button");
        var commentItem = document.querySelector(".comments-comments-list__comment-item");

        if (loadMoreButton && !commentItem.style.display) {
          loadMoreButton.click();
          setTimeout(loadMore, 1000);
        }
      }

      next();
      loadMore();
      autoreply();
      `
    });
  });
});
