import {
  MouseIcon,
  KeyboardIcon,
  HeadphonesIcon,
  MonitorIcon,
  WebcamIcon,
} from '@/components/icons';

export const CategoryHeroConfig: Record<
  string,
  {
    title: string;
    description: string;
    image: string;
    Icon: React.FC<{ className?: string }>;
  }
> = {
  mouse: {
    title: 'Mouse',
    description:
      'Precision and comfort — ergonomic and gaming mice built for every playstyle.',
    image: 'https://i.ibb.co/bjvjkC59/mouse-img.png',
    Icon: MouseIcon,
  },
  monitor: {
    title: 'Monitor',
    description:
      'Crisp visuals and smooth performance for gaming, work, and creativity.',
    image: '/images/categories/monitor.jpg',
    Icon: MonitorIcon,
  },
  headphone: {
    title: 'Headphones',
    description:
      'Immersive sound and all-day comfort for music, gaming, and calls.',
    image: '/images/categories/headphone.jpg',
    Icon: HeadphonesIcon,
  },
  keyboard: {
    title: 'Keyboard',
    description:
      'Mechanical precision or silent comfort — keyboards made to perform.',
    image: '/images/categories/keyboard.jpg',
    Icon: KeyboardIcon,
  },
  webcam: {
    title: 'Webcam',
    description:
      'Sharp video quality for streaming, meetings, and content creation.',
    image: '/images/categories/webcam.jpg',
    Icon: WebcamIcon,
  },
};
