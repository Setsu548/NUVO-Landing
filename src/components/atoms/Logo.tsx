import { Icon } from './Icon';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-headline-md font-bold text-primary">
      <Icon name="cloud_queue" fill size={30} />
      NUVO
    </div>
  );
}
