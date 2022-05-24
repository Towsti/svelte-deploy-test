import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

import { defaultText } from './constants/defaultText';

export let text = persist(writable(defaultText), localStorage(), 'text');