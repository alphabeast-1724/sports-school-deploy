import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeBanner from "@/components/WelcomeBanner";
import AnnouncementsSlider from "@/components/AnnouncementsSlider";
import ThoughtCard from "@/components/ThoughtCard";
import LeaderboardPreview from "@/components/LeaderboardPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <WelcomeBanner userFirstName="Alex" />
        <AnnouncementsSlider />
        <ThoughtCard />
        <LeaderboardPreview />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
