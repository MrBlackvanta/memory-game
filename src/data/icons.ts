import { faFutbol } from "@fortawesome/free-regular-svg-icons/faFutbol";
import { faMoon } from "@fortawesome/free-regular-svg-icons/faMoon";
import { faAnchor } from "@fortawesome/free-solid-svg-icons/faAnchor";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faBug } from "@fortawesome/free-solid-svg-icons/faBug";
import { faCar } from "@fortawesome/free-solid-svg-icons/faCar";
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";
import { faFish } from "@fortawesome/free-solid-svg-icons/faFish";
import { faFlask } from "@fortawesome/free-solid-svg-icons/faFlask";
import { faGhost } from "@fortawesome/free-solid-svg-icons/faGhost";
import { faHandSpock } from "@fortawesome/free-solid-svg-icons/faHandSpock";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { faLeaf } from "@fortawesome/free-solid-svg-icons/faLeaf";
import { faLiraSign } from "@fortawesome/free-solid-svg-icons/faLiraSign";
import { faRocket } from "@fortawesome/free-solid-svg-icons/faRocket";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons/faSnowflake";
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun";
import { faUmbrella } from "@fortawesome/free-solid-svg-icons/faUmbrella";
import type { TileIcon } from "./types";

export const ICONS: readonly TileIcon[] = [
  { name: "Anchor", definition: faAnchor },
  { name: "Flask", definition: faFlask },
  { name: "Sun", definition: faSun },
  { name: "Vulcan salute", definition: faHandSpock },
  { name: "Soccer ball", definition: faFutbol },
  { name: "Bug", definition: faBug },
  { name: "Car", definition: faCar },
  { name: "Lira sign", definition: faLiraSign },
  { name: "Moon", definition: faMoon },
  { name: "Snowflake", definition: faSnowflake },
  { name: "Rocket", definition: faRocket },
  { name: "Ghost", definition: faGhost },
  { name: "Crown", definition: faCrown },
  { name: "Leaf", definition: faLeaf },
  { name: "Umbrella", definition: faUmbrella },
  { name: "Key", definition: faKey },
  { name: "Fish", definition: faFish },
  { name: "Bell", definition: faBell },
];
