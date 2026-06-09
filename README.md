# IoT Workshop Interactive Microsite (Social Engineering Simulation)

A mobile-first, real-time interactive web application built to serve as an engaging introduction for an IoT/PCB design workshop. Disguised as a premium event registration and "lucky draw" system, the app's true purpose is to demonstrate the principles of **Social Engineering** and data privacy awareness.

## 🎯 Concept & Psychology
This application utilizes **Reward Psychology** and **Anticipation** to encourage users to willingly hand over permissions (like camera access) and personal information. 
- **Premium Aesthetics:** Clean, modern, "university-level" design builds trust.
- **Micro-interactions:** Smooth animations (Framer Motion) keep users engaged.
- **Suspense Building:** The "Lottery" stage simulates network latency and system checks to heighten anticipation before the final reveal.
- **The Reveal:** After collecting data, the system reveals it was a simulation to teach participants about digital footprints and privacy in IoT product design.

## 🚀 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Animations:** Framer Motion
- **Real-time Server:** Socket.IO + Bun
- **State Management:** RAM-only in-memory storage (No Database)
- **Language:** TypeScript

## 📂 Project Structure
```text
├── app/
│   ├── admin/       # Real-time control panel for the speaker/admin
│   ├── globals.css  # Global styles (Includes custom viewport scaling for mobile)
│   ├── layout.tsx   # Root layout with Thai Google Fonts (Kanit)
│   └── page.tsx     # Main participant flow rendering
├── components/
│   ├── stages/      # Individual screen components (Join, Address, Lottery, Reveal, etc.)
│   └── ui/          # Reusable UI components (Buttons, Cards, Modals, Carousels)
├── hooks/
│   └── useSocket.ts # Custom hook for Socket.IO client connections
├── server/
│   └── store.ts     # In-memory RoomManager and state definitions
├── server.ts        # Custom Bun + Socket.IO server entry point
└── types/           # Shared TypeScript interfaces (Stages, Participants)
```

## 🛠️ Installation & Setup

1. **Install dependencies:**
   We use `bun` as the primary runtime and package manager.
   ```bash
   bun install
   ```

2. **Run the development server:**
   Because this project uses a custom Socket.IO server alongside Next.js, we run a custom `server.ts` entry point instead of standard `next dev`.
   ```bash
   bun run dev
   ```

3. **Access the application:**
   - **Participant View:** `http://localhost:3000`
   - **Admin Dashboard:** `http://localhost:3000/admin`

## 🎮 How to use the system

### For Participants
Participants simply scan a QR code or visit the main URL on their mobile devices. They will be guided through a series of stages controlled entirely by the Admin. The UI automatically scales down to fit perfectly on small screens (`<= 425px`) without scrolling.

### For the Admin / Speaker
Open the `/admin` route on a tablet or laptop. From here, you can:
- See the live count of joined participants.
- **Change Stages:** Move everyone simultaneously through the flow (Expectations -> Photo -> Address -> Lottery).
- **Force Complete:** Manually approve participants who might be stuck.
- **Force Reveal:** Instantly jump all users to the final educational reveal page.
- **Reset Room:** Clear all in-memory data for the next batch of students.

## 🔒 Security & Privacy Notice
- **No Persistence:** This system operates entirely in RAM. If the server restarts, all data vanishes.
- **No File Storage:** Images uploaded in the "Photo Stage" are converted to base64 and held in memory temporarily just to show completion. They are never saved to disk.
- **Educational Use:** The project is strictly for educational demonstrations of privacy concepts.
