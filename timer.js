const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const messageArea = document.getElementById('messageArea');
const zenChime = document.getElementById('zenChime'); // オーディオ要素を取得
const postToX = document.getElementById('postToX'); // Xポストボタンを取得

let timeInSeconds = 5 * 60; // 初期設定（5分）
let timerInterval;

// 時間を「分:秒」形式に整形する関数
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 1秒ごとに実行される関数
function updateTimer() {
    timeInSeconds--;
    timerDisplay.textContent = formatTime(timeInSeconds);

    if (timeInSeconds <= 0) {
        stopTimer(false); // 時間切れで停止
    }
}

// タイマーを開始させる関数
function startTimer() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    startBtn.textContent = 'セッション実行中...';
    postToX.style.display = 'none'; // タイマー開始時はポストボタンを非表示にする

    // 【スマホ対応/音声再生の確実化のための処理】
    // ユーザー操作時に一度音を再生・ポーズさせ、モバイル環境での制限を解除する
    zenChime.play().catch(error => {
        // 自動再生エラーをキャッチするが、ここでは無視してOK。
        // エラーが発生しても、この操作自体がブラウザの再生許可トリガーになります。
        console.log("Audio playback was prevented. It will play on finish.");
    });
    zenChime.pause(); 
    zenChime.currentTime = 0; // 再生開始位置を0に戻す
    // -------------------------------------------------------------------
    
    if (timeInSeconds < 5 * 60) {
        messageArea.innerHTML = `<p style="color: blue;">🍵 セッション再開：残り${formatTime(timeInSeconds)}からスタートします。悟りへの道はいつでも再開できます。</p>`;
    } else {
        messageArea.innerHTML = '<p style="color: blue;">🍵 儀式開始：瞑想中…。5分間、只管打坐。</p>';
    }

    // 1秒ごとに updateTimer を実行
    timerInterval = setInterval(updateTimer, 1000);
}

/**
 * タイマーを停止させる関数
 * @param {boolean} isManualStop - trueの場合、手動中断（ポーズ）。falseの場合、時間切れ。
 */
function stopTimer(isManualStop) {
    clearInterval(timerInterval);
    
    startBtn.disabled = false;
    stopBtn.disabled = true;

    if (isManualStop) {
        // 手動中断（ポーズ）の場合
        startBtn.textContent = 'セッション再開';
        messageArea.innerHTML = '<p>セッション中断：現在の時間で一時停止しました。悟りへの道はいつでも再開できます。</p>';
        postToX.style.display = 'none'; // 手動中断時はボタン非表示
    } else {
        // 時間切れの場合
        zenChime.play(); // 効果音を鳴らす
        
        messageArea.innerHTML = '<p style="color: #3cb371; font-weight: bold;">🎉 聖域確保：お疲れ様でした。また、明日も瞑想しましょう。</p>';
        timeInSeconds = 5 * 60; // 次のスタートのために時間をリセット
        timerDisplay.textContent = formatTime(timeInSeconds);

        // --- 【𝕏ポスト機能の追加】 ---
        const message = "【心のデトックス完了】\n5分間のセッションが終了しました。心が整い、聖域が確保されました。今日も日々是好日。";
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(message + "\n\n#心のデトックス #瞑想 #日々是好日"); // ハッシュタグもメッセージに追加
        
        // X Web Intent URLを生成
        postToX.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        postToX.style.display = 'block'; // ポストボタンを表示
        // --- 【𝕏ポスト機能の追加ここまで】 ---
    }
}

// 初期表示をセット
timerDisplay.textContent = formatTime(timeInSeconds);
