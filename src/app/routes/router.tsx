import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '../layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGate } from './RoleGate';
import { ProRouteGate } from './ProRouteGate';
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
import { MyOrdersPage } from '../../features/market/pages/MyOrdersPage';
import { MyBookingsPage } from '../../features/bookings/pages/MyBookingsPage';
import { MyTripsPage } from '../../features/trips/pages/MyTripsPage';
import { TripDetailPage } from '../../features/trips/pages/TripDetailPage';
import { NotificationsPage } from '../../features/notifications/pages/NotificationsPage';
import { CommunityPage } from '../../features/community/pages/CommunityPage';
import { GroupDetailPage } from '../../features/community/pages/GroupDetailPage';
import { MessagesPage } from '../../features/messaging/pages/MessagesPage';
import { ProfilePage } from '../../features/profile/pages/ProfilePage';
import { PersonalInfoPage } from '../../features/profile/pages/PersonalInfoPage';
import { ChangePasswordPage } from '../../features/profile/pages/ChangePasswordPage';
import { DangerZonePage } from '../../features/profile/pages/DangerZonePage';
import { PassportPage } from '../../features/passport/pages/PassportPage';
import { PrivacyPolicyPage } from '../../features/legal/pages/PrivacyPolicyPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { VerifyCardPage } from '../../features/auth/pages/VerifyCardPage';
import { ProLayout } from '../layout/ProLayout';
import { PendingVerificationPage } from '../../features/pro/pages/PendingVerificationPage';
import { ProOverviewPage } from '../../features/pro/pages/ProOverviewPage';
import { ProHotelPage } from '../../features/pro/pages/ProHotelPage';
import { ProRestaurantPage } from '../../features/pro/pages/ProRestaurantPage';
import { ProTransportPage } from '../../features/pro/pages/ProTransportPage';
import { ProArtisanPage } from '../../features/pro/pages/ProArtisanPage';
import { ProTeamPage } from '../../features/pro/pages/ProTeamPage';
import { GuideAnalyticsPage } from '../../features/pro/pages/GuideAnalyticsPage';
import { GuideProfilePage } from '../../features/pro/pages/GuideProfilePage';
import { GuideAvailabilityPage } from '../../features/pro/pages/GuideAvailabilityPage';
import { GuideBookingsPage } from '../../features/pro/pages/GuideBookingsPage';
import { GuideReviewsPage } from '../../features/pro/pages/GuideReviewsPage';
import { MessagesPage as ProMessagesPage } from '../../features/messaging/pages/MessagesPage';
import { NotificationsPage as ProNotificationsPage } from '../../features/notifications/pages/NotificationsPage';

export const router = createBrowserRouter([
  {
    element: <RoleGate />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AppLayout />,
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
          { path: '/privacy', element: <PrivacyPolicyPage /> },
          { path: '/confidentialite', element: <PrivacyPolicyPage /> },
          {
            element: <ProtectedRoute />,
            children: [
              { path: '/bookings', element: <MyBookingsPage /> },
              { path: '/market/orders', element: <MyOrdersPage /> },
              { path: '/trips', element: <MyTripsPage /> },
              { path: '/trips/:tripId', element: <TripDetailPage /> },
              { path: '/notifications', element: <NotificationsPage /> },
              { path: '/messages', element: <MessagesPage /> },
              { path: '/profile', element: <ProfilePage /> },
              { path: '/profile/personal-info', element: <PersonalInfoPage /> },
              { path: '/profile/password', element: <ChangePasswordPage /> },
              { path: '/profile/danger-zone', element: <DangerZonePage /> },
              { path: '/passport', element: <PassportPage /> },
            ],
          },
          { path: '*', element: <ErrorPage /> },
        ],
      },
    ],
  },
  { path: '/login', element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: '/verify/:userId', element: <VerifyCardPage />, errorElement: <ErrorPage /> },
  { path: '/register', element: <RegisterPage />, errorElement: <ErrorPage /> },
  {
    element: <ProRouteGate />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/pro/pending', element: <PendingVerificationPage /> },
      {
        element: <ProLayout />,
        children: [
          { path: '/pro/guide', element: <GuideAnalyticsPage /> },
          { path: '/pro/guide/profile', element: <GuideProfilePage /> },
          { path: '/pro/guide/availability', element: <GuideAvailabilityPage /> },
          { path: '/pro/guide/bookings', element: <GuideBookingsPage /> },
          { path: '/pro/guide/reviews', element: <GuideReviewsPage /> },
          { path: '/pro/guide/messages', element: <ProMessagesPage /> },
          { path: '/pro/guide/notifications', element: <ProNotificationsPage /> },
          { path: '/pro/provider', element: <ProOverviewPage /> },
          { path: '/pro/provider/hotel', element: <ProHotelPage /> },
          { path: '/pro/provider/restaurant', element: <ProRestaurantPage /> },
          { path: '/pro/provider/transport', element: <ProTransportPage /> },
          { path: '/pro/provider/artisan', element: <ProArtisanPage /> },
          { path: '/pro/provider/team', element: <ProTeamPage /> },
          { path: '/pro/provider/messages', element: <ProMessagesPage /> },
          { path: '/pro/provider/notifications', element: <ProNotificationsPage /> },
        ],
      },
    ],
  },
]);
