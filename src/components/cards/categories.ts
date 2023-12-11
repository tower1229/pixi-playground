// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CARD_TYPE } from './types';

export const categoryMap: Record<CARD_TYPE, string> = {
  [CARD_TYPE.Other]: 'Other',
  [CARD_TYPE.Membership]: 'Membership',
  [CARD_TYPE.Identity]: 'Identity',
  [CARD_TYPE.POAP]: 'POAP',
  [CARD_TYPE.Social]: 'Social',
  [CARD_TYPE.Achievement]: 'Achievement',
  [CARD_TYPE.Ticket]: 'Ticket',
  [CARD_TYPE.Finance]: 'Finance'
};

export const cardImage: Record<CARD_TYPE, string> = {
  [CARD_TYPE.Other]: '/images/card/img_card_3.png',
  [CARD_TYPE.Membership]: '/images/card/img_card_1.png',
  [CARD_TYPE.Identity]: '/images/card/img_card_3.png',
  [CARD_TYPE.POAP]: '/images/card/img_card_3.png',
  [CARD_TYPE.Social]: '/images/card/img_card_3.png',
  [CARD_TYPE.Achievement]: '/images/card/img_card_3.png',
  [CARD_TYPE.Ticket]: '/images/card/img_card_3.png',
  [CARD_TYPE.Finance]: '/images/card/img_card_3.png'
};

export function isCategory(input: any): input is CARD_TYPE {
  return Object.values(CARD_TYPE).includes(input);
}
