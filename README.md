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

2️⃣ Install dependencies
npm install

3️⃣ Configure environment

Create a .env.local file in the project root and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Visit http://localhost:3000

🔍 Folder Structure
src/
├── app/              # Next.js routes
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── integrations/     # Supabase and web3 setup
├── lib/              # Utilities and constants
└── styles/           # Tailwind config


Push to the branch (git push origin feature/new-feature)

Open a Pull Request

📜 License

This project is licensed under the MIT License
