import Carousel from "../components/carousel";
import Navbar from "../components/navbar/page";
import SecondSection from "../components/hero/page";
import Nftcards from "../components/collections/nftcards";


export default function Home() {
  return <div>
    <Navbar />
    <SecondSection />
    <Carousel />
    <div className="p-2 bg-gray-200 rounded-lg ml-16 mr-16">
  <h1 className="text-[3.5rem] font-bold mb-10 leading-[1.167]">Featured Listing</h1>
</div>

    <Nftcards />
  </div>;
}
