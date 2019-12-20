let SYARIAH_COMPLIANCE_LIST = []

fetch('./stock-list.json')
  .then(i => i.json())
  .then(list => {
    SYARIAH_COMPLIANCE_LIST = list
    browser.runtime.onMessage.addListener(onMessage)
  })

function onMessage(e) {
  console.log('>>> Get msg from content_script', e)

  browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then((tabs) => {
    for(const tab of tabs) {
      browser.tabs.sendMessage(tab.id, { list: SYARIAH_COMPLIANCE_LIST })
    }
  })
}

/*
Toggle CSS: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
//function toggleCSS(tab) {
//    console.log({ browser, tab }, document.querySelector('[data-symbol="MYX:MAYBANK"]'));
//    function gotTitle(title) {
//        console.log({ title })
//        if(title === TITLE_APPLY) {
//            browser.pageAction.setIcon({ tabId: tab.id, path: "icons/on.svg" });
//            browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_REMOVE });
//            browser.tabs.insertCSS({ code: CSS });
//        } else {
//            browser.pageAction.setIcon({ tabId: tab.id, path: "icons/off.svg" });
//            browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
//            browser.tabs.removeCSS({ code: CSS });
//        }
//    }
//
//    var gettingTitle = browser.pageAction.getTitle({ tabId: tab.id });
//    gettingTitle.then(gotTitle);
//}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
//function protocolIsApplicable(url) {
//    var anchor = document.createElement('a');
//    anchor.href = url;
//    return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
//}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
//function initializePageAction(tab) {
//    if(protocolIsApplicable(tab.url)) {
//        browser.pageAction.setIcon({ tabId: tab.id, path: "icons/off.svg" });
//        browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
//        browser.pageAction.show(tab.id);
//    }
//}

/*
When first loaded, initialize the page action for all tabs.
*/


/*
Each time a tab is updated, reset the page action for that tab.
*/
//browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
//    initializePageAction(tab);
//});

/*
Toggle CSS when the page action is clicked.
*/
//browser.pageAction.onClicked.addListener(toggleCSS);
