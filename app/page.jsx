import Carousel from "../components/carousel";
import Navbar from "../components/navbar/page";
import SecondSection from "../components/hero/page";
import Nftcards from "../components/collections/nftcards";
import  Filter  from "../components/filter/page";


export default function Home() {
  return <div>
    <Navbar />
    <SecondSection />
    <Carousel />
    <Filter />
    <Nftcards />
  </div>;
}
