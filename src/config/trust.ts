import { clients } from './clients';
import { blueLilyAwardCount } from './film';
import { services } from './services';

export interface TrustFigure {
  value: number;
  /** Printed after the number in gold, e.g. "+". */
  suffix: string;
  label: string;
}

/**
 * The four numbers under the hero.
 *
 * Every figure that can be counted is counted from the list it describes, so
 * it cannot go stale: brands from the client list, awards from Blue Lily's
 * honours, disciplines from the services. The years figure is the founder's
 * own stated experience and is the one number typed by hand.
 */
export const trustFigures: TrustFigure[] = [
  { value: 15, suffix: '+', label: 'Years in UAE media' },
  { value: clients.length, suffix: '+', label: 'Brands served' },
  { value: blueLilyAwardCount, suffix: '', label: 'Festival awards' },
  { value: services.length, suffix: '', label: 'Disciplines in house' },
];
