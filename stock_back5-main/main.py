from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from statsmodels.tsa.statespace.sarimax import SARIMAX
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# 폰트 깨찜 방지용 코드입니다.
plt.rcParams['font.family'] = 'Malgun Gothic'  # Windows
# plt.rcParams['font.family'] = 'AppleGothic'  # macOS
plt.rcParams['axes.unicode_minus'] = False    

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (React와 연동)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메서드 허용 (POST, GET, OPTIONS 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# 한글 이름과 티커 매핑
NAME_TO_TICKER = {
   "SK하이닉스": "000660.KQ",
    "삼성전자": "005930.KS", 
    "TSLA": "TSLA", # 미국 주식 예시
}

def get_ticker_from_name(name: str) -> str:
    return NAME_TO_TICKER.get(name, name)  # 매핑에 없으면 그대로 반환

class StockRequest(BaseModel):
    stock_name: str


@app.post("/api/stock-analysis")
async def stock_analysis(data: StockRequest):

    stock_name = data.stock_name
    ticker_symbol = get_ticker_from_name(stock_name)
   
 # 한글 이름을 티커(symbol)로 변환
        # stock_name = get_ticker_from_name(data.stock_name)
        # 데이터를 시작 날짜와 종료 날짜로 필터링하여 가져오기
         # 데이터를 가져오기
    
    #df = ticker.history(period="5y")
    try:
        ticker = yf.Ticker(ticker_symbol)
        df = ticker.history(period="5y")
        if df.empty:
            raise HTTPException(status_code=404, detail=f"'{stock_name}'에 대한 데이터를 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터 가져오기 오류: {str(e)}")
    
    if df.empty:
        raise HTTPException(status_code=404, detail=f"'{stock_name}'에 대한 데이터를 찾을 수 없습니다.")
# 월별 데이터 계산
    df['Month'] = df.index.to_period('M')
    monthly_data = df.groupby('Month').agg({'Close': 'mean'}).reset_index()
    monthly_data['Month'] = monthly_data['Month'].astype(str)
    #  # 통계 계산
    # mean = monthly_data['Close'].mean()
    # std = monthly_data['Close'].std()

    # SARIMAX 모델로 예측
    # model = SARIMAX(monthly_data['Close'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    # model_fit = model.fit(disp=False)
    # forecast = model_fit.forecast(steps=12)
    # forecast_index = pd.date_range(
    #     start=pd.to_datetime(monthly_data['Month'].iloc[-1]) + pd.DateOffset(months=1),
    #     periods=12,
    #     freq='M'
    # )

    # forecast_df = pd.DataFrame({
    #     "Month": forecast_index.strftime('%Y-%m'),
    #     "Prediction": forecast
    # })
    # prediction_merged = pd.concat([
    #     monthly_data[['Month', 'Close']],
    #     forecast_df.rename(columns={"Prediction": "Close"})
    # ]).reset_index(drop=True)
    try:
        model = SARIMAX(monthly_data['Close'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
        model_fit = model.fit(disp=False)
        forecast = model_fit.forecast(steps=12)

        forecast_index = pd.date_range(
            start=pd.to_datetime(monthly_data['Month'].iloc[-1]) + pd.DateOffset(months=1),
            periods=12,
            freq='M'
        )

        forecast_df = pd.DataFrame({
            "Month": forecast_index.strftime('%Y-%m'),
            "Prediction": forecast,
        })

        # 예측값을 기존 데이터와 병합
        monthly_data = pd.concat([
            monthly_data,
            forecast_df.rename(columns={"Prediction": "Close"})  # 예측 데이터를 추가
        ]).reset_index(drop=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"예측 오류: {str(e)}")
    # 그래프 생성
    plt.figure(figsize=(10, 6))
    plt.plot(monthly_data['Month'], monthly_data['Close'], label="종가", marker='o')
    plt.plot(forecast_df['Month'], forecast_df['Prediction'], label="예측값", linestyle='--')
    plt.xticks(rotation=45)
    plt.legend()
    plt.title(f"{stock_name} 월별 종가 및 예측값")
    plt.tight_layout()
    # 그래프를 base64로 변환하여 반환
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()

    return {
        "monthly_data": monthly_data.to_dict(orient="records"),  # 실제 월별 데이터
        "forecast_data": forecast_df.to_dict(orient="records"),  # 예측 데이터
        "stats": {
            "mean": monthly_data['Close'].mean(),
            "std": monthly_data['Close'].std(),
        },
        "graph": img_str,
    }
