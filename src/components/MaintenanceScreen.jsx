// components/MaintenanceScreen.jsx
import { Player } from '@lottiefiles/react-lottie-player';
import sleepingCatAnimation from '../../assets/lottie/sleeping-cat.json'; // Place the downloaded JSON here
import PageTracker from './PageTracker';

export default function MaintenanceScreen({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-center px-4">
      <PageTracker page="Maintenance screen"/>
      <Player
        autoplay
        loop
        src={sleepingCatAnimation}
        style={{ height: 200, width: 200 }}
      />
      <h1 className="text-3xl font-bold mt-4 mb-2">We'll be back soon</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}