import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import "./App.css";
import MainDashboard from "./components/MainDashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { scrollSepolia, scroll } from "wagmi/chains";
const chains = [scroll, scrollSepolia];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY", // or infuraId
    walletConnectProjectId: "4c1fb4009a66dfd6a5f0c2babec3254b",
    chains,

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const App = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="retro">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/chat-dashboard" element={<MainDashboard />}></Route>
          </Routes>
        </BrowserRouter>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
export default App;
