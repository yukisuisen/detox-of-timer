const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const messageArea = document.getElementById('messageArea');
const zenChime = document.getElementById('zenChime');
const postToX = document.getElementById('postToX');

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
    // 【最重要修正】: 既に実行中のタイマーがあれば、必ずここで停止（クリア）します
    clearInterval(timerInterval); 

    startBtn.disabled = true;
    stopBtn.disabled = false;
    startBtn.textContent = 'セッション実行中...';
    postToX.style.display = 'none';

    // スマホ対応/音声再生の確実化のための処理
    zenChime.play().catch(error => {
        console.log("Audio playback was prevented. It will play on finish.");
    });
    zenChime.pause(); 
    zenChime.currentTime = 0;
    
    if (timeInSeconds < 5 * 60) {
        messageArea.innerHTML = `<p style="color: blue;">🍵 セッション再開：残り${formatTime(timeInSeconds)}からスタートします。悟りへの道はいつでも再開できます。</p>`;
    } else {
        messageArea.innerHTML = '<p style="color: blue;">🍵 儀式開始：瞑想中…。5分間、只管打坐。</p>';
    }

    // 1秒ごとに updateTimer を実行し、timerIntervalにIDを保存
    timerInterval = setInterval(updateTimer, 1000);
}

/**
 * タイマーを停止させる関数
 * @param {boolean} isManualStop - trueの場合、手動中断（ポーズ）。falseの場合、時間切れ。
 */
function stopTimer(isManualStop) {
    // 【重要】手動ストップでも時間切れでも、ここでタイマーの繰り返し実行を停止させます
    clearInterval(timerInterval);
    
    startBtn.disabled = false;
    stopBtn.disabled = true;

    if (isManualStop) {
        // 手動中断（ポーズ）の場合
        startBtn.textContent = 'セッション再開';
        messageArea.innerHTML = '<p>セッション中断：現在の時間で一時停止しました。悟りへの道はいつでも再開できます。</p>';
        postToX.style.display = 'none';
    } else {
        // 時間切れの場合
        zenChime.play(); // 効果音を鳴らす
        
        messageArea.innerHTML = '<p style="color: #3cb371; font-weight: bold;">🎉 聖域確保：お疲れ様でした。また、明日も瞑想しましょう。</p>';
        timeInSeconds = 5 * 60; // 次のスタートのために時間をリセット
        timerDisplay.textContent = formatTime(timeInSeconds);

        // --- 𝕏ポスト機能の表示 ---
        const message = "【心のデトックス完了】\n5分間のセッションが終了しました。心が整い、聖域が確保されました。";
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(message + "\n\n#心のデトックス #瞑想 #座禅 #癒し"); 
        
        postToX.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        postToX.style.display = 'block'; 
    }
}

// 初期表示をセット
timerDisplay.textContent = formatTime(timeInSeconds);

