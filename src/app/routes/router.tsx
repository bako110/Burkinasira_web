import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '../layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ErrorPage } from '../errors/ErrorPage';
import { HomePage } from '../../features/home/pages/HomePage';
import { ExplorePage } from '../../features/destinations/pages/ExplorePage';
import { DestinationDetailPage } from '../../features/destinations/pages/DestinationDetailPage';
import { HotelsPage } from '../../features/hotels/pages/HotelsPage';
import { HotelDetailPage } from '../../features/hotels/pages/HotelDetailPage';
import { RestaurantsPage } from '../../features/restaurants/pages/RestaurantsPage';
import { RestaurantDetailPage } from '../../features/restaurants/pages/RestaurantDetailPage';
import { MobilityPage } from '../../features/mobility/pages/MobilityPage';
import { TransportDetailPage } from '../../features/mobility/pages/TransportDetailPage';
import { GuidesPage } from '../../features/guides/pages/GuidesPage';
import { GuideDetailPage } from '../../features/guides/pages/GuideDetailPage';
import { EventsPage } from '../../features/events/pages/EventsPage';
import { EventDetailPage } from '../../features/events/pages/EventDetailPage';
import { HealthPage } from '../../features/health/pages/HealthPage';
import { HealthFacilityDetailPage } from '../../features/health/pages/HealthFacilityDetailPage';
import { EmergencyPage } from '../../features/emergency/pages/EmergencyPage';
import { WeatherPage } from '../../features/weather/pages/WeatherPage';
import { FinancePage } from '../../features/finance/pages/FinancePage';
import { MoneyServiceDetailPage } from '../../features/finance/pages/MoneyServiceDetailPage';
import { ConnectivityPage } from '../../features/connectivity/pages/ConnectivityPage';
import { ConnectivityPointDetailPage } from '../../features/connectivity/pages/ConnectivityPointDetailPage';
import { CulturePage } from '../../features/culture/pages/CulturePage';
import { CultureContentDetailPage } from '../../features/culture/pages/CultureContentDetailPage';
import { MarketPage } from '../../features/market/pages/MarketPage';
import { ProductDetailPage } from '../../features/market/pages/ProductDetailPage';
import { MyBookingsPage } from '../../features/bookings/pages/MyBookingsPage';
import { MyTripsPage } from '../../features/trips/pages/MyTripsPage';
import { TripDetailPage } from '../../features/trips/pages/TripDetailPage';
import { NotificationsPage } from '../../features/notifications/pages/NotificationsPage';
import { CommunityPage } from '../../features/community/pages/CommunityPage';
import { GroupDetailPage } from '../../features/community/pages/GroupDetailPage';
import { MessagesPage } from '../../features/messaging/pages/MessagesPage';
import { ProfilePage } from '../../features/profile/pages/ProfilePage';
import { PassportPage } from '../../features/passport/pages/PassportPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/explore', element: <ExplorePage /> },
      { path: '/explore/:slug', element: <DestinationDetailPage /> },
      { path: '/hotels', element: <HotelsPage /> },
      { path: '/hotels/:id', element: <HotelDetailPage /> },
      { path: '/restaurants', element: <RestaurantsPage /> },
      { path: '/restaurants/:id', element: <RestaurantDetailPage /> },
      { path: '/mobility', element: <MobilityPage /> },
      { path: '/mobility/:id', element: <TransportDetailPage /> },
      { path: '/guides', element: <GuidesPage /> },
      { path: '/guides/:id', element: <GuideDetailPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/events/:id', element: <EventDetailPage /> },
      { path: '/health', element: <HealthPage /> },
      { path: '/health/:id', element: <HealthFacilityDetailPage /> },
      { path: '/emergency', element: <EmergencyPage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/community/groups/:groupId', element: <GroupDetailPage /> },
      { path: '/weather', element: <WeatherPage /> },
      { path: '/finance', element: <FinancePage /> },
      { path: '/finance/:id', element: <MoneyServiceDetailPage /> },
      { path: '/connectivity', element: <ConnectivityPage /> },
      { path: '/connectivity/:id', element: <ConnectivityPointDetailPage /> },
      { path: '/culture', element: <CulturePage /> },
      { path: '/culture/:id', element: <CultureContentDetailPage /> },
      { path: '/market', element: <MarketPage /> },
      { path: '/market/:id', element: <ProductDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/bookings', element: <MyBookingsPage /> },
          { path: '/trips', element: <MyTripsPage /> },
          { path: '/trips/:tripId', element: <TripDetailPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/messages', element: <MessagesPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/passport', element: <PassportPage /> },
        ],
      },
      { path: '*', element: <ErrorPage /> },
    ],
  },
  { path: '/login', element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: '/register', element: <RegisterPage />, errorElement: <ErrorPage /> },
]);
