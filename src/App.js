import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import SuppliersPage from './components/SuppliersPage';
import CreateEventPage from './components/CreateEventPage';
import AddSupplier from './components/AddSupplier';
import EditEventPage from './components/EditEventPage';
import SuppliersProfile from './components/SuppliersProfile';
import Events from './components/Events';
import EventsManagementPage from './components/EventsManagementPage';
import CreateTaskPage from './components/CreateTaskPage';
import EditTaskPage from './components/EditTaskPage';
import ServiceProvider from './components/ServiceProvider';
import Marketing from './components/Marketing';
import Legal from './components/Legal';
import CateringService from './components/CateringService';
import AVP from './components/AVP';
import DDS from './components/DDS';
import EntPrf from './components/EntPrf';
import Furniture from './components/Furniture';
import PhotoVid from './components/PhotoVid';
import Transportation from './components/Transportation';
import PromoMarketing from './components/PromoMarketing';
import Techpro from './components/Techpro';
import SupplierSide from './components/SupplierSide';
import EditProfile from './components/EditProfile';
import SupplierHomepage from './components/SupplierHomepage';
import AssignedTask from './components/AssignedTask';
import MessagesPage from './components/MessagesPage';
import TermsAndConditions from './components/TermsAndConditions';
import MyWork from './components/MyWork';
import SupplierTeam from './components/SupplierTeam';
import SupplierEvents from './components/SupplierEvents';
import SupplierEventDetail from './components/SupplierEventDetail';
import SupplierMessagesPage from './components/SupplierMessagesPage';
import MyTeam from './components/MyTeam';
import TestSupabase from './TestSupabase';
import HotelsListPage from './components/HotelsListPage';
import ConferenceCentersPage from './components/ConferenceCentersPage';
import BanquetHallsPage from './components/BanquetHallsPage';
import OutdoorVenuesPage from './components/OutdoorVenuesPage';
import StadiumsArenasPage from './components/StadiumsArenasPage';
import TheatersArtCentersPage from './components/TheatersArtCentersPage';
import HistoricSitesMonumentsPage from './components/HistoricSitesMonumentsPage';
import RestaurantsBarsPage from './components/RestaurantsBarsPage';
import PermitsPage from './components/PermitsPage';
import LicensesPage from './components/LicensesPage';
import SecurityHygienePage from './components/SecurityHygienePage';
import PromoProductSuppliersPage from './components/PromoProductSuppliersPage';
import PrintingServicesPage from './components/PrintingServicesPage';
import GraphicDesignersPage from './components/GraphicDesignersPage';
import BrandingAgenciesPage from './components/BrandingAgenciesPage';
import DigitalMarketingAgenciesPage from './components/DigitalMarketingAgenciesPage';
import SocialMediaMarketingPage from './components/SocialMediaMarketingPage';
import ContentCreationServicesPage from './components/ContentCreationServicesPage';
import VirtualRealityPage from './components/VirtualRealityPage';
import AugmentedRealityPage from './components/AugmentedRealityPage';
import LiveStreamingPage from './components/LiveStreamingPage';
import EventAnalyticsPage from './components/EventAnalyticsPage';
import AudioEquipmentRentalPage from './components/AudioEquipmentRentalPage';
import VisualEquipmentRentalPage from './components/VisualEquipmentRentalPage';
import LightingEquipmentRentalPage from './components/LightingEquipmentRentalPage';
import StageSetDesignPage from './components/StageSetDesignPage';
import TechnicalSupportServicesPage from './components/TechnicalSupportServicesPage';
import AVProductionCompaniesPage from './components/AVProductionCompaniesPage';
import AVLiveStreamingServicesPage from './components/AVLiveStreamingServicesPage';
import DSS from './components/DSS';
import FloristsPage from './components/FloristsPage';
import EventDecoratorsPage from './components/EventDecoratorsPage';
import ThematicDesignSpecialistsPage from './components/ThematicDesignSpecialistsPage';
import BalloonArtistsPage from './components/BalloonArtistsPage';
import TableSettingRentalPage from './components/TableSettingRentalPage';
import BannerPrintingServicesPage from './components/BannerPrintingServicesPage';
import EventFurnitureRentalPage from './components/EventFurnitureRentalPage';
import FurnitureRentalCompaniesPage from './components/FurnitureRentalCompaniesPage';
import LinenRentalServicesPage from './components/LinenRentalServicesPage';
import TablewareRentalServicesPage from './components/TablewareRentalServicesPage';
import TentRentalCompaniesPage from './components/TentRentalCompaniesPage';
import InflatableStructuresPage from './components/InflatableStructuresPage';
import EventFlooringSuppliersPage from './components/EventFlooringSuppliersPage';
import OutdoorEquipmentRentalPage from './components/OutdoorEquipmentRentalPage';
import LiveBandsPage from './components/LiveBandsPage';
import DJsPage from './components/DJsPage';
import MusiciansPage from './components/MusiciansPage';
import ComediansPage from './components/ComediansPage';
import MagiciansIllusionistsPage from './components/MagiciansIllusionistsPage';
import DancersChoreographersPage from './components/DancersChoreographersPage';
import CircusActsPage from './components/CircusActsPage';
import InteractivePerformersPage from './components/InteractivePerformersPage';
import EventPhotographersPage from './components/EventPhotographersPage';
import VideographyServicesPage from './components/VideographyServicesPage';
import DroneVideographyServicesPage from './components/DroneVideographyServicesPage';
import PhotoBoothRentalPage from './components/PhotoBoothRentalPage';
import EventAlbumPrintingServicesPage from './components/EventAlbumPrintingServicesPage';
import EditingPostProductionServicesPage from './components/EditingPostProductionServicesPage';
import ShuttleServicesPage from './components/ShuttleServicesPage';
import LimousineServicesPage from './components/LimousineServicesPage';
import BusCoachRentalsPage from './components/BusCoachRentalsPage';
import CarRentalCompaniesPage from './components/CarRentalCompaniesPage';
import ChauffeurServicesPage from './components/ChauffeurServicesPage';
import AirportTransferServicesPage from './components/AirportTransferServicesPage';
import BikeRentalServicesPage from './components/BikeRentalServicesPage';
import FullServiceCaterersPage from './components/FullServiceCaterersPage';
import SpecialtyCuisineCaterersPage from './components/SpecialtyCuisineCaterersPage';
import FoodTrucksPage from './components/FoodTrucksPage';
import BeverageSuppliersPage from './components/BeverageSuppliersPage';
import BartendingServicesPage from './components/BartendingServicesPage';
import DessertCaterersPage from './components/DessertCaterersPage';
import CorporateCateringPage from './components/CorporateCateringPage';

// Privacy Components
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PrivacySettings from './components/PrivacySettings';

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Ensure body has proper padding for cookie banner
    
    return () => {
      // Don't remove padding on unmount as it's needed for other pages
    };
  }, [location]);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/TestSupabase" element={<TestSupabase />} />
        {/* Main Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/SuppliersPage" element={<SuppliersPage />} />
        <Route path="/CreateEventPage" element={<CreateEventPage />} />
        <Route path="/AddSupplier/:eventId" element={<AddSupplier />} />
        <Route path="/AddSupplier" element={<AddSupplier />} />
        <Route path="/SuppliersProfile" element={<SuppliersProfile />} />
        <Route path="/Events" element={<Events />} />
        
        {/* Venue Routes */}
        <Route path="/hotels" element={<HotelsListPage />} />
        <Route path="/conference-centers" element={<ConferenceCentersPage />} />
        <Route path="/banquet-halls" element={<BanquetHallsPage />} />
        <Route path="/outdoor-venues" element={<OutdoorVenuesPage />} />
        <Route path="/stadiums-arenas" element={<StadiumsArenasPage />} />
        <Route path="/theaters-art-centers" element={<TheatersArtCentersPage />} />
        <Route path="/historic-sites-monuments" element={<HistoricSitesMonumentsPage />} />
        <Route path="/restaurants-bars" element={<RestaurantsBarsPage />} />
        
        {/* Furniture & Rental Services Routes */}
        <Route path="/furniture-rental" element={<FurnitureRentalCompaniesPage />} />
        <Route path="/linen-rental" element={<LinenRentalServicesPage />} />
        <Route path="/tableware-rental" element={<TablewareRentalServicesPage />} />
        <Route path="/tent-rental" element={<TentRentalCompaniesPage />} />
        <Route path="/inflatable-structures" element={<InflatableStructuresPage />} />
        <Route path="/event-flooring" element={<EventFlooringSuppliersPage />} />
        <Route path="/outdoor-equipment" element={<OutdoorEquipmentRentalPage />} />
        <Route path="/event-furniture-rental" element={<EventFurnitureRentalPage />} />
        
        {/* Entertainment Professionals Routes */}
        <Route path="/live-bands" element={<LiveBandsPage />} />
        <Route path="/djs" element={<DJsPage />} />
        <Route path="/musicians" element={<MusiciansPage />} />
        <Route path="/comedians" element={<ComediansPage />} />
        <Route path="/magicians-illusionists" element={<MagiciansIllusionistsPage />} />
        <Route path="/dancers-choreographers" element={<DancersChoreographersPage />} />
        <Route path="/circus-acts" element={<CircusActsPage />} />
        <Route path="/interactive-performers" element={<InteractivePerformersPage />} />
        
        {/* Marketing & Media Routes */}
        <Route path="/promo-product-suppliers" element={<PromoProductSuppliersPage />} />
        <Route path="/printing-services" element={<PrintingServicesPage />} />
        <Route path="/graphic-designers" element={<GraphicDesignersPage />} />
        <Route path="/branding-agencies" element={<BrandingAgenciesPage />} />
        <Route path="/digital-marketing-agencies" element={<DigitalMarketingAgenciesPage />} />
        <Route path="/social-media-marketing" element={<SocialMediaMarketingPage />} />
        <Route path="/content-creation-services" element={<ContentCreationServicesPage />} />
        <Route path="/virtual-reality" element={<VirtualRealityPage />} />
        <Route path="/augmented-reality" element={<AugmentedRealityPage />} />
        <Route path="/live-streaming" element={<LiveStreamingPage />} />
        <Route path="/event-analytics" element={<EventAnalyticsPage />} />
        
        {/* Catering & Beverage Routes */}
        <Route path="/full-service-caterers" element={<FullServiceCaterersPage />} />
        <Route path="/specialty-cuisine-caterers" element={<SpecialtyCuisineCaterersPage />} />
        <Route path="/food-trucks" element={<FoodTrucksPage />} />
        <Route path="/beverage-suppliers" element={<BeverageSuppliersPage />} />
        <Route path="/bartending-services" element={<BartendingServicesPage />} />
        <Route path="/dessert-caterers" element={<DessertCaterersPage />} />
        <Route path="/corporate-catering" element={<CorporateCateringPage />} />
        
        {/* Decor & Styling Routes */}
        <Route path="/dss" element={<DSS />} />
        <Route path="/florists" element={<FloristsPage />} />
        <Route path="/event-decorators" element={<EventDecoratorsPage />} />
        <Route path="/thematic-design-specialists" element={<ThematicDesignSpecialistsPage />} />
        <Route path="/balloon-artists" element={<BalloonArtistsPage />} />
        <Route path="/table-setting-rental" element={<TableSettingRentalPage />} />
        <Route path="/banner-printing-services" element={<BannerPrintingServicesPage />} />
        
        {/* AV & Technical Services Routes */}
        <Route path="/audio-equipment-rental" element={<AudioEquipmentRentalPage />} />
        <Route path="/visual-equipment-rental" element={<VisualEquipmentRentalPage />} />
        <Route path="/lighting-equipment-rental" element={<LightingEquipmentRentalPage />} />
        <Route path="/stage-set-design" element={<StageSetDesignPage />} />
        <Route path="/technical-support-services" element={<TechnicalSupportServicesPage />} />
        <Route path="/av-production-companies" element={<AVProductionCompaniesPage />} />
        <Route path="/av-live-streaming-services" element={<AVLiveStreamingServicesPage />} />
        
        {/* Photo & Video Services Routes */}
        <Route path="/event-photographers" element={<EventPhotographersPage />} />
        <Route path="/videography-services" element={<VideographyServicesPage />} />
        <Route path="/drone-videography" element={<DroneVideographyServicesPage />} />
        <Route path="/photo-booth-rental" element={<PhotoBoothRentalPage />} />
        <Route path="/album-printing" element={<EventAlbumPrintingServicesPage />} />
        <Route path="/post-production" element={<EditingPostProductionServicesPage />} />
        
        {/* Transportation Services Routes */}
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/shuttle-services" element={<ShuttleServicesPage />} />
        <Route path="/limousine-services" element={<LimousineServicesPage />} />
        <Route path="/bus-coach-rentals" element={<BusCoachRentalsPage />} />
        <Route path="/car-rental-companies" element={<CarRentalCompaniesPage />} />
        <Route path="/chauffeur-services" element={<ChauffeurServicesPage />} />
        <Route path="/airport-transfer-services" element={<AirportTransferServicesPage />} />
        <Route path="/bike-rental-services" element={<BikeRentalServicesPage />} />
        
        {/* Other Routes */}
        <Route path="/permits" element={<PermitsPage />} />
        <Route path="/licenses" element={<LicensesPage />} />
        <Route path="/securityhygiene" element={<SecurityHygienePage />} />
        <Route path="/EventsManagementPage/:eventId" element={<EventsManagementPage />} />
        <Route path="/EventsManagementPage" element={<EventsManagementPage />} />
        <Route path="/EditEventPage/:eventId" element={<EditEventPage />} />
        <Route path="/CreateTaskPage/:eventId" element={<CreateTaskPage />} />
        <Route path="/EditTaskPage/:eventId/:taskIndex" element={<EditTaskPage />} />
        <Route path="/ServiceProvider" element={<ServiceProvider />} />
        <Route path="/Marketing" element={<Marketing />} />
        <Route path="/Legal" element={<Legal />} />
        <Route path="/CateringService" element={<CateringService />} />
        <Route path="/AVP" element={<AVP />} />
        <Route path="/DDS" element={<DDS />} />
        <Route path="/EntPrf" element={<EntPrf />} />
        <Route path="/Furniture" element={<Furniture />} />
        <Route path="/PhotoVid" element={<PhotoVid />} />
        <Route path="/PromoMarketing" element={<PromoMarketing />} />
        <Route path="/Techpro" element={<Techpro />} />
        <Route path="/SupplierSide" element={<SupplierSide />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/SupplierHomepage" element={<SupplierHomepage />} />
        <Route path="/AssignedTask" element={<AssignedTask />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/SupplierWork" element={<MyWork />} />
        <Route path="/my-work" element={<MyWork />} />
        <Route path="/SupplierTeam" element={<SupplierTeam />} />
        <Route path="/SupplierEvents" element={<SupplierEvents />} />
        <Route path="/SupplierEventDetail/:eventId" element={<SupplierEventDetail />} />
        <Route path="/SupplierMessagesPage" element={<SupplierMessagesPage />} />
        <Route path="/my-team" element={<MyTeam />} />
        <Route path="/MessagesPage" element={<MessagesPage />} />
        <Route path="/test-supabase" element={<TestSupabase />} />
        
        {/* Privacy Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy-settings" element={<PrivacySettings />} />
      </Routes>
    </div>
  );
}

export default App;
