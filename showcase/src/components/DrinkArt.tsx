import espressoImg from '../assets/drinks/espresso.png';
import americanoImg from '../assets/drinks/americano.png';
import macchiatoImg from '../assets/drinks/macchiato.png';
import cappuccinoImg from '../assets/drinks/cappuccino.png';
import latteImg from '../assets/drinks/latte.png';
import type { DrinkId } from '../types';
import './DrinkArt.css';

interface Props {
  drinkId: DrinkId;
}

const DRINK_IMAGE: Record<DrinkId, string> = {
  espresso: espressoImg,
  americano: americanoImg,
  macchiato: macchiatoImg,
  cappuccino: cappuccinoImg,
  latte: latteImg,
};

export function DrinkArt({ drinkId }: Props) {
  return <img className="drink-art__bild" src={DRINK_IMAGE[drinkId]} alt="" aria-hidden="true" />;
}
