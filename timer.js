const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const messageArea = document.getElementById('messageArea');
const zenChime = document.getElementById('zen_Chime'); // オーディオ要素を取得

let timeInSeconds = 5 * 60; // 初期設定（5分）
let timerInterval;

// 【修正：この関数が欠落していました】
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
    } else {
        // 時間切れの場合
        zenChime.play(); // 効果音を鳴らす
        
        messageArea.innerHTML = '<p style="color: #3cb371; font-weight: bold;">🎉 聖域確保：お疲れ様でした。また、明日も瞑想しましょう。</p>';
        timeInSeconds = 5 * 60; // 次のスタートのために時間をリセット
        timerDisplay.textContent = formatTime(timeInSeconds);
    }
}

// 【修正：この関数が欠落していました】
function startTimer() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    startBtn.textContent = 'セッション実行中...';
    
    if (timeInSeconds < 5 * 60) {
        messageArea.innerHTML = `<p style="color: blue;">🍵 セッション再開：残り${formatTime(timeInSeconds)}からスタートします。悟りへの道はいつでも再開できます。</p>`;
    } else {
        messageArea.innerHTML = '<p style="color: blue;">🍵 儀式開始：デジタルデバイスを遠ざけ、お好きな飲み物を一口飲みましょう。味覚に集中してみてください。</p>';
    }
    
    timerInterval = setInterval(() => {
        timeInSeconds--;
        timerDisplay.textContent = formatTime(timeInSeconds);

        if (timeInSeconds <= 0) {
            stopTimer(false); 
        }
    }, 1000);
}

// イベントリスナー
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', () => stopTimer(true)); 

// 初期表示

timerDisplay.textContent = formatTime(timeInSeconds);
