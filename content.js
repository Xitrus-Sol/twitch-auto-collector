async function loadConfig() {
    const url = chrome.runtime.getURL('config.json');
    const response = await fetch(url);
    return response.json();
}

async function findBonusButton(config) {
    const byClass = document.querySelector(`.${config.bonusButtonClass}`)?.closest('button');
    if (byClass) return byClass;

    for (const label of config.bonusButtonLabels) {
        const byAriaLabel = document.querySelector(`button[aria-label="${label}"]`);
        if (byAriaLabel) return byAriaLabel;
    }
    return null;
}

async function claimBonus(config) {
    const button = await findBonusButton(config);
    if (button) {
        button.click();
        console.log('[Twitch Auto Collector] Bonus claimed.');
    }
}

async function init() {
    const config = await loadConfig();

    await claimBonus(config);

    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => claimBonus(config), 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

init();
