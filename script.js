// DOM 元素
const form = document.querySelector('.search-form');
const routeNameInput = document.getElementById('routeName');
const stopNameInput = document.getElementById('stopName');
const resultDiv = document.getElementById('result');

// API URL
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwfJ-wGjTTzdhtbfBnNhrzdi2vcdmkFKvqvuVYAlAmc__3bhDibxezFMrqBWex8OBQL2Q/exec';

// 顯示結果的函數
function showResult(message, isError = false) {
  resultDiv.textContent = message;
  resultDiv.className = `result active ${isError ? 'error' : 'success'}`;
}

// 格式化巴士資訊
function formatBusInfo(routeName, results) {
  const header = `<h2>路線：${routeName}</h2>`;
  const busInfo = results.map(result => `
    <div class="bus-info">
      <div>方向：${result.direction}</div>
      <div>到站時間：${result.timeText}</div>
    </div>
  `).join('');
  return header + busInfo;
}

// 處理表單提交
async function handleSubmit(event) {
  event.preventDefault();
  
  const routeName = routeNameInput.value.trim();
  const stopName = stopNameInput.value.trim();
  
  if (!routeName || !stopName) {
    showResult('請輸入完整的路線和站牌資訊！', true);
    return;
  }
  
  // 顯示載入中狀態
  showResult('查詢中...');
  
  try {
    const response = await fetch(
      `${API_BASE_URL}?routeName=${encodeURIComponent(routeName)}&stopName=${encodeURIComponent(stopName)}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      showResult(data.error, true);
      return;
    }
    
    const results = data.results || [];
    if (results.length > 0) {
      resultDiv.innerHTML = formatBusInfo(results);
      resultDiv.className = 'result active success';
    } else {
      showResult('查無到站資訊！', true);
    }
    
  } catch (error) {
    console.error('API 請求失敗:', error);
    showResult('發生錯誤，請稍後再試！', true);
  }
}
// 綁定表單提交事件
form.addEventListener('submit', handleSubmit);
