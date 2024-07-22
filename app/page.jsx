import Carousel from "../components/carousel";
import Navbar from "../components/navbar/page";
import SecondSection from "../components/hero/page";
import Nftcards from "../components/collections/nftcards";


export default function Home() {
  return <div>
    <Navbar />
    <SecondSection />
    <Carousel />
    <Nftcards />
  </div>;
}
