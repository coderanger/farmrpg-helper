function extractNumbers(str) {
  const regex = /(\d+)\s*\D+(\d+)/;
  const match = str.match(regex);
  if (match) {
      return [parseInt(match[1]), parseInt(match[2])];
  } else {
      return ["No match found"];
  }
}

function trigger() {
    const questPages = document.querySelectorAll('[data-page="quests"]');
    
    const requiredItems = [];
    
    if (questPages.length > 0) {
      const links = questPages[0].querySelectorAll('a');
      const linkList = Array.from(links)
        .filter((link) => link.href.includes('quest.php?id='));
    
      linkList.forEach((linkContent) => {
        setTimeout(() => {
        const link = linkContent.href;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', link + '&referer=farmrpghelper', true);
    
    
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 400) {
            const questPageHtml = this.responseText;
            const parser = new DOMParser();
            const questPageDoc = parser.parseFromString(questPageHtml, 'text/html');
    
            const requiredItemsContainer = questPageDoc.querySelectorAll('a[href^="item.php?id="][href*="&needed="]');
            requiredItemsContainer.forEach((item) => {
              const itemName = item.textContent.trim();
              const itemString = itemName.replace(/\s+/g, " ").replace(' You have', ':');
              const quantityOfItemsOnInventory = extractNumbers(itemString)[0];
              const quantityOfItemsNeeded = extractNumbers(itemString)[1];
    
              const itemTitleElement = linkContent.querySelector('.item-title');

              if (!itemTitleElement) {
                console.warn("Element with class '.item-title' not found in the DOM.");
                return;
              }
              
              if (quantityOfItemsNeeded > quantityOfItemsOnInventory) {
                itemTitleElement.innerHTML += '<br><span style="font-size: 11px; color:yellow;"><strong>' + itemString + '</strong></span>';
              }              
            });
          }
        };
    
        xhr.onerror = function () {
          console.error(`Failed to fetch quest page: ${link}`);
        };
    
        xhr.send();
    
        }, 1000);
      });
    } else {
      console.log('No elements found with data-page="quests".');
    }
}

const callback = (mutationList, observer) => {
  let pass = 0;
  for(let mutation of mutationList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-page' && mutation.target.dataset.page === 'quests') {
      if (pass >= 1) {
        continue;
      }
      trigger();
      pass += 1;
    }
  }
};

const observer = new MutationObserver(callback);

const targetElement = document.querySelector('#fireworks');

if (targetElement) {
  observer.observe(targetElement, { attributes: true, attributeFilter: ['data-page'] });
} else {
  console.log('No element found with the specified id.');
}
