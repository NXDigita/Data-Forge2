import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import CommandCenter from "./pages/CommandCenter";
import SimulationLab from "./pages/SimulationLab";
import Portfolio from "./pages/Portfolio";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Playground from "./pages/Playground";
import { PlaygroundProvider } from "./context/PlaygroundContext";
import { GameProvider } from "./context/GameContext";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard">
        <Layout>
          <CommandCenter />
        </Layout>
      </Route>
      <Route path="/simulation/:id">
        {(params) => (
          <Layout>
            <SimulationLab />
          </Layout>
        )}
      </Route>
      <Route path="/portfolio">
        <Layout>
          <Portfolio />
        </Layout>
      </Route>
      <Route path="/challenges">
        <Layout>
          <Challenges />
        </Layout>
      </Route>
      <Route path="/leaderboard">
        <Layout>
          <Leaderboard />
        </Layout>
      </Route>
      <Route path="/profile">
        <Layout>
          <Profile />
        </Layout>
      </Route>
      <Route path="/playground">
        <Layout>
          <Playground />
        </Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <PlaygroundProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </PlaygroundProvider>
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
