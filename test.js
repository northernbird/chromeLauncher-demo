const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');

async function launchChrome(headless = true) {

    const targetUrl = 'https://www.google.co.jp';

    const chrome = await chromeLauncher.launch({
        port: 9222,
        chromeFlags: [
            '--disable-gpu',
            '--enable-logging',
            //headless ? '--headless' : '',
        ]
    });
    return chrome;
}

launchChrome(true).then(launcher => {

    CDP(async protocol => {

        // DevTools プロトコルから、必要なタスク部分を抽出する。
        // API ドキュメンテーション: https://chromedevtools.github.io/devtools-protocol/
        const {Page} = protocol;

        // まず、使用する Page ドメインを有効にする。
        Page.enable().then(() => {
            Page.navigate({url: 'https://www.chromestatus.com/'});

            // window.onload を待つ。
            Page.loadEventFired(() => {

                protocol.close();
                launcher.kill(); // Chrome を終了させる。

            });
        });

    }).on('error', err => {
        throw Error('Cannot connect to Chrome:' + err);
    });

});