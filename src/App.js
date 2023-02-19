import './App.css';
import Home from './pages/home/Home';
import {
  Route,
  Routes
} from 'react-router-dom';
import 'aos/dist/aos.css';
import AddCreator from './pages/add_creator/AddCreator'
import AddLearner from './pages/add_learner/AddLearner'
import CreateCourse from './pages/create_course/CreateCourse';
import ExploreCourse from './pages/explore_courses/ExploreCourse';
import "@rainbow-me/rainbowkit/styles.css";
import { ToastContainer } from 'react-toastify';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme 
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import CreatorDashboard from './pages/creator_dashboard/CreatorDashboard';
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import "react-toastify/dist/ReactToastify.css";
import 'boxicons';
import AddVideo from './pages/add_video/AddVideo';
import LearnerCourses from './pages/learner_courses/LearnerCourses';
import { useContext } from 'react';
import Auth from './context/Auth';
import * as Push from "@pushprotocol/restapi";

const { chains, provider } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: '2df1219b-52f9-43bb-b5cb-bd8d7b9998a8',
  }),
});

function App() {

  const {address} = useContext(Auth)

  return (
    <LivepeerConfig client={livepeerClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({
          accentColor: '#7b3fe4',
          accentColorForeground: 'white',
          borderRadius: 'medium'
        })}>
          
          <div className="App"> 
            <Routes>

              <Route exact path="/" element={<Home />} />
              <Route exact path="/creator" element={<AddCreator />} />
              <Route exact path="/create_course" element={<CreateCourse />} />
              <Route exact path="/add_vid" element={<AddVideo />} />
              <Route exact path="/learner" element={<AddLearner />} />
              <Route exact path="/explore" element={<ExploreCourse />} />
              <Route exact path="/dashboard" element={<CreatorDashboard />} />
              <Route exact path="/learner_courses" element={<LearnerCourses />} />

            </Routes>                    
          </div>    
          <ToastContainer autoClose={4000} />
        </RainbowKitProvider>
      </WagmiConfig>
    </LivepeerConfig>
  );
}

export default App;
