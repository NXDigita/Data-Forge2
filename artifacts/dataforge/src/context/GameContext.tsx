import { createContext, useContext, useState, ReactNode } from "react";

interface Submission {
  challengeId: string;
  score: number;
  xpEarned: number;
  submittedAt: number;
}

interface GameContextType {
  submissions: Submission[];
  submitChallenge: (id: string, score: number, xpEarned: number) => void;
  isSubmitted: (id: string) => boolean;
  userXP: number;
  userSimulations: number;
  userRank: number;
  userTFES: number;
}

const GameContext = createContext<GameContextType | null>(null);

const BASE_XP = 4320;
const BASE_SIMS = 47;
const BASE_RANK = 6;
const BASE_TFES = 84;

export function GameProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const submitChallenge = (id: string, score: number, xpEarned: number) => {
    if (submissions.find((s) => s.challengeId === id)) return;
    setSubmissions((prev) => [...prev, { challengeId: id, score, xpEarned, submittedAt: Date.now() }]);
  };

  const isSubmitted = (id: string) => submissions.some((s) => s.challengeId === id);
  const totalXP = submissions.reduce((sum, s) => sum + s.xpEarned, 0);
  const count = submissions.length;

  return (
    <GameContext.Provider value={{
      submissions,
      submitChallenge,
      isSubmitted,
      userXP: BASE_XP + totalXP,
      userSimulations: BASE_SIMS + count,
      userRank: Math.max(1, BASE_RANK - count),
      userTFES: BASE_TFES + count * 2,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
