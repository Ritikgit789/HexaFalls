import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Card from "./components/Card";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

// import CvResult from "./pages/CvResult";
import Cvreview from "./pages/Cvreview";
import Profile from "./pages/Profile";
import Qpgenerator from "./pages/QpGenerator";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Card />
              <HowItWorks />
              <Footer />
            </>
          }
        />
        {/* <Route path="/Interviewcall" element={<Interviewcall />} /> */}
        {/* <Route path="/CvResult" element={<CvResult />} /> */}
        <Route path="/Cvreview" element={<Cvreview />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Qpgenerator" element={<Qpgenerator />} />
      </Routes>
    </>
  );
}

export default App;
