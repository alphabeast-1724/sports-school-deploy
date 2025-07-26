import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeBanner from "@/components/WelcomeBanner";
import AnnouncementsSlider from "@/components/AnnouncementsSlider";
import ThoughtCard from "@/components/ThoughtCard";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <WelcomeBanner userFirstName={user?.firstName || "Student"} />
        <AnnouncementsSlider />
        <ThoughtCard />
        <LeaderboardPreview />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;