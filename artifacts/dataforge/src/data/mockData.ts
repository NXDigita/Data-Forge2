export const candidate = {
  name: "Priya Kumar", initials: "PK", city: "Chennai, TN",
  tier: "Expert", tfes: 84, xp: 4320, xpTarget: 6000,
  simulations: 47, accuracy: 91.2, badges: 7, earned: "₹1.24L"
}

export const skills = [
  {name:"Python", score:88},    {name:"SQL", score:82},
  {name:"ML Modelling", score:90}, {name:"Statistics", score:78},
  {name:"Deep Learning", score:65},{name:"MLOps", score:58}
]

export const challenges = [
  {id:"ML-CHURN-003", title:"Customer Churn Prediction",
   domain:"ML", reward:"₹8,500", xp:290, badge:"ML Classification Expert",
   status:"in_progress", difficulty:"Intermediate",
   dataset:{file:"telecom_churn.csv",rows:7043,features:21},
   models:["XGBoost","Random Forest","Logistic Regression"],
   criteria:{auc:0.88, f1:0.80, balanced:true, shap:true},
   bestResult:{model:"XGBoost",auc:0.921,f1:0.861,acc:0.882,
               precision:0.874,recall:0.849,score:88}},
  {id:"NLP-SENT-007", title:"Twitter Sentiment BERT",
   domain:"NLP", reward:"₹11,000", xp:340, status:"not_started",
   difficulty:"Advanced"},
  {id:"TS-FORE-002", title:"Walmart Sales Forecast",
   domain:"Time Series", reward:"₹9,500", xp:310, status:"not_started",
   difficulty:"Intermediate"},
  {id:"ML-FRAUD-005", title:"Credit Card Fraud Detection",
   domain:"ML", reward:"₹7,800", xp:270, status:"not_started",
   difficulty:"Intermediate"}
]

export const badgeData = [
  {emoji:"🧠",name:"ML Modelling",score:91,level:"Expert",hash:"0x9f3a...d21c",chain:"Polygon PoS",color:"purple"},
  {emoji:"📊",name:"EDA & Statistics",score:88,level:"Expert",hash:"0x4b2e...f87a",chain:"Polygon PoS",color:"green"},
  {emoji:"🔍",name:"NLP Pipelines",score:84,level:"Practitioner",hash:"0x7c1d...b93f",chain:"Polygon PoS",color:"blue"},
  {emoji:"⏱",name:"Time Series",score:82,level:"Practitioner",hash:"0x2a8f...c14e",chain:"Polygon PoS",color:"teal"},
  {emoji:"🧬",name:"Feature Engineering",score:87,level:"Expert",hash:"0x6e3b...a29d",chain:"Polygon PoS",color:"green"},
  {emoji:"🔐",name:"MLOps Fundamentals",score:71,level:"Apprentice",hash:"0x1f9c...d78b",chain:"Polygon PoS",color:"amber"}
]

export const simulationRuns = [
  {project:"Customer Churn XGBoost", domain:"ML", score:88, metric:"AUC 0.921", date:"May 3, 2026", status:"Minted"},
  {project:"Twitter Sentiment BERT", domain:"NLP", score:85, metric:"F1 0.883", date:"Apr 28, 2026", status:"Minted"},
  {project:"Walmart Sales Forecast", domain:"Time Series", score:82, metric:"MAPE 4.2%", date:"Apr 15, 2026", status:"Minted"},
  {project:"Fraud Detection RF", domain:"ML", score:79, metric:"Precision 0.94", date:"Apr 2, 2026", status:"Minted"},
  {project:"Churn SMOTE Baseline", domain:"ML", score:74, metric:"AUC 0.843", date:"Mar 19, 2026", status:"Minted"},
]

export const heatmapData = (() => {
  const data: {week: number; day: number; count: number}[] = [];
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const r = Math.random();
      data.push({week: w, day: d, count: r < 0.5 ? 0 : r < 0.7 ? 1 : r < 0.85 ? 2 : r < 0.95 ? 3 : 4});
    }
  }
  return data;
})();

export const terminalLines = [
  {type:"li", text:"$ dataforge simulate --project churn-telecom --all-models"},
  {type:"li", text:"Initializing DataForge CIE Engine v2.0..."},
  {type:"ls", text:"✓ Challenge ML-CHURN-003 loaded"},
  {type:"ls", text:"✓ Dataset fetched: telecom_churn.csv (7,043 × 21)"},
  {type:"li", text:"── Stage 1: Data Validation ──────────────────────"},
  {type:"ls", text:"✓ Schema validated: 20 features + 1 target"},
  {type:"lv", text:"Missing values: TotalCharges → 11 rows → imputed"},
  {type:"lw", text:"⚠ Class imbalance: Churn=Yes 26.5% / No 73.5%"},
  {type:"ls", text:"✓ Data quality score: 94/100"},
  {type:"li", text:"── Stage 2: Exploratory Data Analysis ────────────"},
  {type:"lv", text:"Correlation heatmap: tenure ↔ TotalCharges = 0.83"},
  {type:"lv", text:"High-value features: tenure, Contract, MonthlyCharges"},
  {type:"lw", text:"Multicollinearity detected: TotalCharges ~ tenure×Charges"},
  {type:"ls", text:"✓ EDA complete — 9 statistical summaries generated"},
  {type:"li", text:"── Stage 3: Feature Engineering ─────────────────"},
  {type:"ls", text:"✓ Label encoding: 16 categorical columns"},
  {type:"ls", text:"✓ SMOTE: minority upsampled → balanced 50/50"},
  {type:"lv", text:"Final feature matrix: 7,043 rows × 24 features"},
  {type:"ls", text:"✓ Train/test split 80/20 · stratified · seed=42"},
  {type:"li", text:"── Stage 4: Model Training ───────────────────────"},
  {type:"lv", text:"Training Logistic Regression... C=1.0 max_iter=1000"},
  {type:"ls", text:"✓ LR: Accuracy=0.814 · F1=0.792 · AUC=0.843"},
  {type:"lv", text:"Training Random Forest... n_estimators=200 depth=12"},
  {type:"ls", text:"✓ RF: Accuracy=0.869 · F1=0.842 · AUC=0.898"},
  {type:"lv", text:"Training XGBoost... lr=0.05 n_est=300 depth=6"},
  {type:"ls", text:"✓ XGB: Accuracy=0.882 · F1=0.861 · AUC=0.921 ← BEST"},
  {type:"li", text:"── Stage 5: Evaluation ──────────────────────────"},
  {type:"ls", text:"✓ Best model: XGBoost (auto-selected by AUC)"},
  {type:"lv", text:"Precision=0.874 · Recall=0.849 · F1=0.861"},
  {type:"lv", text:"Confusion: TP=547 FP=79 FN=97 TN=686"},
  {type:"lv", text:"SHAP values: tenure=0.28 · MonthlyCharges=0.21"},
  {type:"ls", text:"✓ All 5 acceptance criteria PASSED"},
  {type:"li", text:"── Stage 6: Certification ────────────────────────"},
  {type:"lt", text:"Score: 88/100"},
  {type:"ls", text:"✓ sha256:a9f3c14e...b82d — CIE Engine certified"},
  {type:"ls", text:"✓ NFT minted: \"ML Classification Expert\" · Polygon PoS"},
  {type:"lv", text:"Token: 0x9f3a...d21c · Block: 47,821,093"},
  {type:"ls", text:"✓ TFES: 79 → 84 (+5) · XP: +290"},
  {type:"lt", text:"✅ SIMULATION COMPLETE — PASSED · 88/100 · 3.56s"},
]