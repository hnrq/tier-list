import { createContext } from 'solid-js';

import { TierList } from 'reducers/tierList';

export const tierListContext = createContext<[TierList]>();
