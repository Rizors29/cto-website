import YoutubeSection from './YoutubeSection';
import NewsSection from './NewsSection';
import SideSection from './SideSection';
import Guideline from '../resourcespage/Guideline';

function ContentHome() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex flex-col gap-10">
          <NewsSection />
          <Guideline />
          <YoutubeSection />
        </div>
        <SideSection />
      </div>
    </div>
  );
}

export default ContentHome;