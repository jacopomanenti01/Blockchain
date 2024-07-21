import Carousel from "@/components/carousel";
import Navbar from "./navbar/page";
import SecondSection from "./hero/page";
import Nftcards from "./collections/nftcards";


export default function Home() {
  return <div>
    <Navbar />
    <SecondSection />
    <Carousel />
    <Nftcards />
  </div>;
}
