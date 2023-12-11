// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message, MessageType } from '@zcloak/message/types';

import Events from 'eventemitter3';

export interface EventSignatures {
  sync_success: [];
  sync_failed: [];
  new_message: [Array<Message<MessageType>>];
  update_message: [];
  unauthorized: [];
}

export const events = new Events<EventSignatures>();
