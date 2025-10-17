CrossChain Analytics Dashboard

A modern Web3 analytics dashboard that tracks your wallet activity across chains — built with Next.js, RainbowKit, Wagmi, Supabase, and Tailwind CSS.

Users can connect their wallet to view realtime stats like total transactions, tokens sent and received, average gas fee, and recent recipients.

🚀 Features

🔗 Cross-chain analytics — supports multiple EVM networks

⚡ Realtime data sync with Supabase

💼 Wallet connect using RainbowKit + Wagmi

📊 Interactive charts (powered by Recharts)

🧾 Transaction history with sender/receiver tracking

🧑‍🤝‍🧑 Recipient management — saves frequently used addresses

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14, React, Tailwind CSS
Web3 Integration	RainbowKit, Wagmi
Backend / Database	Supabase (PostgreSQL + Realtime)
Charts	Recharts
UI Components	Shadcn/UI, Lucide Icons
⚙️ Setup Instructions
1️⃣ Clone the repo
git clone https://github.com/yourusername/crosschain-analytics.git
cd crosschain-analytics

2️⃣ Install dependencies
npm install

3️⃣ Configure environment

Create a .env.local file in the project root and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

🗄️ Database Setup

Run these SQL commands inside your Supabase SQL Editor to create your tables and enable realtime:

-- Transactions Table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  token TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  chain_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  gas_fee NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  block_number BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipients Table
CREATE TABLE public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  nickname TEXT,
  transaction_count INTEGER DEFAULT 1,
  last_transaction_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_address, recipient_address)
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

🧩 Development

Run the dev server:

npm run dev


Visit http://localhost:3000

🔍 Folder Structure
src/
├── app/              # Next.js routes
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── integrations/     # Supabase and web3 setup
├── lib/              # Utilities and constants
└── styles/           # Tailwind config

🤝 Contributing

Fork the project

Create your feature branch (git checkout -b feature/new-feature)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature/new-feature)

Open a Pull Request

📜 License

This project is licensed under the MIT License