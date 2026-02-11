# Ledgerly

Ledgerly is an all in one real time financial planning and budgeting platform built at ScottyLabs’s TartanHacks 2026 at Carnegie Mellon University.

Ledgerly delivers proactive AI powered insights that help users avoid financial problems before they happen. Instead of reacting to overdrafts or missed payments, the system forecasts risk and recommends actions early.

Ledgerly was selected as the **favorite project at TartanHacks** by Agentuity, as highlighted in their recap  
https://agentuity.com/blog/tartanhacks-2026-recap

---

## Live Deployments

Frontend  
https://ledgerly-ui-6x8o.vercel.app  

Frontend Repo  
https://github.com/jonathandunne/Ledgerly-UI  

Backend API Swagger  
https://ledgerly-production-5bbd.up.railway.app/api/schema/swagger-ui/  

Backend Repo  
https://github.com/adilsazeez/Ledgerly  

Ledgerly AI Service  
https://d24de138e8ec378e6.agentuity.run/  

AI Repo  
https://github.com/adilsazeez/ledgerly-ai  

Pitch Deck  
https://www.canva.com/design/DAHAra4vLP8/BlTk5DMllUzUYC3TzkLPSQ/edit  

---

## What Ledgerly Does

Ledgerly connects to financial accounts and analyzes

- Transactions and spending patterns  
- Bills and subscriptions  
- Cash flow forecasts  
- Upcoming payments  
- Balance trajectories  

AI agents then surface

- Overspending alerts  
- Budget recommendations  
- Subscription cleanup suggestions  
- Low balance warnings  
- Payment timing guidance  
- Monthly projections  

---

## Business Model

Ledgerly is built around proactive financial intelligence.

Core value comes from premium AI driven forecasting and prevention tools including

- Personalized financial risk detection  
- What if spending simulations  
- Automated savings strategies  
- Smart bill timing  
- Credit health monitoring  

Future revenue paths include

- Subscription tiers  
- Payment and transfer services  
- Financial product referrals  
- B2B analytics dashboards  

The objective is simple help users save money before they lose it.

---

## Tech Stack

Frontend  
- Next.js  
- TypeScript  
- Vercel  

Backend  
- Django  
- Python  
- Railway  

Database and Auth  
- Supabase  

Financial Data  
- Plaid sandbox  

Payments  
- Ripple  

AI Agents  
- Agentuity  

# Developer Setup

This repository contains the Ledgerly frontend.

---

## Frontend Setup

### Prerequisites

- Node.js 18 or newer  
- npm or pnpm  
- Supabase project  
- Plaid sandbox credentials  
- Backend running locally or deployed  

---

### Install

```bash
git clone https://github.com/jonathandunne/Ledgerly-UI.git
cd Ledgerly-UI
npm install
```

### Environment Variables

Create a `.env.local` file

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

NEXT_PUBLIC_PLAID_ENV=sandbox
NEXT_PUBLIC_PLAID_CLIENT_ID=your_plaid_client_id
NEXT_PUBLIC_PLAID_PUBLIC_KEY=your_plaid_public_key
```

### Run

```bash
npm run dev
```
Visit http://localhost:3000

## Backend Setup

Backend repo  
https://github.com/adilsazeez/Ledgerly

---

### Prerequisites

- Python 3.10 or newer  
- pip  
- venv  

### Clone

```bash
git clone https://github.com/adilsazeez/Ledgerly.git
cd Ledgerly
```

### Setup Virtual Environment
```bash
python3 -m venv env
source env/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Environment Variables

Create a .env file in the project root
```env
DJANGO_SECRET_KEY=your_secret_key
DEBUG=True

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

DATABASE_URL=postgres_connection_string

AGENTUITY_URL=ai_service_url
```

### Run
```bash
python manage.py migrate
python manage.py runserver
```


Backend runs at http://localhost:8000

---

## Contact

For questions, demos, or collaboration reach out to:

- Jonathan Dunne    
  jonnied@umich.edu     
  https://github.com/jonathandunne
    
- James Dunne    
  dunneja@umich.edu    
  https://github.com/dunneja1

- Yuqi Sun    
  yuqisun@umich.edu    
  https://github.com/The-Real-Kevin

- Adil Sabir Azeez    
  adilsabirazeez@gmail.com    
  https://github.com/adilsazeez
