import Carousel from "@/components/Carousel";
import Navbar from "@/components/navbar/page";
import SecondSection from "@/components/hero/Hero";
import Tutorial from "@/components/collections/Nftcards";


export default function Home() {
  return <div>
    <Navbar />
    <SecondSection />
    <Carousel />
    <Tutorial />
  </div>;
}

